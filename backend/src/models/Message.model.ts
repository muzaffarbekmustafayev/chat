import mongoose, { Schema } from 'mongoose'
import { IMessage } from '../types'

const MessageSchema = new Schema<IMessage>(
  {
    chat:    { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    sender:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:    { type: String, enum: ['text','image','video','audio','document','sticker','system'], default: 'text' },
    text:    { type: String, default: '', maxlength: 4096 },
    media: {
      url:       { type: String },
      thumbnail: { type: String, default: null },
      filename:  { type: String },
      filesize:  { type: Number },
      mimetype:  { type: String },
      duration:  { type: Number, default: null },
      width:     { type: Number, default: null },
      height:    { type: Number, default: null },
    },
    replyTo:    { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    readBy:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isEdited:   { type: Boolean, default: false },
    isDeleted:  { type: Boolean, default: false },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

MessageSchema.index({ chat: 1, createdAt: -1 })
MessageSchema.index({ chat: 1, _id: -1 })
MessageSchema.index({ text: 'text' })

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
