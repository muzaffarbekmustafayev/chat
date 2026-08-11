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
      flex items-center gap-2.5 px-3 py-2 rounded-xl
      bg-tg-500/60 border border-tg-glass-border
      focus-within:border-tg-accent/50
      focus-within:ring-2 focus-within:ring-tg-accent/10
      focus-within:bg-tg-500
      transition-all duration-200
    ">
      <HiMiniMagnifyingGlass size={16} className="text-tg-text-3 flex-shrink-0" />
      <input
        value={value}
        onChange={onChange}
        placeholder="Qidiruv..."
        className="
          flex-1 bg-transparent outline-none
          text-sm text-tg-text-1 placeholder:text-tg-text-4
        "
      />
      {value && (
        <button onClick={onClear} className="text-tg-text-3 hover:text-tg-text-1 transition-colors">
          <IoClose size={16} />
        </button>
      )}
    </div>
  </div>
)

export default SearchBar
