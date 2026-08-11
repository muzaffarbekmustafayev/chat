import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Message } from '../models/Message.model'
import { Chat } from '../models/Chat.model'
import { AppError } from '../utils/AppError'
import { catchAsync } from '../utils/catchAsync'
import { config } from '../config/env'

// GET /api/messages/:chatId?before=<id>&limit=50
export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params
  const { before, limit = '50' } = req.query

  const chat = await Chat.findOne({ _id: chatId, participants: req.user._id })
  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')

  const query: Record<string, unknown> = { chat: chatId, isDeleted: false }
  if (before) query._id = { $lt: new mongoose.Types.ObjectId(before as string) }

  const lim = Math.min(parseInt(limit as string), 100)
  const messages = await Message.find(query)
    .populate('sender', 'username firstName lastName avatar')
    .populate({ path: 'replyTo', populate: { path: 'sender', select: 'firstName' } })
    .sort({ _id: -1 })
    .limit(lim)
    .lean()

  // O'qilmagan soni reset
  await Chat.findByIdAndUpdate(chatId, { [`unreadCounts.${req.user._id}`]: 0 })

  res.json({
    success: true,
    data: {
      messages: messages.reverse(),
      hasMore: messages.length === lim,
      nextCursor: messages.length === lim ? messages[0]?._id : null,
    },
  })
})

// POST /api/messages/:chatId
export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params
  const { text, type = 'text', replyTo } = req.body

  const chat = await Chat.findOne({ _id: chatId, participants: req.user._id })
  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')
  if (!text?.trim()) throw new AppError('Xabar matni bo\'sh', 400)

  const message = await Message.create({ chat: chatId, sender: req.user._id, type, text: text.trim(), replyTo: replyTo || null })
  await message.populate('sender', 'username firstName lastName avatar')
  if (message.replyTo) await message.populate({ path: 'replyTo', populate: { path: 'sender', select: 'firstName' } })

  // LastMessage va unread yangilash
  const unreadUpdate: Record<string, number> = {}
  chat.participants.forEach((pId) => {
    if (!pId.equals(req.user._id)) unreadUpdate[`unreadCounts.${pId}`] = 1
  })

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date(), $inc: unreadUpdate })

  // Socket — req.io orqali
  req.io.to(`chat:${chatId}`).emit('new_message', message)

  res.status(201).json({ success: true, data: message })
})

// POST /api/messages/:chatId/media
export const sendMediaMessage = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params
  const file = req.file
  if (!file) throw new AppError('Fayl yuklanmadi', 400)

  const chat = await Chat.findOne({ _id: chatId, participants: req.user._id })
  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')

  let mediaType: 'image'|'video'|'audio'|'document' = 'document'
  if (file.mimetype.startsWith('image/')) mediaType = 'image'
  if (file.mimetype.startsWith('video/')) mediaType = 'video'
  if (file.mimetype.startsWith('audio/')) mediaType = 'audio'

  const fileUrl = `${config.SERVER_URL}/${file.path.replace(/\\/g, '/')}`

  const message = await Message.create({
    chat: chatId,
    sender: req.user._id,
    type: mediaType,
    text: req.body.caption || '',
    replyTo: req.body.replyTo || null,
    media: { url: fileUrl, filename: file.originalname, filesize: file.size, mimetype: file.mimetype, thumbnail: null, duration: null, width: null, height: null },
  })
  await message.populate('sender', 'username firstName lastName avatar')

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date() })
  req.io.to(`chat:${chatId}`).emit('new_message', message)

  res.status(201).json({ success: true, data: message })
})

// PUT /api/messages/:messageId
export const editMessage = catchAsync(async (req: Request, res: Response) => {
  const { messageId } = req.params
  const { text } = req.body

  const message = await Message.findOne({ _id: messageId, sender: req.user._id, type: 'text', isDeleted: false })
  if (!message) throw new AppError('Xabar topilmadi', 404)

  message.text = text.trim()
  message.isEdited = true
  await message.save()

  req.io.to(`chat:${message.chat}`).emit('message_edited', { messageId, text: message.text, isEdited: true, updatedAt: message.updatedAt })
  res.json({ success: true, data: message })
})

// DELETE /api/messages/:messageId
export const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const { messageId } = req.params
  const { deleteFor = 'me' } = req.body

  const message = await Message.findOne({ _id: messageId })
  if (!message) throw new AppError('Xabar topilmadi', 404)

  const isOwner = message.sender.equals(req.user._id)

  if (deleteFor === 'everyone' && isOwner) {
    message.isDeleted = true
    message.text = ''
    await message.save()
    req.io.to(`chat:${message.chat}`).emit('message_deleted', { messageId, chatId: message.chat, deletedFor: 'everyone' })
  } else {
    await Message.findByIdAndUpdate(messageId, { $addToSet: { deletedFor: req.user._id } })
    req.io.to(`user:${req.user._id}`).emit('message_deleted', { messageId, chatId: message.chat, deletedFor: 'me' })
  }

  res.json({ success: true, data: null })
})

// POST /api/messages/:chatId/read
export const markRead = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params
  const { lastMessageId } = req.body

  await Message.updateMany(
    { chat: chatId, readBy: { $ne: req.user._id }, _id: { $lte: new mongoose.Types.ObjectId(lastMessageId) } },
    { $addToSet: { readBy: req.user._id } }
  )
  await Chat.findByIdAndUpdate(chatId, { [`unreadCounts.${req.user._id}`]: 0 })

  req.io.to(`chat:${chatId}`).emit('message_read', { chatId, userId: req.user._id.toString(), lastReadMessageId: lastMessageId })
  res.json({ success: true, data: null })
})
