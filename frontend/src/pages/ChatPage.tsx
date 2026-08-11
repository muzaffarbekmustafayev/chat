import React, { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

const ChatPage: React.FC = () => {
  // Kichik ekranlar uchun sidebar yoki chat oynasini ko'rsatishni boshqarish
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  return (
    <div className="flex h-full w-full overflow-hidden bg-tg-800">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onChatSelect={() => setIsSidebarOpen(false)} 
      />
      <ChatWindow 
        onBack={() => setIsSidebarOpen(true)} 
      />
    </div>
  )
}

export default ChatPage
