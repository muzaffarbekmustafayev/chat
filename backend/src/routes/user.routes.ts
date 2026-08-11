import { Router } from 'express'
import { getMe, updateMe, updateAvatar, searchUsers, getUserById } from '../controllers/user.controller'
import { protect } from '../middlewares/auth.middleware'
import { uploadAvatar } from '../middlewares/upload.middleware'

const router = Router()
router.use(protect)

router.get('/me', getMe)
router.put('/me', updateMe)
router.put('/me/avatar', uploadAvatar.single('avatar'), updateAvatar)
router.get('/search', searchUsers)
router.get('/:id', getUserById)

export default router
