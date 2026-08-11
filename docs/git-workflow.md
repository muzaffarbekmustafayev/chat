# 🔀 Git Workflow — Kod Boshqaruvi

> Branch strategiyasi, commit qoidalari va Pull Request jarayoni.

---

## 🌿 Branch Strategiyasi (GitHub Flow)

```
main ──────────────────────────────────────────────► (production)
  │
  ├── feature/auth-system          (yangi funksiya)
  ├── feature/group-chat
  ├── feature/file-upload
  │
  ├── fix/message-not-delivered    (xato tuzatish)
  ├── fix/sidebar-mobile-bug
  │
  ├── hotfix/security-patch        (jiddiy xato)
  │
  └── chore/update-dependencies    (texnik vazifa)
```

### Branch Nomlash Qoidalari

| Tur | Format | Misol |
|-----|--------|-------|
| Yangi funksiya | `feature/<tavsif>` | `feature/voice-messages` |
| Xato tuzatish | `fix/<tavsif>` | `fix/login-redirect-loop` |
| Jiddiy xato | `hotfix/<tavsif>` | `hotfix/sql-injection` |
| Texnik vazifa | `chore/<tavsif>` | `chore/update-socket-io` |
| Hujjat | `docs/<tavsif>` | `docs/api-endpoints` |
| Refactor | `refactor/<tavsif>` | `refactor/auth-service` |

---

## ✍️ Commit Xabarlari (Conventional Commits)

### Format
```
<tur>(<qamrov>): <qisqa tavsif>

[Ixtiyoriy: kengaytirilgan tavsif]

[Ixtiyoriy: footer — BREAKING CHANGE, closes #issue]
```

### Tur Turlari

| Tur | Emoji | Tavsif |
|-----|-------|--------|
| `feat` | ✨ | Yangi funksiya |
| `fix` | 🐛 | Xato tuzatish |
| `docs` | 📝 | Hujjat yangilash |
| `style` | 💄 | Kod formati (mantiqsiz) |
| `refactor` | ♻️ | Refactor (funksiya o'zgarmaydi) |
| `test` | ✅ | Test qo'shish/yangilash |
| `chore` | 🔧 | Tooling, dependencies |
| `perf` | ⚡ | Ishlash tezligi |
| `security` | 🔒 | Xavfsizlik tuzatish |
| `ci` | 👷 | CI/CD o'zgarish |
| `revert` | ⏪ | Oldingi commit-ni bekor qilish |

### Yaxshi Commit Misollari

```bash
# ✅ Yaxshi
git commit -m "feat(auth): JWT refresh token mexanizmi qo'shildi"
git commit -m "fix(chat): sidebar mobilda to'g'ri ko'rinmayotgan xato tuzatildi"
git commit -m "docs(api): messages endpoint hujjati yangilandi"
git commit -m "perf(db): messages kolleksiyasiga compound index qo'shildi"
git commit -m "security(upload): fayl MIME type validatsiyasi kuchaytirildi"

# ❌ Yomon
git commit -m "fix"
git commit -m "ishladi"
git commit -m "update"
git commit -m "o'zgartirdim"
```

### Ko'p qatorli commit
```bash
git commit -m "feat(messages): fayl yuklash funksiyasi

- Rasm, video, audio, hujjat yuklash
- Sharp bilan thumbnail yaratish
- Yuklanish progress bar
- Drag & Drop qo'llab-quvvatlash

Closes #23"
```

---

## 🔄 Ishchi Oqim (Workflow)

### 1. Yangi branch
```bash
# main ni yangilash
git checkout main
git pull origin main

# Yangi branch
git checkout -b feature/group-chat
```

### 2. Kod yozish + commit
```bash
# Staging
git add .
# yoki alohida fayllar:
git add backend/src/controllers/chat.controller.js

# Commit
git commit -m "feat(chat): guruh chat yaratish endpoint qo'shildi"

# Davom etish
git add .
git commit -m "feat(chat): guruh a'zolar boshqaruvi"
```

### 3. Remote ga push
```bash
git push origin feature/group-chat
```

### 4. Pull Request
```
1. GitHub → "Compare & pull request" tugmasi
2. PR sarlavhasi: "feat(chat): guruh chat yaratish"
3. Tavsif: Nima o'zgardi, qanday sinash mumkin
4. Review: kamida 1 approver
5. Squash va merge
```

### 5. Tozalash
```bash
git checkout main
git pull origin main
git branch -d feature/group-chat
git push origin --delete feature/group-chat
```

---

## 📋 Pull Request Shabloni

**File:** `.github/pull_request_template.md`

```markdown
## 📝 O'zgarishlar tavsifi
<!-- Nima o'zgardi va nima uchun? -->

## 🔗 Bog'liq Issue
Closes #___

## 🧪 Qanday sinash mumkin
1. `npm run dev` ishga tushiring
2. `___` sahifasiga o'ting
3. `___` qilganda `___` bo'lishi kerak

## 📸 Screenshot (UI o'zgarish bo'lsa)
<!-- Oldin/keyin rasmlar -->

## ✅ Checklist
- [ ] Testlar yozilgan
- [ ] Hujjat yangilangan
- [ ] Breaking change yo'q
- [ ] .env.example yangilangan (agar kerak bo'lsa)
```

---

## 🔖 Versiyalash (Semantic Versioning)

```
v1.0.0
│ │ │
│ │ └── PATCH: xato tuzatish (1.0.1)
│ └──── MINOR: yangi funksiya, mos (1.1.0)
└────── MAJOR: katta o'zgarish, mos emas (2.0.0)
```

### Tag yaratish
```bash
# Versiya tag
git tag -a v1.0.0 -m "v1.0.0 — Birinchi barqaror reliz"
git push origin v1.0.0

# Barcha taglар
git tag -l
```

---

## 🪝 Git Hooks (Husky)

```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Pre-commit hook:** `commit oldidan test va lint`
```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd backend && npm run test:ci
cd ../frontend && npm run lint
```

**Commit-msg hook:** `commit xabari formatini tekshirish`
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**`commitlint.config.js`:**
```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "test", "chore", "perf", "security", "ci", "revert"
    ]],
    "subject-max-length": [2, "always", 72],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  }
};
```

---

## 📁 .gitignore

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local
!.env.example

# Build
dist/
build/

# Logs
logs/
*.log
npm-debug.log*

# Uploads (local fayllar)
backend/uploads/
!backend/uploads/.gitkeep

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Testing
coverage/

# PM2
.pm2/
ecosystem.config.js.map
```

---

## ✅ Git Workflow Checklist

```
□ Branch nomi qoidaga mos (feature/fix/hotfix/chore)
□ Commit xabarlari Conventional Commits formatida
□ Har bir commit — bitta mantiqiy o'zgarish
□ PR yaratishdan oldin main dan rebase yoki merge
□ PR tavsifi to'liq (nima, nima uchun, qanday sinash)
□ Kamida 1 reviewer tomonidan approved
□ Test-lar o'tdi (CI green)
□ Merge dan keyin branch o'chirildi
□ Versiya tag qo'yildi (reliz da)
□ .env fayllar hech qachon commit qilinmagan
```
