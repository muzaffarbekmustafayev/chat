import { Router } from 'express'
import { getMessages, sendMessage, sendMediaMessage, editMessage, deleteMessage, markRead } from '../controllers/message.controller'
import { protect } from '../middlewares/auth.middleware'
import { uploadMedia } from '../middlewares/upload.middleware'

const router = Router()
router.use(protect)

router.get('/:chatId', getMessages)
router.post('/:chatId', sendMessage)
router.post('/:chatId/media', uploadMedia.single('file'), sendMediaMessage)
router.put('/:messageId', editMessage)
router.delete('/:messageId', deleteMessage)
router.post('/:chatId/read', markRead)

export default router
