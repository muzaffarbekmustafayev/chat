# 💬 Telegram Clone — Loyiha Hujjatlari

> **Stack:** Node.js · React · **TypeScript** · MongoDB · Socket.IO · JWT · Tailwind CSS CDN

---

## 📁 Hujjatlar Ro'yxati

### 🏗️ Arxitektura
| Fayl | Tavsif |
|------|--------|
| [architecture.md](./architecture.md) | Tizim arxitekturasi va papka tuzilmasi |
| [typescript.md](./typescript.md) | TypeScript konfiguratsiya va tur tizimi |
| [features.md](./features.md) | Funksiyalar ro'yxati va holati |
| [changelog.md](./changelog.md) | Versiyalar tarixi |

### ⚙️ Backend
| Fayl | Tavsif |
|------|--------|
| [api.md](./api.md) | REST API endpointlari |
| [websocket.md](./websocket.md) | Real-time Socket.IO hodisalari |
| [database.md](./database.md) | MongoDB sxemalari va modellar |
| [migration.md](./migration.md) | MongoDB migration strategiyasi |
| [file-upload.md](./file-upload.md) | Fayl va media yuklash |
| [notifications.md](./notifications.md) | Push bildirishnomalar |
| [error-handling.md](./error-handling.md) | Xatolarni boshqarish va logging |

### ⚛️ Frontend
| Fayl | Tavsif |
|------|--------|
| [frontend.md](./frontend.md) | React komponentlari va sahifalar |
| [design.md](./design.md) | UI/UX dizayn tizimi (Tailwind CDN) |
| [responsive.md](./responsive.md) | Responsive dizayn va breakpointlar |

### 🔒 Xavfsizlik va Konfiguratsiya
| Fayl | Tavsif |
|------|--------|
| [auth.md](./auth.md) | Autentifikatsiya va avtorizatsiya |
| [security.md](./security.md) | Xavfsizlik choralari (OWASP) |
| [env.md](./env.md) | Environment variables to'liq tavsifi |

### 🚀 Deploy va Sifat
| Fayl | Tavsif |
|------|--------|
| [setup.md](./setup.md) | O'rnatish va ishga tushirish |
| [deployment.md](./deployment.md) | Production deploy (PM2, Nginx, Docker, CI/CD) |
| [testing.md](./testing.md) | Testlash strategiyasi (Jest, Playwright) |
| [performance.md](./performance.md) | Ishlash tezligini oshirish |
| [git-workflow.md](./git-workflow.md) | Git branch va commit qoidalari |

---

## 🚀 Loyiha Haqida

Bu loyiha **Telegram**ning asosiy funksiyalarini takrorlaydigan to'liq real-time chat ilovasi.

### Asosiy Imkoniyatlar

- 🔐 JWT asosidagi autentifikatsiya (access + refresh token)
- 💬 Real-time xabar almashish (Socket.IO)
- 👥 Guruh chatlari
- 📁 Fayl va media yuborish (rasm, video, audio, hujjat)
- 🟢 Online/offline holat ko'rsatgichi
- ✅ Xabar o'qilganlik belgisi (read receipts)
- ⌨️ Yozmoqda... ko'rsatgichi (typing indicator)
- 🔔 Web Push bildirishnomalar (PWA)
- 🔍 Foydalanuvchi va xabar qidirish
- 📱 Responsive dizayn (mobil/planshet/desktop)

---

## 🏗️ Arxitektura Umumiy Ko'rinishi

```
chat/
├── backend/          # Node.js + Express + Socket.IO + TypeScript
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── services/
│       ├── migrations/
│       └── utils/
├── frontend/         # React + Vite + TypeScript + Tailwind CSS CDN
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── hooks/
│       ├── context/
│       └── api/
└── docs/             # Hujjatlar (shu papka)
```

---

## ⚡ Tezkor Ishga Tushirish

```bash
# 1. MongoDB ishga tushiring
net start MongoDB

# 2. Backend
cd backend
cp .env.example .env    # .env ni to'ldiring
npm install
npm run dev

# 3. Frontend (yangi terminolda)
cd frontend
cp .env.example .env
npm install
npm run dev
```

| Xizmat | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

> 📖 To'liq o'rnatish uchun [setup.md](./setup.md) ni o'qing.
