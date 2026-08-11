import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi2'
import { BsPersonFill, BsAt, BsTelephoneFill, BsLockFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: formatPhone(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
    <div className="h-full w-full flex items-center justify-center p-4 relative overflow-y-auto bg-tg-900">
      <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-tg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-6 sm:p-8 relative z-10 animate-fade-in border border-white/10 shadow-2xl my-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-accent-gradient shadow-tg-glow flex items-center justify-center mb-3 transform hover:scale-105 transition-transform duration-300">
            <FaTelegramPlane size={32} className="text-white drop-shadow ml-[-2px] mt-[2px]" />
          </div>
          <h1 className="text-xl font-extrabold text-tg-text-1 tracking-tight mb-1">Ro'yxatdan o'tish</h1>
          <p className="text-xs text-tg-text-3 font-medium">Yangi hisob yaratish uchun formani to'ldiring</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
                Ism <span className="text-red-400">*</span>
              </label>
              <div className="tg-input-wrapper group">
                <div className="pl-3.5 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                  <BsPersonFill size={15} />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ali"
                  className="tg-input py-2.5 pl-2.5"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
                Familiya
              </label>
              <div className="tg-input-wrapper group">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="tg-input-wrapper group">
              <div className="pl-3.5 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                <BsAt size={17} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="alivaliyev"
                className="tg-input py-2.5 pl-2.5"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Telefon raqam <span className="text-red-400">*</span>
            </label>
            <div className="tg-input-wrapper group">
              <div className="pl-3.5 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                <BsTelephoneFill size={15} />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="tg-input py-2.5 pl-2.5"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1.5 ml-1">
              Parol <span className="text-red-400">*</span>
            </label>
            <div className="tg-input-wrapper group">
              <div className="pl-3.5 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
                <BsLockFill size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="tg-input py-2.5 pl-2.5 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-tg-text-3 hover:text-tg-text-1 transition-colors"
              >
                {showPassword ? <BsEyeSlashFill size={16} /> : <BsEyeFill size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 mt-4 flex items-center justify-center gap-2 text-sm font-semibold rounded-2xl shadow-tg-glow hover:shadow-tg-glow-sm transition-all duration-200"
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

        <div className="mt-6 text-center pt-3 border-t border-white/5">
          <p className="text-xs text-tg-text-3">
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/login" className="text-tg-accent hover:text-tg-accent-light font-semibold transition-colors">
              Tizimga kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
