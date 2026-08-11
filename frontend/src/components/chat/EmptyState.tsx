import React from 'react'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { HiMiniPencilSquare } from 'react-icons/hi2'

const EmptyState: React.FC = () => (
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
          bg-tg-accent-muted border border-tg-accent/20
          shadow-tg-glow animate-glow
        ">
          <IoChatbubbleEllipsesOutline size={48} className="text-tg-accent" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tg-accent/30 animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-tg-accent/20 animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-tg-text-1 mb-1.5">
          Suhbat tanlang
        </h2>
        <p className="text-sm text-tg-text-2 max-w-[240px] leading-relaxed mx-auto">
          Chap paneldan chatni tanlang yoki yangi suhbat boshlang
        </p>
      </div>
    </div>
  </div>
)

export default EmptyState
