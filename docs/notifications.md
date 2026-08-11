# 📢 Bildirishnomalar — Notifications

> In-app toast + Web Push Notifications (PWA).

---

## 📦 O'rnatish

```bash
# Backend
cd backend
npm install web-push

# Frontend
cd frontend
npm install react-hot-toast
```

---

## 🔔 1. In-App Toast Bildirishnomalar

**File:** `frontend/src/main.jsx`

```jsx
import { Toaster } from "react-hot-toast";

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e2c3a",
          color:      "#ffffff",
          border:     "1px solid #1c2f3e",
          borderRadius: "12px",
          padding:    "12px 16px",
          fontSize:   "14px",
          boxShadow:  "0 4px 12px rgba(0,0,0,0.5)",
        },
        success: {
          iconTheme: { primary: "#4caf50", secondary: "#fff" }
        },
        error: {
          iconTheme: { primary: "#ef5350", secondary: "#fff" }
        }
      }}
    />
  </>
);
```

### Toast ishlatish

```javascript
import toast from "react-hot-toast";

// Muvaffaqiyat
toast.success("Xabar yuborildi!");

// Xato
toast.error("Xabar yuborilmadi. Qayta urinib ko'ring.");

// Yuklanish
const id = toast.loading("Fayl yuklanmoqda...");
// ... amal tugagach:
toast.success("Fayl yuklandi!", { id });

// Custom (yangi xabar bildirishnomasi)
toast.custom((t) => (
  <div
    className={`
      flex items-center gap-3 p-3 rounded-xl cursor-pointer
      bg-tg-card border border-tg-border shadow-tg-lg
      ${t.visible ? "animate-slide-left" : "opacity-0"}
    `}
    onClick={() => {
      toast.dismiss(t.id);
      navigateToChat(chatId);
    }}
  >
    <Avatar src={sender.avatar} name={sender.firstName} size="sm" />
    <div className="min-w-0">
      <p className="text-sm font-semibold text-tg-primary truncate">
        {sender.firstName}
      </p>
      <p className="text-xs text-tg-secondary truncate">{messageText}</p>
    </div>
  </div>
), { duration: 5000 });
```

---

## 🌐 2. Web Push Notifications

### VAPID kalitlari yaratish

```bash
cd backend
node -e "
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('PUBLIC KEY:', keys.publicKey);
console.log('PRIVATE KEY:', keys.privateKey);
"
```

Natijani `.env` ga qo'shing:
```env
VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA
VAPID_PRIVATE_KEY=yxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_EMAIL=mailto:admin@yourdomain.com
```

---

### Backend — Push Notification Service

**File:** `backend/src/services/notification.service.js`

```javascript
const webpush = require("web-push");
const User    = require("../models/User.model");
const logger  = require("../utils/logger");

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class NotificationService {

  // Foydalanuvchiga bildirishnoma yuborish
  static async sendToUser(userId, payload) {
    try {
      const user = await User.findById(userId).select("pushSubscriptions");
      if (!user?.pushSubscriptions?.length) return;

      const notification = JSON.stringify({
        title:  payload.title,
        body:   payload.body,
        icon:   "/icon-192.png",
        badge:  "/badge-96.png",
        data:   payload.data || {},
        tag:    payload.tag || "default",
      });

      // Barcha qurilmalarga yuborish
      const promises = user.pushSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, notification);
        } catch (err) {
          if (err.statusCode === 410) {
            // Subscription eskirgan — o'chirish
            await User.findByIdAndUpdate(userId, {
              $pull: { pushSubscriptions: { endpoint: sub.endpoint } }
            });
          }
        }
      });

      await Promise.allSettled(promises);
    } catch (err) {
      logger.error("Push notification xatosi:", err);
    }
  }

  // Yangi xabar bildirishnomasi
  static async notifyNewMessage(message, chat) {
    const senderId = message.sender._id.toString();

    for (const participantId of chat.participants) {
      // O'ziga yubormaslik
      if (participantId.toString() === senderId) continue;

      await this.sendToUser(participantId, {
        title: message.sender.firstName || "Yangi xabar",
        body:  message.type === "text"
               ? message.text.slice(0, 100)
               : `📎 ${message.type} yuborildi`,
        tag:   `chat-${chat._id}`,
        data:  {
          chatId:    chat._id.toString(),
          messageId: message._id.toString(),
          url:       `/chat?id=${chat._id}`,
        }
      });
    }
  }
}

module.exports = NotificationService;
```

### Subscription saqlash route-i

```javascript
// routes/notification.routes.js
const protect = require("../middlewares/auth.middleware");

// Subscription saqlash
router.post("/subscribe", protect, async (req, res) => {
  const { subscription } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { pushSubscriptions: subscription }
  });

  res.json({ success: true, message: "Bildirishnomalar yoqildi" });
});

// Subscription o'chirish
router.post("/unsubscribe", protect, async (req, res) => {
  const { endpoint } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { pushSubscriptions: { endpoint } }
  });

  res.json({ success: true, message: "Bildirishnomalar o'chirildi" });
});

// VAPID public key
router.get("/vapid-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
```

---

### User Model — pushSubscriptions maydoni

```javascript
// models/User.model.js ga qo'shish
pushSubscriptions: [
  {
    endpoint: String,
    expirationTime: Date,
    keys: {
      p256dh: String,
      auth:   String,
    }
  }
],
```

---

### Frontend — Push Permission & Subscription

**File:** `frontend/src/hooks/usePushNotifications.js`

```javascript
const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission,   setPermission]   = useState(Notification.permission);

  // Service Worker ro'yxatdan o'tkazish
  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) return null;

    const reg = await navigator.serviceWorker.register("/sw.js");
    return reg;
  };

  // Ruxsat so'rash va subscribe
  const subscribe = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        toast.error("Bildirishnomalar uchun ruxsat berilmadi");
        return;
      }

      const reg = await registerServiceWorker();
      if (!reg) return;

      // VAPID public key olish
      const { data } = await api.get("/notifications/vapid-key");

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:    true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      // Serverga yuborish
      await api.post("/notifications/subscribe", { subscription });
      setIsSubscribed(true);
      toast.success("Bildirishnomalar yoqildi!");
    } catch (err) {
      console.error("Subscribe xatosi:", err);
      toast.error("Bildirishnomalarni yoqishda xato");
    }
  };

  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (sub) {
      await sub.unsubscribe();
      await api.post("/notifications/unsubscribe", { endpoint: sub.endpoint });
    }

    setIsSubscribed(false);
    toast.success("Bildirishnomalar o'chirildi");
  };

  return { isSubscribed, permission, subscribe, unsubscribe };
};

// Helper
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
};
```

---

### Service Worker

**File:** `frontend/public/sw.js`

```javascript
// Push xabar qabul qilish
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Telegram Clone", {
      body:    data.body,
      icon:    data.icon    || "/icon-192.png",
      badge:   data.badge   || "/badge-96.png",
      tag:     data.tag     || "default",
      data:    data.data    || {},
      actions: [
        { action: "open",    title: "Ochish" },
        { action: "dismiss", title: "Yopish" },
      ],
      vibrate:   [100, 50, 100],
      renotify:  true,
    })
  );
});

// Bildirishnomaga bosish
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/chat";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Agar ilova ochiq bo'lsa — fokus
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Ochiq bo'lmasa — yangi tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
```

---

## 🔕 Mute (Ovozni o'chirish)

```javascript
// Socket.IO da — faqat online va mute qilinmagan foydalanuvchilarga
socket.on("send_message", async ({ chatId, text }) => {
  const message = await Message.create({ chat: chatId, sender: userId, text });

  const chat = await Chat.findById(chatId);

  // Chat a'zolariga xabar tarqatish
  chat.participants.forEach(participantId => {
    if (participantId.toString() === userId) return;

    // Mute qilinganmi?
    if (!chat.mutedBy.includes(participantId)) {
      io.to(`user:${participantId}`).emit("new_message", message);
      // Push notification ham
      NotificationService.notifyNewMessage(message, chat);
    } else {
      // Mute — faqat xabar yuborish, notification yo'q
      io.to(`user:${participantId}`).emit("new_message", message);
    }
  });
});
```

---

## ✅ Notifications Checklist

```
□ VAPID kalitlari .env da
□ web-push npm da o'rnatilgan
□ pushSubscriptions maydoni User modelida
□ /api/notifications/subscribe route ishlayapti
□ public/sw.js to'g'ri joylashgan
□ Service Worker ro'yxatdan o'tkazilgan
□ Ruxsat so'rash foydalanuvchi harakati bilan (click)
□ Mute qilingan chatlarda push yuborilmaydi
□ Eskirgan subscription-lar tozalanadi (410 error)
□ Foydalanuvchi ilova ichida bo'lsa push yuborilmaydi
```
