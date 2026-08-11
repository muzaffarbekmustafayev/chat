import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '../types'

interface IUserMethods { comparePassword(candidate: string): Promise<boolean> }
type UserModel = Model<IUser, Record<string, never>, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username:  { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 32 },
    phone:     { type: String, required: true, unique: true, trim: true },
    password:  { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true, maxlength: 64 },
    lastName:  { type: String, default: '', trim: true, maxlength: 64 },
    bio:       { type: String, default: '', maxlength: 255 },
    avatar:    { type: String, default: null },
    isOnline:  { type: Boolean, default: false },
    lastSeen:  { type: Date, default: null },
    socketId:  { type: String, default: null, select: false },
    refreshTokens: { type: [String], default: [], select: false },
    contacts:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pushSubscriptions: [{
      endpoint: String,
      expirationTime: Date,
      keys: { p256dh: String, auth: String },
    }],
  },
  { timestamps: true }
)

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.index({ phone: 1 })
UserSchema.index({ username: 'text', firstName: 'text', lastName: 'text' })

export const User = mongoose.model<IUser, UserModel>('User', UserSchema)
