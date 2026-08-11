import React, { useState, useRef } from 'react'
import { HiPaperAirplane, HiFaceSmile, HiPaperClip, HiMicrophone } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { Chat } from '../../types'
import { api } from '../../api/axios'

interface Props {
  chat: Chat
}

const MessageInput: React.FC<Props> = ({ chat }) => {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return
    if (sending) return

    try {
      setSending(true)

      if (selectedFile) {
        // Send file message via FormData
        const formData = new FormData()
        formData.append('file', selectedFile)
        if (text.trim()) formData.append('text', text.trim())

        let msgType = 'document'
        if (selectedFile.type.startsWith('image/')) msgType = 'image'
        else if (selectedFile.type.startsWith('video/')) msgType = 'video'
        else if (selectedFile.type.startsWith('audio/')) msgType = 'audio'

        formData.append('type', msgType)

        await api.post(`/messages/${chat._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        clearFile()
      } else {
        // Plain text message
        await api.post(`/messages/${chat._id}`, { text: text.trim(), type: 'text' })
      }

      setText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Xabar yuborishda xatolik")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex-shrink-0 bg-tg-700/90 backdrop-blur-tg-sm border-t border-tg-glass-border p-2">
      {/* File Preview */}
      {selectedFile && (
        <div className="max-w-4xl mx-auto mb-2 p-2 bg-tg-600/80 rounded-xl border border-tg-glass-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <img src={previewUrl} className="w-12 h-12 object-cover rounded-lg" alt="preview" />
            ) : (
              <div className="w-12 h-12 bg-tg-accent/20 rounded-lg flex items-center justify-center text-xs font-semibold text-tg-accent">
                FILE
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-tg-text-1 truncate">{selectedFile.name}</p>
              <p className="text-xxs text-tg-text-3">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={clearFile} className="btn-icon-circle text-tg-text-3 hover:text-tg-text-1">
            <IoClose size={18} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-icon-circle mb-0.5 text-tg-text-2"
          title="Fayl biriktirish"
        >
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
            disabled={sending}
            className="w-full bg-transparent outline-none resize-none text-sm text-tg-text-1 placeholder:text-tg-text-4 px-4 py-3 pr-10 max-h-32 overflow-y-auto scrollbar-none"
          />
          <button className="absolute right-3 bottom-2.5 text-tg-text-3 hover:text-tg-text-1 transition-colors">
            <HiFaceSmile size={22} />
          </button>
        </div>

        <div className="mb-0.5 flex-shrink-0">
          {text.trim() || selectedFile ? (
            <button onClick={handleSend} disabled={sending} className="btn-icon-accent">
              {sending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiPaperAirplane size={20} className="-rotate-45 ml-1 mt-1" />
              )}
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
