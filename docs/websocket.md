# ⚡ WebSocket — Socket.IO Hodisalari

**Socket URL:** `http://localhost:5000`

---

## 🔗 Ulanish

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // JWT token
  },
  transports: ["websocket"]
});
```

### Ulanish Holati

```javascript
socket.on("connect", () => {
  console.log("✅ Ulandi:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Ulanish xatosi:", err.message);
  // "Authentication error" → token yaroqsiz
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Uzildi:", reason);
});
```

---

## 📤 Client → Server Hodisalari (Emit)

### `join_chat`
Chat xonasiga kirish.

```javascript
socket.emit("join_chat", {
  chatId: "64def..."
});
```

---

### `leave_chat`
Chat xonasidan chiqish.

```javascript
socket.emit("leave_chat", {
  chatId: "64def..."
});
```

---

### `send_message`
Yangi xabar yuborish.

```javascript
socket.emit("send_message", {
  chatId: "64def...",
  type: "text",
  text: "Salom!",
  replyTo: null      // yoki message ID
});
```

---

### `typing_start`
Yozish boshlandi.

```javascript
socket.emit("typing_start", {
  chatId: "64def..."
});
```

---

### `typing_stop`
Yozish to'xtatildi.

```javascript
socket.emit("typing_stop", {
  chatId: "64def..."
});
```

---

### `mark_read`
Xabarlarni o'qilgan deb belgilash.

```javascript
socket.emit("mark_read", {
  chatId: "64def...",
  lastMessageId: "64xyz..."
});
```

---

### `edit_message`
Xabarni tahrirlash.

```javascript
socket.emit("edit_message", {
  messageId: "64xyz...",
  text: "Tahrirlangan matn"
});
```

---

### `delete_message`
Xabarni o'chirish.

```javascript
socket.emit("delete_message", {
  messageId: "64xyz...",
  chatId: "64def...",
  deleteFor: "everyone"  // "me" | "everyone"
});
```

---

## 📥 Server → Client Hodisalari (On)

### `new_message`
Yangi xabar keldi.

```javascript
socket.on("new_message", (data) => {
  console.log(data);
  /*
  {
    _id: "64xyz...",
    chat: "64def...",
    sender: {
      _id: "64abc...",
      username: "john_doe",
      avatar: "..."
    },
    type: "text",
    text: "Salom!",
    media: null,
    replyTo: null,
    readBy: [],
    isEdited: false,
    createdAt: "2024-01-15T10:00:00Z"
  }
  */
});
```

---

### `message_edited`
Xabar tahrirlandi.

```javascript
socket.on("message_edited", (data) => {
  /*
  {
    messageId: "64xyz...",
    chatId: "64def...",
    text: "Yangilangan matn",
    isEdited: true,
    updatedAt: "2024-01-15T10:05:00Z"
  }
  */
});
```

---

### `message_deleted`
Xabar o'chirildi.

```javascript
socket.on("message_deleted", (data) => {
  /*
  {
    messageId: "64xyz...",
    chatId: "64def...",
    deletedFor: "everyone"
  }
  */
});
```

---

### `user_typing`
Foydalanuvchi yozmoqda.

```javascript
socket.on("user_typing", (data) => {
  /*
  {
    chatId: "64def...",
    userId: "64abc...",
    username: "john_doe"
  }
  */
});
```

---

### `user_stop_typing`
Foydalanuvchi yozishni to'xtatdi.

```javascript
socket.on("user_stop_typing", (data) => {
  /*
  {
    chatId: "64def...",
    userId: "64abc..."
  }
  */
});
```

---

### `message_read`
Xabar o'qildi.

```javascript
socket.on("message_read", (data) => {
  /*
  {
    chatId: "64def...",
    userId: "64abc...",
    lastReadMessageId: "64xyz..."
  }
  */
});
```

---

### `user_online`
Foydalanuvchi online bo'ldi.

```javascript
socket.on("user_online", (data) => {
  /*
  {
    userId: "64abc...",
    isOnline: true
  }
  */
});
```

---

### `user_offline`
Foydalanuvchi offline bo'ldi.

```javascript
socket.on("user_offline", (data) => {
  /*
  {
    userId: "64abc...",
    isOnline: false,
    lastSeen: "2024-01-15T10:30:00Z"
  }
  */
});
```

---

### `new_chat`
Yangi chat yaratildi yoki qo'shildi.

```javascript
socket.on("new_chat", (data) => {
  // To'liq chat obyekti
});
```

---

### `chat_updated`
Chat ma'lumotlari o'zgardi (guruh nomi, rasm va h.k.).

```javascript
socket.on("chat_updated", (data) => {
  /*
  {
    chatId: "64def...",
    changes: {
      name: "Yangi guruh nomi",
      avatar: "..."
    }
  }
  */
});
```

---

### `error`
Server xatosi.

```javascript
socket.on("error", (data) => {
  /*
  {
    code: "UNAUTHORIZED",
    message: "Ruxsat yo'q"
  }
  */
});
```

---

## 🏠 Xona (Room) Tizimi

| Xona Nomi | Tavsif |
|-----------|--------|
| `user:<userId>` | Foydalanuvchiga shaxsiy hodisalar |
| `chat:<chatId>` | Chat xonasi (barcha a'zolar) |

```
Foydalanuvchi ulanadi
    │
    ▼
user:<userId> xonasiga avtomatik qo'shiladi
    │
    ▼
join_chat emit qilinadi
    │
    ▼
chat:<chatId> xonasiga qo'shiladi
```

---

## 💡 Misol: To'liq Chat Oqimi

```javascript
// 1. Ulan
const socket = io("http://localhost:5000", { auth: { token } });

// 2. Chat xonasiga kir
socket.emit("join_chat", { chatId });

// 3. Xabarlarni tinglash
socket.on("new_message", (message) => {
  // Redux store ga qo'sh
  dispatch(addMessage(message));
  // O'qilgan deb belgilagin (agar chat ochiq bo'lsa)
  if (isActiveChatOpen) {
    socket.emit("mark_read", { chatId, lastMessageId: message._id });
  }
});

// 4. Yozish indikatori
let typingTimeout;
inputRef.current.addEventListener("input", () => {
  socket.emit("typing_start", { chatId });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("typing_stop", { chatId });
  }, 2000);
});

// 5. Xabar yuborish
const sendMessage = (text) => {
  socket.emit("send_message", { chatId, type: "text", text });
};
```
