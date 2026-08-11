import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdDoneAll, MdDone } from 'react-icons/md'
import { HiPhoto } from 'react-icons/hi2'
import { BsMicFill } from 'react-icons/bs'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { format } from 'date-fns'
import { Chat, User, Message } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import { setActiveChat } from '../../../store/chatSlice'

interface Props {
  chat: Chat
  isActive: boolean
  onClick: () => void
  currentUser: User | null
}

const formatTime = (dateString?: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'HH:mm')
}

const ChatItem: React.FC<Props> = ({ chat, isActive, onClick, currentUser }) => {
  const lastMsg = chat.lastMessage

  const renderLastMsg = () => {
    if (!lastMsg) return <span className="italic text-tg-text-4">Xabar yo'q</span>
    if (lastMsg.type === 'image') return <><HiPhoto size={12} className="inline mr-1" />Rasm</>
    if (lastMsg.type === 'audio') return <><BsMicFill size={11} className="inline mr-1" />Ovozli xabar</>
    if (lastMsg.type === 'document') return <><AiOutlineFilePdf size={12} className="inline mr-1" />Hujjat</>
    return lastMsg.text?.slice(0, 40) || 'Media'
  }

  const isMine = lastMsg?.sender?._id === currentUser?._id
  const otherUser = chat.type === 'private' ? chat.participants.find(p => p._id !== currentUser?._id) : null
  const chatName = chat.type === 'private' ? `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim() : chat.name
  const chatAvatar = chat.type === 'private' ? otherUser?.avatar : chat.avatar
  const isOnline = chat.type === 'private' ? otherUser?.isOnline : false

  return (
    <div onClick={onClick} className={`chat-item ${isActive ? "chat-item-active" : ""}`}>
      {/* Avatar */}
      <div className="avatar-wrapper flex-shrink-0">
        {chatAvatar ? (
          <img src={chatAvatar} className="avatar-base avatar-md" alt="avatar" />
        ) : (
          <div className="avatar-base avatar-md avatar-placeholder">
            {chatName?.[0] || "?"}
          </div>
        )}
        {isOnline && <span className="online-dot" />}
      </div>

      {/* Ma'lumot */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-[14.5px] font-semibold text-tg-text-1 truncate">
            {chatName}
          </span>
          <span className="text-xxs text-tg-text-3 flex-shrink-0">
            {formatTime(lastMsg?.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[13px] text-tg-text-2 truncate min-w-0">
            {/* O'z xabar bo'lsa tick */}
            {isMine && lastMsg && (
              lastMsg.readBy?.length > 1
                ? <MdDoneAll size={14} className="text-tg-tick flex-shrink-0" />
                : <MdDone size={14} className="text-tg-text-3 flex-shrink-0" />
            )}
            <span className="truncate">{renderLastMsg()}</span>
          </div>

          {chat.unreadCount > 0 && (
            <span className="badge">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatItem
