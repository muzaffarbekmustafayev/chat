# ✅ Funksiyalar Ro'yxati va Holati

> **Belgilar:** ✅ Tayyor · 🔄 Ishlanmoqda · 📋 Rejalashtirilgan · ❌ Yo'q

---

## 🔐 Autentifikatsiya

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Telefon + parol bilan ro'yxat | 📋 | SMS OTP tasdiq ham qo'shish mumkin |
| Login (telefon + parol) | 📋 | |
| JWT access + refresh token | 📋 | 15min / 30kun |
| Token avtomatik yangilash | 📋 | Axios interceptor |
| Logout (barcha qurilmalar) | 📋 | DB dagi refreshTokens tozalanadi |
| Profil tahrirlash | 📋 | Ism, bio, username |
| Avatar yuklash | 📋 | Max 5MB, rasm |
| Parol o'zgartirish | 📋 | Eski parol talab qilinadi |

---

## 💬 Xabar Almashish

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Matn xabar yuborish | 📋 | Max 4096 belgi |
| Rasm yuborish | 📋 | JPEG, PNG, WebP, max 10MB |
| Video yuborish | 📋 | Max 50MB |
| Audio / ovozli xabar | 📋 | Web Audio API bilan yozish |
| Hujjat (fayl) yuborish | 📋 | Har qanday format, max 50MB |
| Sticker yuborish | 📋 | |
| Xabarga javob berish | 📋 | Reply preview |
| Xabarni forward qilish | 📋 | Boshqa chatlarga |
| Xabarni tahrirlash | 📋 | Faqat o'z xabarlar, "edited" belgisi |
| Xabarni o'chirish | 📋 | Faqat o'zim uchun / hammaga |
| Xabarni pin qilish | 📋 | Guruh adminlar |
| Xabar qidirish | 📋 | Full-text MongoDB |
| Emoji reaksiyalar | 📋 | Xabarga emoji qo'shish |

---

## 📋 Chat Turlari

| Tur | Holat | Tavsif |
|-----|-------|--------|
| Shaxsiy chat (private) | 📋 | Ikki kishi orasida |
| Guruh chat | 📋 | Ko'p a'zo, admin rollari |
| Kanal | 📋 | Bir tomonlama (admin yozadi) |
| Saved Messages | 📋 | O'zingizga xabar |

---

## 👥 Guruh Boshqaruv

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Guruh yaratish | 📋 | Nom, tavsif, a'zolar |
| A'zo qo'shish | 📋 | |
| A'zoni chiqarish (kick) | 📋 | Admin huquqi |
| A'zoni bloklash (ban) | 📋 | Admin huquqi |
| Admin tayinlash | 📋 | |
| Guruh ma'lumotini tahrirlash | 📋 | Admin huquqi |
| Guruhdan chiqish | 📋 | |
| Guruhni o'chirish | 📋 | Faqat egasi |
| Guruh havolasi | 📋 | `t.me/groupname` uslubida |

---

## 🟢 Online Holat

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Online/Offline ko'rsatgich | 📋 | Yashil nuqta |
| "So'nggi faollik" vaqti | 📋 | "online" / "5 daqiqa avval" |
| Yozmoqda... (typing indicator) | 📋 | |
| Ovozli xabar yozmoqda... | 📋 | |

---

## ✅ O'qilganlik

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Yuborildi (bir belgi ✓) | 📋 | |
| Yetkazildi (ikki belgi ✓✓) | 📋 | |
| O'qildi (ko'k ✓✓) | 📋 | |
| O'qilmagan xabarlar soni | 📋 | Sidebar badge |

---

## 📁 Fayl Boshqaruv

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Fayl yuklash (Multer) | 📋 | Local saqlash |
| Thumbnail generatsiya | 📋 | Rasmlar uchun |
| Fayl yuklab olish | 📋 | |
| Media gallery (chat media) | 📋 | Chat medialarini ko'rish |

---

## 🔍 Qidiruv

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Foydalanuvchi qidirish | 📋 | Username, ism bo'yicha |
| Chat qidirish | 📋 | |
| Xabar qidirish | 📋 | Chat ichida |
| Global qidiruv | 📋 | Foydalanuvchi + guruhlar |

---

## 🔔 Bildirishnomalar

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| In-app bildirishnomalar | 📋 | Toast/notification |
| Browser push notifications | 📋 | Web Push API |
| Ovozni o'chirish (mute) | 📋 | Chat mute qilish |

---

## 🎨 UI/UX

| Funksiya | Holat | Tavsif |
|----------|-------|--------|
| Dark mode (Telegram uslubi) | 📋 | Default qorong'u tema |
| Light mode | 📋 | Almashtirish imkoni |
| Emoji picker | 📋 | `emoji-picker-react` |
| Infinite scroll (xabarlar) | 📋 | Cursor pagination |
| Lazy loading (rasmlar) | 📋 | |
| Drag & drop fayl yuborish | 📋 | |
| Rasm kattalashtirish | 📋 | Lightbox |
| Video player | 📋 | In-chat |
| Responsive (mobil) | 📋 | |

---

## 🚀 Kelajakdagi Funksiyalar (v2)

| Funksiya | Tavsif |
|----------|--------|
| 📞 Audio qo'ng'iroq | WebRTC |
| 📹 Video qo'ng'iroq | WebRTC |
| 🤖 Bot API | Telegram bot uslubida |
| 📊 Kanal statistikasi | Ko'rishlar, obunalar |
| 🔒 End-to-end encryption | Signal Protocol |
| 📍 Joylashuv ulashish | |
| 🗓️ Rejalashtirilgan xabarlar | |

---

## 📊 Texnik Ko'rsatkichlar (Maqsad)

| Ko'rsatkich | Maqsad |
|-------------|--------|
| Bir vaqtda ulanishlar | 1,000+ |
| Xabar yetkazish vaqti | < 100ms |
| API javob vaqti | < 200ms |
| Fayl yuklash tezligi | 10MB/s |
| Frontend bundle hajmi | < 500KB |
