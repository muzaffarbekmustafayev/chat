import React, { useState } from 'react'
import { HiMiniPencilSquare } from 'react-icons/hi2'
import { BsSunFill, BsMoonFill } from 'react-icons/bs'
import { IoLogOutOutline } from 'react-icons/io5'
import { User } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import { setNewChatModalOpen } from '../../store/chatSlice'
import { RootState } from '../../store'
import NewChatModal from '../modals/NewChatModal'
import ProfileModal from '../modals/ProfileModal'

const SidebarHeader: React.FC<{ user: User | null }> = ({ user }) => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.theme)
  const { isNewChatModalOpen } = useSelector((state: RootState) => state.chat)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="
        flex items-center justify-between px-3 py-2 h-16 flex-shrink-0
        border-b border-tg-glass-border bg-tg-700/30 backdrop-blur-md z-10
      ">
        {/* Avatar + Ism */}
        <div 
          onClick={() => setIsProfileOpen(true)} 
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="avatar-wrapper relative">
            {user.avatar ? (
              <img src={user.avatar} className="avatar-base avatar-sm group-hover:scale-105 transition-transform" alt="avatar" />
            ) : (
              <div className="avatar-base avatar-sm avatar-placeholder group-hover:scale-105 transition-transform">
                {user.firstName[0]}
              </div>
            )}
            <span className="online-dot ring-2 ring-tg-700" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-tg-text-1 truncate group-hover:text-tg-accent transition-colors">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xxs text-tg-online flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-tg-online inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              online
            </p>
          </div>
        </div>

        {/* Amallar */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button 
            onClick={() => dispatch(toggleTheme())} 
            className="w-9 h-9 flex items-center justify-center rounded-xl text-tg-accent hover:bg-tg-accent/10 transition-colors" 
            title={mode === 'dark' ? "Kunduzgi rejim" : "Tungi rejim"}
          >
            {mode === 'dark' ? <BsSunFill size={17} /> : <BsMoonFill size={16} />}
          </button>
          <button 
            onClick={() => dispatch(setNewChatModalOpen(true))} 
            className="w-9 h-9 flex items-center justify-center rounded-xl text-tg-text-2 hover:text-tg-text-1 hover:bg-white/5 transition-colors" 
            title="Yangi suhbat"
          >
            <HiMiniPencilSquare size={19} />
          </button>
          <button 
            onClick={() => dispatch(logout())} 
            className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" 
            title="Chiqish"
          >
            <IoLogOutOutline size={19} className="ml-0.5" />
          </button>
        </div>
      </div>

      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => dispatch(setNewChatModalOpen(false))} />
      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

export default SidebarHeader

