# 📱 Responsive Dizayn

> Telegram Clone **mobil birinchi (mobile-first)** yondashuvi bilan qurilgan.  
> Tailwind CSS CDN breakpoint tizimidan foydalaniladi.

---

## 📐 Breakpoint Tizimi (Tailwind)

| Prefiks | Minimal kenglik | Qurilma |
|---------|----------------|---------|
| *(yo'q)* | 0px | 📱 Mobil (default) |
| `sm:` | 640px | 📱 Katta telefon |
| `md:` | 768px | 📟 Planshet |
| `lg:` | 1024px | 💻 Noutbuk |
| `xl:` | 1280px | 🖥️ Desktop |
| `2xl:` | 1536px | 🖥️ Katta monitor |

> **Qoida:** Avval mobilni yoz, keyin kattasini `md:`, `lg:` bilan ustiga yoz.

---

## 🗺️ Asosiy Layout — 3 ko'rinish

### 📱 Mobil (< 768px)
```
┌──────────────────────┐
│   Sidebar (to'liq)   │  ← Faqat chatlar ro'yxati
│  ┌────────────────┐  │
│  │ 🔍 Qidiruv    │  │
│  ├────────────────┤  │
│  │ Chat 1        │  │
│  │ Chat 2        │  │
│  │ Chat 3        │  │
│  └────────────────┘  │
└──────────────────────┘

          ↕ (chat tanlanganda almashtiradi)

┌──────────────────────┐
│  ← Chat sarlavhasi   │  ← Orqaga qaytish tugmasi bor
│  ────────────────── │
│  Xabarlar ...        │
│                      │
│  ────────────────── │
│  [ Xabar yozing... ] │
└──────────────────────┘
```

### 📟 Planshet (768px – 1024px)
```
┌─────────┬────────────────────┐
│Sidebar  │  Chat oynasi       │
│ 280px   │  flex-1            │
│         │                    │
│ Chat 1  │  Xabarlar          │
│ Chat 2  │                    │
│ Chat 3  │  ────────────────  │
│         │  [ Input          ]│
└─────────┴────────────────────┘
```

### 🖥️ Desktop (> 1024px)
```
┌──────────┬─────────────────────┐
│ Sidebar  │   Chat oynasi       │
│  340px   │   flex-1            │
│          │                     │
│ 🔍 Izla  │  ChatHeader         │
│ ──────── │  ─────────────────  │
│ Chat 1   │  Xabarlar (scroll)  │
│ Chat 2   │                     │
│ Chat 3   │  ─────────────────  │
│ Chat 4   │  [ 📎 Xabar... 😊 →]│
└──────────┴─────────────────────┘
```

---

## ⚙️ Layout Implementatsiya

```jsx
// pages/ChatPage.jsx
const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setShowSidebar(false); // Mobilda sidebarni yashir
  };

  const handleBack = () => {
    setActiveChat(null);
    setShowSidebar(true); // Mobilda sidebarni ko'rsat
  };

  return (
    <div className="flex h-screen overflow-hidden bg-tg-base">

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          /* Mobil: to'liq ekran, mutlaq pozisiya */
          absolute inset-0 z-30 flex flex-col
          bg-tg-sidebar border-r border-tg-border
          transition-transform duration-300 ease-in-out

          /* Mobil: chat tanlanganda chapga chiqib ketadi */
          ${activeChat ? "-translate-x-full" : "translate-x-0"}

          /* Planshet+: sidebar chiqib ketmaydi, o'z joyida turadi */
          md:relative md:translate-x-0
          md:w-[280px] md:flex-shrink-0

          /* Desktop: kenglik oshadi */
          lg:w-[340px]
        `}
      >
        <SidebarHeader user={currentUser} />
        <SearchBar />
        <div className="flex-1 overflow-y-auto">
          <ChatList onSelect={handleSelectChat} activeId={activeChat?._id} />
        </div>
      </aside>

      {/* ===== CHAT OYNASI ===== */}
      <main
        className={`
          /* Mobil: to'liq ekran */
          flex-1 flex flex-col overflow-hidden

          /* Mobildan yashirish (chat tanlanmasa) */
          ${!activeChat ? "hidden md:flex" : "flex"}
        `}
      >
        {activeChat ? (
          <>
            <ChatHeader
              chat={activeChat}
              onBack={handleBack}     /* Mobil uchun orqaga */
            />
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
              <MessageList chatId={activeChat._id} />
            </div>
            <MessageInput chatId={activeChat._id} />
          </>
        ) : (
          <EmptyState />
        )}
      </main>

    </div>
  );
};
```

---

## 🔝 ChatHeader — Responsive

```jsx
// components/chat/ChatHeader.jsx
const ChatHeader = ({ chat, onBack }) => {
  return (
    <div className="
      flex items-center gap-3 px-3 sm:px-4 h-14
      bg-tg-sidebar border-b border-tg-border flex-shrink-0
    ">
      {/* ← Orqaga tugmasi: faqat mobildan ko'rinadi */}
      <button
        onClick={onBack}
        className="
          md:hidden
          w-9 h-9 flex items-center justify-center
          rounded-full text-tg-secondary hover:bg-tg-hover
          transition-colors -ml-1
        "
      >
        <ArrowLeft size={20} />
      </button>

      {/* Avatar */}
      <Avatar src={chat.avatar} name={chat.name} size="sm" online={chat.isOnline} />

      {/* Nom va holat */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-tg-primary truncate">
          {chat.name}
        </p>
        <p className="text-xs text-tg-muted truncate">
          {chat.isOnline ? "online" : `so'nggi faollik: ${formatLastSeen(chat.lastSeen)}`}
        </p>
      </div>

      {/* Amallar — mobildan ba'zilari yashiriladi */}
      <div className="flex items-center gap-1">
        {/* Qidiruv: barcha qurilmalarda */}
        <button className="icon-btn"><Search size={18} /></button>

        {/* Qo'ng'iroq: faqat sm+ dan */}
        <button className="icon-btn hidden sm:flex"><Phone size={18} /></button>

        {/* Video: faqat md+ dan */}
        <button className="icon-btn hidden md:flex"><Video size={18} /></button>

        {/* Ko'proq */}
        <button className="icon-btn"><MoreVertical size={18} /></button>
      </div>
    </div>
  );
};
```

---

## 💬 Xabar Pufakchasi — Responsive

```jsx
// Mobilda kichikroq, desktopda kattaroq max-width
<div className={`
  ${isMine ? "msg-bubble-out" : "msg-bubble-in"}

  /* Mobilda kengroq */
  max-w-[85vw]

  /* sm+ da cheklash */
  sm:max-w-[75vw]

  /* md+ da standart */
  md:max-w-[420px]

  /* lg+ da biroz kattaroq */
  lg:max-w-[520px]
`}>
  {/* ...xabar tarkibi... */}
</div>
```

---

## 🔍 SearchBar — Responsive

```jsx
const SearchBar = () => (
  <div className="px-3 py-2 flex-shrink-0">
    <div className="
      flex items-center gap-2
      bg-tg-input border border-transparent
      rounded-full px-3 py-2
      focus-within:border-tg-accent focus-within:ring-2 focus-within:ring-tg-accent/15
      transition-all duration-200
    ">
      <Search size={15} className="text-tg-muted flex-shrink-0" />
      <input
        type="text"
        placeholder="Qidiruv"
        className="
          flex-1 bg-transparent outline-none
          text-tg-primary placeholder:text-tg-muted

          /* Mobil: kichikroq shrift */
          text-sm

          /* md+: normal */
          md:text-[14px]
        "
      />
    </div>
  </div>
);
```

---

## 🖼️ Media Xabarlar — Responsive Grid

```jsx
{/* Bir nechta rasm: responsive grid */}
const MediaGrid = ({ images }) => {
  const count = images.length;

  return (
    <div className={`
      grid gap-0.5 rounded-lg overflow-hidden

      ${count === 1 ? "grid-cols-1" : ""}
      ${count === 2 ? "grid-cols-2" : ""}
      ${count === 3 ? "grid-cols-2" : ""}
      ${count >= 4 ? "grid-cols-2" : ""}

      /* Mobildan kichikroq */
      max-w-[260px] sm:max-w-[320px] md:max-w-[380px]
    `}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img.url}
          alt=""
          className={`
            w-full object-cover cursor-pointer
            hover:opacity-90 transition-opacity

            /* Balandlik */
            ${count === 1 ? "h-[200px] sm:h-[280px]" : "h-[130px] sm:h-[160px]"}
            ${count === 3 && i === 0 ? "col-span-2 h-[160px]" : ""}
          `}
        />
      ))}
    </div>
  );
};
```

---

## 📋 Sidebar Chat Elementi — Responsive

```jsx
const ChatItem = ({ chat, isActive, onClick }) => (
  <div onClick={onClick}
    className={`
      flex items-center gap-3 cursor-pointer
      transition-colors duration-100
      ${isActive ? "bg-tg-active" : "hover:bg-tg-hover"}

      /* Mobildan kichikroq padding */
      px-3 py-2

      /* md+ dan normal */
      md:px-4 md:py-2
    `}
  >
    <Avatar src={chat.avatar} name={chat.name}
      /* Mobildan kichikroq avatar */
      size={window.innerWidth < 640 ? "sm" : "md"}
      online={chat.isOnline}
    />

    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline gap-1">
        <span className="
          font-medium text-tg-primary truncate
          text-sm md:text-[15px]
        ">
          {chat.name}
        </span>
        <span className="text-[11px] text-tg-muted flex-shrink-0">
          {formatTime(chat.lastMessage?.createdAt)}
        </span>
      </div>

      <div className="flex justify-between items-center gap-1">
        <p className="text-xs text-tg-secondary truncate">
          {chat.lastMessage?.text}
        </p>
        {chat.unreadCount > 0 && (
          <span className="unread-badge">{chat.unreadCount}</span>
        )}
      </div>
    </div>
  </div>
);
```

---

## ⌨️ MessageInput — Responsive

```jsx
const MessageInput = ({ onSend }) => (
  <div className="
    flex items-end gap-1.5 sm:gap-2
    px-2 sm:px-3 py-2
    bg-tg-sidebar border-t border-tg-border
    flex-shrink-0
  ">
    {/* Fayl tugmasi */}
    <button className="icon-btn-ghost mb-0.5 flex-shrink-0">
      <Paperclip size={20} />
    </button>

    {/* Matn maydoni */}
    <textarea
      placeholder="Xabar yozing..."
      rows={1}
      className="
        flex-1 bg-tg-input border border-transparent
        outline-none resize-none

        /* Mobildan kichikroq */
        rounded-[18px] px-3 py-2 text-sm

        /* md+ dan kattaroq */
        md:rounded-[22px] md:px-4 md:py-2.5 md:text-[14px]

        text-tg-primary placeholder:text-tg-muted
        focus:border-tg-accent focus:ring-2 focus:ring-tg-accent/15
        transition-all duration-200 max-h-[160px] overflow-y-auto
      "
    />

    {/* Yuborish tugmasi */}
    <button className="
      flex-shrink-0 mb-0.5 rounded-full
      bg-tg-accent hover:bg-tg-accent-dark
      text-white transition-all active:scale-95

      /* Mobildan kichikroq */
      w-9 h-9

      /* md+ dan normal */
      md:w-[42px] md:h-[42px]

      flex items-center justify-center
    ">
      <Send size={16} className="md:hidden" />
      <Send size={18} className="hidden md:block" />
    </button>
  </div>
);
```

---

## 🧪 Sinov Qurilmalari

| Qurilma | Kenglik | Sinov usuli |
|---------|---------|-------------|
| iPhone SE | 375px | Chrome DevTools |
| iPhone 14 Pro | 393px | Chrome DevTools |
| Samsung Galaxy S21 | 360px | Chrome DevTools |
| iPad Mini | 768px | Chrome DevTools |
| iPad Pro | 1024px | Chrome DevTools |
| MacBook Air | 1280px | Brauzer |
| Full HD | 1920px | Brauzer |

### Chrome DevTools bilan sinov:
```
1. F12 → DevTools oching
2. Ctrl+Shift+M (Device Toolbar)
3. Qurilmani tanlang yoki custom o'lcham kiring
4. Sahifani yangilang (Ctrl+R)
```

---

## ✅ Responsive Checklist

```
□ Mobil (<640px): sidebar to'liq ekran, chat ustiga o'tish bor
□ ChatHeader da ← orqaga tugmasi mobildan ko'rinadi, md: dan yashiriladi
□ Xabar pufakchasi max-w: mobildan 85vw, desktopdan 420px
□ Sidebar kengligi: 280px (md), 340px (lg)
□ Shrift o'lchamlari mobildan kichik, md+ dan normal
□ Tugmalar touch-friendly: min 44×44px
□ Matn truncate bilan to'lib ketmaydi
□ Rasmlar max-w va responsive grid bilan
□ Input textarea mobildan ham qulay
□ overflow-hidden va scroll to'g'ri ishlaydi
□ No horizontal scroll (overflow-x: hidden)
```
