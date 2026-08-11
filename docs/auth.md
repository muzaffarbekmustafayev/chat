# 🔐 Autentifikatsiya va Avtorizatsiya

---

## 🔑 JWT Strategiyasi

Loyiha **ikki tokenli** autentifikatsiya tizimidan foydalanadi:

| Token | Davomiyligi | Saqlash joyi | Maqsad |
|-------|-------------|--------------|--------|
| `accessToken` | 15 daqiqa | `localStorage` | API so'rovlar |
| `refreshToken` | 30 kun | `httpOnly Cookie` + DB | Token yangilash |

---

## 🔄 Token Hayot Sikli

```
1. Login → accessToken + refreshToken beriladi
              │
              ▼
2. Har bir API so'rovda:
   Authorization: Bearer <accessToken>
              │
              ▼
3. accessToken muddati tugasa (401):
   → /api/auth/refresh endpoint chaqiriladi
   → Yangi accessToken olinadi
   → So'rov qayta yuboriladi
              │
              ▼
4. refreshToken ham muddati tugasa:
   → Foydalanuvchi login sahifasiga yo'naltiriladi
```

---

## 🛡️ Backend Middleware

**File:** `backend/src/middlewares/auth.middleware.js`

```javascript
const protect = async (req, res, next) => {
  try {
    // 1. Token olish
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "NO_TOKEN", message: "Token taqdim etilmagan" }
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Token tekshirish
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Foydalanuvchini topish
    const user = await User.findById(decoded.userId).select("-password -refreshTokens");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "Foydalanuvchi topilmadi" }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: { code: "TOKEN_EXPIRED", message: "Token muddati tugagan" }
      });
    }
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token yaroqsiz" }
    });
  }
};
```

---

## 🔌 Socket.IO Autentifikatsiya

**File:** `backend/src/services/socket.service.js`

```javascript
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select("_id username");

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});
```

---

## 🔁 Axios Interceptor (Frontend)

**File:** `frontend/src/api/axios.js`

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true    // Cookie yuborish uchun
});

// Request interceptor — token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — token yangilash
let isRefreshing = false;
let failedQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Navbatga qo'sh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.data.token;
        localStorage.setItem("accessToken", newToken);

        // Navbatdagi so'rovlarni qayta yubor
        failedQueue.forEach(({ resolve }) => resolve(newToken));
        failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh ham muvaffaqiyatsiz — logout
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔒 Route Himoyasi (Frontend)

**File:** `frontend/src/components/common/ProtectedRoute.jsx`

```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App.jsx da ishlatish:
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route
    path="/chat"
    element={
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    }
  />
  <Route path="*" element={<Navigate to="/chat" replace />} />
</Routes>
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/telegram_clone

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# CORS
CLIENT_URL=http://localhost:5173

# Fayllar
MAX_FILE_SIZE=52428800     # 50MB
UPLOAD_DIR=uploads/
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🛡️ Xavfsizlik Choralari

| Chora | Kutubxona | Tavsif |
|-------|-----------|--------|
| Rate Limiting | `express-rate-limit` | 100 so'rov/15 daqiqa |
| CORS | `cors` | Faqat ruxsat etilgan domenlar |
| Helmet | `helmet` | HTTP xavfsizlik headerlar |
| Input sanitization | `express-validator` | XSS himoya |
| Password hashing | `bcryptjs` | 12 round |
| SQL Injection | Mongoose | ODM himoyasi |
