export interface User {
  _id: string
  username: string
  phone: string
  firstName: string
  lastName: string
  bio: string
  avatar: string | null
  isOnline: boolean
  lastSeen: string | null
  createdAt: string
}

export type ChatType = 'private' | 'group' | 'channel'
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'system'

export interface Chat {
  _id: string
  type: ChatType
  name: string | null
  description: string
  avatar: string | null
  participants: User[]
  admins: string[]
  owner: string | null
  lastMessage: Message | null
  unreadCount: number
  isMuted: boolean
  createdAt: string
  updatedAt: string
}

export interface MediaData {
  url: string
  thumbnail: string | null
  filename: string
  filesize: number
  mimetype: string
  duration: number | null
  width: number | null
  height: number | null
}

export interface Message {
  _id: string
  chat: string
  sender: User
  type: MessageType
  text: string
  media: MediaData | null
  replyTo: Message | null
  readBy: string[]
  isEdited: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  error?: { code: string; message: string }
}
