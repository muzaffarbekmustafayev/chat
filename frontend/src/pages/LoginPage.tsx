import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { api } from '../api/axios'
import { setAuth } from '../store/authSlice'
import { RootState, AppDispatch } from '../store'

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading: authLoading } = useSelector((state: RootState) => state.auth)

  const [phone, setPhone] = useState('+998')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring")
    }

    try {
      setLoading(true)
      const res = await api.post('/auth/login', { phone, password })
      if (res.data.success) {
        dispatch(setAuth({ user: res.data.data.user, token: res.data.data.token }))
        toast.success("Xush kelibsiz!")
        navigate('/')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Tizimga kirishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Orqa fon bezaklari */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tg-accent-light/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 relative z-10 animate-modal">
        {/* Logo qismi */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-gradient shadow-tg-glow flex items-center justify-center mb-4">
            <IoChatbubbleEllipsesOutline size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tg-text-1 mb-1">Telegram Clone</h1>
          <p className="text-sm text-tg-text-3">Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Telefon raqam
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="tg-input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="tg-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Tizimga kirish <HiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-tg-text-3">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="text-tg-accent hover:text-tg-accent-light font-medium transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
