# 📁 Fayl Yuklash — File Upload

> Multer + local storage. Media xabarlar uchun.

---

## 📦 O'rnatish

```bash
cd backend
npm install multer sharp uuid
```

| Kutubxona | Maqsad |
|-----------|--------|
| `multer` | Multipart form-data qayta ishlash |
| `sharp` | Rasm o'lchamini kamaytirish, thumbnail |
| `uuid` | Noyob fayl nomlari |

---

## 📁 Papka Tuzilmasi

```
backend/
└── uploads/
    ├── avatars/          # Profil rasmlari
    ├── images/           # Chat rasmlari
    ├── videos/           # Chat videolar
    ├── audio/            # Ovozli xabarlar
    ├── documents/        # Hujjatlar
    └── thumbnails/       # Kichik preview rasmlar
```

```javascript
// Papkalarni yaratish (server start da)
const fs = require("fs");
const dirs = [
  "uploads/avatars",
  "uploads/images",
  "uploads/videos",
  "uploads/audio",
  "uploads/documents",
  "uploads/thumbnails"
];
dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
```

---

## ⚙️ Multer Konfiguratsiya

**File:** `backend/src/middlewares/upload.middleware.js`

```javascript
const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");

// Fayl turiga qarab papka aniqlash
const getUploadDir = (mimetype) => {
  if (mimetype.startsWith("image/"))       return "uploads/images";
  if (mimetype.startsWith("video/"))       return "uploads/videos";
  if (mimetype.startsWith("audio/"))       return "uploads/audio";
  return "uploads/documents";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUploadDir(file.mimetype);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(20).toString("hex") + ext;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm",
    "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Ruxsat etilmagan fayl turi: ${file.mimetype}`), false);
  }
};

// Xabar media uchun
const uploadMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }  // 50MB
});

// Avatar uchun (kichikroq limit)
const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/avatars"),
    filename: (req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = crypto.randomBytes(16).toString("hex") + ext;
      cb(null, name);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Faqat rasm"), allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 }   // 5MB
});

module.exports = { uploadMedia, uploadAvatar };
```

---

## 🔧 Media Xizmat (Service)

**File:** `backend/src/services/media.service.js`

```javascript
const sharp = require("sharp");
const path  = require("path");
const fs    = require("fs/promises");
const crypto = require("crypto");

class MediaService {

  // Rasm thumbnail yaratish
  static async createThumbnail(imagePath) {
    const thumbName = `thumb_${crypto.randomBytes(8).toString("hex")}.webp`;
    const thumbPath = path.join("uploads/thumbnails", thumbName);

    await sharp(imagePath)
      .resize(300, 300, {
        fit:      "cover",
        position: "center"
      })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    return thumbPath;
  }

  // Rasmni optimallashtirish
  static async optimizeImage(inputPath) {
    const outputName = `opt_${crypto.randomBytes(8).toString("hex")}.webp`;
    const outputPath = path.join("uploads/images", outputName);

    const metadata = await sharp(inputPath).metadata();

    await sharp(inputPath)
      .resize(
        Math.min(metadata.width, 1280),  // Max 1280px kenglik
        null,
        { withoutEnlargement: true }
      )
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Asl faylni o'chirish
    await fs.unlink(inputPath).catch(() => {});

    return { path: outputPath, width: metadata.width, height: metadata.height };
  }

  // Fayl URL generatsiya
  static getFileUrl(filePath) {
    const normalized = filePath.replace(/\\/g, "/");
    return `${process.env.SERVER_URL || "http://localhost:5000"}/${normalized}`;
  }

  // Faylni o'chirish
  static async deleteFile(fileUrl) {
    try {
      const urlPath  = new URL(fileUrl).pathname;
      const filePath = path.join(process.cwd(), urlPath);
      await fs.unlink(filePath);
    } catch {
      // Fayl mavjud emas — xato emas
    }
  }

  // Fayl metama'lumotlari
  static async getFileInfo(filePath) {
    const stats    = await fs.stat(filePath);
    const metadata = await sharp(filePath).metadata().catch(() => null);

    return {
      filesize: stats.size,
      width:    metadata?.width,
      height:   metadata?.height,
    };
  }
}

module.exports = MediaService;
```

---

## 🛤️ Route-lar

**File:** `backend/src/routes/message.routes.js` (media qismi)

```javascript
const { uploadMedia } = require("../middlewares/upload.middleware");
const protect         = require("../middlewares/auth.middleware");

// Media xabar yuborish
router.post(
  "/:chatId/media",
  protect,
  uploadMedia.single("file"),   // "file" — form field nomi
  messageController.sendMediaMessage
);

// Ko'p fayl
router.post(
  "/:chatId/files",
  protect,
  uploadMedia.array("files", 10),  // max 10 fayl
  messageController.sendMultipleFiles
);
```

---

## 🎮 Controller

**File:** `backend/src/controllers/message.controller.js`

```javascript
const sendMediaMessage = async (req, res) => {
  try {
    const { chatId }  = req.params;
    const { caption, replyTo } = req.body;
    const file        = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: { message: "Fayl yuklanmadi" }});
    }

    // Chat a'zoligi tekshirish
    const chat = await Chat.findOne({
      _id:          chatId,
      participants: req.user._id
    });
    if (!chat) return res.status(403).json({ success: false, error: { message: "Ruxsat yo'q" }});

    // Fayl turi aniqlash
    let mediaType = "document";
    if (file.mimetype.startsWith("image/")) mediaType = "image";
    if (file.mimetype.startsWith("video/")) mediaType = "video";
    if (file.mimetype.startsWith("audio/")) mediaType = "audio";

    let mediaData = {
      url:         MediaService.getFileUrl(file.path),
      filename:    file.originalname,
      filesize:    file.size,
      mimetype:    file.mimetype,
    };

    // Rasm bo'lsa thumbnail va optimizatsiya
    if (mediaType === "image") {
      const optimized = await MediaService.optimizeImage(file.path);
      const thumbPath = await MediaService.createThumbnail(optimized.path);

      mediaData.url       = MediaService.getFileUrl(optimized.path);
      mediaData.thumbnail = MediaService.getFileUrl(thumbPath);
      mediaData.width     = optimized.width;
      mediaData.height    = optimized.height;
    }

    // Xabar yaratish
    const message = await Message.create({
      chat:    chatId,
      sender:  req.user._id,
      type:    mediaType,
      text:    caption || "",
      media:   mediaData,
      replyTo: replyTo || null,
    });

    // Chat oxirgi xabar yangilash
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt:   new Date()
    });

    // Socket.IO orqali yuborish
    req.io.to(`chat:${chatId}`).emit("new_message", message);

    return res.status(201).json({ success: true, data: message });

  } catch (err) {
    // Xato bo'lsa faylni o'chirish
    if (req.file) {
      await MediaService.deleteFile(req.file.path).catch(() => {});
    }
    return res.status(500).json({ success: false, error: { message: err.message }});
  }
};
```

---

## ⚛️ Frontend — Fayl Yuborish

```jsx
// hooks/useFileUpload.js
const useFileUpload = (chatId) => {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const uploadFile = async (file) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        `/messages/${chatId}/media`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        }
      );
      return response.data.data;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};
```

```jsx
// Drag & Drop fayl yuborish
const MessageInput = ({ chatId }) => {
  const { uploadFile, uploading, progress } = useFileUpload(chatId);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await uploadFile(file);
    }
  }, [uploadFile]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="relative"
    >
      {/* Upload progress bar */}
      {uploading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-tg-border">
          <div
            className="h-full bg-tg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {/* ...input kontent... */}
    </div>
  );
};
```

---

## 📊 Fayl Limitleri

| Fayl turi | Max hajm | Ruxsat etilgan formatlar |
|-----------|----------|--------------------------|
| Avatar | 5 MB | JPEG, PNG, WebP |
| Rasm | 10 MB | JPEG, PNG, WebP, GIF |
| Video | 50 MB | MP4, WebM |
| Audio | 20 MB | MP3, OGG, WAV, WebM |
| Hujjat | 50 MB | PDF, DOCX, DOC, TXT |

---

## 🧹 Fayl Tozalash (Cleanup)

```javascript
// Xabar o'chirilganda media ham o'chirish
Message.pre("deleteOne", async function(next) {
  const message = await this.model.findOne(this.getQuery());
  if (message?.media?.url) {
    await MediaService.deleteFile(message.media.url);
  }
  if (message?.media?.thumbnail) {
    await MediaService.deleteFile(message.media.thumbnail);
  }
  next();
});
```

```javascript
// Eskirgan/ishlatilmagan fayllarni tozalash (cron job)
// Har kecha 02:00 da
const cleanupOrphanFiles = async () => {
  const mediaMessages = await Message.find({
    "media.url": { $exists: true }
  }).select("media.url media.thumbnail");

  const usedUrls = new Set(
    mediaMessages.flatMap(m => [m.media.url, m.media.thumbnail].filter(Boolean))
  );

  const uploadDirs = ["uploads/images", "uploads/videos", "uploads/audio", "uploads/documents"];
  for (const dir of uploadDirs) {
    const files = await fs.readdir(dir).catch(() => []);
    for (const file of files) {
      const fileUrl = MediaService.getFileUrl(path.join(dir, file));
      if (!usedUrls.has(fileUrl)) {
        await fs.unlink(path.join(dir, file)).catch(() => {});
        console.log(`🗑️ O'chirildi: ${file}`);
      }
    }
  }
};
```
