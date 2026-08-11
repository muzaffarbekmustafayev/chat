# 🧪 Testing — Testlash Strategiyasi

> **Stack:** Jest · Supertest · React Testing Library · Playwright

---

## 📊 Test Piramidasi

```
        /──────────\
       /  E2E Tests  \       ← Playwright (10%)
      /──────────────\
     /  Integration   \      ← Supertest + Jest (30%)
    /──────────────────\
   /    Unit Tests      \    ← Jest (60%)
  /──────────────────────\
```

---

## 📦 O'rnatish

```bash
# Backend
cd backend
npm install --save-dev jest supertest @types/jest mongodb-memory-server

# Frontend
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event vitest jsdom

# E2E
npm install --save-dev @playwright/test
npx playwright install
```

---

## ⚙️ Sozlash

### Backend — `jest.config.js`
```javascript
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterFramework: ["<rootDir>/src/__tests__/setup.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/migrations/**",
    "!src/server.js"
  ],
  coverageThreshold: {
    global: {
      branches:   70,
      functions:  80,
      lines:      80,
      statements: 80
    }
  }
};
```

### Backend — Test Setup
**File:** `backend/src/__tests__/setup.js`
```javascript
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Har test keyin DB tozalash
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

### Frontend — `vite.config.js` (test qo'shish)
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.js"],
    globals: true,
  }
});
```

---

## 🔧 Backend Unit Testlar

### Utils testi
**File:** `backend/src/__tests__/unit/jwt.utils.test.js`
```javascript
const { generateAccessToken, verifyToken } = require("../../utils/jwt.utils");

describe("JWT Utils", () => {
  const payload = { userId: "64abc123", username: "test_user" };

  test("Access token yaratiladi", () => {
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  test("Token to'g'ri decode qilinadi", () => {
    const token = generateAccessToken(payload);
    const decoded = verifyToken(token, "access");
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.username).toBe(payload.username);
  });

  test("Noto'g'ri token xato qaytaradi", () => {
    expect(() => verifyToken("invalid.token.here", "access"))
      .toThrow("Invalid token");
  });
});
```

---

### Controller testi (with mocks)
**File:** `backend/src/__tests__/unit/auth.controller.test.js`
```javascript
const authController = require("../../controllers/auth.controller");
const User = require("../../models/User.model");

jest.mock("../../models/User.model");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn().mockReturnThis(),
    };
  });

  describe("register()", () => {
    test("Mavjud username bilan ro'yxat → 409", async () => {
      User.findOne.mockResolvedValue({ _id: "existing" });

      req.body = {
        username: "existing_user",
        phone:    "+998901234567",
        password: "Test123!",
        firstName:"John"
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    test("To'g'ri ma'lumot bilan → 201 va token", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(true);

      req.body = {
        username:  "new_user",
        phone:     "+998901234567",
        password:  "Test123!",
        firstName: "John",
        lastName:  "Doe"
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ token: expect.any(String) })
        })
      );
    });
  });
});
```

---

## 🔗 Backend Integration Testlar

**File:** `backend/src/__tests__/integration/auth.routes.test.js`
```javascript
const request  = require("supertest");
const app      = require("../../app");
const User     = require("../../models/User.model");

describe("POST /api/auth/register", () => {
  const validUser = {
    username:  "testuser",
    phone:     "+998901234567",
    password:  "Test123!",
    firstName: "Test",
    lastName:  "User"
  };

  test("✅ To'g'ri ma'lumot → 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  test("❌ Takroriy ro'yxat → 409", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(409);
  });

  test("❌ Majburiy maydon yo'q → 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "only_username" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      username: "loginuser", phone: "+998909999999",
      password: "Test123!", firstName: "Login"
    });
  });

  test("✅ To'g'ri parol → 200 + token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      phone: "+998909999999", password: "Test123!"
    });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });

  test("❌ Noto'g'ri parol → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      phone: "+998909999999", password: "WrongPass!"
    });
    expect(res.status).toBe(401);
  });
});
```

---

### Himoyalangan Route testi
**File:** `backend/src/__tests__/integration/messages.routes.test.js`
```javascript
const request = require("supertest");
const app     = require("../../app");

describe("GET /api/messages/:chatId", () => {
  let token, chatId;

  beforeAll(async () => {
    // Foydalanuvchi yaratish va login
    const loginRes = await request(app).post("/api/auth/login")
      .send({ phone: "+998901234567", password: "Test123!" });
    token  = loginRes.body.data.token;
    chatId = "64abc123456789012345678";
  });

  test("❌ Token yo'q → 401", async () => {
    const res = await request(app).get(`/api/messages/${chatId}`);
    expect(res.status).toBe(401);
  });

  test("✅ Token bilan → 200", async () => {
    const res = await request(app)
      .get(`/api/messages/${chatId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("messages");
  });
});
```

---

## ⚛️ Frontend Unit Testlar

### Komponenti testi
**File:** `frontend/src/__tests__/MessageBubble.test.jsx`
```javascript
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import MessageBubble from "../../components/chat/MessageBubble";

const mockMessage = {
  _id: "msg1",
  text: "Salom, qalaysiz?",
  type: "text",
  sender: { _id: "user1", firstName: "Ali", avatar: null },
  readBy: [],
  isEdited: false,
  createdAt: new Date().toISOString(),
};

describe("MessageBubble", () => {
  test("Xabar matni ko'rsatiladi", () => {
    render(<MessageBubble message={mockMessage} isMine={false} />);
    expect(screen.getByText("Salom, qalaysiz?")).toBeInTheDocument();
  });

  test("O'z xabari o'ng tomonda (isMine=true)", () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isMine={true} />
    );
    expect(container.firstChild).toHaveClass("justify-end");
  });

  test("Boshqa xabari chap tomonda (isMine=false)", () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isMine={false} />
    );
    expect(container.firstChild).toHaveClass("justify-start");
  });

  test("Tahrirlangan xabar belgisi ko'rinadi", () => {
    render(
      <MessageBubble message={{ ...mockMessage, isEdited: true }} isMine={true} />
    );
    expect(screen.getByText("tahrirlangan")).toBeInTheDocument();
  });
});
```

### Hook testi
**File:** `frontend/src/__tests__/useAuth.test.js`
```javascript
import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useAuth } from "../../hooks/useAuth";
import { AuthProvider } from "../../context/AuthContext";

describe("useAuth", () => {
  test("Boshlang'ich holat: autentifikatsiya yo'q", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

## 🌐 E2E Testlar (Playwright)

**File:** `e2e/auth.spec.js`
```javascript
import { test, expect } from "@playwright/test";

test.describe("Autentifikatsiya", () => {
  test("Login sahifasi to'g'ri ko'rinadi", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await expect(page.locator("h1")).toContainText("Kirish");
    await expect(page.locator("#phone-input")).toBeVisible();
    await expect(page.locator("#password-input")).toBeVisible();
    await expect(page.locator("#login-btn")).toBeVisible();
  });

  test("To'g'ri ma'lumot bilan login → chat sahifasiga o'tadi", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await page.fill("#phone-input", "+998901234567");
    await page.fill("#password-input", "Test123!");
    await page.click("#login-btn");
    await expect(page).toHaveURL(/\/chat/);
  });

  test("Noto'g'ri parol → xato xabari", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await page.fill("#phone-input", "+998901234567");
    await page.fill("#password-input", "WrongPass!");
    await page.click("#login-btn");
    await expect(page.locator(".toast-error")).toBeVisible();
  });
});

test.describe("Chat oqimi", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("http://localhost:5173/login");
    await page.fill("#phone-input", "+998901234567");
    await page.fill("#password-input", "Test123!");
    await page.click("#login-btn");
    await page.waitForURL(/\/chat/);
  });

  test("Xabar yuborish", async ({ page }) => {
    await page.click(".chat-item:first-child");
    await page.fill(".message-textarea", "Salom! Bu test xabar.");
    await page.keyboard.press("Enter");
    await expect(page.locator(".msg-bubble-out").last())
      .toContainText("Salom! Bu test xabar.");
  });
});
```

---

## 📜 Test Skriptlari

### Backend `package.json`
```json
{
  "scripts": {
    "test":            "jest",
    "test:unit":       "jest --testPathPattern=unit",
    "test:integration":"jest --testPathPattern=integration",
    "test:watch":      "jest --watch",
    "test:coverage":   "jest --coverage",
    "test:ci":         "jest --ci --coverage --forceExit"
  }
}
```

### Frontend `package.json`
```json
{
  "scripts": {
    "test":          "vitest",
    "test:ui":       "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e":      "playwright test",
    "test:e2e:ui":   "playwright test --ui"
  }
}
```

---

## ✅ Test Checklist

```
□ Auth: register, login, logout, refresh token
□ Users: profil olish, yangilash, qidirish
□ Chats: yaratish, ro'yxat, tafsilot
□ Messages: yuborish, o'qish, tahrirlash, o'chirish
□ JWT: yaratish, tekshirish, muddati
□ Middleware: token yo'q, yaroqsiz token
□ Socket: connect, send message, typing
□ Frontend: MessageBubble, ChatItem, MessageInput
□ E2E: login flow, send message, logout
□ Coverage: ≥ 80% lines
```
