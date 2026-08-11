# ⚛️ Frontend — React Komponentlari

**Tech Stack:** React 18 · Vite · Redux Toolkit · React Router DOM · Socket.IO Client · Axios · **Tailwind CSS (CDN)**

---

## 📦 Kutubxonalar

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.0",
    "date-fns": "^3.3.0",
    "react-hot-toast": "^2.4.0",
    "react-dropzone": "^14.2.0",
    "emoji-picker-react": "^4.9.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.1.0"
  }
}
```

---

## 🗺️ Sahifalar (Pages)

### `/` — Login Sahifasi (`LoginPage.jsx`)
- Telefon raqam va parol input
- "Ro'yxatdan o'tish" havolasi
- JWT token saqlash (localStorage)

### `/register` — Ro'yxat (`RegisterPage.jsx`)
- Ism, familiya, username, telefon, parol
- Real-time validatsiya

### `/chat` — Asosiy Chat (`ChatPage.jsx`)
- Sidebar (chat ro'yxati)
- Chat oynasi
- Foydalanuvchi sozlamalari

---

## 🧩 Komponentlar

### 📌 Sidebar

#### `Sidebar.jsx`
```
Sidebar
├── SidebarHeader (profil avatar, qidiruv, menyu)
├── SearchBar (qidiruv input)
└── ChatList (chat ro'yxati)
    └── ChatItem × n
```

**ChatItem Props:**
| Prop | Tur | Tavsif |
|------|-----|--------|
| `chat` | `Object` | Chat obyekti |
| `isActive` | `Boolean` | Tanlangan chat |
| `onClick` | `Function` | Bosish hodisasi |

---

### 💬 Chat Oynasi

#### `ChatWindow.jsx`
```
ChatWindow
├── ChatHeader (avatar, ism, online holat, amallar)
├── MessageList (scroll container)
│   ├── DateSeparator (sana ajratgich)
│   └── MessageBubble × n
│       ├── ReplyPreview (javob ko'rinishi)
│       ├── MediaContent (rasm/video/fayl)
│       ├── MessageText
│       └── MessageMeta (vaqt, o'qilganlik)
└── MessageInput
    ├── AttachmentPicker (fayl yuborish)
    ├── EmojiPicker
    ├── TextArea (yozish maydoni)
    └── SendButton / AudioRecordButton
```

---

### `MessageBubble.jsx`

```jsx
// Kiruvchi xabar (chap tomon)
// Chiquvchi xabar (o'ng tomon, ko'k/to'q)

const MessageBubble = ({ message, isMine }) => {
  return (
    <div className={`message-bubble ${isMine ? "mine" : "theirs"}`}>
      {message.replyTo && <ReplyPreview replyTo={message.replyTo} />}

      {message.type === "text" && (
        <p className="message-text">{message.text}</p>
      )}

      {message.type === "image" && (
        <img src={message.media.url} alt="rasm" />
      )}

      <div className="message-meta">
        <span className="message-time">
          {format(new Date(message.createdAt), "HH:mm")}
        </span>
        {isMine && <ReadReceipt readBy={message.readBy} />}
      </div>
    </div>
  );
};
```

---

### `MessageInput.jsx`

```jsx
// Funksiyalar:
// - Ko'p qatorli matn yozish (auto-resize)
// - Emoji picker
// - Fayl biriktirish
// - Ovozli xabar (Web Audio API)
// - Javob ko'rsatgichi (reply preview)
// - Typing indicator emit qilish
// - Enter bosib yuborish (Shift+Enter yangi qator)
```

---

## 🏪 Redux Store

### `authSlice.js`
```javascript
{
  user: null,          // Foydalanuvchi ma'lumotlari
  token: null,         // JWT access token
  isAuthenticated: false,
  loading: false,
  error: null
}
```

**Actions:**
- `loginUser(credentials)` — async thunk
- `registerUser(data)` — async thunk
- `logoutUser()` — token tozalash
- `updateProfile(data)` — profil yangilash

---

### `chatSlice.js`
```javascript
{
  chats: [],           // Barcha chatlar ro'yxati
  activeChat: null,    // Joriy ochiq chat
  loading: false,
  searchResults: []
}
```

**Actions:**
- `fetchChats()` — chatlarni yuklash
- `setActiveChat(chatId)` — chatni tanlash
- `addChat(chat)` — yangi chat qo'shish
- `updateLastMessage({ chatId, message })` — oxirgi xabar
- `incrementUnread(chatId)` — o'qilmagan oshirish

---

### `messageSlice.js`
```javascript
{
  messagesByChatId: {
    "chatId1": {
      messages: [],
      hasMore: true,
      loading: false
    }
  },
  typingUsers: {
    "chatId1": ["userId1"]
  }
}
```

**Actions:**
- `fetchMessages({ chatId, before })` — yuklash
- `addMessage(message)` — yangi xabar
- `editMessage({ messageId, text })` — tahrirlash
- `deleteMessage({ messageId, chatId })` — o'chirish
- `setTyping({ chatId, userId })` — typing holat

---

## 🔌 Context-lar

### `SocketContext.jsx`
```jsx
// Socket instance ni butun ilovaga tarqatish
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const newSocket = io(SERVER_URL, { auth: { token } });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
```

---

## 🎣 Custom Hook-lar

### `useSocket.js`
```javascript
// Socket hodisalarini subscribe qilish
const useSocket = (event, handler) => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket, event, handler]);
};
```

### `useMessages.js`
```javascript
// Xabarlarni yuklash va real-time yangilash
const useMessages = (chatId) => {
  const dispatch = useDispatch();
  const messages = useSelector(/* ... */);
  
  // Initial load
  useEffect(() => {
    dispatch(fetchMessages({ chatId }));
  }, [chatId]);

  // Real-time
  useSocket("new_message", (msg) => {
    if (msg.chat === chatId) dispatch(addMessage(msg));
  });

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    const oldest = messages[0];
    dispatch(fetchMessages({ chatId, before: oldest._id }));
  }, [chatId, messages]);

  return { messages, loadMore };
};
```

---

## 🎨 UI/UX Dizayn Tizimi

### Ranglar (CSS Variables)
```css
:root {
  --bg-primary: #0e1621;        /* Asosiy fon */
  --bg-secondary: #17212b;      /* Sidebar fon */
  --bg-tertiary: #242f3d;       /* Card fon */
  --accent: #2196f3;            /* Ko'k accent */
  --accent-hover: #1976d2;
  --text-primary: #ffffff;
  --text-secondary: #708499;
  --message-out: #2b5278;       /* O'z xabarlar */
  --message-in: #182533;        /* Boshqa xabarlar */
  --border: #0d1117;
  --online: #4caf50;
  --read-tick: #64b5f6;
}
```

### Animatsiyalar
- Xabar kelish: `slide-up 0.2s ease`
- Typing indicator: `bounce 1.4s infinite`
- Modal: `fade-scale 0.15s ease`
- Sidebar hover: `background 0.1s ease`

---

## 📱 Responsive Design

| Breakpoint | Ko'rinish |
|------------|-----------|
| `> 768px` | Sidebar + Chat oynasi (ikki ustun) |
| `< 768px` | Sidebar YOKI Chat oynasi (bir sahifa) |

```css
@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: var(--sidebar-display, flex);
  }
  .chat-window {
    display: var(--chat-display, none);
  }
}
```
