import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { Server } from 'socket.io'

import { config } from './config/env'
import { errorMiddleware, notFound } from './middlewares/error.middleware'
import authRoutes    from './routes/auth.routes'
import userRoutes    from './routes/user.routes'
import chatRoutes    from './routes/chat.routes'
import messageRoutes from './routes/message.routes'

export const createApp = (io: Server) => {
  const app = express()

  // ── Security ──
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  }))

  // ── Rate limit ──
  app.use('/api/', rateLimit({
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    max: config.RATE_LIMIT.MAX,
    message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Juda ko\'p so\'rov' } },
    standardHeaders: true,
    legacyHeaders: false,
  }))
  app.use('/api/auth', rateLimit({
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    max: config.RATE_LIMIT.AUTH_MAX,
    skipSuccessfulRequests: true,
    message: { success: false, error: { code: 'TOO_MANY_ATTEMPTS', message: 'Juda ko\'p urinish' } },
  }))

  // ── Parsing ──
  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))
  app.use(cookieParser())
  app.use(mongoSanitize())

  // ── Logging ──
  if (config.IS_DEV) app.use(morgan('dev'))

  // ── Static files ──
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

  // ── Socket.IO instance — req.io ──
  app.use((req, _res, next) => { (req as any).io = io; next() })

  // ── Routes ──
  app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok', env: config.NODE_ENV } }))
  app.use('/api/auth',     authRoutes)
  app.use('/api/users',    userRoutes)
  app.use('/api/chats',    chatRoutes)
  app.use('/api/messages', messageRoutes)

  // ── Error ──
  app.use(notFound)
  app.use(errorMiddleware)

  return app
}
