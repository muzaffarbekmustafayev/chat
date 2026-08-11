import React, { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

const ChatPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  return (
    <div className="flex h-full w-full overflow-hidden bg-tg-900 relative">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-tg-accent/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main content layer */}
      <div className="flex h-full w-full z-10 backdrop-blur-[40px] bg-tg-900/40 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onChatSelect={() => setIsSidebarOpen(false)} 
        />
        <ChatWindow 
          onBack={() => setIsSidebarOpen(true)} 
        />
      </div>
    </div>
  )
}

export default ChatPage
