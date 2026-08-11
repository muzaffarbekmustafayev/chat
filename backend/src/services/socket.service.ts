import { Server, Socket } from 'socket.io'
import { verifyAccessToken } from '../utils/jwt.utils'
import { User } from '../models/User.model'
import { logger } from '../utils/logger'

interface AuthSocket extends Socket {
  userId?: string
}

export const initSocket = (io: Server): void => {
  // Auth middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined
      if (!token) return next(new Error('Token taqdim etilmagan'))
      const decoded = verifyAccessToken(token)
      socket.userId = decoded.userId
      next()
    } catch {
      next(new Error('Token yaroqsiz'))
    }
  })

  io.on('connection', async (socket: AuthSocket) => {
    const userId = socket.userId!
    logger.info(`🔌 Socket ulandi: ${userId}`)

    // Foydalanuvchi personal room
    socket.join(`user:${userId}`)

    // Online
    await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id })
    socket.broadcast.emit('user_online', { userId, isOnline: true })

    // ── Chatga qo'shilish ──
    socket.on('join_chat', ({ chatId }: { chatId: string }) => {
      socket.join(`chat:${chatId}`)
    })

    socket.on('leave_chat', ({ chatId }: { chatId: string }) => {
      socket.leave(`chat:${chatId}`)
    })

    // ── Yozmoqda ──
    socket.on('typing_start', ({ chatId }: { chatId: string }) => {
      socket.to(`chat:${chatId}`).emit('user_typing', { chatId, userId, username: '' })
    })

    socket.on('typing_stop', ({ chatId }: { chatId: string }) => {
      socket.to(`chat:${chatId}`).emit('user_stop_typing', { chatId, userId })
    })

    // ── Disconnect ──
    socket.on('disconnect', async () => {
      logger.info(`🔌 Socket uzildi: ${userId}`)
      const lastSeen = new Date()
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen, socketId: null })
      socket.broadcast.emit('user_offline', { userId, isOnline: false, lastSeen })
    })
  })
}
