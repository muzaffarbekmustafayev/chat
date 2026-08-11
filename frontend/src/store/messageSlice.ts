import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from '../types'

interface MessageState {
  messagesByChat: Record<string, Message[]>
  typingByChat: Record<string, string[]>
}

const initialState: MessageState = {
  messagesByChat: {},
  typingByChat: {},
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messagesByChat[action.payload.chatId] = action.payload.messages
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chat
      if (!state.messagesByChat[chatId]) state.messagesByChat[chatId] = []
      if (!state.messagesByChat[chatId].some((m) => m._id === action.payload._id)) {
        state.messagesByChat[chatId].push(action.payload)
      }
    },
    setTyping: (state, action: PayloadAction<{ chatId: string; user: string }>) => {
      const { chatId, user } = action.payload
      if (!state.typingByChat[chatId]) state.typingByChat[chatId] = []
      if (!state.typingByChat[chatId].includes(user)) state.typingByChat[chatId].push(user)
    },
    removeTyping: (state, action: PayloadAction<{ chatId: string; user: string }>) => {
      const { chatId, user } = action.payload
      if (state.typingByChat[chatId]) {
        state.typingByChat[chatId] = state.typingByChat[chatId].filter((u) => u !== user)
      }
    },
  },
})

export const { setMessages, addMessage, setTyping, removeTyping } = messageSlice.actions
export default messageSlice.reducer
