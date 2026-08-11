import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SidebarHeader from './SidebarHeader'
import SearchBar from './SearchBar'
import ChatList from './ChatList'
import { RootState, AppDispatch } from '../../store'
import { fetchChats } from '../../store/chatSlice'

interface SidebarProps {
  isOpen: boolean
  onChatSelect: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onChatSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { chats, loading } = useSelector((state: RootState) => state.chat)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])

  const filteredChats = chats.filter((c) => {
    const name = c.type === 'private' 
      ? c.participants.find(p => p._id !== user?._id)?.firstName || '' 
      : c.name || ''
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className={`
      flex flex-col h-full bg-tg-700/50 border-r border-tg-glass-border
      transition-all duration-300 flex-shrink-0
      w-full md:w-[340px] lg:w-[380px]
      ${!isOpen ? 'hidden md:flex' : 'flex'}
    `}>
      <SidebarHeader user={user} />
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClear={() => setSearchQuery('')} />
      <ChatList chats={filteredChats} loading={loading} onSelect={onChatSelect} currentUser={user} />
    </div>
  )
}

export default Sidebar
