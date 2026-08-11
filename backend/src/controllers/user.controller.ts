import { Request, Response } from 'express'
import { User } from '../models/User.model'
import { AppError } from '../utils/AppError'
import { catchAsync } from '../utils/catchAsync'
import { config } from '../config/env'

// GET /api/users/me
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id)
  res.json({ success: true, data: user })
})

// PUT /api/users/me
export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, bio, username } = req.body
  const update: Record<string, unknown> = {}
  if (firstName) update.firstName = firstName
  if (lastName !== undefined) update.lastName = lastName
  if (bio !== undefined) update.bio = bio
  if (username) {
    const exists = await User.findOne({ username, _id: { $ne: req.user._id } })
    if (exists) throw new AppError('Bu username band', 409, 'DUPLICATE_KEY')
    update.username = username
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true })
  res.json({ success: true, data: user })
})

// PUT /api/users/me/avatar
export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('Rasm yuklanmadi', 400, 'NO_FILE')
  const avatarUrl = `${config.SERVER_URL}/${req.file.path.replace(/\\/g, '/')}`
  const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true })
  res.json({ success: true, data: user })
})

// GET /api/users/search?q=ali
export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const q = ((req.query.q || req.query.query) as string || '').trim()
  
  const query: any = { _id: { $ne: req.user._id } }
  
  if (q) {
    if (q.startsWith('@')) {
      // Strictly search by username if it starts with @
      const cleanQ = q.substring(1)
      query.username = { $regex: cleanQ, $options: 'i' }
    } else {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { phone: q },
      ]
    }
  }

  const users = await User.find(query)
    .select('username firstName lastName avatar isOnline lastSeen')
    .limit(20)

  res.json({ success: true, data: users })
})

// GET /api/users/:id
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-refreshTokens -socketId -password')
  if (!user) throw new AppError('Foydalanuvchi topilmadi', 404, 'USER_NOT_FOUND')
  res.json({ success: true, data: user })
})
