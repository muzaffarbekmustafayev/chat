# 🔒 Xavfsizlik — Security

> OWASP Top 10 va production xavfsizlik choralari.

---

## 🛡️ Xavfsizlik Qatlamlari

```
Client (Browser)
    │  HTTPS/WSS
    ▼
Nginx (SSL termination, rate limit)
    │
    ▼
Express (Helmet, CORS, Rate Limit, Input Validation)
    │
    ▼
JWT Middleware (token verify)
    │
    ▼
Controller → Mongoose (query sanitization)
    │
    ▼
MongoDB
```

---

## 📦 Kerakli Kutubxonalar

```bash
npm install helmet cors express-rate-limit express-validator \
            bcryptjs hpp xss-clean express-mongo-sanitize
```

| Kutubxona | Maqsad |
|-----------|--------|
| `helmet` | HTTP xavfsizlik sarlavhalari |
| `cors` | Cross-Origin himoya |
| `express-rate-limit` | DDoS / brute-force himoya |
| `express-validator` | Input validatsiya |
| `bcryptjs` | Parol hash |
| `hpp` | HTTP Parameter Pollution |
| `xss-clean` | XSS hujumlaridan himoya |
| `express-mongo-sanitize` | NoSQL injection himoya |

---

## ⚙️ Express Xavfsizlik Sozlamasi

**File:** `backend/src/app.js`

```javascript
const express       = require("express");
const helmet        = require("helmet");
const cors          = require("cors");
const rateLimit     = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss           = require("xss-clean");
const hpp           = require("hpp");

const app = express();

// ============ 1. HELMET — HTTP sarlavhalar ============
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      imgSrc:     ["'self'", "data:", "blob:"],
      scriptSrc:  ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
    }
  },
  crossOriginEmbedderPolicy: false,
}));

// ============ 2. CORS ============
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} ruxsat etilmagan`));
    }
  },
  credentials:      true,
  methods:          ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders:   ["Content-Type", "Authorization"],
  exposedHeaders:   ["X-Total-Count"],
  maxAge:           600,   // Preflight cache 10 daqiqa
}));

// ============ 3. RATE LIMITING ============
// Umumiy limit
const generalLimit = rateLimit({
  windowMs:       15 * 60 * 1000,   // 15 daqiqa
  max:            100,               // 100 so'rov
  message:        { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Juda ko'p so'rov. 15 daqiqadan keyin urinib ko'ring." }},
  standardHeaders: true,
  legacyHeaders:   false,
});

// Auth uchun qat'iyroq limit (brute-force himoya)
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,    // 15 daqiqada 10 ta login urinish
  message:  { success: false, error: { code: "TOO_MANY_ATTEMPTS", message: "Juda ko'p urinish. Keyinroq urinib ko'ring." }},
  skipSuccessfulRequests: true,
});

app.use("/api/", generalLimit);
app.use("/api/auth/login",    authLimit);
app.use("/api/auth/register", authLimit);

// ============ 4. BODY PARSING ============
app.use(express.json({ limit: "10kb" }));         // JSON hajm cheki
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============ 5. NoSQL INJECTION HIMOYA ============
app.use(mongoSanitize());
// { $gt: "" } kabi operatorlarni olib tashlaydi

// ============ 6. XSS HIMOYA ============
app.use(xss());
// HTML teglarni tozalaydi: <script>alert(1)</script> → &lt;script&gt;

// ============ 7. HPP (Parameter Pollution) ============
app.use(hpp({
  whitelist: ["sort", "limit", "page"]  // Ko'p qiymat ruxsat etilganlar
}));

module.exports = app;
```

---

## 🔑 Parol Xavfsizligi

```javascript
// utils/bcrypt.utils.js
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;  // Production da 12, test da 10

const hashPassword = async (plaintext) => {
  return await bcrypt.hash(plaintext, SALT_ROUNDS);
};

const comparePassword = async (plaintext, hashed) => {
  return await bcrypt.compare(plaintext, hashed);
};

// Parol kuchliligi tekshirish
const isStrongPassword = (password) => {
  const minLength    = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit     = /\d/.test(password);
  const hasSpecial   = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUppercase && hasLowercase && hasDigit;
};

module.exports = { hashPassword, comparePassword, isStrongPassword };
```

---

## ✅ Input Validatsiya

**File:** `backend/src/validators/auth.validator.js`

```javascript
const { body, validationResult } = require("express-validator");

// Register validatsiya qoidalari
const registerRules = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 32 }).withMessage("Username 3-32 belgi")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Faqat harf, raqam va _"),

  body("phone")
    .trim()
    .matches(/^\+998[0-9]{9}$/).withMessage("Telefon: +998XXXXXXXXX formatda"),

  body("password")
    .isLength({ min: 8 }).withMessage("Parol kamida 8 belgi")
    .matches(/[A-Z]/).withMessage("Kamida bitta katta harf")
    .matches(/[a-z]/).withMessage("Kamida bitta kichik harf")
    .matches(/\d/).withMessage("Kamida bitta raqam"),

  body("firstName")
    .trim()
    .isLength({ min: 1, max: 64 }).withMessage("Ism 1-64 belgi")
    .escape(),  // HTML tozalash

  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 64 }).withMessage("Familiya max 64 belgi")
    .escape(),
];

// Xatolarni tekshirish middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code:    "VALIDATION_ERROR",
        message: "Ma'lumotlar noto'g'ri",
        details: errors.array().map(e => ({
          field:   e.path,
          message: e.msg
        }))
      }
    });
  }
  next();
};

module.exports = { registerRules, validate };
```

```javascript
// routes/auth.routes.js da ishlatish:
const { registerRules, validate } = require("../validators/auth.validator");

router.post("/register", registerRules, validate, authController.register);
```

---

## 🔐 JWT Xavfsizligi

```javascript
// utils/jwt.utils.js
const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId },      // Faqat kerakli ma'lumot
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn:  process.env.JWT_ACCESS_EXPIRES || "15m",
      issuer:     "telegram-clone",
      audience:   "telegram-clone-users",
    }
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId, tokenVersion: payload.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d" }
  );
};

// Refresh token DB da saqlash (rotation uchun)
// Har yangilashda eski token o'chiriladi
```

---

## 🗂️ Fayl Yuklash Xavfsizligi

```javascript
// middlewares/upload.middleware.js
const multer  = require("multer");
const path    = require("path");
const crypto  = require("crypto");

// Ruxsat etilgan MIME turlar
const ALLOWED_TYPES = {
  image:    ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video:    ["video/mp4", "video/webm"],
  audio:    ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "uploads/");
  },
  filename: (req, file, cb) => {
    // Tasodifiy nom (XSS va path traversal himoya)
    const ext      = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allAllowed = Object.values(ALLOWED_TYPES).flat();

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Fayl turi ruxsat etilmagan: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024,
    files:    10,       // Maksimal fayl soni
  }
});

module.exports = upload;
```

---

## 🚫 OWASP Top 10 Himoya

| OWASP | Xavf | Himoya |
|-------|------|--------|
| A01 — Broken Access Control | Boshqa foydalanuvchi chatiga kirish | JWT + chat participant tekshirish |
| A02 — Cryptographic Failures | Oddiy parol saqlash | bcryptjs (12 round) |
| A03 — Injection | NoSQL injection | express-mongo-sanitize |
| A04 — Insecure Design | Brute-force | Rate limiting (10/15min) |
| A05 — Security Misconfiguration | CORS open | Faqat ruxsat etilgan origin |
| A06 — Vulnerable Components | Eski kutubxonalar | `npm audit` muntazam |
| A07 — Auth Failures | JWT hijacking | httpOnly cookie + short expiry |
| A08 — Software Integrity | Supply chain | `package-lock.json` |
| A09 — Logging Failures | Hujumni bilmaslik | Morgan + Winston logging |
| A10 — SSRF | Tashqi URL fetch | Faqat internal so'rovlar |

---

## 📋 Xavfsizlik Checklist

```
□ Helmet yoqilgan
□ CORS faqat ruxsat etilgan originlar
□ Rate limiting: umumiy (100/15min), auth (10/15min)
□ Input validatsiya barcha route-larda
□ Parol bcrypt 12 round
□ JWT secret 64+ belgi, tasodifiy
□ JWT access token 15 daqiqa
□ NoSQL injection himoya (mongoSanitize)
□ XSS himoya (xss-clean)
□ Fayl yuklash MIME type tekshirish
□ Fayl nomi tasodifiy (path traversal himoya)
□ HTTPS faqat (HTTP → redirect)
□ npm audit muntazam
□ .env fayllar .gitignore da
□ JWT secret .env da, kodda yo'q
□ Error javobda stack trace yo'q (production)
```
