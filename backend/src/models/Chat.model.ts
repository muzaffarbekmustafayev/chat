import mongoose, { Schema } from 'mongoose'
import { IChat } from '../types'

const ChatSchema = new Schema<IChat>(
  {
    type:        { type: String, enum: ['private', 'group', 'channel'], required: true },
    name:        { type: String, default: null, maxlength: 128 },
    description: { type: String, default: '', maxlength: 512 },
    avatar:      { type: String, default: null },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    admins:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner:       { type: Schema.Types.ObjectId, ref: 'User', default: null },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    unreadCounts:{ type: Map, of: Number, default: {} },
    mutedBy:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

ChatSchema.index({ participants: 1, updatedAt: -1 })
ChatSchema.index({ type: 1 })

export const Chat = mongoose.model<IChat>('Chat', ChatSchema)
