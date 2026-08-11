import React from 'react'
import { HiMiniPencilSquare, HiMiniMagnifyingGlass } from 'react-icons/hi2'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { User } from '../../../types'
import { useDispatch } from 'react-redux'
import { logout } from '../../../store/authSlice'

const SidebarHeader: React.FC<{ user: User | null }> = ({ user }) => {
  const dispatch = useDispatch()

  if (!user) return null

  return (
    <div className="
      flex items-center justify-between px-4 h-14 flex-shrink-0
      border-b border-tg-glass-border
    ">
      {/* Avatar + Ism */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="avatar-wrapper">
          {user.avatar ? (
            <img src={user.avatar} className="avatar-base avatar-sm" alt="avatar" />
          ) : (
            <div className="avatar-base avatar-sm avatar-placeholder">
              {user.firstName[0]}
            </div>
          )}
          <span className="online-dot" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-tg-text-1 truncate">
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
        <button className="btn-icon-circle">
          <HiMiniPencilSquare size={18} />
        </button>
        <button onClick={() => dispatch(logout())} className="btn-icon-circle text-red-400 hover:text-red-300 hover:bg-red-500/10" title="Chiqish">
          <BsThreeDotsVertical size={16} />
        </button>
      </div>
    </div>
  )
}

export default SidebarHeader
