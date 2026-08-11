import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Chat } from '../models/Chat.model'
import { Message } from '../models/Message.model'
import { AppError } from '../utils/AppError'
import { catchAsync } from '../utils/catchAsync'

// GET /api/chats
export const getChats = catchAsync(async (req: Request, res: Response) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'username firstName lastName avatar isOnline lastSeen')
    .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'firstName' } })
    .sort({ updatedAt: -1 })
    .lean()

  // unreadCount — hozircha Map dan olish
  const result = chats.map((c) => ({
    ...c,
    unreadCount: c.unreadCounts?.get?.(req.user._id.toString()) ?? 0,
    isMuted: c.mutedBy?.some((id: mongoose.Types.ObjectId) => id.equals(req.user._id)) ?? false,
  }))

  res.json({ success: true, data: result })
})

// POST /api/chats/private
export const createPrivateChat = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body
  if (!userId) throw new AppError("userId talab qilinadi", 400)

  // Mavjudini tekshirish
  const existing = await Chat.findOne({
    type: 'private',
    participants: { $all: [req.user._id, userId], $size: 2 },
  })
    .populate('participants', 'username firstName lastName avatar isOnline lastSeen')
    .populate('lastMessage')

  if (existing) return res.json({ success: true, data: existing })

  const chat = await Chat.create({
    type: 'private',
    participants: [req.user._id, userId],
  })
  const populated = await chat.populate('participants', 'username firstName lastName avatar isOnline lastSeen')

  res.status(201).json({ success: true, data: populated })
})

// POST /api/chats/group
export const createGroupChat = catchAsync(async (req: Request, res: Response) => {
  const { name, participantIds, link } = req.body
  if (!name) throw new AppError("Guruh nomi talab qilinadi", 400)
  if (!Array.isArray(participantIds) || participantIds.length < 1)
    throw new AppError("Kamida 1 ta a'zo kerak", 400)

  // Ensure link doesn't contain '@' prefix in the database
  const cleanLink = link?.startsWith('@') ? link.substring(1).trim() : link?.trim()

  if (cleanLink) {
    const exists = await Chat.findOne({ link: cleanLink })
    if (exists) throw new AppError("Ushbu link (havola) allaqachon band", 409)
  }

  const allParticipants = [...new Set([req.user._id.toString(), ...participantIds])]

  const chat = await Chat.create({
    type: 'group',
    name,
    link: cleanLink || null,
    participants: allParticipants,
    admins: [req.user._id],
    owner: req.user._id,
  })

  const populated = await chat.populate('participants', 'username firstName lastName avatar isOnline lastSeen')
  res.status(201).json({ success: true, data: populated })
})

// POST /api/chats/channel
export const createChannelChat = catchAsync(async (req: Request, res: Response) => {
  const { name, description, participantIds, isPublic, link } = req.body
  if (!name) throw new AppError("Kanal nomi talab qilinadi", 400)
  
  const cleanLink = link?.startsWith('@') ? link.substring(1).trim() : link?.trim()

  if (cleanLink) {
    const exists = await Chat.findOne({ link: cleanLink })
    if (exists) throw new AppError("Ushbu link (havola) allaqachon band", 409)
  }

  // For channels, adding initial participants is optional
  const allParticipants = [...new Set([req.user._id.toString(), ...(Array.isArray(participantIds) ? participantIds : [])])]

  const chat = await Chat.create({
    type: 'channel',
    name,
    link: cleanLink || null,
    description: description || '',
    isPublic: !!isPublic,
    participants: allParticipants,
    admins: [req.user._id],
    owner: req.user._id,
  })

  const populated = await chat.populate('participants', 'username firstName lastName avatar isOnline lastSeen')
  res.status(201).json({ success: true, data: populated })
})

// GET /api/chats/:id
export const getChatById = catchAsync(async (req: Request, res: Response) => {
  const chat = await Chat.findOne({ _id: req.params.id, participants: req.user._id })
    .populate('participants', 'username firstName lastName avatar isOnline lastSeen')
    .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'firstName' } })

  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')
  res.json({ success: true, data: chat })
})

// DELETE /api/chats/:id
export const deleteChat = catchAsync(async (req: Request, res: Response) => {
  const chat = await Chat.findOne({ _id: req.params.id, participants: req.user._id })
  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')

  if (chat.type === 'group' && !chat.owner?.equals(req.user._id))
    throw new AppError("Faqat guruh egasi o'chira oladi", 403, 'FORBIDDEN')

  await Chat.findByIdAndDelete(chat._id)
  await Message.deleteMany({ chat: chat._id })

  res.json({ success: true, data: null, message: "Chat o'chirildi" })
})

// POST /api/chats/:id/mute
export const muteChat = catchAsync(async (req: Request, res: Response) => {
  const chat = await Chat.findOne({ _id: req.params.id, participants: req.user._id })
  if (!chat) throw new AppError('Chat topilmadi', 404, 'CHAT_NOT_FOUND')

  const isMuted = chat.mutedBy.some((id) => id.equals(req.user._id))
  if (isMuted) {
    await Chat.findByIdAndUpdate(chat._id, { $pull: { mutedBy: req.user._id } })
  } else {
    await Chat.findByIdAndUpdate(chat._id, { $addToSet: { mutedBy: req.user._id } })
  }

  res.json({ success: true, data: { muted: !isMuted } })
})

// GET /api/chats/search/public
export const searchPublicChats = catchAsync(async (req: Request, res: Response) => {
  const q = ((req.query.q || req.query.query) as string || '').trim()
  
  if (!q) {
    return res.json({ success: true, data: [] })
  }

  const cleanQ = q.startsWith('@') ? q.substring(1) : q

  const chats = await Chat.find({
    $or: [
      { link: { $regex: cleanQ, $options: 'i' } },
      { name: { $regex: q, $options: 'i' }, isPublic: true },
    ]
  }).select('name link type avatar isPublic description participants').limit(20)

  res.json({ success: true, data: chats })
})
