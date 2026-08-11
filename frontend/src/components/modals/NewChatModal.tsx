import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { HiMiniMagnifyingGlass, HiUserGroup, HiUser } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { api } from '../../api/axios'
import { User, Chat } from '../../types'
import { useDispatch } from 'react-redux'
import { newChatPrepend, setActiveChat } from '../../store/chatSlice'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const NewChatModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const [tab, setTab] = useState<'private' | 'group'>('private')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  // Group tab states
  const [groupName, setGroupName] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [creatingGroup, setCreatingGroup] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const searchUsers = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/users/search?query=${encodeURIComponent(search)}`)
        if (res.data.success) {
          setUsers(res.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [search, isOpen])

  if (!isOpen) return null

  const handleStartPrivateChat = async (userId: string) => {
    try {
      const res = await api.post('/chats/private', { recipientId: userId })
      if (res.data.success) {
        const chat: Chat = res.data.data
        dispatch(newChatPrepend(chat))
        dispatch(setActiveChat(chat))
        toast.success("Suhbat ochildi")
        onClose()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Xatolik yuz berdi")
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return toast.error("Guruh nomini kiriting")
    if (selectedUserIds.length === 0) return toast.error("Kamida 1 ta a'zo tanlang")

    try {
      setCreatingGroup(true)
      const res = await api.post('/chats/group', {
        name: groupName.trim(),
        participantIds: selectedUserIds
      })
      if (res.data.success) {
        const chat: Chat = res.data.data
        dispatch(newChatPrepend(chat))
        dispatch(setActiveChat(chat))
        toast.success("Guruh yaratildi")
        onClose()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Guruh yaratishda xatolik")
    } finally {
      setCreatingGroup(false)
    }
  }

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uId => uId !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-tg-700 border border-tg-glass-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-tg-glass-border">
          <h2 className="text-lg font-bold text-tg-text-1">Yangi suhbat</h2>
          <button onClick={onClose} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <IoClose size={22} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-tg-glass-border p-1 bg-tg-800/40">
          <button
            onClick={() => setTab('private')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              tab === 'private' ? 'bg-tg-accent text-white shadow-tg-glow-sm' : 'text-tg-text-3 hover:text-tg-text-1'
            }`}
          >
            <HiUser size={16} /> Shaxsiy chat
          </button>
          <button
            onClick={() => setTab('group')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              tab === 'group' ? 'bg-tg-accent text-white shadow-tg-glow-sm' : 'text-tg-text-3 hover:text-tg-text-1'
            }`}
          >
            <HiUserGroup size={16} /> Yangi Guruh
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {tab === 'group' && (
            <div>
              <label className="block text-xs font-semibold text-tg-text-2 mb-1">Guruh nomi</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Masalan: Dasturchilar guruhi"
                className="tg-input py-2.5"
              />
            </div>
          )}

          {/* Qidiruv input */}
          <div className="relative">
            <HiMiniMagnifyingGlass size={18} className="absolute left-3.5 top-3 text-tg-text-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Foydalanuvchi qidirish (ism yoki username)..."
              className="tg-input pl-10 py-2.5"
            />
          </div>

          {/* User List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-none">
            {loading ? (
              <div className="text-center py-6 text-tg-text-3 text-sm">Qidirilmoqda...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-6 text-tg-text-3 text-sm">Foydalanuvchilar topilmadi</div>
            ) : (
              users.map((u) => {
                const isSelected = selectedUserIds.includes(u._id)
                return (
                  <div
                    key={u._id}
                    onClick={() => tab === 'private' ? handleStartPrivateChat(u._id) : toggleSelectUser(u._id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-tg-accent/20 border border-tg-accent/40' : 'hover:bg-tg-600/50'
                    }`}
                  >
                    <div className="avatar-wrapper flex-shrink-0">
                      {u.avatar ? (
                        <img src={u.avatar} className="avatar-base avatar-md" alt="" />
                      ) : (
                        <div className="avatar-base avatar-md avatar-placeholder">
                          {u.firstName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tg-text-1 truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-tg-text-3 truncate">@{u.username}</p>
                    </div>
                    {tab === 'group' && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 accent-tg-accent cursor-pointer"
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer for Group */}
        {tab === 'group' && (
          <div className="p-4 border-t border-tg-glass-border bg-tg-800/30 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-tg-text-3 hover:text-tg-text-1">
              Bekor qilish
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={creatingGroup}
              className="btn-primary py-2 text-xs"
            >
              {creatingGroup ? "Yaratilmoqda..." : `Guruh yaratish (${selectedUserIds.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewChatModal
