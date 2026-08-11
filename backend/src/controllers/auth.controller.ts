import { Request, Response } from 'express'
import { User } from '../models/User.model'
import { AppError } from '../utils/AppError'
import { catchAsync } from '../utils/catchAsync'
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils'
import { config } from '../config/env'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: config.IS_PROD,
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

// POST /api/auth/register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, phone, password, firstName, lastName } = req.body

  // Ensure username doesn't contain '@' prefix in the database
  const cleanUsername = username?.startsWith('@') ? username.substring(1) : username

  const exists = await User.findOne({ $or: [{ username: cleanUsername }, { phone }] })
  if (exists) throw new AppError("Username yoki telefon band", 409, 'DUPLICATE_KEY')

  const user = await User.create({ username: cleanUsername, phone, password, firstName, lastName: lastName || '' })
  const tokens = generateTokens(user._id.toString())

  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: tokens.refreshToken } })

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS)
  res.status(201).json({
    success: true,
    data: {
      token: tokens.accessToken,
      user: { _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
    },
  })
})

// POST /api/auth/login
export const login = catchAsync(async (req: Request, res: Response) => {
  const { phone, password } = req.body

  const user = await User.findOne({ phone }).select('+password +refreshTokens')
  if (!user || !(await user.comparePassword(password)))
    throw new AppError("Telefon yoki parol noto'g'ri", 401, 'INVALID_CREDENTIALS')

  const tokens = generateTokens(user._id.toString())
  user.refreshTokens.push(tokens.refreshToken)
  user.isOnline = true
  await user.save({ validateBeforeSave: false })

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS)
  res.json({
    success: true,
    data: {
      token: tokens.accessToken,
      user: { _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
    },
  })
})

// POST /api/auth/logout
export const logout = catchAsync(async (req: Request, res: Response) => {
  const rf = req.cookies?.refreshToken as string | undefined

  if (rf) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { refreshTokens: rf }, isOnline: false, lastSeen: new Date() })
  }

  res.clearCookie('refreshToken')
  res.json({ success: true, data: null, message: 'Chiqildi' })
})

// POST /api/auth/refresh
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const rf = req.cookies?.refreshToken as string | undefined
  if (!rf) throw new AppError('Refresh token topilmadi', 401, 'NO_TOKEN')

  const decoded = verifyRefreshToken(rf)
  const user = await User.findById(decoded.userId).select('+refreshTokens')
  if (!user || !user.refreshTokens.includes(rf))
    throw new AppError('Token yaroqsiz', 401, 'INVALID_TOKEN')

  // Rotate
  const tokens = generateTokens(user._id.toString())
  user.refreshTokens = user.refreshTokens.filter((t) => t !== rf)
  user.refreshTokens.push(tokens.refreshToken)
  await user.save({ validateBeforeSave: false })

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS)
  res.json({ success: true, data: { token: tokens.accessToken } })
})
