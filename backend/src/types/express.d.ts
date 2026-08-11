import { IUser } from './index'
import { Server } from 'socket.io'

declare global {
  namespace Express {
    interface Request {
      user: IUser
      io: Server
    }
  }
}

export {}
