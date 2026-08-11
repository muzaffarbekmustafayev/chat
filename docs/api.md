# 🔌 REST API Endpointlari

**Base URL:** `http://localhost:5000/api`

> Barcha himoyalangan route-lar `Authorization: Bearer <token>` header talab qiladi.

---

## 🔐 Autentifikatsiya (`/api/auth`)

### `POST /api/auth/register`
Yangi foydalanuvchi ro'yxatdan o'tkazish.

**Request Body:**
```json
{
  "username": "john_doe",
  "phone": "+998901234567",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc...",
      "username": "john_doe",
      "phone": "+998901234567",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": null,
      "bio": "",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `POST /api/auth/login`
Tizimga kirish.

**Request Body:**
```json
{
  "phone": "+998901234567",
  "password": "StrongPass123!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "...foydalanuvchi ma'lumotlari" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `POST /api/auth/refresh`
Access token yangilash.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### `POST /api/auth/logout`
🔒 Tizimdan chiqish.

**Response `200`:**
```json
{ "success": true, "message": "Tizimdan chiqildi" }
```

---

## 👤 Foydalanuvchilar (`/api/users`)

### `GET /api/users/me` 🔒
Joriy foydalanuvchi profili.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+998901234567",
    "avatar": "http://localhost:5000/uploads/avatars/avatar-123.jpg",
    "bio": "Salom! Men Telegramdan foydalanaman.",
    "isOnline": true,
    "lastSeen": "2024-01-15T10:30:00Z"
  }
}
```

---

### `PUT /api/users/me` 🔒
Profil ma'lumotlarini yangilash.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Yangi bio matni",
  "username": "new_username"
}
```

---

### `PUT /api/users/me/avatar` 🔒
Avatar yuklash.

**Request:** `multipart/form-data`
- Field: `avatar` (image file, max 5MB)

---

### `GET /api/users/search?q=john` 🔒
Foydalanuvchi qidirish.

**Query Params:**
- `q` — qidiruv so'zi (username yoki ism)
- `limit` — natijalar soni (default: 20)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc...",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "...",
      "isOnline": false,
      "lastSeen": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

### `GET /api/users/:userId` 🔒
Boshqa foydalanuvchi profili.

---

## 💬 Chatlar (`/api/chats`)

### `GET /api/chats` 🔒
Joriy foydalanuvchining barcha chatlari.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64def...",
      "type": "private",
      "participants": [
        { "_id": "...", "username": "john_doe", "avatar": "...", "isOnline": true }
      ],
      "lastMessage": {
        "_id": "...",
        "text": "Salom!",
        "sender": "64abc...",
        "createdAt": "2024-01-15T10:00:00Z"
      },
      "unreadCount": 3,
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### `POST /api/chats/private` 🔒
Shaxsiy chat yaratish yoki olish.

**Request Body:**
```json
{ "userId": "64abc..." }
```

---

### `POST /api/chats/group` 🔒
Guruh chat yaratish.

**Request Body:**
```json
{
  "name": "Do'stlar",
  "description": "Guruh tavsifi",
  "participants": ["64abc...", "64def...", "64ghi..."]
}
```

---

### `GET /api/chats/:chatId` 🔒
Chat tafsilotlari.

---

### `PUT /api/chats/:chatId` 🔒
Guruh ma'lumotlarini yangilash (faqat admin).

**Request Body:**
```json
{
  "name": "Yangi nom",
  "description": "Yangi tavsif"
}
```

---

### `POST /api/chats/:chatId/members` 🔒
Guruhga a'zo qo'shish.

**Request Body:**
```json
{ "userId": "64abc..." }
```

---

### `DELETE /api/chats/:chatId/members/:userId` 🔒
Guruhdan a'zoni chiqarish.

---

### `DELETE /api/chats/:chatId/leave` 🔒
Guruhdan chiqish.

---

## 📨 Xabarlar (`/api/messages`)

### `GET /api/messages/:chatId` 🔒
Chat xabarlari (sahifalab).

**Query Params:**
- `page` — sahifa (default: 1)
- `limit` — xabarlar soni (default: 50)
- `before` — ID dan oldingi xabarlar (cursor pagination)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "64xyz...",
        "chat": "64def...",
        "sender": {
          "_id": "64abc...",
          "username": "john_doe",
          "avatar": "..."
        },
        "type": "text",
        "text": "Salom!",
        "media": null,
        "replyTo": null,
        "readBy": ["64abc...", "64def..."],
        "isEdited": false,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "hasMore": true
    }
  }
}
```

---

### `POST /api/messages/:chatId` 🔒
Xabar yuborish.

**Request Body:**
```json
{
  "type": "text",
  "text": "Salom, qalaysiz?",
  "replyTo": "64xyz..."
}
```

**Xabar turlari (`type`):**
- `text` — matn xabar
- `image` — rasm
- `video` — video
- `audio` — audio / ovozli xabar
- `document` — hujjat/fayl
- `sticker` — sticker

---

### `POST /api/messages/:chatId/media` 🔒
Media xabar yuborish.

**Request:** `multipart/form-data`
- Field: `file` (max 50MB)
- Field: `caption` — izoh (ixtiyoriy)
- Field: `replyTo` — javob xabar IDsi (ixtiyoriy)

---

### `PUT /api/messages/:messageId` 🔒
Xabarni tahrirlash.

**Request Body:**
```json
{ "text": "Tahrirlangan xabar matni" }
```

---

### `DELETE /api/messages/:messageId` 🔒
Xabarni o'chirish.

**Query Params:**
- `deleteFor` — `me` yoki `everyone`

---

### `POST /api/messages/:chatId/read` 🔒
Xabarlarni o'qilgan deb belgilash.

**Request Body:**
```json
{ "lastReadMessageId": "64xyz..." }
```

---

## ❌ Xato Kodlari

| Kod | Ma'no |
|-----|-------|
| `400` | Noto'g'ri so'rov (Validation Error) |
| `401` | Autentifikatsiya talab qilinadi |
| `403` | Ruxsat yo'q |
| `404` | Topilmadi |
| `409` | Conflict (username band) |
| `429` | So'rovlar juda ko'p (Rate limit) |
| `500` | Server xatosi |

**Xato javobi formati:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Telefon raqami noto'g'ri formatda",
    "details": [
      { "field": "phone", "message": "Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak" }
    ]
  }
}
```
