import mongoose from 'mongoose'
import { config } from './env'
import { logger } from '../utils/logger'

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.MONGODB_URI)
    logger.info('✅ MongoDB ulandi')

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB xatosi:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB uzildi, qayta ulanmoqda...')
    })
  } catch (err) {
    logger.error('❌ MongoDB ulanish xatosi:', err)
    process.exit(1)
  }
}
