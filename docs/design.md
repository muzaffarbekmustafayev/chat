# 💎 Premium Dizayn Tizimi

> Glassmorphism · Micro-animations · React Icons · Tailwind CSS CDN

---

## 🔗 CDN va Kutubxonalar

```html
<head>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts — Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
</head>
```

```bash
# React Icons o'rnatish
npm install react-icons
```

---

## 🎨 Tailwind Konfiguratsiya (Premium Token-lar)

```html
<script>
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      colors: {
        tg: {
          /* ── FON QATLAMLARI ── */
          '900': '#0a0f18',    /* Eng qorong'u fon */
          '800': '#0e1621',    /* Asosiy fon */
          '700': '#131f2e',    /* Sidebar */
          '600': '#17212b',    /* Panel */
          '500': '#1e2c3a',    /* Karta */
          '400': '#243344',    /* Ko'tarilgan */
          '300': '#2b3a4d',    /* Hover */
          '200': '#364a60',    /* Border highlight */
          '100': '#4a6278',    /* Muted element */

          /* ── ACCENT (Ko'k spektr) ── */
          'accent':       '#3b82f6',
          'accent-light': '#60a5fa',
          'accent-glow':  '#2563eb',
          'accent-muted': '#1e3a5f',

          /* ── MATN ── */
          'text-1': '#f1f5f9',   /* Birlamchi */
          'text-2': '#94a3b8',   /* Ikkilamchi */
          'text-3': '#64748b',   /* Uchinchi */
          'text-4': '#475569',   /* To'rtinchi (eng so'l) */

          /* ── XABAR ── */
          'out':     '#2b5278',
          'out-2':   '#1d3f5e',
          'in':      '#1e2c3a',
          'in-2':    '#172435',

          /* ── HOLAT ── */
          'online':  '#22c55e',
          'away':    '#f59e0b',
          'offline': '#64748b',
          'tick':    '#60a5fa',

          /* ── GLASS ── */
          'glass':       'rgba(30, 44, 58, 0.7)',
          'glass-light': 'rgba(36, 51, 68, 0.6)',
          'glass-border':'rgba(255, 255, 255, 0.06)',

          /* ── GRADIENT STOPS ── */
          'grad-1': '#1a2744',
          'grad-2': '#0e1621',
        }
      },

      backgroundImage: {
        'tg-gradient':     'linear-gradient(135deg, #0a0f18 0%, #0e1621 50%, #131f2e 100%)',
        'accent-gradient': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
        'card-gradient':   'linear-gradient(145deg, rgba(36,51,68,0.8) 0%, rgba(30,44,58,0.6) 100%)',
        'msg-out-grad':    'linear-gradient(135deg, #2b5278 0%, #1d3f5e 100%)',
        'shine':           'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
      },

      boxShadow: {
        'tg-xs':     '0 1px 2px rgba(0,0,0,0.4)',
        'tg-sm':     '0 2px 8px rgba(0,0,0,0.45)',
        'tg-md':     '0 4px 16px rgba(0,0,0,0.5)',
        'tg-lg':     '0 8px 32px rgba(0,0,0,0.6)',
        'tg-xl':     '0 16px 64px rgba(0,0,0,0.7)',
        'tg-glow':   '0 0 24px rgba(59,130,246,0.3)',
        'tg-glow-sm':'0 0 12px rgba(59,130,246,0.2)',
        'tg-inset':  'inset 0 1px 0 rgba(255,255,255,0.05)',
        'tg-ring':   '0 0 0 3px rgba(59,130,246,0.2)',
        'msg-out':   '0 2px 8px rgba(37,99,235,0.25)',
        'msg-in':    '0 2px 8px rgba(0,0,0,0.3)',
        'avatar':    '0 4px 12px rgba(0,0,0,0.5)',
      },

      borderRadius: {
        'pill':      '9999px',
        'bubble':    '18px',
        'bubble-tl': '4px',
        'bubble-tr': '4px',
      },

      backdropBlur: {
        'tg': '16px',
        'tg-sm': '8px',
      },

      keyframes: {
        /* Xabar kelishi */
        messageSlideIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px) scale(0.95)' },
          '60%':  { transform: 'translateY(-2px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        /* Typing dots */
        typingPulse: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%':           { transform: 'translateY(-5px)', opacity: '1' },
        },
        /* Online pulse */
        onlineRipple: {
          '0%':   { boxShadow: '0 0 0 0 rgba(34,197,94, 0.5)' },
          '70%':  { boxShadow: '0 0 0 6px rgba(34,197,94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,197,94, 0)' },
        },
        /* Badge pop */
        badgeBounce: {
          '0%':   { transform: 'scale(0) rotate(-10deg)' },
          '50%':  { transform: 'scale(1.25) rotate(3deg)' },
          '75%':  { transform: 'scale(0.9) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        /* Shimmer (skeleton) */
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        /* Glow pulse */
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(59,130,246,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(59,130,246,0.6)' },
        },
        /* Float */
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        /* Slide in left (sidebar items) */
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        /* Modal */
        modalIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        /* Spin gradient */
        gradientSpin: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },

      animation: {
        'msg-in':       'messageSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        'typing-1':     'typingPulse 1.4s ease-in-out infinite 0s',
        'typing-2':     'typingPulse 1.4s ease-in-out infinite 0.2s',
        'typing-3':     'typingPulse 1.4s ease-in-out infinite 0.4s',
        'online':       'onlineRipple 2s ease-out infinite',
        'badge':        'badgeBounce 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer':      'shimmer 2s linear infinite',
        'glow':         'glowPulse 3s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'slide-left':   'slideInLeft 0.2s ease',
        'modal':        'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      },

      width:    { sidebar: '340px' },
      minWidth: { sidebar: '280px' },
    }
  }
}
</script>

<style type="text/tailwindcss">
  @layer base {
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { height: 100%; overflow: hidden; }

    body {
      @apply font-sans bg-tg-800 text-tg-text-1 antialiased;
      background-image: radial-gradient(ellipse at top left, rgba(37,99,235,0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(59,130,246,0.05) 0%, transparent 50%);
    }

    /* Scroll */
    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { @apply bg-tg-300 rounded-pill; }
    ::-webkit-scrollbar-thumb:hover { @apply bg-tg-200; }

    /* Seleksiya */
    ::selection { @apply bg-tg-accent/30 text-tg-text-1; }
  }

  @layer components {

    /* ─── GLASS CARD ─── */
    .glass-card {
      @apply bg-tg-glass border border-tg-glass-border rounded-2xl
             shadow-tg-lg backdrop-blur-tg;
      background-image: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    }

    /* ─── AVATAR ─── */
    .avatar-base {
      @apply rounded-full object-cover flex-shrink-0 overflow-hidden
             shadow-avatar ring-2 ring-white/5;
    }
    .avatar-sm  { @apply w-8 h-8 text-[11px]; }
    .avatar-md  { @apply w-11 h-11 text-sm; }
    .avatar-lg  { @apply w-14 h-14 text-base; }
    .avatar-xl  { @apply w-20 h-20 text-xl; }

    .avatar-placeholder {
      @apply flex items-center justify-center font-semibold
             text-white/90 bg-accent-gradient;
    }

    .avatar-wrapper { @apply relative inline-flex; }
    .online-dot {
      @apply absolute bottom-0 right-0 w-3 h-3 rounded-full
             bg-tg-online border-2 border-tg-700 animate-online;
    }

    /* ─── XABAR PUFAKCHALARI ─── */
    .msg-out {
      @apply bg-msg-out-grad rounded-bubble rounded-tr-bubble-tr
             text-tg-text-1 shadow-msg-out ml-auto
             max-w-[75%] md:max-w-[420px] px-3 py-2
             animate-msg-in relative;
    }
    .msg-in {
      @apply bg-tg-500 rounded-bubble rounded-tl-bubble-tl
             text-tg-text-1 shadow-msg-in mr-auto
             max-w-[75%] md:max-w-[420px] px-3 py-2
             animate-msg-in relative;
      background-image: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    }

    /* ─── CHAT ITEM ─── */
    .chat-item {
      @apply flex items-center gap-3 px-4 py-3 cursor-pointer
             rounded-xl mx-2 transition-all duration-150
             hover:bg-tg-300/60 active:bg-tg-300
             relative overflow-hidden;
    }
    .chat-item::before {
      content: '';
      @apply absolute inset-0 opacity-0 transition-opacity duration-150;
      background: linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 100%);
    }
    .chat-item:hover::before { @apply opacity-100; }
    .chat-item-active {
      @apply bg-tg-accent-muted/80 hover:bg-tg-accent-muted;
    }
    .chat-item-active::after {
      content: '';
      @apply absolute left-0 top-1/4 h-1/2 w-[3px]
             bg-tg-accent rounded-r-full;
    }

    /* ─── BADGE ─── */
    .badge {
      @apply min-w-[20px] h-5 px-1.5 rounded-pill text-[11px]
             font-bold flex items-center justify-center
             bg-accent-gradient text-white shadow-tg-glow-sm
             animate-badge;
    }

    /* ─── INPUT ─── */
    .tg-input {
      @apply w-full bg-tg-500/80 border border-tg-glass-border
             rounded-xl px-4 py-2.5 text-sm text-tg-text-1
             placeholder:text-tg-text-3 outline-none
             transition-all duration-200
             focus:border-tg-accent/60 focus:ring-2 focus:ring-tg-accent/15
             focus:bg-tg-500;
    }

    /* ─── TUGMALAR ─── */
    .btn-primary {
      @apply bg-accent-gradient text-white font-semibold
             px-6 py-2.5 rounded-xl shadow-tg-glow-sm
             transition-all duration-150
             hover:shadow-tg-glow hover:scale-[1.02]
             active:scale-[0.98] active:shadow-tg-sm;
    }
    .btn-ghost {
      @apply text-tg-text-2 hover:text-tg-text-1
             hover:bg-tg-300/60 rounded-xl px-4 py-2
             transition-all duration-150;
    }
    .btn-icon {
      @apply w-9 h-9 flex items-center justify-center rounded-xl
             text-tg-text-2 hover:text-tg-text-1
             hover:bg-tg-300/60 transition-all duration-150
             active:scale-95;
    }
    .btn-icon-accent {
      @apply w-10 h-10 flex items-center justify-center rounded-xl
             bg-accent-gradient text-white shadow-tg-glow-sm
             hover:shadow-tg-glow hover:scale-[1.05]
             active:scale-95 transition-all duration-150 flex-shrink-0;
    }
    .btn-icon-circle {
      @apply w-9 h-9 flex items-center justify-center rounded-full
             text-tg-text-2 hover:text-tg-text-1
             hover:bg-tg-300/60 transition-all duration-150
             active:scale-90;
    }

    /* ─── SKELETON ─── */
    .skeleton {
      @apply rounded-lg bg-tg-400;
      background-image: linear-gradient(90deg,
        transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
      background-size: 200% 100%;
      @apply animate-shimmer;
    }

    /* ─── DIVIDER ─── */
    .tg-divider {
      @apply border-none h-px mx-4;
      background: linear-gradient(90deg,
        transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent);
    }

    /* ─── TOOLTIP ─── */
    .tooltip {
      @apply absolute z-50 px-2.5 py-1.5 text-xs font-medium
             text-tg-text-1 bg-tg-400 border border-tg-glass-border
             rounded-lg shadow-tg-md pointer-events-none
             whitespace-nowrap;
    }
  }

  @layer utilities {
    .text-xxs       { font-size: 11px; line-height: 1.4; }
    .text-gradient  {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .glass-border   { border: 1px solid rgba(255,255,255,0.06); }
    .no-select      { user-select: none; }
  }
</style>
```

---

## ⚛️ React Icons — To'liq Ro'yxat

```bash
npm install react-icons
```

### Ishlatilgan Ikonkalar (Loyiha bo'yicha)

```tsx
// Chat Header
import {
  BsThreeDotsVertical,   // Ko'proq amallar
  BsSearch,              // Qidiruv
  BsTelephoneFill,       // Ovozli qo'ng'iroq
  BsCameraVideoFill,     // Video qo'ng'iroq
  BsArrowLeft,           // Orqaga (mobil)
  BsPinAngleFill,        // Pin qilish
  BsBellSlashFill,       // Mute
} from "react-icons/bs";

// MessageInput
import {
  HiPaperAirplane,       // Yuborish
  HiFaceSmile,           // Emoji
  HiPaperClip,           // Fayl biriktirish
  HiMicrophone,          // Ovoz yozish
  HiXMark,               // Yopish
  HiPhoto,               // Rasm tanlash
} from "react-icons/hi2";

// Sidebar
import {
  HiMiniPencilSquare,    // Yangi chat
  HiMiniMagnifyingGlass, // Qidiruv
  HiMiniCog6Tooth,       // Sozlamalar
} from "react-icons/hi2";

// Xabar amallari
import {
  MdReply,               // Javob berish
  MdDelete,              // O'chirish
  MdEdit,                // Tahrirlash
  MdForward,             // Forward
  MdContentCopy,         // Nusxa olish
  MdDoneAll,             // Ikki belgi (✓✓)
  MdDone,                // Bir belgi (✓)
} from "react-icons/md";

// Chat turlari / holat
import {
  IoChatbubbleEllipsesOutline,  // Chat
  IoPersonAddOutline,           // Kontakt qo'shish
  IoClose,                      // Yopish
  IoCheckmarkCircle,            // Tasdiqlash
} from "react-icons/io5";

// Fayl turlari
import {
  AiOutlineFilePdf,     // PDF
  AiOutlineFileWord,    // Word
  AiOutlineFileImage,   // Rasm
  AiOutlineFileZip,     // Zip
  AiOutlinePlayCircle,  // Video
} from "react-icons/ai";

// Guruh / Kanal
import {
  RiGroupLine,           // Guruh
  RiMegaphoneLine,       // Kanal
  RiUserAddLine,         // A'zo qo'shish
  RiAdminLine,           // Admin
} from "react-icons/ri";
```

---

## 🧩 Premium Komponentlar

### 1. Premium Sidebar Header

```tsx
import { HiMiniPencilSquare, HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";

const SidebarHeader = ({ user, onNewChat, onSearch }) => (
  <div className="
    flex items-center justify-between px-4 h-14 flex-shrink-0
    border-b border-tg-glass-border
  ">
    {/* Avatar + Ism */}
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="avatar-wrapper">
        {user.avatar
          ? <img src={user.avatar} className="avatar-base avatar-sm" />
          : <div className="avatar-base avatar-sm avatar-placeholder">
              {user.firstName[0]}
            </div>
        }
        <span className="online-dot" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-tg-text-1 truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xxs text-tg-online flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-tg-online inline-block" />
          online
        </p>
      </div>
    </div>

    {/* Amallar */}
    <div className="flex items-center gap-0.5 flex-shrink-0">
      <button onClick={onSearch} className="btn-icon-circle">
        <HiMiniMagnifyingGlass size={18} />
      </button>
      <button onClick={onNewChat} className="btn-icon-circle">
        <HiMiniPencilSquare size={18} />
      </button>
      <button className="btn-icon-circle">
        <BsThreeDotsVertical size={16} />
      </button>
    </div>
  </div>
);
```

---

### 2. Premium SearchBar

```tsx
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

const SearchBar = ({ value, onChange, onClear }) => (
  <div className="px-3 py-2 flex-shrink-0">
    <div className="
      flex items-center gap-2.5 px-3 py-2 rounded-xl
      bg-tg-500/60 border border-tg-glass-border
      focus-within:border-tg-accent/50
      focus-within:ring-2 focus-within:ring-tg-accent/10
      focus-within:bg-tg-500
      transition-all duration-200
    ">
      <HiMiniMagnifyingGlass size={16} className="text-tg-text-3 flex-shrink-0" />
      <input
        value={value}
        onChange={onChange}
        placeholder="Qidiruv..."
        className="
          flex-1 bg-transparent outline-none
          text-sm text-tg-text-1 placeholder:text-tg-text-4
        "
      />
      {value && (
        <button onClick={onClear} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
          <IoClose size={16} />
        </button>
      )}
    </div>
  </div>
);
```

---

### 3. Premium ChatItem

```tsx
import { MdDoneAll, MdDone } from "react-icons/md";
import { BsMicFill } from "react-icons/bs";
import { HiPhoto } from "react-icons/hi2";

const ChatItem = ({ chat, isActive, onClick }) => {
  const lastMsg = chat.lastMessage;

  const renderLastMsg = () => {
    if (!lastMsg) return <span className="italic text-tg-text-4">Xabar yo'q</span>;
    if (lastMsg.type === "image")    return <><HiPhoto size={12} className="inline mr-1" />Rasm</>;
    if (lastMsg.type === "audio")    return <><BsMicFill size={11} className="inline mr-1" />Ovozli xabar</>;
    if (lastMsg.type === "document") return <><AiOutlineFilePdf size={12} className="inline mr-1" />Hujjat</>;
    return lastMsg.text?.slice(0, 40) || "";
  };

  return (
    <div onClick={onClick} className={`chat-item ${isActive ? "chat-item-active" : ""}`}>

      {/* Avatar */}
      <div className="avatar-wrapper flex-shrink-0">
        {chat.avatar
          ? <img src={chat.avatar} className="avatar-base avatar-md" />
          : <div className="avatar-base avatar-md avatar-placeholder">
              {chat.name?.[0] || "?"}
            </div>
        }
        {chat.isOnline && <span className="online-dot" />}
      </div>

      {/* Ma'lumot */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-[14.5px] font-semibold text-tg-text-1 truncate">
            {chat.name}
          </span>
          <span className="text-xxs text-tg-text-3 flex-shrink-0">
            {formatTime(lastMsg?.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[13px] text-tg-text-2 truncate min-w-0">
            {/* O'z xabar bo'lsa tick */}
            {lastMsg?.isMine && (
              lastMsg?.readBy?.length > 1
                ? <MdDoneAll size={14} className="text-tg-tick flex-shrink-0" />
                : <MdDone size={14} className="text-tg-text-3 flex-shrink-0" />
            )}
            <span className="truncate">{renderLastMsg()}</span>
          </div>

          {chat.unreadCount > 0 && (
            <span className="badge">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### 4. Premium ChatHeader

```tsx
import {
  BsArrowLeft, BsTelephoneFill, BsCameraVideoFill,
  BsThreeDotsVertical, BsSearch
} from "react-icons/bs";

const ChatHeader = ({ chat, onBack }) => (
  <div className="
    flex items-center gap-3 px-3 sm:px-4 h-14 flex-shrink-0
    border-b border-tg-glass-border
    bg-tg-700/80 backdrop-blur-tg-sm
  ">
    {/* ← Orqaga (faqat mobil) */}
    <button onClick={onBack} className="md:hidden btn-icon-circle -ml-1">
      <BsArrowLeft size={20} />
    </button>

    {/* Avatar */}
    <div className="avatar-wrapper cursor-pointer flex-shrink-0">
      {chat.avatar
        ? <img src={chat.avatar} className="avatar-base avatar-sm hover:opacity-90 transition-opacity" />
        : <div className="avatar-base avatar-sm avatar-placeholder">
            {chat.name?.[0]}
          </div>
      }
      {chat.isOnline && <span className="online-dot" />}
    </div>

    {/* Ism + holat */}
    <div className="flex-1 min-w-0 cursor-pointer">
      <p className="text-[14.5px] font-semibold text-tg-text-1 truncate">
        {chat.name}
      </p>
      <p className={`text-xxs font-medium truncate ${
        chat.isOnline ? "text-tg-online" : "text-tg-text-3"
      }`}>
        {chat.isOnline ? "online" : `ko'rilgan: ${formatLastSeen(chat.lastSeen)}`}
      </p>
    </div>

    {/* Tugmalar */}
    <div className="flex items-center gap-1 flex-shrink-0">
      <button className="btn-icon-circle hidden sm:flex">
        <BsSearch size={16} />
      </button>
      <button className="btn-icon-circle hidden md:flex">
        <BsTelephoneFill size={16} />
      </button>
      <button className="btn-icon-circle hidden lg:flex">
        <BsCameraVideoFill size={17} />
      </button>
      <button className="btn-icon-circle">
        <BsThreeDotsVertical size={17} />
      </button>
    </div>
  </div>
);
```

---

### 5. Premium MessageBubble

```tsx
import { MdDoneAll, MdDone, MdEdit } from "react-icons/md";
import { MdReply }                    from "react-icons/md";
import { BsPlayCircleFill }           from "react-icons/bs";
import { AiOutlineFilePdf }           from "react-icons/ai";

const MessageBubble = ({ message, isMine }) => (
  <div className={`flex gap-2 mb-0.5 group ${isMine ? "justify-end" : "justify-start"}`}>

    {/* Boshqa odamning avatari */}
    {!isMine && (
      <div className="avatar-base avatar-sm avatar-placeholder self-end mb-1 flex-shrink-0">
        {message.sender.firstName[0]}
      </div>
    )}

    <div className={isMine ? "msg-out" : "msg-in"}>

      {/* Sender ismi (guruhda) */}
      {!isMine && (
        <p className="text-xxs font-bold text-gradient mb-1">
          {message.sender.firstName}
        </p>
      )}

      {/* Reply Preview */}
      {message.replyTo && (
        <div className="
          flex gap-2 mb-2 pl-2 py-1
          border-l-2 border-tg-accent rounded-r-lg
          bg-black/20
        ">
          <div className="min-w-0">
            <p className="text-xxs font-semibold text-tg-accent truncate">
              {message.replyTo.sender.firstName}
            </p>
            <p className="text-xxs text-tg-text-2 truncate">
              {message.replyTo.text || "Media"}
            </p>
          </div>
        </div>
      )}

      {/* Rasm */}
      {message.type === "image" && (
        <div className="relative mb-1 -mx-1 -mt-1 overflow-hidden rounded-xl">
          <img
            src={message.media?.thumbnail || message.media?.url}
            alt=""
            className="w-full max-h-72 object-cover"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Video */}
      {message.type === "video" && (
        <div className="relative mb-1 -mx-1 -mt-1 rounded-xl overflow-hidden bg-black cursor-pointer group/video">
          <img src={message.media?.thumbnail} className="w-full max-h-56 object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BsPlayCircleFill size={48} className="text-white/90 drop-shadow-lg group-hover/video:scale-110 transition-transform" />
          </div>
        </div>
      )}

      {/* Hujjat */}
      {message.type === "document" && (
        <div className="flex items-center gap-2.5 mb-1 p-2 bg-black/20 rounded-xl min-w-[180px]">
          <div className="w-9 h-9 rounded-lg bg-tg-accent/20 flex items-center justify-center flex-shrink-0">
            <AiOutlineFilePdf size={20} className="text-tg-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-tg-text-1 truncate">{message.media?.filename}</p>
            <p className="text-xxs text-tg-text-3">{formatBytes(message.media?.filesize)}</p>
          </div>
        </div>
      )}

      {/* Matn */}
      {message.text && (
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-1 justify-end mt-0.5">
        {message.isEdited && (
          <span className="text-xxs text-tg-text-3 flex items-center gap-0.5">
            <MdEdit size={10} /> tahrirlangan
          </span>
        )}
        <span className="text-xxs text-tg-text-3">
          {format(new Date(message.createdAt), "HH:mm")}
        </span>
        {isMine && (
          message.readBy?.length > 1
            ? <MdDoneAll size={14} className="text-tg-tick" />
            : <MdDone size={14} className="text-tg-text-3" />
        )}
      </div>

      {/* Hover amallar (kontekst menyusiz tez amallar) */}
      <div className="
        absolute -top-7 right-0
        flex items-center gap-1 px-2 py-1
        bg-tg-400/95 backdrop-blur-tg-sm border border-tg-glass-border
        rounded-lg shadow-tg-md
        opacity-0 group-hover:opacity-100
        transition-all duration-150 scale-95 group-hover:scale-100
        pointer-events-none group-hover:pointer-events-auto
      ">
        <button className="btn-icon w-7 h-7 rounded-lg" title="Javob berish">
          <MdReply size={15} />
        </button>
      </div>
    </div>
  </div>
);
```

---

### 6. Premium Typing Indicator

```tsx
const TypingIndicator = ({ users }: { users: string[] }) => {
  if (!users.length) return null;
  return (
    <div className="flex items-end gap-2 px-4 py-1 animate-slide-left">
      <div className="avatar-base avatar-sm avatar-placeholder flex-shrink-0">
        {users[0][0]}
      </div>
      <div className="msg-in px-3 py-2.5 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-tg-text-2 animate-typing-1" />
        <span className="w-2 h-2 rounded-full bg-tg-text-2 animate-typing-2" />
        <span className="w-2 h-2 rounded-full bg-tg-text-2 animate-typing-3" />
      </div>
      <p className="text-xxs text-tg-text-3 mb-1">
        {users[0]} yozmoqda...
      </p>
    </div>
  );
};
```

---

### 7. Premium MessageInput

```tsx
import {
  HiPaperAirplane, HiFaceSmile,
  HiPaperClip, HiMicrophone, HiXMark
} from "react-icons/hi2";
import { MdReply } from "react-icons/md";

const MessageInput = ({ onSend, onTyping, replyTo, onClearReply }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="flex-shrink-0 bg-tg-700/90 backdrop-blur-tg-sm border-t border-tg-glass-border">

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-4 pt-2.5">
          <div className="flex-1 flex items-center gap-2 bg-tg-accent/10 border-l-2 border-tg-accent rounded-r-xl px-3 py-1.5 min-w-0">
            <MdReply size={16} className="text-tg-accent flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xxs font-semibold text-tg-accent">{replyTo.sender.firstName}</p>
              <p className="text-xxs text-tg-text-2 truncate">{replyTo.text || "Media"}</p>
            </div>
          </div>
          <button onClick={onClearReply} className="btn-icon-circle w-7 h-7">
            <HiXMark size={16} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 px-3 py-2.5">

        {/* Fayl */}
        <button className="btn-icon-circle mb-0.5 flex-shrink-0">
          <HiPaperClip size={20} />
        </button>

        {/* Textarea + Emoji */}
        <div className="flex-1 relative bg-tg-500/70 border border-tg-glass-border rounded-2xl
                        focus-within:border-tg-accent/40 focus-within:bg-tg-500
                        transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); autoResize(); onTyping(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (text.trim()) { onSend(text); setText(""); autoResize(); }
              }
            }}
            placeholder="Xabar yozing..."
            rows={1}
            className="
              w-full bg-transparent outline-none resize-none
              text-sm text-tg-text-1 placeholder:text-tg-text-4
              px-4 pt-2.5 pb-2 pr-10
              max-h-40 overflow-y-auto
            "
            style={{ lineHeight: "1.5" }}
          />
          <button className="absolute right-2.5 bottom-2 text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <HiFaceSmile size={18} />
          </button>
        </div>

        {/* Yuborish / Mikrofon */}
        <div className="mb-0.5 flex-shrink-0">
          {text.trim() ? (
            <button
              onClick={() => { onSend(text); setText(""); autoResize(); }}
              className="btn-icon-accent"
            >
              <HiPaperAirplane size={18} className="-rotate-45" />
            </button>
          ) : (
            <button className="btn-icon-accent">
              <HiMicrophone size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### 8. Skeleton Loading

```tsx
const ChatItemSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3 mx-2">
    <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <div className="skeleton h-3.5 w-28 rounded-lg" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
      <div className="skeleton h-3 w-40 rounded" />
    </div>
  </div>
);

const MessageSkeleton = ({ isMine = false }) => (
  <div className={`flex gap-2 mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
    {!isMine && <div className="skeleton w-8 h-8 rounded-full flex-shrink-0 self-end" />}
    <div className="space-y-1 max-w-[60%]">
      <div className={`skeleton h-10 ${isMine ? "w-48" : "w-56"} rounded-bubble`} />
      <div className={`skeleton h-3 w-16 rounded ${isMine ? "ml-auto" : ""}`} />
    </div>
  </div>
);
```

---

### 9. Empty State

```tsx
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
    {/* Animatsiyali ikonka */}
    <div className="relative">
      <div className="
        w-24 h-24 rounded-full flex items-center justify-center
        bg-tg-accent-muted border border-tg-accent/20
        shadow-tg-glow animate-glow
      ">
        <IoChatbubbleEllipsesOutline size={48} className="text-tg-accent" />
      </div>
      {/* Floating dots */}
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tg-accent/30 animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-tg-accent/20 animate-float" style={{ animationDelay: "0.5s" }} />
    </div>

    <div className="text-center">
      <h2 className="text-lg font-bold text-tg-text-1 mb-1.5">
        Suhbat tanlang
      </h2>
      <p className="text-sm text-tg-text-2 max-w-[240px] leading-relaxed">
        Chap paneldan chatni tanlang yoki yangi suhbat boshlang
      </p>
    </div>

    <button className="btn-primary flex items-center gap-2">
      <HiMiniPencilSquare size={16} />
      Yangi xabar
    </button>
  </div>
);
```

---

## 🎨 Rang Vizuali

| Token | Hex | Ko'rinish |
|-------|-----|-----------|
| `tg-900` | `#0a0f18` | ⬛ Eng qorong'u |
| `tg-800` | `#0e1621` | ⬛ Asosiy fon |
| `tg-700` | `#131f2e` | 🟦 Sidebar |
| `tg-600` | `#17212b` | 🟦 Panel |
| `tg-500` | `#1e2c3a` | 🟦 Karta |
| `tg-300` | `#2b3a4d` | 🔷 Hover |
| `tg-accent` | `#3b82f6` | 🔵 Ko'k accent |
| `tg-online` | `#22c55e` | 🟢 Online |
| `tg-tick` | `#60a5fa` | 💙 O'qilgan |

---

## ✅ Premium Dizayn Checklist

```
□ react-icons o'rnatilgan
□ tailwind.config da barcha tg-* tokenlar
□ glass-card, glass-border o'rnatilgan
□ Animatsiyalar silliqligi 60fps
□ Hover effektlar barcha interaktiv elementlarda
□ Online dot animate-online bilan
□ Xabar kirishi animate-msg-in bilan
□ Skeleton loaderlar mavjud
□ Empty state ikonka va animatsiya bilan
□ Gradient xabar pufakchalari
□ Reply preview premium ko'rinishda
□ Hover-da tez amallar (kontekst menyu)
□ Scrollbar nozik va stilizatsiya qilingan
□ Barcha tugmalar active:scale-95 bilan
□ prefers-reduced-motion qo'llab-quvvatlanadi
```

```css
/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
