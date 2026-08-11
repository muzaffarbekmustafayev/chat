import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
import { AppError } from '../utils/AppError'
import { config } from '../config/env'

const ALLOWED = [
  'image/jpeg','image/png','image/webp','image/gif',
  'video/mp4','video/webm',
  'audio/mpeg','audio/ogg','audio/wav','audio/webm',
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

const getDir = (mime: string): string => {
  if (mime.startsWith('image/')) return 'uploads/images'
  if (mime.startsWith('video/')) return 'uploads/videos'
  if (mime.startsWith('audio/')) return 'uploads/audio'
  return 'uploads/documents'
}

// Papkalarni yaratish
;['uploads/avatars','uploads/images','uploads/videos','uploads/audio','uploads/documents','uploads/thumbnails']
  .forEach((d) => fs.mkdirSync(d, { recursive: true }))

const storage = multer.diskStorage({
  destination: (_req, file, cb) => cb(null, getDir(file.mimetype)),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = crypto.randomBytes(20).toString('hex') + ext
    cb(null, name)
  },
})

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/avatars'),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = crypto.randomBytes(16).toString('hex') + ext
    cb(null, name)
  },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED.includes(file.mimetype)) cb(null, true)
  else cb(new AppError(`Ruxsat etilmagan fayl turi: ${file.mimetype}`, 400, 'INVALID_FILE_TYPE') as any, false)
}

const avatarFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype)
  if (ok) cb(null, true)
  else cb(new AppError('Faqat rasm fayllari ruxsat etilgan', 400, 'INVALID_FILE_TYPE') as any, false)
}

export const uploadMedia  = multer({ storage, fileFilter, limits: { fileSize: config.MAX_FILE_SIZE } })
export const uploadAvatar = multer({ storage: avatarStorage, fileFilter: avatarFilter, limits: { fileSize: 5 * 1024 * 1024 } })
