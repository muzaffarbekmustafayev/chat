import React from 'react'
import { IoClose } from 'react-icons/io5'
import { HiUserGroup, HiUser, HiPhone, HiMiniInformationCircle } from 'react-icons/hi2'
import { Chat, User } from '../../types'

interface Props {
  chat: Chat | null
  currentUser: User | null
  isOpen: boolean
  onClose: () => void
}

const ChatInfoModal: React.FC<Props> = ({ chat, currentUser, isOpen, onClose }) => {
  if (!isOpen || !chat) return null

  const isGroup = chat.type === 'group'
  const otherUser = !isGroup ? chat.participants.find(p => p._id !== currentUser?._id) : null
  const name = isGroup ? chat.name : `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim()
  const avatar = isGroup ? chat.avatar : otherUser?.avatar

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-tg-700 border border-tg-glass-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-tg-glass-border">
          <h2 className="text-lg font-bold text-tg-text-1">Suhbat ma'lumotlari</h2>
          <button onClick={onClose} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <IoClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="avatar-wrapper">
            {avatar ? (
              <img src={avatar} className="w-20 h-20 rounded-full object-cover shadow-avatar" alt="avatar" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent-gradient text-white text-2xl font-bold flex items-center justify-center shadow-avatar">
                {name?.[0] || '?'}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-tg-text-1">{name}</h3>
            {!isGroup && otherUser?.username && (
              <p className="text-xs text-tg-text-3">@{otherUser.username}</p>
            )}
            {isGroup && (
              <p className="text-xs text-tg-accent font-semibold">{chat.participants.length} ta a'zo</p>
            )}
          </div>

          {!isGroup && otherUser?.phone && (
            <div className="w-full bg-tg-800/50 p-3 rounded-xl border border-tg-glass-border flex items-center gap-3 text-left">
              <HiPhone size={18} className="text-tg-accent flex-shrink-0" />
              <div>
                <p className="text-xxs text-tg-text-3">Telefon raqam</p>
                <p className="text-xs font-semibold text-tg-text-1">{otherUser.phone}</p>
              </div>
            </div>
          )}

          {!isGroup && otherUser?.bio && (
            <div className="w-full bg-tg-800/50 p-3 rounded-xl border border-tg-glass-border flex items-center gap-3 text-left">
              <HiMiniInformationCircle size={18} className="text-tg-accent flex-shrink-0" />
              <div>
                <p className="text-xxs text-tg-text-3">Bio</p>
                <p className="text-xs font-medium text-tg-text-1">{otherUser.bio}</p>
              </div>
            </div>
          )}

          {/* Group members list */}
          {isGroup && (
            <div className="w-full text-left">
              <p className="text-xs font-semibold text-tg-text-2 mb-2">A'zolar:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-none">
                {chat.participants.map((p) => (
                  <div key={p._id} className="flex items-center gap-2 p-1.5 rounded-lg bg-tg-800/30">
                    <div className="avatar-base avatar-sm avatar-placeholder text-xs">
                      {p.firstName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-tg-text-1 truncate">{p.firstName} {p.lastName}</p>
                      <p className="text-xxs text-tg-text-3 truncate">@{p.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInfoModal
