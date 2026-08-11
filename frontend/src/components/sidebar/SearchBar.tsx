import React from 'react'
import { HiMiniMagnifyingGlass } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

const SearchBar: React.FC<Props> = ({ value, onChange, onClear }) => (
  <div className="px-3 py-2 flex-shrink-0">
    <div className="
      flex items-center bg-tg-600/50 hover:bg-tg-600/80 rounded-full
      border border-transparent focus-within:border-tg-accent/50 focus-within:bg-tg-800
      transition-all duration-300 shadow-inner
    ">
      <div className="pl-3.5 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
        <HiMiniMagnifyingGlass size={18} />
      </div>
      <input
        value={value}
        onChange={onChange}
        placeholder="Qidiruv..."
        className="flex-1 bg-transparent border-none rounded-full px-3 py-2 text-[14px] text-tg-text-1 placeholder:text-tg-text-4 outline-none"
      />
      {value && (
        <button onClick={onClear} className="pr-3.5 text-tg-text-3 hover:text-tg-text-1 transition-colors">
          <IoClose size={18} />
        </button>
      )}
    </div>
  </div>
)

export default SearchBar
