import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import { config } from '../config/env'

const handleCastError = (err: any) =>
  new AppError(`Noto'g'ri qiymat: ${err.path}`, 400, 'INVALID_ID')

const handleDuplicateKey = (err: any) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field'
  return new AppError(`${field} allaqachon mavjud`, 409, 'DUPLICATE_KEY')
}

const handleValidationError = (err: any) => {
  const msg = Object.values(err.errors as Record<string, { message: string }>)
    .map((e) => e.message)
    .join('. ')
  return new AppError(msg, 400, 'VALIDATION_ERROR')
}

const handleJWT = () => new AppError('Token yaroqsiz', 401, 'INVALID_TOKEN')
const handleJWTExpired = () => new AppError('Token muddati tugagan', 401, 'TOKEN_EXPIRED')

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500

  logger.error({ message: err.message, code: err.code, path: req.path, stack: err.stack })

  let error = err

  if (err.name === 'CastError')         error = handleCastError(err)
  if (err.code === 11000)               error = handleDuplicateKey(err)
  if (err.name === 'ValidationError')   error = handleValidationError(err)
  if (err.name === 'JsonWebTokenError') error = handleJWT()
  if (err.name === 'TokenExpiredError') error = handleJWTExpired()

  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message },
    })
    return
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.IS_DEV ? err.message : 'Server xatosi yuz berdi',
      ...(config.IS_DEV && { stack: err.stack }),
    },
  })
}

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route topilmadi: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'))
}
