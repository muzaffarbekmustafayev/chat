# 🔷 TypeScript — Sozlash va Tur Tizimi

> Backend (Node.js) va Frontend (React) uchun **TypeScript** to'liq konfiguratsiyasi.

---

## 📦 O'rnatish

### Backend
```bash
cd backend
npm install --save-dev typescript ts-node ts-node-dev \
  @types/node @types/express @types/bcryptjs \
  @types/jsonwebtoken @types/multer @types/cors \
  @types/morgan @types/jest @types/supertest
```

### Frontend
```bash
cd frontend
npm install --save-dev typescript @types/react @types/react-dom
```

---

## ⚙️ TypeScript Konfiguratsiya

### Backend — `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target":           "ES2022",
    "module":           "CommonJS",
    "lib":              ["ES2022"],
    "outDir":           "./dist",
    "rootDir":          "./src",
    "strict":           true,
    "esModuleInterop":  true,
    "skipLibCheck":     true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",

    /* Path aliases */
    "baseUrl": "./src",
    "paths": {
      "@controllers/*": ["controllers/*"],
      "@models/*":      ["models/*"],
      "@middlewares/*": ["middlewares/*"],
      "@services/*":    ["services/*"],
      "@utils/*":       ["utils/*"],
      "@config/*":      ["config/*"],
      "@types/*":       ["types/*"]
    },

    /* Dekorator (mongoose-typegoose uchun) */
    "experimentalDecorators":        true,
    "emitDecoratorMetadata":         true,

    /* Qo'shimcha tekshiruvlar */
    "noUnusedLocals":        true,
    "noUnusedParameters":    true,
    "noImplicitReturns":     true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Frontend — `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target":              "ES2020",
    "useDefineForClassFields": true,
    "lib":                 ["ES2020", "DOM", "DOM.Iterable"],
    "module":              "ESNext",
    "skipLibCheck":        true,
    "moduleResolution":    "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule":   true,
    "isolatedModules":     true,
    "noEmit":              true,
    "jsx":                 "react-jsx",
    "strict":              true,
    "noUnusedLocals":      true,
    "noUnusedParameters":  true,

    /* Path aliases */
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@pages/*":      ["pages/*"],
      "@store/*":      ["store/*"],
      "@hooks/*":      ["hooks/*"],
      "@api/*":        ["api/*"],
      "@utils/*":      ["utils/*"],
      "@types/*":      ["types/*"],
      "@context/*":    ["context/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Frontend — `frontend/tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite":        true,
    "skipLibCheck":     true,
    "module":           "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 📜 Package Scripts

### Backend `package.json`
```json
{
  "scripts": {
    "dev":        "ts-node-dev --respawn --transpile-only src/server.ts",
    "build":      "tsc --project tsconfig.json",
    "start":      "node dist/server.js",
    "type-check": "tsc --noEmit",
    "test":       "jest --config jest.config.ts",
    "lint":       "eslint src --ext .ts"
  }
}
```

### Frontend `package.json`
```json
{
  "scripts": {
    "dev":        "vite",
    "build":      "tsc && vite build",
    "type-check": "tsc --noEmit",
    "preview":    "vite preview",
    "lint":       "eslint src --ext .ts,.tsx"
  }
}
```

---

## 🏷️ Tur Ta'riflari (Type Definitions)

### Shared Types — `src/types/index.ts`
```typescript
import { Types, Document } from "mongoose";

// ============================================================
// FOYDALANUVCHI
// ============================================================
export interface IUser extends Document {
  _id:            Types.ObjectId;
  username:       string;
  phone:          string;
  password:       string;
  firstName:      string;
  lastName:       string;
  bio:            string;
  avatar:         string | null;
  isOnline:       boolean;
  lastSeen:       Date | null;
  socketId:       string | null;
  refreshTokens:  string[];
  contacts:       Types.ObjectId[];
  blockedUsers:   Types.ObjectId[];
  pushSubscriptions: IPushSubscription[];
  createdAt:      Date;
  updatedAt:      Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPushSubscription {
  endpoint:       string;
  expirationTime: Date | null;
  keys: {
    p256dh: string;
    auth:   string;
  };
}

// Public (parolsiz) User
export type IPublicUser = Omit<
  IUser,
  "password" | "refreshTokens" | "socketId" | "pushSubscriptions"
>;

// ============================================================
// CHAT
// ============================================================
export type ChatType = "private" | "group" | "channel";

export interface IChat extends Document {
  _id:          Types.ObjectId;
  type:         ChatType;
  name:         string | null;
  description:  string;
  avatar:       string | null;
  participants: Types.ObjectId[] | IPublicUser[];
  admins:       Types.ObjectId[];
  owner:        Types.ObjectId | null;
  lastMessage:  Types.ObjectId | IMessage | null;
  unreadCounts: Map<string, number>;
  mutedBy:      Types.ObjectId[];
  isPinned:     Map<string, boolean>;
  createdAt:    Date;
  updatedAt:    Date;
}

// ============================================================
// XABAR
// ============================================================
export type MessageType = "text" | "image" | "video" | "audio" | "document" | "sticker" | "system";

export interface IMediaData {
  url:       string;
  thumbnail: string | null;
  filename:  string;
  filesize:  number;
  mimetype:  string;
  duration:  number | null;
  width:     number | null;
  height:    number | null;
}

export interface IMessage extends Document {
  _id:         Types.ObjectId;
  chat:        Types.ObjectId | IChat;
  sender:      Types.ObjectId | IPublicUser;
  type:        MessageType;
  text:        string;
  media:       IMediaData | null;
  replyTo:     Types.ObjectId | IMessage | null;
  forwardedFrom: {
    user:    Types.ObjectId | null;
    chat:    Types.ObjectId | null;
    messageId: Types.ObjectId | null;
  } | null;
  readBy:      Types.ObjectId[];
  isEdited:    boolean;
  isDeleted:   boolean;
  deletedFor:  Types.ObjectId[];
  createdAt:   Date;
  updatedAt:   Date;
}

// ============================================================
// API JAVOB FORMATI
// ============================================================
export interface ApiResponse<T = unknown> {
  success: true;
  data:    T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code:     string;
    message:  string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================
// JWT
// ============================================================
export interface JwtPayload {
  userId: string;
  iat?:   number;
  exp?:   number;
}

export interface JwtTokens {
  accessToken:  string;
  refreshToken: string;
}

// ============================================================
// PAGINATION
// ============================================================
export interface PaginationResult<T> {
  items:      T[];
  total:      number;
  page:       number;
  limit:      number;
  hasMore:    boolean;
  nextCursor: string | null;
}

// ============================================================
// SOCKET.IO HODISALAR
// ============================================================
export interface ServerToClientEvents {
  new_message:      (message: IMessage) => void;
  message_edited:   (data: { messageId: string; text: string; isEdited: boolean; updatedAt: Date }) => void;
  message_deleted:  (data: { messageId: string; chatId: string; deletedFor: "me" | "everyone" }) => void;
  user_typing:      (data: { chatId: string; userId: string; username: string }) => void;
  user_stop_typing: (data: { chatId: string; userId: string }) => void;
  message_read:     (data: { chatId: string; userId: string; lastReadMessageId: string }) => void;
  user_online:      (data: { userId: string; isOnline: true }) => void;
  user_offline:     (data: { userId: string; isOnline: false; lastSeen: Date }) => void;
  new_chat:         (chat: IChat) => void;
  chat_updated:     (data: { chatId: string; changes: Partial<IChat> }) => void;
  error:            (data: { code: string; message: string }) => void;
}

export interface ClientToServerEvents {
  join_chat:    (data: { chatId: string }) => void;
  leave_chat:   (data: { chatId: string }) => void;
  send_message: (data: { chatId: string; type: MessageType; text?: string; replyTo?: string }) => void;
  typing_start: (data: { chatId: string }) => void;
  typing_stop:  (data: { chatId: string }) => void;
  mark_read:    (data: { chatId: string; lastMessageId: string }) => void;
  edit_message: (data: { messageId: string; text: string }) => void;
  delete_message:(data: { messageId: string; chatId: string; deleteFor: "me" | "everyone" }) => void;
}
```

---

## 🔧 Backend TypeScript

### Express Request kengaytirish
**File:** `backend/src/types/express.d.ts`
```typescript
import { IUser } from "./index";
import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user: IUser;       // protect middleware qo'shadi
      io:   Server;      // Socket.IO instance
    }
  }
}

export {};
```

### Mongoose Model TypeScript
**File:** `backend/src/models/User.model.ts`
```typescript
import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@types/index";

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username:  { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 32 },
    phone:     { type: String, required: true, unique: true, trim: true },
    password:  { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true, maxlength: 64 },
    lastName:  { type: String, default: "", trim: true, maxlength: 64 },
    bio:       { type: String, default: "", maxlength: 255 },
    avatar:    { type: String, default: null },
    isOnline:  { type: Boolean, default: false },
    lastSeen:  { type: Date, default: null },
    socketId:  { type: String, default: null, select: false },
    refreshTokens: { type: [String], default: [], select: false },
    contacts:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pushSubscriptions: [{
      endpoint:       String,
      expirationTime: Date,
      keys: { p256dh: String, auth: String }
    }],
  },
  { timestamps: true }
);

// Instance method
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook
UserSchema.pre<IUser>("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Indekslar
UserSchema.index({ phone: 1 });
UserSchema.index({ username: "text", firstName: "text", lastName: "text" });

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);
```

### Controller TypeScript
**File:** `backend/src/controllers/auth.controller.ts`
```typescript
import { Request, Response, NextFunction } from "express";
import { User } from "@models/User.model";
import { generateTokens } from "@utils/jwt.utils";
import { AppError } from "@utils/AppError";
import { catchAsync } from "@utils/catchAsync";
import type { ApiResponse, JwtTokens } from "@types/index";

interface RegisterBody {
  username:  string;
  phone:     string;
  password:  string;
  firstName: string;
  lastName?: string;
}

interface LoginBody {
  phone:    string;
  password: string;
}

// Ro'yxatdan o'tish
export const register = catchAsync(
  async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
    const { username, phone, password, firstName, lastName } = req.body;

    // Mavjudligini tekshirish
    const existing = await User.findOne({ $or: [{ username }, { phone }] });
    if (existing) {
      throw new AppError("Username yoki telefon raqam band", 409, "DUPLICATE_KEY");
    }

    const user = await User.create({
      username, phone, password, firstName, lastName: lastName || ""
    });

    const tokens = generateTokens(user._id.toString());

    // Refresh tokenni saqlash
    user.refreshTokens = [tokens.refreshToken];
    await user.save({ validateBeforeSave: false });

    const response: ApiResponse<{ user: typeof user; token: string }> = {
      success: true,
      data: {
        user,
        token: tokens.accessToken,
      }
    };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(response);
  }
);

// Kirish
export const login = catchAsync(
  async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Telefon yoki parol noto'g'ri", 401, "INVALID_CREDENTIALS");
    }

    const tokens = generateTokens(user._id.toString());
    user.refreshTokens.push(tokens.refreshToken);
    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { user, token: tokens.accessToken }
    });
  }
);
```

### Middleware TypeScript
**File:** `backend/src/middlewares/auth.middleware.ts`
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@models/User.model";
import { AppError } from "@utils/AppError";
import { catchAsync } from "@utils/catchAsync";
import type { JwtPayload } from "@types/index";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Token taqdim etilmagan", 401, "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("Foydalanuvchi topilmadi", 401, "USER_NOT_FOUND");
    }

    req.user = user;
    next();
  }
);

// Admin tekshirish
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Keyinroq role tizimi qo'shilganda
    next();
  };
};
```

### catchAsync utility
**File:** `backend/src/utils/catchAsync.ts`
```typescript
import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (fn: AsyncHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
```

### AppError TypeScript
**File:** `backend/src/utils/AppError.ts`
```typescript
export class AppError extends Error {
  public statusCode: number;
  public status:     "fail" | "error";
  public code:       string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);

    this.statusCode    = statusCode;
    this.status        = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.code          = code || this.getDefaultCode(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  private getDefaultCode(statusCode: number): string {
    const codes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_ERROR",
    };
    return codes[statusCode] || "ERROR";
  }
}
```

---

## ⚛️ Frontend TypeScript

### Redux Store Turlari
**File:** `frontend/src/types/index.ts`
```typescript
// API turlari (backend dan ko'chirilgan)
export interface User {
  _id:       string;
  username:  string;
  phone:     string;
  firstName: string;
  lastName:  string;
  bio:       string;
  avatar:    string | null;
  isOnline:  boolean;
  lastSeen:  string | null;
  createdAt: string;
}

export type ChatType = "private" | "group" | "channel";
export type MessageType = "text" | "image" | "video" | "audio" | "document" | "sticker";

export interface Chat {
  _id:          string;
  type:         ChatType;
  name:         string | null;
  description:  string;
  avatar:       string | null;
  participants: User[];
  admins:       string[];
  lastMessage:  Message | null;
  unreadCount:  number;
  isMuted:      boolean;
  createdAt:    string;
  updatedAt:    string;
}

export interface MediaData {
  url:       string;
  thumbnail: string | null;
  filename:  string;
  filesize:  number;
  mimetype:  string;
  duration:  number | null;
  width:     number | null;
  height:    number | null;
}

export interface Message {
  _id:       string;
  chat:      string;
  sender:    User;
  type:      MessageType;
  text:      string;
  media:     MediaData | null;
  replyTo:   Message | null;
  readBy:    string[];
  isEdited:  boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Redux State turlari
export interface AuthState {
  user:            User | null;
  token:           string | null;
  isAuthenticated: boolean;
  loading:         boolean;
  error:           string | null;
}

export interface ChatState {
  chats:         Chat[];
  activeChat:    Chat | null;
  loading:       boolean;
  searchResults: User[];
}

export interface MessageState {
  messagesByChatId: Record<string, {
    messages: Message[];
    hasMore:  boolean;
    loading:  boolean;
  }>;
  typingUsers: Record<string, string[]>;
}

export interface RootState {
  auth:     AuthState;
  chat:     ChatState;
  messages: MessageState;
}
```

### Redux Slice TypeScript
**File:** `frontend/src/store/authSlice.ts`
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@types/index";
import { authApi } from "@api/auth.api";

const initialState: AuthState = {
  user:            null,
  token:           localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading:         false,
  error:           null,
};

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { phone: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("accessToken", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || "Kirish xatosi");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading        = false;
        state.user           = action.payload.user;
        state.token          = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? "Noma'lum xato";
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Komponent Props TypeScript
**File:** `frontend/src/components/chat/MessageBubble.tsx`
```typescript
import React, { FC, memo } from "react";
import type { Message, User } from "@types/index";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  isMine:  boolean;
  onReply?:(message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?(message: Message): void;
}

const MessageBubble: FC<MessageBubbleProps> = memo(
  ({ message, isMine, onReply, onEdit, onDelete }) => {
    const formattedTime = format(
      new Date(message.createdAt), "HH:mm", { locale: uz }
    );

    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
        <div className={isMine ? "msg-bubble-out" : "msg-bubble-in"}>
          {message.replyTo && (
            <ReplyPreview reply={message.replyTo} />
          )}

          {message.type === "text" && (
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
          )}

          {message.type === "image" && message.media && (
            <img
              src={message.media.url}
              alt="rasm"
              className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          )}

          <div className="flex items-center gap-1 justify-end mt-1">
            {message.isEdited && (
              <span className="text-[11px] text-tg-muted">tahrirlangan</span>
            )}
            <span className="text-[11px] text-tg-muted opacity-80">
              {formattedTime}
            </span>
            {isMine && <ReadTicks readBy={message.readBy} />}
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.message._id                  === next.message._id &&
    prev.message.isEdited             === next.message.isEdited &&
    prev.message.readBy?.length       === next.message.readBy?.length
);

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
```

### Custom Hook TypeScript
**File:** `frontend/src/hooks/useSocket.ts`
```typescript
import { useEffect, useContext } from "react";
import { SocketContext } from "@context/SocketContext";
import type { ServerToClientEvents } from "@types/index";

type SocketEvent = keyof ServerToClientEvents;

export function useSocket<E extends SocketEvent>(
  event: E,
  handler: ServerToClientEvents[E]
): void {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on(event as string, handler as (...args: any[]) => void);
    return () => {
      socket.off(event as string, handler as (...args: any[]) => void);
    };
  }, [socket, event, handler]);
}
```

### API Service TypeScript
**File:** `frontend/src/api/auth.api.ts`
```typescript
import api from "./axios";
import type { ApiResponse, User } from "@types/index";

interface LoginPayload  { phone: string; password: string; }
interface LoginResponse { user: User; token: string; refreshToken: string; }

interface RegisterPayload {
  username: string; phone: string; password: string;
  firstName: string; lastName?: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterPayload) =>
    api.post<ApiResponse<LoginResponse>>("/auth/register", data),

  logout: () =>
    api.post<ApiResponse<null>>("/auth/logout"),

  refresh: () =>
    api.post<ApiResponse<{ token: string }>>("/auth/refresh"),

  getMe: () =>
    api.get<ApiResponse<User>>("/users/me"),
};
```

---

## 🔷 Vite Path Aliases

**File:** `frontend/vite.config.ts`
```typescript
import { defineConfig }  from "vite";
import react             from "@vitejs/plugin-react";
import path              from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages":      path.resolve(__dirname, "src/pages"),
      "@store":      path.resolve(__dirname, "src/store"),
      "@hooks":      path.resolve(__dirname, "src/hooks"),
      "@api":        path.resolve(__dirname, "src/api"),
      "@utils":      path.resolve(__dirname, "src/utils"),
      "@types":      path.resolve(__dirname, "src/types"),
      "@context":    path.resolve(__dirname, "src/context"),
    }
  },
  test: {
    environment: "jsdom",
    setupFiles:  ["./src/__tests__/setup.ts"],
    globals:     true,
  }
});
```

---

## 🔍 ESLint TypeScript

**File:** `.eslintrc.json` (backend va frontend uchun)
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": "latest"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any":         "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars":          ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-non-null-assertion":   "warn",
    "no-console":                                  "warn"
  }
}
```

```bash
npm install --save-dev \
  eslint @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin
```

---

## 📁 To'liq Papka Tuzilmasi (TypeScript bilan)

```
backend/src/
├── types/
│   ├── index.ts          # Barcha interface-lar
│   └── express.d.ts      # Request kengaytirish
├── config/
│   ├── db.ts
│   └── env.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── chat.controller.ts
│   └── message.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── upload.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── User.model.ts
│   ├── Chat.model.ts
│   └── Message.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── chat.routes.ts
│   └── message.routes.ts
├── services/
│   ├── socket.service.ts
│   ├── media.service.ts
│   └── notification.service.ts
├── utils/
│   ├── AppError.ts
│   ├── catchAsync.ts
│   ├── jwt.utils.ts
│   └── logger.ts
├── migrations/
│   └── ...
├── app.ts
└── server.ts

frontend/src/
├── types/
│   └── index.ts          # Frontend turlari
├── api/
│   ├── axios.ts
│   ├── auth.api.ts
│   ├── chat.api.ts
│   └── message.api.ts
├── components/
│   ├── common/
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   └── ErrorBoundary.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── ChatList.tsx
│   │   └── ChatItem.tsx
│   └── chat/
│       ├── ChatWindow.tsx
│       ├── MessageBubble.tsx
│       └── MessageInput.tsx
├── context/
│   ├── AuthContext.tsx
│   └── SocketContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSocket.ts
│   └── useMessages.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ChatPage.tsx
├── store/
│   ├── index.ts
│   ├── authSlice.ts
│   ├── chatSlice.ts
│   └── messageSlice.ts
├── utils/
│   ├── dateFormat.ts
│   └── fileType.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## ✅ TypeScript Checklist

```
□ backend/tsconfig.json to'g'ri sozlangan
□ frontend/tsconfig.json to'g'ri sozlangan
□ Path aliases backend va frontendda ishlayapti
□ src/types/index.ts barcha interface-larni o'z ichiga olgan
□ express.d.ts — Request.user va Request.io typed
□ Mongoose modellar generic type bilan
□ Controller-lar Request<P,B,Q> bilan typed
□ Redux state turlari RootState da
□ createAsyncThunk uchun 3 ta generic tur
□ Socket.IO hodisalari typed
□ API funksiyalar return type bilan
□ Props interface-lar barcha komponentlarda
□ any ishlatilmagan (yoki warn bilan chegaralangan)
□ ESLint @typescript-eslint qoidalari
□ npm run type-check xatosiz o'tadi
□ npm run build muvaffaqiyatli
```
