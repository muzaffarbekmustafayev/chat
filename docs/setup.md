# ⚙️ O'rnatish va Ishga Tushirish

---

## 📋 Talablar

| Dastur | Versiya | Tekshirish |
|--------|---------|-----------|
| Node.js | ≥ 18.x | `node --version` |
| npm | ≥ 9.x | `npm --version` |
| MongoDB | ≥ 6.x | `mongod --version` |
| Git | istalgan | `git --version` |

---

## 🚀 1-qadam: Loyihani Klonlash

```bash
git clone https://github.com/username/telegram-clone.git
cd telegram-clone
```

---

## 🔧 2-qadam: Backend O'rnatish

```bash
cd backend
npm install
```

**Kerakli paketlar:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.1.0",
    "socket.io": "^4.7.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "express-validator": "^7.0.0",
    "multer": "^1.4.5",
    "dotenv": "^16.4.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### `.env` faylini yarating:
```bash
cp .env.example .env
```

Keyin `.env` faylini tahrirlang:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/telegram_clone
JWT_ACCESS_SECRET=kamida_32_belgilik_murakkab_kalit
JWT_REFRESH_SECRET=boshqa_kamida_32_belgilik_murakkab_kalit
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads/
```

---

## ⚛️ 3-qadam: Frontend O'rnatish

```bash
cd ../frontend
npm install
```

### `.env` faylini yarating:
```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🗄️ 4-qadam: MongoDB Ishga Tushirish

### Local MongoDB:
```bash
# Windows (Service sifatida ishga tushirish)
net start MongoDB

# yoki to'g'ridan-to'g'ri:
mongod --dbpath C:\data\db
```

### MongoDB Atlas (Cloud):
1. [mongodb.com/atlas](https://mongodb.com/atlas) da hisob oching
2. Cluster yarating (bepul M0)
3. Connection string oling
4. `.env` da `MONGODB_URI` ni yangilang:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/telegram_clone
```

---

## ▶️ 5-qadam: Ishga Tushirish

### Development rejimi:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
✅ `Server running on port 5000` ko'rinishi kerak

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
✅ `Local: http://localhost:5173` ko'rinishi kerak

---

## 📜 `package.json` Scripts

### Backend `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "lint": "eslint src/"
  }
}
```

### Frontend `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/"
  }
}
```

---

## 🌐 Vite Proxy Sozlamasi

**File:** `frontend/vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
```

---

## 🐳 Docker bilan Ishga Tushirish (Ixtiyoriy)

**`docker-compose.yml`** (loyiha ildizida):
```yaml
version: "3.8"
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: telegram_clone

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/telegram_clone
    depends_on:
      - mongodb
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

```bash
# Ishga tushirish
docker-compose up -d

# To'xtatish
docker-compose down
```

---

## 🔍 Muammolarni Hal Qilish

### ❌ `ECONNREFUSED 27017`
MongoDB ishlamayapti.
```bash
# Windows
net start MongoDB
```

### ❌ `CORS error`
Backend `.env` da `CLIENT_URL` to'g'ri emasligini tekshiring:
```env
CLIENT_URL=http://localhost:5173
```

### ❌ `JWT malformed`
Token format xato. `Authorization: Bearer <token>` ekanligini tekshiring.

### ❌ Port band (`EADDRINUSE`)
```bash
# 5000 portni ishlatayotgan jarayonni toping
netstat -ano | findstr :5000
# PID ni o'ldiring
taskkill /PID <PID> /F
```

---

## ✅ Ishlashini Tekshirish

```bash
# Backend health check
curl http://localhost:5000/api/health

# Kutilgan javob:
# {"status":"ok","database":"connected","uptime":42}
```

Brauzerda: `http://localhost:5173` — login sahifasi ko'rinishi kerak.
