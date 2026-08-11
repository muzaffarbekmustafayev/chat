# 🚨 Error Handling — Xatolarni Boshqarish

> Markazlashtirilgan xato boshqaruvi, logging va frontend xato ko'rsatish.

---

## 🏗️ Backend Xato Arxitekturasi

```
Route Handler
    │ throw new AppError(...)
    ▼
Global Error Middleware
    │
    ├── AppError (kutilgan) → 4xx
    ├── ValidationError     → 400
    ├── CastError           → 400
    ├── DuplicateKeyError   → 409
    ├── JWT Errors          → 401
    └── Boshqa              → 500
    │
    ▼
Formatted JSON Response
    │
    ▼
Winston Logger (log fayl)
```

---

## 🔧 AppError Klassi

**File:** `backend/src/utils/AppError.js`

```javascript
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);

    this.statusCode = statusCode;
    this.status     = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.code       = code || this._getDefaultCode(statusCode);
    this.isOperational = true;  // Kutilgan xato

    Error.captureStackTrace(this, this.constructor);
  }

  _getDefaultCode(statusCode) {
    const codes = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_ERROR",
    };
    return codes[statusCode] || "ERROR";
  }
}

module.exports = AppError;
```

---

## ⚙️ Global Error Middleware

**File:** `backend/src/middlewares/error.middleware.js`

```javascript
const AppError = require("../utils/AppError");
const logger   = require("../utils/logger");

// Mongoose xatolarini AppError ga aylantirish
const handleMongooseCastError = (err) =>
  new AppError(`Noto'g'ri qiymat: ${err.path} = ${err.value}`, 400, "INVALID_ID");

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field}: "${value}" allaqachon mavjud`, 409, "DUPLICATE_KEY");
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map(e => e.message);
  return new AppError(messages.join(". "), 400, "VALIDATION_ERROR");
};

const handleJWTError  = () => new AppError("Token yaroqsiz. Iltimos, qayta kiring.", 401, "INVALID_TOKEN");
const handleJWTExpired = () => new AppError("Token muddati tugagan.", 401, "TOKEN_EXPIRED");

// Javob formatlash
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      code:       err.code,
      message:    err.message,
      stack:      err.stack,    // Development da stack ko'rsatiladi
      statusCode: err.statusCode,
    }
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Kutilgan xato — foydalanuvchiga xabar
    res.status(err.statusCode).json({
      success: false,
      error: {
        code:    err.code,
        message: err.message,
      }
    });
  } else {
    // Kutilmagan xato — stack ko'rsatilmaydi
    logger.error("KUTILMAGAN XATO:", err);
    res.status(500).json({
      success: false,
      error: {
        code:    "INTERNAL_ERROR",
        message: "Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.",
      }
    });
  }
};

// Global xato handler
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Log
  logger.error({
    message:    err.message,
    code:       err.code,
    statusCode: err.statusCode,
    path:       req.path,
    method:     req.method,
    userId:     req.user?._id,
    stack:      err.stack,
  });

  let error = { ...err };
  error.message = err.message;

  // Mongoose xatolarini aylantirish
  if (err.name === "CastError")           error = handleMongooseCastError(err);
  if (err.code === 11000)                 error = handleDuplicateKey(err);
  if (err.name === "ValidationError")     error = handleValidationError(err);
  if (err.name === "JsonWebTokenError")   error = handleJWTError();
  if (err.name === "TokenExpiredError")   error = handleJWTExpired();

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 handler
const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Route topilmadi: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
};

module.exports = { errorMiddleware, notFoundMiddleware };
```

```javascript
// app.js da
app.use(notFoundMiddleware);
app.use(errorMiddleware);
```

---

## 🎯 Controller-larda Xato Yuborish

```javascript
// catchAsync — try/catch ni kamaytirishdan
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Ishlatish
const getChat = catchAsync(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    throw new AppError("Chat topilmadi", 404, "CHAT_NOT_FOUND");
  }

  if (!chat.participants.includes(req.user._id)) {
    throw new AppError("Bu chatga kirish ruxsati yo'q", 403, "FORBIDDEN");
  }

  res.json({ success: true, data: chat });
});
```

---

## 📝 Winston Logger

**File:** `backend/src/utils/logger.js`

```javascript
const winston = require("winston");

const { combine, timestamp, json, colorize, simple, errors } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    // Konsol
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple()
      )
    }),
    // Xatolar fayl
    new winston.transports.File({
      filename: "logs/error.log",
      level:    "error",
      maxsize:  5 * 1024 * 1024,   // 5MB
      maxFiles: 5,
    }),
    // Barcha loglar
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize:  10 * 1024 * 1024,  // 10MB
      maxFiles: 3,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" })
  ],
});

module.exports = logger;
```

```bash
# Kerakli paket
npm install winston
```

---

## ⚛️ Frontend Xato Boshqaruvi

### Global API xato handler

**File:** `frontend/src/api/axios.js`

```javascript
import toast from "react-hot-toast";

// Xato matnlari (uz)
const ERROR_MESSAGES = {
  UNAUTHORIZED:        "Tizimga kirish talab qilinadi",
  FORBIDDEN:           "Bu amalni bajarishga ruxsat yo'q",
  NOT_FOUND:           "So'ralgan ma'lumot topilmadi",
  VALIDATION_ERROR:    "Ma'lumotlar noto'g'ri kiritilgan",
  TOO_MANY_REQUESTS:   "Juda ko'p urinish. Biroz kuting",
  DUPLICATE_KEY:       "Bu ma'lumot allaqachon mavjud",
  INTERNAL_ERROR:      "Server xatosi. Keyinroq urinib ko'ring",
  NETWORK_ERROR:       "Internet aloqasi yo'q",
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code    = error.response?.data?.error?.code;
    const message = error.response?.data?.error?.message
                 || ERROR_MESSAGES[code]
                 || ERROR_MESSAGES.INTERNAL_ERROR;

    // Network xato
    if (!error.response) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(error);
    }

    // 401 — login sahifasiga
    if (error.response.status === 401 && code !== "TOKEN_EXPIRED") {
      toast.error(message);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Boshqa xatolar — toast
    if (error.response.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
```

---

### React Error Boundary

**File:** `frontend/src/components/common/ErrorBoundary.jsx`

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info.componentStack);
    // Sentry yoki boshqa monitoring ga yuborish mumkin
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full
                        gap-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center
                          justify-center text-red-400 text-2xl">
            ⚠️
          </div>
          <div>
            <h2 className="text-lg font-semibold text-tg-primary mb-1">
              Xatolik yuz berdi
            </h2>
            <p className="text-sm text-tg-secondary">
              Sahifani yangilang yoki keyinroq urinib ko'ring
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="tg-btn-primary"
          >
            Sahifani yangilash
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Ishlatish:
// <ErrorBoundary><ChatWindow /></ErrorBoundary>
```

---

## 📊 Xato Kodlari Ro'yxati

| Kod | HTTP | Tavsif |
|-----|------|--------|
| `VALIDATION_ERROR` | 400 | Input validatsiya xatosi |
| `INVALID_ID` | 400 | Noto'g'ri MongoDB ID |
| `UNAUTHORIZED` | 401 | Token yo'q yoki yaroqsiz |
| `TOKEN_EXPIRED` | 401 | Token muddati tugagan |
| `INVALID_TOKEN` | 401 | Token noto'g'ri format |
| `FORBIDDEN` | 403 | Ruxsat yo'q |
| `NOT_FOUND` | 404 | Resurs topilmadi |
| `CHAT_NOT_FOUND` | 404 | Chat topilmadi |
| `USER_NOT_FOUND` | 404 | Foydalanuvchi topilmadi |
| `DUPLICATE_KEY` | 409 | Takroriy qiymat |
| `TOO_MANY_REQUESTS` | 429 | Rate limit oshib ketdi |
| `INTERNAL_ERROR` | 500 | Server ichki xatosi |

---

## ✅ Xato Boshqaruvi Checklist

```
□ Barcha controller-lar catchAsync ichida
□ AppError to'g'ri statusCode va code bilan
□ Global errorMiddleware app.js da eng oxirida
□ 404 middleware barcha route-lardan keyin
□ Winston logger o'rnatilgan va sozlangan
□ logs/ papkasi .gitignore da
□ Production da stack trace yo'q
□ Frontend axios interceptor xatolarni ushlaydi
□ ErrorBoundary barcha sahifa komponentlarda
□ Tarmoq xatosi (offline) ko'rsatiladi
□ Toast xabarlari foydalanuvchiga qulay
```
