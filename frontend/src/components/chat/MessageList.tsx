import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Chat } from '../../types'
import MessageBubble from './MessageBubble'

interface Props {
  chat: Chat
}

const MessageList: React.FC<Props> = ({ chat }) => {
  const { messagesByChat } = useSelector((state: RootState) => state.message)
  const { user } = useSelector((state: RootState) => state.auth)
  const messages = messagesByChat[chat._id] || []
  
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-1">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="bg-tg-600/50 px-4 py-2 rounded-xl text-sm text-tg-text-2">
            Bu yerda hali xabarlar yo'q
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <MessageBubble 
            key={msg._id} 
            message={msg} 
            isMine={msg.sender._id === user?._id}
            isFirst={idx === 0 || messages[idx-1].sender._id !== msg.sender._id}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList
