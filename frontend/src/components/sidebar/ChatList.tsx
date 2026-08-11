import React from 'react'
import { Chat, User } from '../../../types'
import ChatItem from './ChatItem'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { setActiveChat } from '../../../store/chatSlice'

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
      <div className="flex-1 flex items-center justify-center text-tg-text-3 text-sm italic">
        Suhbatlar topilmadi
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
