import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { api } from '../api/axios'
import { setAuth } from '../store/authSlice'
import { RootState, AppDispatch } from '../store'

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading: authLoading } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    phone: '+998',
    firstName: '',
    lastName: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const { username, phone, firstName, password } = formData

    if (!username || !phone || !firstName || !password) {
      return toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
    }

    if (password.length < 8) {
      return toast.error("Parol kamida 8 ta belgidan iborat bo'lishi kerak")
    }

    try {
      setLoading(true)
      const res = await api.post('/auth/register', formData)
      if (res.data.success) {
        dispatch(setAuth({ user: res.data.data.user, token: res.data.data.token }))
        toast.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!")
        navigate('/')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Ro'yxatdan o'tishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-tg-accent-light/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 relative z-10 animate-modal my-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient shadow-tg-glow flex items-center justify-center mb-3">
            <IoChatbubbleEllipsesOutline size={30} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-tg-text-1 mb-1">Ro'yxatdan o'tish</h1>
          <p className="text-xs text-tg-text-3">Yangi hisob yarating</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
                Ism <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ali"
                className="tg-input py-2.5"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
                Familiya
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Valiyev"
                className="tg-input py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="alivaliyev"
              className="tg-input py-2.5"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Telefon raqam <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 90 123 45 67"
              className="tg-input py-2.5"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Parol <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="tg-input py-2.5"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4 py-2.5"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Ro'yxatdan o'tish <HiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-tg-text-3">
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/login" className="text-tg-accent hover:text-tg-accent-light font-medium transition-colors">
              Tizimga kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
