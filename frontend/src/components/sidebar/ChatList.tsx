import React from 'react'
import { Chat, User } from '../../types'
import ChatItem from './ChatItem'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { setActiveChat } from '../../store/chatSlice'

import { setNewChatModalOpen } from '../../store/chatSlice'

interface Props {
  chats: Chat[]
  loading: boolean
  currentUser: User | null
  onSelect: () => void
}

const ChatList: React.FC<Props> = ({ chats, loading, currentUser, onSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { activeChat } = useSelector((state: RootState) => state.chat)

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 py-2 scrollbar-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 mx-2">
            <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-3.5 w-28 rounded-lg" />
                <div className="skeleton h-3 w-10 rounded" />
              </div>
              <div className="skeleton h-3 w-40 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
        <div className="w-16 h-16 rounded-full bg-tg-800/50 flex items-center justify-center mb-3 text-tg-text-3 border border-white/5">
          <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-tg-text-2 mb-1">Hali suhbatlar yo'q</p>
        <p className="text-xs text-tg-text-3 max-w-[180px]">Yangi suhbat boshlash uchun yuqoridagi tugmani bosing</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
      {chats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isActive={activeChat?._id === chat._id}
          currentUser={currentUser}
          onClick={() => {
            dispatch(setActiveChat(chat))
            onSelect()
          }}
        />
      ))}
    </div>
  )
}

export default ChatList
