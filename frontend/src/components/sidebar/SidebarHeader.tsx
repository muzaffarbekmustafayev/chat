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
        flex items-center justify-between px-4 h-14 flex-shrink-0
        border-b border-tg-glass-border
      ">
        {/* Avatar + Ism */}
        <div onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group">
          <div className="avatar-wrapper">
            {user.avatar ? (
              <img src={user.avatar} className="avatar-base avatar-sm group-hover:opacity-90 transition-opacity" alt="avatar" />
            ) : (
              <div className="avatar-base avatar-sm avatar-placeholder">
                {user.firstName[0]}
              </div>
            )}
            <span className="online-dot" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-tg-text-1 truncate group-hover:text-tg-accent transition-colors">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xxs text-tg-online flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tg-online inline-block" />
              online
            </p>
          </div>
        </div>

        {/* Amallar */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button 
            onClick={() => dispatch(toggleTheme())} 
            className="btn-icon-circle text-tg-accent hover:text-tg-accent-light" 
            title={mode === 'dark' ? "Kunduzgi rejim" : "Tungi rejim"}
          >
            {mode === 'dark' ? <BsSunFill size={16} /> : <BsMoonFill size={16} />}
          </button>
          <button onClick={() => dispatch(setNewChatModalOpen(true))} className="btn-icon-circle" title="Yangi suhbat">
            <HiMiniPencilSquare size={18} />
          </button>
          <button onClick={() => dispatch(logout())} className="btn-icon-circle text-red-400 hover:text-red-300 hover:bg-red-500/10" title="Chiqish">
            <IoLogOutOutline size={18} className="ml-1" />
          </button>
        </div>
      </div>

      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => dispatch(setNewChatModalOpen(false))} />
      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

export default SidebarHeader

