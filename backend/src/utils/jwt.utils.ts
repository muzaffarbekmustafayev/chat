import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { JwtPayload, JwtTokens } from '../types'

export const generateTokens = (userId: string): JwtTokens => ({
  accessToken: jwt.sign({ userId }, config.JWT.ACCESS_SECRET, {
    expiresIn: config.JWT.ACCESS_EXPIRES as string,
  }),
  refreshToken: jwt.sign({ userId }, config.JWT.REFRESH_SECRET, {
    expiresIn: config.JWT.REFRESH_EXPIRES as string,
  }),
})

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, config.JWT.ACCESS_SECRET) as JwtPayload

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, config.JWT.REFRESH_SECRET) as JwtPayload
