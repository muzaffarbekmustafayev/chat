import React, { useState, useRef } from 'react'
import { HiPaperAirplane, HiFaceSmile, HiPaperClip, HiMicrophone } from 'react-icons/hi2'
import { Chat } from '../../types'
import { api } from '../../api/axios'

interface Props {
  chat: Chat
}

const MessageInput: React.FC<Props> = ({ chat }) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }

  const handleSend = async () => {
    if (!text.trim()) return
    try {
      await api.post(`/messages/${chat._id}`, { text: text.trim(), type: 'text' })
      setText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex-shrink-0 bg-tg-700/90 backdrop-blur-tg-sm border-t border-tg-glass-border p-2">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <button className="btn-icon-circle mb-0.5 text-tg-text-2">
          <HiPaperClip size={22} />
        </button>

        <div className="flex-1 relative bg-tg-500/70 border border-tg-glass-border rounded-2xl focus-within:border-tg-accent/40 focus-within:bg-tg-500 transition-all duration-200 flex items-end">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); autoResize() }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Xabar yozing..."
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-sm text-tg-text-1 placeholder:text-tg-text-4 px-4 py-3 pr-10 max-h-32 overflow-y-auto scrollbar-none"
          />
          <button className="absolute right-3 bottom-2.5 text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <HiFaceSmile size={22} />
          </button>
        </div>

        <div className="mb-0.5 flex-shrink-0">
          {text.trim() ? (
            <button onClick={handleSend} className="btn-icon-accent">
              <HiPaperAirplane size={20} className="-rotate-45 ml-1 mt-1" />
            </button>
          ) : (
            <button className="btn-icon-circle text-tg-text-2">
              <HiMicrophone size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageInput
