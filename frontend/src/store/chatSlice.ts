import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Chat, ApiResponse } from '../types'
import { api } from '../api/axios'

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  loading: boolean
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
}

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  const res = await api.get<ApiResponse<Chat[]>>('/chats')
  return res.data.data
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload
    },
    updateChat: (state, action: PayloadAction<Partial<Chat> & { _id: string }>) => {
      const idx = state.chats.findIndex((c) => c._id === action.payload._id)
      if (idx !== -1) {
        state.chats[idx] = { ...state.chats[idx], ...action.payload }
      }
      if (state.activeChat?._id === action.payload._id) {
        state.activeChat = { ...state.activeChat, ...action.payload }
      }
    },
    newChatPrepend: (state, action: PayloadAction<Chat>) => {
      if (!state.chats.some((c) => c._id === action.payload._id)) {
        state.chats.unshift(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.loading = true })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false
        state.chats = action.payload
      })
      .addCase(fetchChats.rejected, (state) => { state.loading = false })
  },
})

export const { setActiveChat, updateChat, newChatPrepend } = chatSlice.actions
export default chatSlice.reducer
