import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import EmptyState from './EmptyState'
import { api } from '../../api/axios'
import { setMessages, addMessage } from '../../store/messageSlice'
import { useSocketContext } from '../../context/SocketContext'

interface Props {
  onBack: () => void
}

const ChatWindow: React.FC<Props> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { activeChat } = useSelector((state: RootState) => state.chat)
  const { socket } = useSocketContext()

  useEffect(() => {
    if (activeChat) {
      // Chat xabarlarini yuklash
      api.get(`/messages/${activeChat._id}`)
        .then(res => {
          if (res.data.success) {
            dispatch(setMessages({ chatId: activeChat._id, messages: res.data.data.messages }))
          }
        })
        .catch(console.error)

      // Socket orqali xonaga qo'shilish
      if (socket) {
        socket.emit('join_chat', { chatId: activeChat._id })
        
        const handleNewMessage = (msg: any) => {
          dispatch(addMessage(msg))
        }
        
        socket.on('new_message', handleNewMessage)
        
        return () => {
          socket.emit('leave_chat', { chatId: activeChat._id })
          socket.off('new_message', handleNewMessage)
        }
      }
    }
  }, [activeChat, dispatch, socket])

  if (!activeChat) {
    return <EmptyState />
  }

  return (
    <div className="flex-1 flex flex-col relative transition-all duration-300 bg-transparent overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundRepeat: 'repeat' }} 
      />
      
      {/* Gradient Overlay for extra premium feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-tg-900/40 to-tg-900/10 pointer-events-none" />

      <div className="flex-1 flex flex-col z-10 relative">
        <ChatHeader chat={activeChat} onBack={onBack} />
        <MessageList chat={activeChat} />
        <MessageInput chat={activeChat} />
      </div>
    </div>
  )
}

export default ChatWindow
