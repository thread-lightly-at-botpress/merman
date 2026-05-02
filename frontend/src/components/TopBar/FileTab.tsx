import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

type Props = {
  id: string
  name: string
  isActive: boolean
  onClick: () => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export function FileTab({ id, name, isActive, onClick, onRename, onRemove }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft.trim()) onRename(id, draft.trim())
    else setDraft(name)
  }

  return (
    <div
      className={`group flex items-center gap-1 px-3 h-full border-r border-zinc-800 cursor-pointer select-none text-sm font-mono transition-colors
        ${
          isActive
            ? 'bg-zinc-900 text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
        }`}
      onClick={onClick}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="bg-transparent outline-none w-28 text-zinc-100"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setEditing(false)
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span>{name}</span>
      )}
      <button
        className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(id)
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}
