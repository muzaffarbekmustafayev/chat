import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model'
import { AppError } from '../utils/AppError'
import { catchAsync } from '../utils/catchAsync'
import { verifyAccessToken } from '../utils/jwt.utils'

export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) throw new AppError('Token taqdim etilmagan', 401, 'NO_TOKEN')

  const token = auth.split(' ')[1]
  const decoded = verifyAccessToken(token)

  const user = await User.findById(decoded.userId)
  if (!user) throw new AppError('Foydalanuvchi topilmadi', 401, 'USER_NOT_FOUND')

  req.user = user
  next()
})
