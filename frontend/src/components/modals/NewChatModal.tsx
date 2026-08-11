import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { HiMiniMagnifyingGlass, HiUserGroup, HiUser } from 'react-icons/hi2'
import { HiSpeakerphone } from 'react-icons/hi'
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
  const [tab, setTab] = useState<'private' | 'group' | 'channel'>('private')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  // Group tab states
  const [groupName, setGroupName] = useState('')
  const [groupLink, setGroupLink] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [creatingGroup, setCreatingGroup] = useState(false)

  // Channel tab states
  const [channelName, setChannelName] = useState('')
  const [channelLink, setChannelLink] = useState('')
  const [channelDescription, setChannelDescription] = useState('')
  const [isPublicChannel, setIsPublicChannel] = useState(true)
  const [creatingChannel, setCreatingChannel] = useState(false)

  // Unified search results
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    if (!isOpen) return
    const searchUsers = async () => {
      setLoading(true)
      try {
        const query = encodeURIComponent(search)
        const [usersRes, chatsRes] = await Promise.all([
          api.get(`/users/search?query=${query}`),
          api.get(`/chats/search/public?query=${query}`)
        ])
        
        const combined = []
        if (usersRes.data.success) {
          combined.push(...usersRes.data.data.map((u: any) => ({ ...u, _type: 'user' })))
        }
        if (chatsRes.data.success) {
          combined.push(...chatsRes.data.data.map((c: any) => ({ ...c, _type: 'chat' })))
        }
        setSearchResults(combined)
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
      const res = await api.post('/chats/private', { userId })
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
        link: groupLink.trim(),
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

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channelName.trim()) return toast.error("Kanal nomini kiriting")

    try {
      setCreatingChannel(true)
      const res = await api.post('/chats/channel', {
        name: channelName.trim(),
        link: channelLink.trim(),
        description: channelDescription.trim(),
        isPublic: isPublicChannel,
        participantIds: selectedUserIds // Optional for channels
      })
      if (res.data.success) {
        const chat: Chat = res.data.data
        dispatch(newChatPrepend(chat))
        dispatch(setActiveChat(chat))
        toast.success("Kanal yaratildi")
        onClose()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Kanal yaratishda xatolik")
    } finally {
      setCreatingChannel(false)
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
              className={`flex-1 py-2.5 text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
                tab === 'group' ? 'bg-tg-600/80 text-tg-text-1 shadow-lg border border-white/10' : 'text-tg-text-3 hover:text-tg-text-1 hover:bg-white/5'
              }`}
            >
              <HiUserGroup size={15} /> Guruh
            </button>
            <button
              onClick={() => setTab('channel')}
              className={`flex-1 py-2.5 text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
                tab === 'channel' ? 'bg-tg-600/80 text-tg-text-1 shadow-lg border border-white/10' : 'text-tg-text-3 hover:text-tg-text-1 hover:bg-white/5'
              }`}
            >
              <HiSpeakerphone size={15} /> Kanal
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto space-y-5 relative z-10">
          {tab === 'group' && (
            <div className="space-y-4">
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
              <div>
                <label className="block text-xs font-medium text-tg-text-2 mb-2 ml-1">Guruh havolasi (Link) - <span className="text-tg-text-3 font-normal">ixtiyoriy</span></label>
                <div className="tg-input-wrapper group">
                  <input
                    type="text"
                    value={groupLink}
                    onChange={(e) => setGroupLink(e.target.value)}
                    placeholder="@dasturchilar"
                    className="tg-input py-3"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'channel' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-tg-text-2 mb-2 ml-1">Kanal nomi</label>
                <div className="tg-input-wrapper group">
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Masalan: Yangiliklar"
                    className="tg-input py-3"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="text-sm font-semibold text-tg-text-1">Kanal turi</p>
                  <p className="text-xs text-tg-text-3 mt-0.5">
                    {isPublicChannel ? "Kanalni barcha qidirib topa oladi" : "Faqat taklif orqali qo'shilish mumkin"}
                  </p>
                </div>
                <button
                  onClick={() => setIsPublicChannel(!isPublicChannel)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublicChannel ? 'bg-tg-accent' : 'bg-tg-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublicChannel ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {isPublicChannel && (
                <div>
                  <label className="block text-xs font-medium text-tg-text-2 mb-2 ml-1">Kanal havolasi (Link)</label>
                  <div className="tg-input-wrapper group">
                    <input
                      type="text"
                      value={channelLink}
                      onChange={(e) => setChannelLink(e.target.value)}
                      placeholder="@yangiliklar"
                      className="tg-input py-3"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-tg-text-2 mb-2 ml-1">Kanal haqida (ixtiyoriy)</label>
                <div className="tg-input-wrapper group h-auto">
                  <textarea
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    placeholder="Kanal qanday mavzuda..."
                    className="tg-input py-3 min-h-[60px] resize-none"
                    rows={2}
                  />
                </div>
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
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-tg-text-3 text-sm bg-white/5 rounded-2xl border border-white/5">
                Natija topilmadi
              </div>
            ) : (
              searchResults.map((item) => {
                const isSelected = selectedUserIds.includes(item._id)
                const isUser = item._type === 'user'
                const displayName = isUser ? `${item.firstName} ${item.lastName || ''}`.trim() : item.name
                const displayUsername = isUser ? item.username : item.link

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (isUser && tab === 'private') {
                        handleStartPrivateChat(item._id)
                      } else if (isUser && tab !== 'private') {
                        toggleSelectUser(item._id)
                      } else if (!isUser) {
                        // TODO: Open chat/group
                        toast.error("Guruh/kanalga kirish hozircha tayyor emas")
                      }
                    }}
                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected ? 'bg-tg-accent/10 border-tg-accent/40 shadow-tg-glow-sm' : 'border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="avatar-wrapper flex-shrink-0 relative">
                      {item.avatar ? (
                        <img src={item.avatar} className="avatar-base avatar-md" alt="" />
                      ) : (
                        <div className={`avatar-base avatar-md avatar-placeholder ${!isUser && 'bg-blue-600'}`}>
                          {displayName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-tg-text-1 truncate flex items-center gap-2">
                        {displayName}
                        {!isUser && <span className="text-[10px] px-1.5 py-0.5 rounded bg-tg-600/50 text-tg-text-3 uppercase tracking-wider">{item.type}</span>}
                      </p>
                      {displayUsername && <p className="text-xs text-tg-text-3 truncate">@{displayUsername}</p>}
                    </div>
                    {isUser && tab !== 'private' && (
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

        {/* Footer for Group/Channel */}
        {tab !== 'private' && (
          <div className="p-5 border-t border-white/10 bg-tg-800/40 backdrop-blur-md flex justify-end gap-3 relative z-10">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-tg-text-3 hover:text-tg-text-1 transition-colors">
              Bekor qilish
            </button>
            <button
              onClick={tab === 'group' ? handleCreateGroup : handleCreateChannel}
              disabled={tab === 'group' ? (creatingGroup || selectedUserIds.length === 0) : creatingChannel}
              className="btn-primary py-2.5 text-sm flex items-center gap-2"
            >
              {(creatingGroup || creatingChannel) && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {creatingGroup ? "Yaratilmoqda..." : creatingChannel ? "Yaratilmoqda..." : tab === 'group' ? `Guruh yaratish (${selectedUserIds.length})` : `Kanal yaratish ${selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewChatModal
