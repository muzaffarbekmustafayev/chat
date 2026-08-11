import { Types, Document } from 'mongoose'

// ── USER ──────────────────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId
  username: string
  phone: string
  password: string
  firstName: string
  lastName: string
  bio: string
  avatar: string | null
  isOnline: boolean
  lastSeen: Date | null
  socketId: string | null
  refreshTokens: string[]
  contacts: Types.ObjectId[]
  blockedUsers: Types.ObjectId[]
  pushSubscriptions: IPushSubscription[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

export interface IPushSubscription {
  endpoint: string
  expirationTime: Date | null
  keys: { p256dh: string; auth: string }
}

export type IPublicUser = Pick<
  IUser,
  '_id' | 'username' | 'firstName' | 'lastName' | 'bio' | 'avatar' | 'isOnline' | 'lastSeen' | 'createdAt'
>

// ── CHAT ──────────────────────────────────────────────────────
export type ChatType = 'private' | 'group' | 'channel'

export interface IChat extends Document {
  _id: Types.ObjectId
  type: ChatType
  name: string | null
  description: string
  avatar: string | null
  participants: Types.ObjectId[]
  admins: Types.ObjectId[]
  owner: Types.ObjectId | null
  lastMessage: Types.ObjectId | null
  unreadCounts: Map<string, number>
  mutedBy: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// ── MESSAGE ───────────────────────────────────────────────────
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'system'

export interface IMediaData {
  url: string
  thumbnail: string | null
  filename: string
  filesize: number
  mimetype: string
  duration: number | null
  width: number | null
  height: number | null
}

export interface IMessage extends Document {
  _id: Types.ObjectId
  chat: Types.ObjectId
  sender: Types.ObjectId
  type: MessageType
  text: string
  media: IMediaData | null
  replyTo: Types.ObjectId | null
  readBy: Types.ObjectId[]
  isEdited: boolean
  isDeleted: boolean
  deletedFor: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// ── API ───────────────────────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: { code: string; message: string; details?: { field: string; message: string }[] }
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

// ── JWT ───────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string
  iat?: number
  exp?: number
}

export interface JwtTokens {
  accessToken: string
  refreshToken: string
}
