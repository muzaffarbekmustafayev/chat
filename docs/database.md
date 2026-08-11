# 🗄️ MongoDB — Ma'lumotlar Bazasi

**Database:** `telegram_clone`

---

## 📊 Kolleksiyalar (Collections)

| Kolleksiya | Tavsif |
|------------|--------|
| `users` | Foydalanuvchilar |
| `chats` | Chatlar (private, group, channel) |
| `messages` | Xabarlar |
| `media` | Yuklangan fayllar metama'lumoti |

---

## 👤 User Model

**File:** `backend/src/models/User.model.js`

```javascript
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 32,
    match: /^[a-zA-Z0-9_]+$/
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false    // So'rovlarda avtomatik chiqarilmaydi
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 64
  },
  lastName: {
    type: String,
    default: "",
    trim: true,
    maxlength: 64
  },
  bio: {
    type: String,
    default: "",
    maxlength: 255
  },
  avatar: {
    type: String,
    default: null    // Fayl URL
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: null
  },
  socketId: {
    type: String,
    default: null,
    select: false
  },
  refreshTokens: {
    type: [String],
    default: [],
    select: false
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
});

// Indekslar
UserSchema.index({ username: "text", firstName: "text", lastName: "text" });
UserSchema.index({ phone: 1 });

// Parolni saqlashdan oldin hash qilish
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

---

## 💬 Chat Model

**File:** `backend/src/models/Chat.model.js`

```javascript
const ChatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["private", "group", "channel"],
    required: true
  },
  name: {
    type: String,
    default: null,    // Private chatda null
    maxlength: 128
  },
  description: {
    type: String,
    default: "",
    maxlength: 512
  },
  avatar: {
    type: String,
    default: null
  },

  // A'zolar
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],

  // Adminlar (group/channel)
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  // Egasi (channel)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // Oxirgi xabar
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },

  // O'qilmagan xabarlar (har foydalanuvchi uchun)
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  },

  // Yopilgan (muted) foydalanuvchilar
  mutedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  isPinned: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, {
  timestamps: true
});

// Indekslar
ChatSchema.index({ participants: 1 });
ChatSchema.index({ type: 1 });
ChatSchema.index({ updatedAt: -1 });
```

---

## 📨 Message Model

**File:** `backend/src/models/Message.model.js`

```javascript
const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Xabar turi
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "document", "sticker", "system"],
    default: "text"
  },

  // Matn xabar
  text: {
    type: String,
    default: "",
    maxlength: 4096
  },

  // Media xabar
  media: {
    url: String,
    thumbnail: String,
    filename: String,
    filesize: Number,
    mimetype: String,
    duration: Number,    // Audio/video uchun (soniyada)
    width: Number,       // Rasm/video uchun
    height: Number
  },

  // Sticker
  sticker: {
    url: String,
    emoji: String,
    stickerSetId: String
  },

  // Javob xabar
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },

  // Forwardlangan xabar
  forwardedFrom: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    },
    messageId: mongoose.Schema.Types.ObjectId
  },

  // O'qish holati
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  // Tahrirlash
  isEdited: {
    type: Boolean,
    default: false
  },

  // O'chirish
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
});

// Indekslar
MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ text: "text" });   // Full-text search
```

---

## 🖼️ Media Model

**File:** `backend/src/models/Media.model.js`

```javascript
const MediaSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  width: Number,
  height: Number,
  duration: Number
}, {
  timestamps: true
});
```

---

## 🔍 Muhim So'rovlar (Queries)

### Chatlarni yuklash (sorted by latest message)
```javascript
Chat.find({ participants: userId })
  .populate("participants", "username firstName lastName avatar isOnline lastSeen")
  .populate({
    path: "lastMessage",
    populate: { path: "sender", select: "username firstName" }
  })
  .sort({ updatedAt: -1 })
  .lean();
```

### Cursor-based pagination bilan xabarlar
```javascript
const query = { chat: chatId, isDeleted: false };
if (before) {
  query._id = { $lt: new mongoose.Types.ObjectId(before) };
}
Message.find(query)
  .populate("sender", "username firstName lastName avatar")
  .populate("replyTo")
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();
```

### Full-text qidiruv
```javascript
Message.find({
  chat: chatId,
  $text: { $search: "qidiruv so'zi" }
}).sort({ score: { $meta: "textScore" } });
```

---

## ⚡ Indekslar Strategiyasi

| Kolleksiya | Index | Sabab |
|------------|-------|-------|
| `users` | `{ phone: 1 }` | Login |
| `users` | `{ username: "text", firstName: "text" }` | Qidirish |
| `chats` | `{ participants: 1, updatedAt: -1 }` | Chat ro'yxati |
| `messages` | `{ chat: 1, createdAt: -1 }` | Xabar yuklash |
| `messages` | `{ text: "text" }` | Xabar qidirish |
