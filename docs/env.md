# 🌍 Environment Variables — Muhit O'zgaruvchilari

> Backend va Frontend uchun barcha `.env` o'zgaruvchilari to'liq tavsifi.

---

## 🖥️ Backend `.env`

**Fayl:** `backend/.env`  
**Namuna:** `backend/.env.example`

```env
# ============================================================
# SERVER
# ============================================================
PORT=5000
NODE_ENV=development         # development | production | test
SERVER_URL=http://localhost:5000

# ============================================================
# MONGODB
# ============================================================
# Local
MONGODB_URI=mongodb://localhost:27017/telegram_clone

# Atlas (production)
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/telegram_clone

# ============================================================
# JWT
# ============================================================
JWT_ACCESS_SECRET=your_super_secret_access_key_min_64_chars_here_change_me_pls
JWT_REFRESH_SECRET=another_super_secret_refresh_key_min_64_chars_change_me_too
JWT_ACCESS_EXPIRES=15m       # 15 daqiqa
JWT_REFRESH_EXPIRES=30d      # 30 kun

# ============================================================
# CORS
# ============================================================
CLIENT_URL=http://localhost:5173
# Production: CLIENT_URL=https://yourdomain.com

# ============================================================
# FAYL YUKLASH
# ============================================================
MAX_FILE_SIZE=52428800        # 50MB (baytda)
UPLOAD_DIR=uploads/           # Yuklash papkasi

# ============================================================
# REDIS (ixtiyoriy — caching uchun)
# ============================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=               # Yo'q bo'lsa bo'sh

# ============================================================
# MIGRATION
# ============================================================
AUTO_MIGRATE=true             # Serverda avtomatik migration

# ============================================================
# LOGGING
# ============================================================
LOG_LEVEL=debug               # error | warn | info | debug
LOG_FORMAT=dev                # dev | combined (production uchun combined)

# ============================================================
# RATE LIMITING
# ============================================================
RATE_LIMIT_WINDOW_MS=900000   # 15 daqiqa (ms)
RATE_LIMIT_MAX=100            # Maksimal so'rov soni
AUTH_RATE_LIMIT_MAX=10        # Auth endpointlar uchun

# ============================================================
# EMAIL (ixtiyoriy — bildirishnomalar uchun)
# ============================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# ============================================================
# PUSH NOTIFICATIONS (ixtiyoriy)
# ============================================================
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:admin@yourdomain.com
```

---

## 📋 Backend O'zgaruvchilar Jadvali

| O'zgaruvchi | Majburiy | Default | Tavsif |
|-------------|----------|---------|--------|
| `PORT` | ✅ | `5000` | Server port |
| `NODE_ENV` | ✅ | `development` | Muhit turi |
| `MONGODB_URI` | ✅ | — | MongoDB ulanish string |
| `JWT_ACCESS_SECRET` | ✅ | — | Access token kalit (64+ belgi) |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token kalit (64+ belgi) |
| `JWT_ACCESS_EXPIRES` | ⬜ | `15m` | Access token muddati |
| `JWT_REFRESH_EXPIRES` | ⬜ | `30d` | Refresh token muddati |
| `CLIENT_URL` | ✅ | — | Frontend URL (CORS) |
| `MAX_FILE_SIZE` | ⬜ | `52428800` | Max fayl hajmi (bayt) |
| `UPLOAD_DIR` | ⬜ | `uploads/` | Media papkasi |
| `AUTO_MIGRATE` | ⬜ | `false` | Avtomatik migration |
| `REDIS_HOST` | ⬜ | `localhost` | Redis server |
| `REDIS_PORT` | ⬜ | `6379` | Redis port |
| `LOG_LEVEL` | ⬜ | `info` | Log darajasi |
| `VAPID_PUBLIC_KEY` | ⬜ | — | Push notification |
| `VAPID_PRIVATE_KEY` | ⬜ | — | Push notification |

---

## ⚛️ Frontend `.env`

**Fayl:** `frontend/.env`  
**Namuna:** `frontend/.env.example`

```env
# ============================================================
# API
# ============================================================
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# ============================================================
# APP
# ============================================================
VITE_APP_NAME=Telegram Clone
VITE_APP_VERSION=1.0.0

# ============================================================
# PUSH NOTIFICATIONS (ixtiyoriy)
# ============================================================
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# ============================================================
# FEATURE FLAGS (ixtiyoriy)
# ============================================================
VITE_ENABLE_VOICE_CALLS=false
VITE_ENABLE_VIDEO_CALLS=false
VITE_ENABLE_CHANNELS=false
VITE_MAX_FILE_SIZE=52428800
```

---

## 📋 Frontend O'zgaruvchilar Jadvali

| O'zgaruvchi | Majburiy | Default | Tavsif |
|-------------|----------|---------|--------|
| `VITE_API_URL` | ✅ | — | Backend REST API URL |
| `VITE_SOCKET_URL` | ✅ | — | Socket.IO server URL |
| `VITE_APP_NAME` | ⬜ | `Telegram Clone` | Ilova nomi |
| `VITE_APP_VERSION` | ⬜ | `1.0.0` | Versiya |
| `VITE_VAPID_PUBLIC_KEY` | ⬜ | — | Push notification kaliti |
| `VITE_ENABLE_VOICE_CALLS` | ⬜ | `false` | Ovozli qo'ng'iroq yoqish |
| `VITE_MAX_FILE_SIZE` | ⬜ | `52428800` | Max fayl hajmi |

---

## 🔧 `.env.example` Fayllar

Har doim `.env.example` faylni git-ga qo'shing (haqiqiy qiymatlarsiz):

```bash
# backend/.env.example

PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000

MONGODB_URI=mongodb://localhost:27017/telegram_clone

JWT_ACCESS_SECRET=CHANGE_THIS_TO_RANDOM_64_CHAR_STRING
JWT_REFRESH_SECRET=CHANGE_THIS_TO_ANOTHER_RANDOM_64_CHAR_STRING
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

CLIENT_URL=http://localhost:5173

MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads/

AUTO_MIGRATE=true
LOG_LEVEL=debug
```

```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local

# Faqat example fayllar git-ga
!.env.example
```

---

## ⚙️ Environment Yuklash

**File:** `backend/src/config/env.js`

```javascript
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env")
});

// Majburiy o'zgaruvchilarni tekshirish
const required = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL"
];

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Kerakli environment variables topilmadi: ${missing.join(", ")}`);
  console.error("   .env.example faylini nusxa oling: cp .env.example .env");
  process.exit(1);
}

// JWT secret uzunligini tekshirish (xavfsizlik)
if (process.env.JWT_ACCESS_SECRET.length < 32) {
  console.error("❌ JWT_ACCESS_SECRET kamida 32 belgidan iborat bo'lishi kerak");
  process.exit(1);
}

module.exports = {
  PORT:          parseInt(process.env.PORT) || 5000,
  NODE_ENV:      process.env.NODE_ENV || "development",
  MONGODB_URI:   process.env.MONGODB_URI,
  JWT: {
    ACCESS_SECRET:   process.env.JWT_ACCESS_SECRET,
    REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRES:  process.env.JWT_ACCESS_EXPIRES  || "15m",
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "30d",
  },
  CLIENT_URL:    process.env.CLIENT_URL,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024,
  UPLOAD_DIR:    process.env.UPLOAD_DIR || "uploads/",
  AUTO_MIGRATE:  process.env.AUTO_MIGRATE === "true",
  IS_PROD:       process.env.NODE_ENV === "production",
  IS_DEV:        process.env.NODE_ENV === "development",
  IS_TEST:       process.env.NODE_ENV === "test",
};
```

---

## 🌐 Environment bo'yicha farqlar

| Sozlama | Development | Test | Production |
|---------|-------------|------|------------|
| `NODE_ENV` | `development` | `test` | `production` |
| `MONGODB_URI` | Local | Memory Server | Atlas |
| `AUTO_MIGRATE` | `true` | `false` | `false` (qo'lda) |
| `LOG_LEVEL` | `debug` | `error` | `warn` |
| `JWT_ACCESS_EXPIRES` | `15m` | `1h` | `15m` |
| CORS | `localhost:5173` | `*` | Domen |
| Rate Limit | 1000 | o'chirilgan | 100 |

---

## 🔐 Xavfsiz Kalit Yaratish

```bash
# Linux / Mac
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Natija (64 bayt = 128 hex belgi):
# a3f8b2e1d4c7a9f0b3e6d1c8a5f2b9e4d7c0a3f8b2e1d4c7a9f0b3e6d1c8a5f2...
```

> ⚠️ **Muhim:** Haqiqiy `.env` fayllarini **hech qachon** git-ga commit qilmang!
