import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { User, ApiResponse } from '../types'
import { api } from '../api/axios'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
}

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ApiResponse<User>>('/users/me')
    return res.data.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error?.message || 'Xato')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('accessToken', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
      api.post('/auth/logout').catch(() => {})
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        localStorage.removeItem('accessToken')
      })
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
