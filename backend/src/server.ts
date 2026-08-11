import './config/env' // env ni birinchi yuklash
import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app'
import { connectDB } from './config/db'
import { initSocket } from './services/socket.service'
import { config } from './config/env'
import { logger } from './utils/logger'

const bootstrap = async () => {
  await connectDB()

  const io = new Server({ cors: { origin: config.CLIENT_URL, credentials: true } })
  const app = createApp(io)
  const server = http.createServer(app)

  io.attach(server)
  initSocket(io)

  server.listen(config.PORT, () => {
    logger.info(`🚀 Server ishga tushdi: http://localhost:${config.PORT}`)
    logger.info(`📡 Socket.IO tayyor`)
    logger.info(`🌍 Muhit: ${config.NODE_ENV}`)
  })

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} — server to'xtatilmoqda...`)
    server.close(() => {
      logger.info('✅ Server to\'xtatildi')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('unhandledRejection', (err) => {
    logger.error('❌ Unhandled Rejection:', err)
    process.exit(1)
  })
}

bootstrap()
