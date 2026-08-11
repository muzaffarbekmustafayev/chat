import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { RootState, AppDispatch } from './store'
import { fetchMe } from './store/authSlice'
import { SocketProvider } from './context/SocketContext'

// Sahifalar (vaqtincha oddiy komponentlar kiritamiz)
const ChatPage = () => <div className="h-full flex items-center justify-center text-2xl font-bold">💬 Chat Sahifasi Tayyorlanmoqda...</div>
const LoginPage = () => <div className="h-full flex items-center justify-center text-2xl font-bold">🔑 Login Tayyorlanmoqda...</div>
const RegisterPage = () => <div className="h-full flex items-center justify-center text-2xl font-bold">📝 Register Tayyorlanmoqda...</div>

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe())
    }
  }, [dispatch])

  if (loading) return <div className="h-full flex items-center justify-center">Yuklanmoqda...</div>

  return (
    <BrowserRouter>
      <SocketProvider>
        <Toaster position="top-center" toastOptions={{ className: 'bg-tg-500 text-tg-text-1 border border-tg-glass-border' }} />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App
