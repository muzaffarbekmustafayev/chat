import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`❌ Kerakli .env o'zgaruvchilar topilmadi: ${missing.join(', ')}`)
  console.error('   cp .env.example .env — va to\'ldiring')
  process.exit(1)
}

export const config = {
  PORT: parseInt(process.env.PORT || '5000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_DEV: process.env.NODE_ENV === 'development',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',

  MONGODB_URI: process.env.MONGODB_URI as string,

  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '30d',
  },

  CLIENT_URL: process.env.CLIENT_URL as string,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/',
  AUTO_MIGRATE: process.env.AUTO_MIGRATE === 'true',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    AUTH_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10'),
  },
}
