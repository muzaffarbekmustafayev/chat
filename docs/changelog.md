# 📋 Changelog — O'zgarishlar Tarixi

Barcha muhim o'zgarishlar shu faylda qayd etiladi.  
Format: [Keep a Changelog](https://keepachangelog.com) asosida.  
Versiyalash: [Semantic Versioning](https://semver.org).

---

## [Unreleased] — Ishlanmoqda

### 📌 Rejalashtirilgan
- [ ] Ovozli qo'ng'iroq (WebRTC)
- [ ] Video qo'ng'iroq (WebRTC)
- [ ] Kanal yaratish
- [ ] Xabar pin qilish
- [ ] Emoji reaksiyalar
- [ ] Bot API

---

## [1.0.0] — 2024-01-01 — Birinchi Reliz 🎉

### ✨ Qo'shildi (Added)
- JWT asosidagi autentifikatsiya (access + refresh token)
- Telefon + parol bilan ro'yxat va kirish
- Shaxsiy chat (private)
- Guruh chat yaratish va boshqarish
- Real-time xabar almashish (Socket.IO)
- Matn xabar yuborish
- Rasm yuborish (sharp bilan optimallashtirish)
- Hujjat yuborish
- Xabarga javob berish (reply)
- Xabar tahrirlash
- Xabar o'chirish (faqat o'zim / hammaga)
- Online/offline holat ko'rsatgichi
- Yozmoqda... (typing indicator)
- Xabar o'qilganlik belgisi (read receipts)
- O'qilmagan xabarlar soni (unread badge)
- Foydalanuvchi qidirish
- Profil tahrirlash (ism, bio, username)
- Avatar yuklash
- Guruhga a'zo qo'shish/chiqarish
- Guruhdan chiqish
- Responsive dizayn (mobil/planshet/desktop)
- Tailwind CSS CDN asosidagi dizayn tizimi
- Dark mode (Telegram uslubida)
- In-app toast bildirishnomalar
- MongoDB migration tizimi (migrate-mongo)
- Rate limiting va xavfsizlik middleware-lar
- Fayl yuklash xavfsizligi (MIME type validatsiya)

### 🔧 Texnik
- Node.js + Express backend
- React 18 + Vite frontend
- MongoDB + Mongoose
- Socket.IO real-time
- Redux Toolkit state boshqaruvi
- Axios + interceptorlar
- Multer fayl yuklash
- Sharp rasm optimallashtirish
- Helmet, CORS, express-rate-limit
- express-validator input tekshirish
- bcryptjs parol hash

---

## [0.3.0] — 2024-01-28

### ✨ Qo'shildi
- Fayl yuklash (rasm, video, audio, hujjat)
- Rasm thumbnail yaratish
- Upload progress bar
- Drag & Drop fayl yuborish
- Lazy loading rasmlar

### 🐛 Tuzatildi
- Katta fayl yuklashda server timeout
- Thumbnail papkasi yaratilmagan holat

### ⚡ Yaxshilandi
- MongoDB cursor-based pagination (offset o'rniga)
- Rasm yuklanish tezligi (WebP formatiga o'girish)

---

## [0.2.0] — 2024-01-15

### ✨ Qo'shildi
- Guruh chat yaratish
- Guruhga a'zo qo'shish va chiqarish
- Admin tayinlash
- Guruh ma'lumotlarini tahrirlash
- Guruhdan chiqish
- Foydalanuvchi qidirish (full-text)
- Xabarga javob berish (reply)
- Xabar tahrirlash
- Xabar o'chirish

### 🐛 Tuzatildi
- Socket.IO token yangilanmagan holat
- Xabarlar ketma-ket kelganda tartib buzilishi
- Mobilda keyboard ochilganda layout siljishi

### 🔒 Xavfsizlik
- NoSQL injection himoya (express-mongo-sanitize)
- XSS himoya (xss-clean)
- Input validatsiya barcha route-larda
- Rate limiting auth endpointlarga

---

## [0.1.0] — 2024-01-01

### ✨ Qo'shildi
- Loyiha asosi yaratildi
- JWT autentifikatsiya (access + refresh)
- Shaxsiy chat
- Real-time matn xabar (Socket.IO)
- Online/offline holat
- Yozmoqda... ko'rsatgich
- O'qilganlik belgisi
- Sidebar chat ro'yxati
- Responsive layout (asosiy)

### 🔧 Arxitektura
- `backend/` va `frontend/` alohida papkalar
- Express + MongoDB + Mongoose
- React + Vite + Redux Toolkit
- Socket.IO server + client
- Papka tuzilmasi yaratildi

---

## Versiya Taqqoslash

| Versiya | Holat | Sanasi | Tavsif |
|---------|-------|--------|--------|
| `1.0.0` | ✅ Barqaror | 2024-01-01 | Birinchi reliz |
| `0.3.0` | ✅ | 2024-01-28 | Fayl yuklash |
| `0.2.0` | ✅ | 2024-01-15 | Guruh chat |
| `0.1.0` | ✅ | 2024-01-01 | MVP |
| `Unreleased` | 🔄 | — | Ishlanmoqda |

---

> **Qo'llanma:** Yangi funksiya qo'shilganda `[Unreleased]` bo'limiga yozing.  
> Reliz paytida `[Unreleased]` → `[x.y.z] — YYYY-MM-DD` ga o'zgartiring.
