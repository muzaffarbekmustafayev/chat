import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, logout, refresh } from '../controllers/auth.controller'
import { protect } from '../middlewares/auth.middleware'

const router = Router()

const registerRules = [
  body('username').trim().isLength({ min: 3, max: 32 }).matches(/^[a-zA-Z0-9_]+$/),
  body('phone').trim().matches(/^\+[0-9]{7,15}$/),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
]

const loginRules = [
  body('phone').trim().notEmpty(),
  body('password').notEmpty(),
]

router.post('/register', registerRules, register)
router.post('/login', loginRules, login)
router.post('/logout', protect, logout)
router.post('/refresh', refresh)

export default router
