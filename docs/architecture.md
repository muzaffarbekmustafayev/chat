# 🏗️ Arxitektura va Papka Tuzilmasi

## Umumiy Ko'rinish

```
chat/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB ulanish
│   │   │   └── env.js             # Environment o'zgaruvchilari
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── chat.controller.js
│   │   │   └── message.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  # JWT tekshirish
│   │   │   ├── upload.middleware.js # Multer (fayl yuklash)
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Chat.model.js
│   │   │   ├── Message.model.js
│   │   │   └── Media.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── chat.routes.js
│   │   │   └── message.routes.js
│   │   ├── services/
│   │   │   ├── socket.service.js   # Socket.IO mantiq
│   │   │   ├── media.service.js    # Fayl boshqarish
│   │   │   └── notification.service.js
│   │   ├── utils/
│   │   │   ├── jwt.utils.js
│   │   │   ├── bcrypt.utils.js
│   │   │   └── response.utils.js
│   │   ├── app.js                  # Express ilovasi
│   │   └── server.js               # HTTP + Socket.IO server
│   ├── uploads/                    # Yuklanadigan fayllar
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js            # Axios instance + interceptors
│   │   │   ├── auth.api.js
│   │   │   ├── chat.api.js
│   │   │   └── message.api.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ChatList.jsx
│   │   │   │   ├── ChatItem.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   └── AttachmentPicker.jsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.jsx
│   │   │       └── RegisterForm.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useChat.js
│   │   │   └── useMessages.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── store/
│   │   │   ├── index.js            # Redux Toolkit store
│   │   │   ├── authSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── messageSlice.js
│   │   ├── utils/
│   │   │   ├── dateFormat.js
│   │   │   └── fileType.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── docs/
    ├── README.md
    ├── architecture.md    (← siz bu fayldasiz)
    ├── api.md
    ├── websocket.md
    ├── database.md
    ├── frontend.md
    ├── auth.md
    ├── setup.md
    └── features.md
```

---

## 🔄 Ma'lumot Oqimi (Data Flow)

```
React Frontend
    │
    ├── HTTP (REST API) ──────► Express Routes
    │                               │
    └── WebSocket (Socket.IO) ──►  Socket Server
                                    │
                                    ▼
                              Business Logic
                              (Controllers / Services)
                                    │
                                    ▼
                              MongoDB (Mongoose)
```

---

## 🧩 Qatlamlar (Layers)

### 1. Presentation Layer (Frontend)

- React + Vite
- Redux Toolkit (state boshqarish)
- React Router DOM (routing)
- Socket.IO Client

### 2. API Layer (Backend)

- Express.js REST API
- JWT middleware
- Multer (fayl yuklash)
- Input validatsiya (express-validator)

### 3. Real-time Layer

- Socket.IO server
- Xona (room) asosidagi xabar tarqatish
- Typing indicator
- Online holat

### 4. Data Layer

- MongoDB + Mongoose
- Indekslangan so'rovlar
- GridFS (katta fayllar uchun)

---

## 🔐 Xavfsizlik Arxitekturasi

```
Client Request
    │
    ▼
Rate Limiter (express-rate-limit)
    │
    ▼
CORS Check
    │
    ▼
JWT Verification (middleware)
    │
    ▼
Route Handler
    │
    ▼
Input Validation
    │
    ▼
Controller → Model → MongoDB
```

---

## 🌐 Port va URL-lar

| Xizmat      | URL                                          | Port  |
| ----------- | -------------------------------------------- | ----- |
| Backend API | `http://localhost:5000/api`                | 5000  |
| Socket.IO   | `http://localhost:5000`                    | 5000  |
| Frontend    | `http://localhost:5173`                    | 5173  |
| MongoDB     | `mongodb://localhost:27017/telegram_clone` | 27017 |
