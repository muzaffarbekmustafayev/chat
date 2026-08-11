# ⚡ Performance — Ishlash Tezligini Oshirish

> MongoDB indekslash, caching, lazy loading, bundle optimizatsiya.

---

## 🔢 MongoDB Indekslar

```javascript
// Barcha muhim indekslar — bir joyda

// === USERS ===
db.users.createIndex({ phone: 1 },    { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ username: "text", firstName: "text", lastName: "text" },
  { weights: { username: 3, firstName: 2, lastName: 1 } });
db.users.createIndex({ isOnline: 1 });

// === CHATS ===
db.chats.createIndex({ participants: 1, updatedAt: -1 });  // Chat ro'yxati
db.chats.createIndex({ type: 1 });
db.chats.createIndex({ "participants": 1 }, { partialFilter: { type: "private" } });

// === MESSAGES ===
db.messages.createIndex({ chat: 1, createdAt: -1 });  // Xabarlar sahifalash
db.messages.createIndex({ sender: 1 });
db.messages.createIndex({ chat: 1, _id: -1 });        // Cursor pagination
db.messages.createIndex({ text: "text" });             // Full-text qidiruv
db.messages.createIndex(
  { chat: 1, createdAt: 1 },
  { partialFilter: { isDeleted: false } }              // Partial index
);
```

### Explain bilan so'rovni tekshirish
```javascript
// So'rov indeksdan foydalanyaptimi?
const result = await Message.find({ chat: chatId })
  .sort({ createdAt: -1 })
  .limit(50)
  .explain("executionStats");

console.log(result.executionStats.executionTimeMillis); // Vaqt (ms)
console.log(result.executionStats.totalDocsExamined);   // Ko'rilgan docs
// totalDocsExamined ≈ nReturned bo'lishi kerak (index ishlayapti)
```

---

## 🗃️ Server-Side Caching (Redis)

```bash
npm install ioredis
```

**File:** `backend/src/services/cache.service.js`

```javascript
const Redis  = require("ioredis");

const redis = new Redis({
  host:     process.env.REDIS_HOST || "localhost",
  port:     process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

class CacheService {
  // Cache yozish
  static async set(key, data, ttlSeconds = 300) {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  }

  // Cache o'qish
  static async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Cache o'chirish
  static async del(key) {
    await redis.del(key);
  }

  // Pattern bo'yicha o'chirish
  static async delPattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  }
}

module.exports = CacheService;
```

### Chatlar ro'yxatini cache qilish
```javascript
// controllers/chat.controller.js
const getChats = async (req, res) => {
  const userId  = req.user._id.toString();
  const cacheKey = `chats:${userId}`;

  // Cache tekshirish
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, fromCache: true });
  }

  // DB dan yuklash
  const chats = await Chat.find({ participants: req.user._id })
    .populate("participants", "username firstName lastName avatar isOnline lastSeen")
    .populate({ path: "lastMessage", populate: { path: "sender", select: "firstName" }})
    .sort({ updatedAt: -1 })
    .lean();

  // 60 soniya cache
  await CacheService.set(cacheKey, chats, 60);

  res.json({ success: true, data: chats });
};

// Yangi xabar kelganda cache tozalash
const invalidateChatCache = async (chatId) => {
  const chat = await Chat.findById(chatId).select("participants");
  for (const userId of chat.participants) {
    await CacheService.del(`chats:${userId.toString()}`);
  }
};
```

---

## 📄 Cursor-Based Pagination (Tez yuklash)

```javascript
// Offset pagination (SEKIN — katta datada)
// db.messages.find().skip(10000).limit(50)  ← ❌

// Cursor pagination (TEZ — har doim)
const getMessages = async (req, res) => {
  const { chatId }  = req.params;
  const { before, limit = 50 } = req.query;

  const query = {
    chat:      chatId,
    isDeleted: false,
  };

  // "before" ID dan oldingilarni olish
  if (before) {
    query._id = { $lt: new mongoose.Types.ObjectId(before) };
  }

  const messages = await Message.find(query)
    .populate("sender", "username firstName lastName avatar")
    .populate("replyTo")
    .sort({ _id: -1 })        // _id indeksi — eng tez
    .limit(parseInt(limit))
    .lean();

  const hasMore = messages.length === parseInt(limit);
  const oldest  = messages[messages.length - 1];

  res.json({
    success: true,
    data: {
      messages: messages.reverse(),  // Vaqt tartibida qaytarish
      hasMore,
      nextCursor: hasMore ? oldest?._id : null,
    }
  });
};
```

---

## ⚛️ Frontend Performance

### 1. React.memo — Keraksiz re-render oldini olish
```jsx
// MessageBubble ko'p renderlanadi — memo bilan optimizatsiya
const MessageBubble = React.memo(({ message, isMine }) => {
  return (/* ...jsx... */);
}, (prev, next) => {
  // Faqat o'zgarganda render qilish
  return prev.message._id       === next.message._id &&
         prev.message.isEdited  === next.message.isEdited &&
         prev.message.readBy?.length === next.message.readBy?.length;
});
```

### 2. useCallback — Funksiya stabilizatsiya
```jsx
const ChatList = ({ onSelect }) => {
  // onSelect har renderda yangi funksiya bo'lmaydi
  const handleSelect = useCallback((chat) => {
    onSelect(chat);
  }, [onSelect]);

  return (
    <div>
      {chats.map(chat => (
        <ChatItem key={chat._id} chat={chat} onClick={handleSelect} />
      ))}
    </div>
  );
};
```

### 3. useMemo — Qimmat hisob-kitob
```jsx
const MessageList = ({ messages }) => {
  // Sana ajratgichlarni faqat messages o'zgarganda hisoblash
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  }, [messages]);

  return (/* ...render... */);
};
```

### 4. Virtual Scroll — Ko'p xabarlar
```bash
npm install @tanstack/react-virtual
```

```jsx
import { useVirtualizer } from "@tanstack/react-virtual";

const VirtualMessageList = ({ messages }) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count:          messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize:   () => 60,   // O'rtacha xabar balandligi
    overscan:       10,          // Ekrandan tashqarida render
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
      <div style={{ height: virtualizer.getTotalSize() + "px", position: "relative" }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position:  "absolute",
              top:       virtualItem.start + "px",
              width:     "100%",
            }}
          >
            <MessageBubble
              message={messages[virtualItem.index]}
              isMine={messages[virtualItem.index].sender._id === myId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Infinite Scroll — Eski xabarlarni yuklash
```jsx
const useInfiniteMessages = (chatId) => {
  const observerRef = useRef(null);
  const topRef      = useRef(null);    // Ro'yxat tepasiga ref

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const oldest = messages[0];
    dispatch(fetchMessages({ chatId, before: oldest._id }));
  }, [hasMore, loading, messages, chatId]);

  // Intersection Observer — yuqoriga scroll qilganda yuklash
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return { messages, hasMore, loading, topRef };
};
```

### 6. Lazy Loading — Rasmlar
```jsx
// Rasm faqat ko'rinish zonasiga kelganda yuklanadi
const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && imgRef.current) {
        imgRef.current.src = src;
        observer.disconnect();
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-tg-elevated animate-pulse rounded-lg" />
      )}
      <img
        ref={imgRef}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover rounded-lg transition-opacity
                   ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};
```

---

## 📦 Bundle Optimizatsiya

### `vite.config.js`
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ["react", "react-dom"],
          redux:    ["@reduxjs/toolkit", "react-redux"],
          router:   ["react-router-dom"],
          socket:   ["socket.io-client"],
          ui:       ["lucide-react", "emoji-picker-react"],
          utils:    ["date-fns", "axios"],
        }
      }
    },
    // Chunk hajmi ogohlantiruvi
    chunkSizeWarningLimit: 500,
    // Minifikatsiya
    minify: "esbuild",
  }
});
```

---

## 📊 Ko'rsatkichlar Maqsadi

| Ko'rsatkich | Maqsad | O'lchash |
|-------------|--------|----------|
| API javob vaqti | < 200ms | Morgan log |
| MongoDB so'rov | < 50ms | Mongoose debug |
| Frontend FCP | < 1.5s | Lighthouse |
| Frontend LCP | < 2.5s | Lighthouse |
| Bundle (gzip) | < 200KB | `npm run build` |
| Xabar yetkazish | < 100ms | Socket ping |

### Lighthouse tekshirish
```bash
npx lighthouse http://localhost:5173 \
  --output html --output-path ./lighthouse-report.html
```
