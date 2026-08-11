import React, { useState } from 'react'
import { IoClose, IoCameraOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { User } from '../../types'
import { api } from '../../api/axios'
import { useDispatch } from 'react-redux'
import { fetchMe } from '../../store/authSlice'

interface Props {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<Props> = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch<any>()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  if (!isOpen || !user) return null

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim()) return toast.error("Ismingizni kiriting")
    if (!username.trim()) return toast.error("Username kiriting")

    try {
      setLoading(true)
      const res = await api.put('/users/profile', { firstName, lastName, bio, username })
      if (res.data.success) {
        toast.success("Profil yangilandi")
        dispatch(fetchMe())
        onClose()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setUploadingAvatar(true)
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        toast.success("Rasm yangilandi")
        dispatch(fetchMe())
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Rasm yuklashda xatolik")
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-tg-700 border border-tg-glass-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-tg-glass-border">
          <h2 className="text-lg font-bold text-tg-text-1">Profil Sozlamalari</h2>
          <button onClick={onClose} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <IoClose size={22} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="relative group cursor-pointer">
              {user.avatar ? (
                <img src={user.avatar} className="w-24 h-24 rounded-full object-cover shadow-avatar ring-4 ring-tg-accent/20" alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent-gradient text-white text-2xl font-bold flex items-center justify-center shadow-avatar">
                  {user.firstName[0]}
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingAvatar ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IoCameraOutline size={28} className="text-white" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
              </label>
            </div>
            <p className="text-xs text-tg-text-3 mt-2">Rasm almashtirish uchun bosing</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-text-3">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                className="tg-input py-2.5 pl-7"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1">Ism</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="tg-input py-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1">Familiya</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="tg-input py-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-tg-text-2 mb-1">Bio (Ma'lumot)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="O'zingiz haqingizda qisqacha..."
              rows={2}
              className="tg-input py-2.5 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-tg-text-3 hover:text-tg-text-1">
              Bekor qilish
            </button>
            <button type="submit" disabled={loading} className="btn-primary py-2 text-xs">
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
