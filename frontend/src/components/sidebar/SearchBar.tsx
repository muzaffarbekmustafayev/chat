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
    <div className="tg-input-wrapper group">
      <div className="pl-3 text-tg-text-3 group-focus-within:text-tg-accent transition-colors">
        <HiMiniMagnifyingGlass size={16} />
      </div>
      <input
        value={value}
        onChange={onChange}
        placeholder="Qidiruv..."
        className="flex-1 bg-transparent border-none rounded-2xl px-2 py-2 text-sm text-tg-text-1 placeholder:text-tg-text-4 outline-none"
      />
      {value && (
        <button onClick={onClear} className="pr-3 text-tg-text-3 hover:text-tg-text-1 transition-colors">
          <IoClose size={16} />
        </button>
      )}
    </div>
  </div>
)

export default SearchBar
