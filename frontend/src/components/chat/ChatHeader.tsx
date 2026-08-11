import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Chat } from '../../types'
import { BsArrowLeft, BsTelephoneFill, BsCameraVideoFill, BsThreeDotsVertical, BsSearch } from 'react-icons/bs'
import ChatInfoModal from '../modals/ChatInfoModal'

interface Props {
  chat: Chat
  onBack: () => void
}

const ChatHeader: React.FC<Props> = ({ chat, onBack }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const otherUser = chat.type === 'private' ? chat.participants.find(p => p._id !== user?._id) : null
  const chatName = chat.type === 'private' ? `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim() : chat.name
  const chatAvatar = chat.type === 'private' ? otherUser?.avatar : chat.avatar
  const isOnline = chat.type === 'private' ? otherUser?.isOnline : false

  return (
    <>
      <div className="
        flex items-center gap-3 px-3 sm:px-4 h-14 flex-shrink-0
        border-b border-tg-glass-border
        bg-tg-700/80 backdrop-blur-tg-sm z-10
      ">
        <button onClick={onBack} className="md:hidden btn-icon-circle -ml-1 text-tg-text-1">
          <BsArrowLeft size={20} />
        </button>

        <div onClick={() => setIsInfoOpen(true)} className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group">
          <div className="avatar-wrapper flex-shrink-0">
            {chatAvatar ? (
              <img src={chatAvatar} className="avatar-base avatar-sm group-hover:opacity-90 transition-opacity" alt="avatar" />
            ) : (
              <div className="avatar-base avatar-sm avatar-placeholder">
                {chatName?.[0] || '?'}
              </div>
            )}
            {isOnline && <span className="online-dot" />}
          </div>

          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-tg-text-1 truncate group-hover:text-tg-accent transition-colors">
              {chatName}
            </p>
            <p className={`text-xxs font-medium truncate ${isOnline ? "text-tg-online" : "text-tg-text-3"}`}>
              {isOnline ? "online" : "so'nggi marta yaqinda"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 text-tg-text-2">
          <button className="btn-icon-circle hidden sm:flex">
            <BsSearch size={16} />
          </button>
          <button className="btn-icon-circle hidden md:flex">
            <BsTelephoneFill size={16} />
          </button>
          <button className="btn-icon-circle hidden lg:flex">
            <BsCameraVideoFill size={17} />
          </button>
          <button onClick={() => setIsInfoOpen(true)} className="btn-icon-circle">
            <BsThreeDotsVertical size={17} />
          </button>
        </div>
      </div>

      <ChatInfoModal
        chat={chat}
        currentUser={user}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  )
}

export default ChatHeader
