import React from 'react'
import { MdDoneAll, MdDone, MdEdit, MdReply } from 'react-icons/md'
import { BsPlayCircleFill } from 'react-icons/bs'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { format } from 'date-fns'
import { Message } from '../../types'

interface Props {
  message: Message
  isMine: boolean
  isFirst?: boolean
}

const formatBytes = (bytes?: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const MessageBubble: React.FC<Props> = ({ message, isMine, isFirst }) => {
  return (
    <div className={`flex gap-2 group ${isMine ? "justify-end" : "justify-start"} ${isFirst ? "mt-2" : "mt-0.5"}`}>
      
      {!isMine && (
        <div className="w-8 flex-shrink-0 flex items-end">
          {isFirst ? (
            <div className="avatar-base avatar-sm avatar-placeholder">
              {message.sender.firstName[0]}
            </div>
          ) : <div className="w-8" />}
        </div>
      )}

      <div className={isMine ? "msg-out" : "msg-in"}>
        {!isMine && isFirst && message.chat && (
          <p className="text-xxs font-bold text-gradient mb-1">
            {message.sender.firstName}
          </p>
        )}

        {message.replyTo && (
          <div className="flex gap-2 mb-2 pl-2 py-1 border-l-2 border-tg-accent rounded-r-lg bg-black/20">
            <div className="min-w-0">
              <p className="text-xxs font-semibold text-tg-accent truncate">
                {message.replyTo.sender.firstName}
              </p>
              <p className="text-xxs text-tg-text-2 truncate">
                {message.replyTo.text || "Media"}
              </p>
            </div>
          </div>
        )}

        {message.type === "image" && message.media && (
          <div className="relative mb-1 -mx-1 -mt-1 overflow-hidden rounded-xl">
            <img src={message.media.url} alt="" className="w-full max-h-72 object-cover" loading="lazy" />
          </div>
        )}

        {message.type === "video" && message.media && (
          <div className="relative mb-1 -mx-1 -mt-1 rounded-xl overflow-hidden bg-black cursor-pointer group/video">
            <video src={message.media.url} className="w-full max-h-56 object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BsPlayCircleFill size={48} className="text-white/90 drop-shadow-lg group-hover/video:scale-110 transition-transform" />
            </div>
          </div>
        )}

        {message.type === "document" && message.media && (
          <div className="flex items-center gap-2.5 mb-1 p-2 bg-black/20 rounded-xl min-w-[180px]">
            <div className="w-9 h-9 rounded-lg bg-tg-accent/20 flex items-center justify-center flex-shrink-0">
              <AiOutlineFilePdf size={20} className="text-tg-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-tg-text-1 truncate">{message.media.filename}</p>
              <p className="text-xxs text-tg-text-3">{formatBytes(message.media.filesize)}</p>
            </div>
          </div>
        )}

        {message.text && (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        <div className="flex items-center gap-1 justify-end mt-0.5">
          {message.isEdited && (
            <span className="text-xxs text-tg-text-3 flex items-center gap-0.5">
              <MdEdit size={10} /> tahrirlangan
            </span>
          )}
          <span className="text-xxs text-tg-text-3">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          {isMine && (
            message.readBy?.length > 1
              ? <MdDoneAll size={14} className="text-tg-tick" />
              : <MdDone size={14} className="text-tg-text-3" />
          )}
        </div>

        <div className="
          absolute -top-7 right-0
          flex items-center gap-1 px-2 py-1
          bg-tg-400/95 backdrop-blur-tg-sm border border-tg-glass-border
          rounded-lg shadow-tg-md
          opacity-0 group-hover:opacity-100
          transition-all duration-150 scale-95 group-hover:scale-100
          pointer-events-none group-hover:pointer-events-auto
        ">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-tg-text-2 hover:bg-tg-500 hover:text-tg-text-1" title="Javob berish">
            <MdReply size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
