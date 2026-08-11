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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tg-900/60 backdrop-blur-[8px] animate-fade-in">
      <div className="w-full max-w-md glass-card overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border border-white/10 relative">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-tg-text-1">Yangi suhbat</h2>
          <button onClick={onClose} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <IoClose size={22} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="relative z-10 px-6 pt-5 pb-2">
          <div className="flex bg-tg-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
            <button
              onClick={() => setTab('private')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                tab === 'private' ? 'bg-tg-600/80 text-tg-text-1 shadow-lg border border-white/10' : 'text-tg-text-3 hover:text-tg-text-1 hover:bg-white/5'
              }`}
            >
              <HiUser size={16} /> Shaxsiy chat
            </button>
            <button
              onClick={() => setTab('group')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                tab === 'group' ? 'bg-tg-600/80 text-tg-text-1 shadow-lg border border-white/10' : 'text-tg-text-3 hover:text-tg-text-1 hover:bg-white/5'
              }`}
            >
              <HiUserGroup size={16} /> Yangi Guruh
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto space-y-5 relative z-10">
          {tab === 'group' && (
            <div>
              <label className="block text-xs font-medium text-tg-text-2 mb-2 ml-1">Guruh nomi</label>
              <div className="tg-input-wrapper group">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Masalan: Dasturchilar guruhi"
                  className="tg-input py-3"
                />
              </div>
            </div>
          )}

          {/* Qidiruv input */}
          <div className="tg-input-wrapper group">
            <div className="pl-4 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
              <HiMiniMagnifyingGlass size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki username orqali izlash..."
              className="tg-input pl-3 py-3"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none pr-1">
            {loading ? (
              <div className="text-center py-8 text-tg-text-3 text-sm flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-tg-accent/30 border-t-tg-accent rounded-full animate-spin" />
                Qidirilmoqda...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-tg-text-3 text-sm bg-white/5 rounded-2xl border border-white/5">
                Foydalanuvchilar topilmadi
              </div>
            ) : (
              users.map((u) => {
                const isSelected = selectedUserIds.includes(u._id)
                return (
                  <div
                    key={u._id}
                    onClick={() => tab === 'private' ? handleStartPrivateChat(u._id) : toggleSelectUser(u._id)}
                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected ? 'bg-tg-accent/10 border-tg-accent/40 shadow-tg-glow-sm' : 'border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="avatar-wrapper flex-shrink-0 relative">
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
          <div className="p-5 border-t border-white/10 bg-tg-800/40 backdrop-blur-md flex justify-end gap-3 relative z-10">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-tg-text-3 hover:text-tg-text-1 transition-colors">
              Bekor qilish
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={creatingGroup || selectedUserIds.length === 0}
              className="btn-primary py-2.5 text-sm flex items-center gap-2"
            >
              {creatingGroup && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {creatingGroup ? "Yaratilmoqda..." : `Guruh yaratish (${selectedUserIds.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewChatModal
