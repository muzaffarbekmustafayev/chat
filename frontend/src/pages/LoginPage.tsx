import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import { BsTelephoneFill, BsLockFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { api } from '../api/axios'
import { setAuth } from '../store/authSlice'
import { RootState, AppDispatch } from '../store'

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading: authLoading } = useSelector((state: RootState) => state.auth)

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '')
    let body = digits.startsWith('998') ? digits.slice(3) : digits
    body = body.slice(0, 9)

    let res = '+998'
    if (body.length > 0) res += ' ' + body.slice(0, 2)
    if (body.length > 2) res += ' ' + body.slice(2, 5)
    if (body.length > 5) res += ' ' + body.slice(5, 7)
    if (body.length > 7) res += ' ' + body.slice(7, 9)

    return res
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

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
    <div className="h-full w-full flex items-center justify-center p-4 relative overflow-hidden bg-tg-900">
      {/* Orqa fon bezaklari - Gradient Blobs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-tg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 animate-fade-in border border-white/10 shadow-2xl">
        {/* Logo qismi */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-gradient shadow-tg-glow flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <IoChatbubbleEllipsesOutline size={36} className="text-white drop-shadow" />
          </div>
          <h1 className="text-2xl font-extrabold text-tg-text-1 tracking-tight mb-1">Telegram Clone</h1>
          <p className="text-xs text-tg-text-3 font-medium">Hisobingizga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Telefon Input */}
          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-2 ml-1">
              Telefon raqam
            </label>
            <div className="tg-input-wrapper group">
              <div className="pl-4 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                <BsTelephoneFill size={16} />
              </div>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                className="tg-input font-medium tracking-wide"
                disabled={loading}
              />
            </div>
          </div>

          {/* Parol Input */}
          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-2 ml-1">
              Parol
            </label>
            <div className="tg-input-wrapper group">
              <div className="pl-4 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                <BsLockFill size={17} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="tg-input pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-tg-text-3 hover:text-tg-text-1 transition-colors"
              >
                {showPassword ? <BsEyeSlashFill size={18} /> : <BsEyeFill size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-4 flex items-center justify-center gap-2 text-sm font-semibold rounded-2xl shadow-tg-glow hover:shadow-tg-glow-sm transition-all duration-200"
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

        <div className="mt-8 text-center pt-4 border-t border-white/5">
          <p className="text-xs text-tg-text-3">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="text-tg-accent hover:text-tg-accent-light font-semibold transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
