# 🗄️ Database Migration

> MongoDB **sxemalar o'zgarishi** va **migration** strategiyasi.  
> Mongoose + `migrate-mongo` kutubxonasi ishlatiladi.

---

## 📦 O'rnatish

```bash
cd backend
npm install migrate-mongo
```

---

## ⚙️ Sozlash

**File:** `backend/migrate-mongo-config.js`

```javascript
const config = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017",
    databaseName: "telegram_clone",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Migration fayllari saqlanadigan papka
  migrationsDir: "src/migrations",

  // Bajarilgan migration-larni saqlaydigan kolleksiya
  changelogCollectionName: "changelog",

  // Migration fayl nomi formati
  migrationFileExtension: ".js",

  // ID generatsiya
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
```

---

## 📜 package.json Scripts

```json
{
  "scripts": {
    "migrate:status":   "migrate-mongo status",
    "migrate:up":       "migrate-mongo up",
    "migrate:down":     "migrate-mongo down",
    "migrate:create":   "migrate-mongo create"
  }
}
```

---

## 📁 Migration Papka Tuzilmasi

```
backend/
└── src/
    └── migrations/
        ├── 20240101000000-initial-users-indexes.js
        ├── 20240115000000-add-bio-to-users.js
        ├── 20240120000000-create-chats-collection.js
        ├── 20240201000000-add-unread-counts-to-chats.js
        ├── 20240210000000-add-message-reactions.js
        └── 20240301000000-add-pinned-messages.js
```

---

## 🏗️ Migration Fayl Tuzilmasi

Har bir migration fayl ikki funksiyadan iborat:

| Funksiya | Tavsif |
|----------|--------|
| `up(db, client)` | O'zgarishni qo'llash (yangilash) |
| `down(db, client)` | O'zgarishni bekor qilish (rollback) |

---

## 📋 Migration Namunalari

### 1. Yangi indeks qo'shish

```bash
# Yangi migration yaratish
npm run migrate:create add-users-text-index
```

**File:** `20240101000000-initial-users-indexes.js`

```javascript
module.exports = {
  async up(db) {
    // Text index yaratish (qidiruv uchun)
    await db.collection("users").createIndex(
      {
        username:  "text",
        firstName: "text",
        lastName:  "text",
      },
      {
        name: "users_text_search",
        weights: {
          username:  3,
          firstName: 2,
          lastName:  1,
        }
      }
    );

    // Phone unique index
    await db.collection("users").createIndex(
      { phone: 1 },
      { unique: true, name: "users_phone_unique" }
    );

    console.log("✅ Users indekslari yaratildi");
  },

  async down(db) {
    await db.collection("users").dropIndex("users_text_search");
    await db.collection("users").dropIndex("users_phone_unique");
    console.log("⬇️ Users indekslari o'chirildi");
  }
};
```

---

### 2. Yangi maydon qo'shish

**File:** `20240115000000-add-bio-to-users.js`

```javascript
module.exports = {
  async up(db) {
    // Barcha mavjud foydalanuvchilarga 'bio' maydon qo'shish
    const result = await db.collection("users").updateMany(
      { bio: { $exists: false } },          // bio yo'q bo'lganlarga
      { $set: { bio: "" } }                 // bo'sh string qo'yish
    );

    console.log(`✅ ${result.modifiedCount} foydalanuvchiga bio qo'shildi`);
  },

  async down(db) {
    // bio maydonini olib tashlash
    await db.collection("users").updateMany(
      {},
      { $unset: { bio: "" } }
    );
    console.log("⬇️ bio maydoni o'chirildi");
  }
};
```

---

### 3. Mavjud ma'lumotlarni o'zgartirish

**File:** `20240120000000-rename-field-in-messages.js`

```javascript
module.exports = {
  async up(db) {
    // 'content' maydonini 'text' ga o'zgartirish
    const result = await db.collection("messages").updateMany(
      { content: { $exists: true } },
      { $rename: { content: "text" } }
    );

    console.log(`✅ ${result.modifiedCount} xabarda 'content' → 'text' o'zgartirildi`);
  },

  async down(db) {
    await db.collection("messages").updateMany(
      { text: { $exists: true } },
      { $rename: { text: "content" } }
    );
    console.log("⬇️ 'text' → 'content' qaytarildi");
  }
};
```

---

### 4. Yangi kolleksiya yaratish

**File:** `20240201000000-create-reactions-collection.js`

```javascript
module.exports = {
  async up(db) {
    // Kolleksiya yaratish (validation bilan)
    await db.createCollection("reactions", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["messageId", "userId", "emoji"],
          properties: {
            messageId: { bsonType: "objectId" },
            userId:    { bsonType: "objectId" },
            emoji:     { bsonType: "string", maxLength: 10 },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });

    // Indeks: bir foydalanuvchi bir xabarga bir marta reaksiya
    await db.collection("reactions").createIndex(
      { messageId: 1, userId: 1 },
      { unique: true, name: "reactions_unique_per_user" }
    );

    await db.collection("reactions").createIndex({ messageId: 1 });

    console.log("✅ reactions kolleksiyasi yaratildi");
  },

  async down(db) {
    await db.collection("reactions").drop();
    console.log("⬇️ reactions kolleksiyasi o'chirildi");
  }
};
```

---

### 5. Yangi maydon + mavjud ma'lumotlarni hisoblash

**File:** `20240210000000-add-unread-counts-to-chats.js`

```javascript
module.exports = {
  async up(db) {
    const chats = await db.collection("chats").find({}).toArray();

    for (const chat of chats) {
      // Har bir participant uchun o'qilmagan xabarlarni hisoblash
      const unreadCounts = {};

      for (const participantId of chat.participants) {
        const count = await db.collection("messages").countDocuments({
          chat: chat._id,
          readBy: { $nin: [participantId] },
          sender: { $ne: participantId }
        });
        unreadCounts[participantId.toString()] = count;
      }

      await db.collection("chats").updateOne(
        { _id: chat._id },
        { $set: { unreadCounts } }
      );
    }

    console.log(`✅ ${chats.length} chat uchun unreadCounts hisoblandi`);
  },

  async down(db) {
    await db.collection("chats").updateMany(
      {},
      { $unset: { unreadCounts: "" } }
    );
    console.log("⬇️ unreadCounts o'chirildi");
  }
};
```

---

### 6. Katta hajmli ma'lumot migratsiyasi (Batch)

**File:** `20240301000000-migrate-avatar-urls.js`

```javascript
module.exports = {
  async up(db) {
    const BATCH_SIZE = 100;
    const OLD_BASE = "http://old-server.com/uploads/";
    const NEW_BASE = "http://localhost:5000/uploads/";

    let skip = 0;
    let totalUpdated = 0;

    while (true) {
      const users = await db.collection("users")
        .find({ avatar: { $regex: OLD_BASE } })
        .skip(skip)
        .limit(BATCH_SIZE)
        .toArray();

      if (users.length === 0) break;

      const bulkOps = users.map(user => ({
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: {
              avatar: user.avatar.replace(OLD_BASE, NEW_BASE)
            }
          }
        }
      }));

      const result = await db.collection("users").bulkWrite(bulkOps);
      totalUpdated += result.modifiedCount;
      skip += BATCH_SIZE;

      console.log(`  → Batch: ${totalUpdated} ta yangilandi...`);
    }

    console.log(`✅ Jami ${totalUpdated} ta avatar URL yangilandi`);
  },

  async down(db) {
    const OLD_BASE = "http://old-server.com/uploads/";
    const NEW_BASE = "http://localhost:5000/uploads/";

    await db.collection("users").updateMany(
      { avatar: { $regex: NEW_BASE } },
      [{ $set: { avatar: { $replaceAll: {
        input: "$avatar",
        find: NEW_BASE,
        replacement: OLD_BASE
      }}}}]
    );
    console.log("⬇️ Avatar URL-lar qaytarildi");
  }
};
```

---

## 🚀 Migration Ishga Tushirish

### Holat tekshirish
```bash
npm run migrate:status
```

**Chiqish:**
```
┌────────────────────────────────────────┬───────────┬────────────────────────┐
│ Filename                               │ Applied   │ Applied At             │
├────────────────────────────────────────┼───────────┼────────────────────────┤
│ 20240101000000-initial-users-indexes   │ MIGRATED  │ 2024-01-01 12:00:00    │
│ 20240115000000-add-bio-to-users        │ MIGRATED  │ 2024-01-15 09:30:00    │
│ 20240120000000-create-chats-collection │ PENDING   │                        │
└────────────────────────────────────────┴───────────┴────────────────────────┘
```

### Barcha PENDING migration-larni ishga tushirish
```bash
npm run migrate:up
```

### Oxirgi migration-ni bekor qilish (rollback)
```bash
npm run migrate:down
```

### Yangi migration yaratish
```bash
npm run migrate:create -- add-stickers-support
# → src/migrations/20240401000000-add-stickers-support.js
```

---

## 🔄 Avtomatik Migration (Server start)

**File:** `backend/src/config/db.js`

```javascript
const mongoose = require("mongoose");
const { up } = require("migrate-mongo");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB ulandi");

    // Server start bo'lganda avtomatik migration
    if (process.env.AUTO_MIGRATE === "true") {
      const { db, client } = await mongoose.connection.getClient();
      const migrated = await up(db, client);
      if (migrated.length > 0) {
        console.log(`✅ ${migrated.length} ta migration bajarildi:`, migrated);
      }
    }
  } catch (err) {
    console.error("❌ MongoDB ulanish xatosi:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**.env** ga qo'shing:
```env
AUTO_MIGRATE=true    # development da
# AUTO_MIGRATE=false  # production da (qo'lda boshqariladi)
```

---

## 📊 Seed Ma'lumotlari (Test uchun)

**File:** `backend/src/migrations/20240101999999-seed-data.js`

```javascript
const bcrypt = require("bcryptjs");

module.exports = {
  async up(db) {
    if (process.env.NODE_ENV !== "development") {
      console.log("⚠️  Seed faqat development da ishlaydi");
      return;
    }

    // Test foydalanuvchilar
    const password = await bcrypt.hash("Test123!", 12);
    const users = await db.collection("users").insertMany([
      {
        username:  "test_user1",
        phone:     "+998901111111",
        password,
        firstName: "Ali",
        lastName:  "Valiyev",
        bio:       "Test foydalanuvchi 1",
        isOnline:  false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username:  "test_user2",
        phone:     "+998902222222",
        password,
        firstName: "Barno",
        lastName:  "Karimova",
        bio:       "Test foydalanuvchi 2",
        isOnline:  false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Ular orasida chat yaratish
    const [user1Id, user2Id] = Object.values(users.insertedIds);
    await db.collection("chats").insertOne({
      type:         "private",
      participants: [user1Id, user2Id],
      admins:       [],
      lastMessage:  null,
      unreadCounts: {},
      createdAt:    new Date(),
      updatedAt:    new Date(),
    });

    console.log("✅ Test ma'lumotlari qo'shildi");
  },

  async down(db) {
    await db.collection("users").deleteMany({
      phone: { $in: ["+998901111111", "+998902222222"] }
    });
    console.log("⬇️ Test ma'lumotlari o'chirildi");
  }
};
```

```bash
# Seed ishga tushirish
npm run migrate:up
```

---

## 🛡️ Migration Qoidalari

| Qoida | Sabab |
|-------|-------|
| Har bir migration **mustaqil** bo'lsin | Rollback osonlashadi |
| `up` va `down` har doim **bir juft** yozilsin | Rollback imkoni |
| Migration-larni **hech qachon o'zgartirma** | Bajarilgan migration o'zgartirilmasin |
| Katta hajmli o'zgarish **batch** qilinsin | Server to'xtalmasin |
| Migration-lar **tranzaksiyasiz** yozilsin (MongoDB restrictions) | Xato bo'lsa rollback qo'lda |
| Production da `AUTO_MIGRATE=false` | Nazorat saqlansin |
| Migration oldidan **backup** ol | Ma'lumot yo'qolmasin |

---

## 🔁 Versiya Boshqaruvi Oqimi

```
Feature branch
    │
    ├── Yangi migration fayl yarat
    │   npm run migrate:create -- feature-name
    │
    ├── up() va down() yoz
    │
    ├── Local da sinab ko'r:
    │   npm run migrate:up
    │   npm run migrate:down   ← rollback ishlayaptimi?
    │   npm run migrate:up     ← qayta ishlayaptimi?
    │
    ├── Git commit: "migration: add-feature-name"
    │
    └── PR → main → Production da:
        npm run migrate:status  ← tekshir
        npm run migrate:up      ← qo'lla
```

---

## 💾 Backup Strategiyasi

```bash
# Production da migration oldidan backup
mongodump \
  --uri="mongodb://localhost:27017/telegram_clone" \
  --out="./backups/backup-$(date +%Y%m%d-%H%M%S)"

# Keyin migration
npm run migrate:up

# Agar xato bo'lsa restore
mongorestore \
  --uri="mongodb://localhost:27017/telegram_clone" \
  --drop \
  ./backups/backup-YYYYMMDD-HHMMSS/telegram_clone
```
