import { Router } from 'express'
import { getChats, createPrivateChat, createGroupChat, getChatById, deleteChat, muteChat } from '../controllers/chat.controller'
import { protect } from '../middlewares/auth.middleware'

const router = Router()
router.use(protect)

router.get('/', getChats)
router.post('/private', createPrivateChat)
router.post('/group', createGroupChat)
router.get('/:id', getChatById)
router.delete('/:id', deleteChat)
router.post('/:id/mute', muteChat)

export default router
