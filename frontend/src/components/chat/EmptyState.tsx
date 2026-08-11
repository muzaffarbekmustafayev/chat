import React from 'react'
import { useDispatch } from 'react-redux'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiMiniPencilSquare } from 'react-icons/hi2'
import { setNewChatModalOpen } from '../../store/chatSlice'

const EmptyState: React.FC = () => {
  const dispatch = useDispatch()
  
  return (
  <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-5 p-8 bg-transparent relative overflow-hidden">
    {/* Background Pattern */}
    <div 
      className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundRepeat: 'repeat' }} 
    />
    
    {/* Gradient Overlay for extra premium feel */}
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-tg-900/40 to-tg-900/10 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center gap-5">
      <div className="relative">
        <div className="
          w-24 h-24 rounded-full flex items-center justify-center
          bg-accent-gradient shadow-tg-glow animate-glow
        ">
          <FaTelegramPlane size={48} className="text-white drop-shadow ml-[-2px] mt-[2px]" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tg-accent/60 animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-tg-accent/40 animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-tg-text-1 mb-1.5">
          Suhbat tanlang
        </h2>
        <p className="text-sm text-tg-text-2 max-w-[240px] leading-relaxed mx-auto mb-6">
          Chap paneldan chatni tanlang yoki yangi suhbat boshlang
        </p>
        <button 
          onClick={() => dispatch(setNewChatModalOpen(true))}
          className="btn-primary shadow-tg-glow mx-auto flex items-center gap-2"
        >
          <HiMiniPencilSquare size={18} />
          <span>Yangi suhbat</span>
        </button>
      </div>
    </div>
  </div>
  )
}

export default EmptyState
