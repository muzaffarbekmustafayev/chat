# 💬 Telegram Clone (Full-Stack Real-Time Chat App)

Zamonaviy texnologiyalar asosida qurilgan, to'laqonli va real vaqt rejimida (real-time) ishlovchi chat ilovasi. 
Bu loyiha mashhur Telegram messenjerining asosiy imkoniyatlari va vizual uslubini takrorlash maqsadida yaratilgan.

## ✨ Imkoniyatlar (Features)

*   **Real-time suhbat:** Socket.IO yordamida uzluksiz, kechikishlarsiz xabar almashish.
*   **Xavfsiz avtorizatsiya:** JWT (Access va Refresh tokenlar) orqali himoyalangan foydalanuvchi tizimi.
*   **Shaxsiy Chatlar:** Foydalanuvchilarni qidirib topish va ular bilan yakka-yakka (Private) chat ochish.
*   **Guruhlar va Kanallar:** Bir nechta odamni qo'shib guruhlar yaratish hamda faqat adminlar yoza oladigan kanallar ochish imkoniyati.
*   **Premium Dizayn:** Shisha effekti (Glassmorphism), qorong'u/yorug' (Dark/Light) rejim, va ajoyib animatsiyalar.
*   **Media va Fayllar:** Rasm, audio va hujjatlarni yuklash imkoniyati (profil rasmlari va chatdagi media).
*   **Xabarlarni O'qish (Read Receipts):** Xabarlar yetkazib berilgani (1 ta belgi) va o'qilgani (2 ta belgi) holatlari (Seen status).
*   **Online/Offline holati:** Foydalanuvchilarning joriy holatini va qachon oxirgi marta kirganligini (Last seen) ko'rish.
*   **Theme Switcher:** Tungi va kunduzgi rejimni bir marta bosish bilan o'zgartirish.

## 🛠️ Texnologiyalar (Tech Stack)

### Frontend
*   **Framework:** React 18 (TypeScript) + Vite
*   **State Management:** Redux Toolkit (RTK)
*   **Styling:** Tailwind CSS (CDN orqali sozlanib olingan maxsus dizayn tizimi)
*   **Real-time:** Socket.IO-client
*   **Routing:** React Router v6
*   **Icons:** React Icons

### Backend
*   **Environment:** Node.js
*   **Framework:** Express.js (TypeScript bilan)
*   **Database:** MongoDB & Mongoose
*   **Real-time:** Socket.IO
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Uploads:** Multer (fayllarni saqlash uchun)

## 🚀 O'rnatish va Ishga tushirish (Setup & Run)

Loyiha kompyuteringizda ishlashi uchun `Node.js` va `MongoDB` (mahalliy yoki MongoDB Atlas) o'rnatilgan bo'lishi kerak.

### 1. Repozitoriyni ko'chirib olish

```bash
git clone https://github.com/muzaffarbekmustafayev/chat.git
cd chat
```

### 2. Backend ni sozlash

```bash
cd backend
npm install
```

`backend` papkasi ichida `.env.example` faylidan `.env` nusxasini yarating:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/telegram_clone
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
```

Backend ni ishga tushirish:
```bash
npm run dev
```

### 3. Frontend ni sozlash

```bash
cd ../frontend
npm install
```

`frontend` papkasi ichida `.env.example` faylidan `.env` nusxasini yarating:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Frontend ni ishga tushirish:
```bash
npm run dev
```

## 🤝 Hissa qo'shish (Contributing)
Loyiha ochiq kodli va har qanday PR (Pull Request) lar qabul qilinadi. Kodni yaxshilash yoki yangi funksiyalar qo'shish bo'yicha takliflaringiz bo'lsa, xursand bo'lamiz!

---
*Ushbu loyiha o'rganish va tajriba oshirish maqsadida yaratilgan.*
