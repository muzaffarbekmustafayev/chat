import React, { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

const ChatPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  return (
    <div className="flex h-full w-full overflow-hidden bg-tg-900 relative">
      {/* Background glowing blobs (made brighter and more vibrant) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-tg-accent/30 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Main content layer */}
      <div className="flex h-full w-full z-10 backdrop-blur-[30px] bg-tg-900/30 relative border border-white/5 shadow-2xl">
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
