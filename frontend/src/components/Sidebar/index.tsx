import { FileCode2, Plus, X, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MmdFile } from '../../types'

type Props = {
  files: MmdFile[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onAddFile: () => void
  onOpenFiles: () => void
  onRemoveFile: (id: string) => void
}

export function Sidebar({
  files,
  activeFileId,
  onSelectFile,
  onAddFile,
  onOpenFiles,
  onRemoveFile,
}: Props) {
  return (
    <aside className="h-full w-full border-r border-orange-950/90 bg-gradient-to-b from-zinc-950 to-orange-950/20">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs font-mono uppercase tracking-wide text-orange-400/90">Explorer</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-orange-200 hover:border-orange-500/60"
            onClick={onOpenFiles}
            title="Open from computer"
          >
            <FolderOpen size={12} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-orange-200 hover:border-orange-500/60"
            onClick={onAddFile}
            title="New file"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>

      <div className="py-1">
        {files.map((file) => {
          const isActive = file.id === activeFileId
          return (
            <div
              key={file.id}
              className={`group mx-1 flex cursor-pointer items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-sm ${
                isActive
                  ? 'border-orange-500/40 bg-orange-950/50 text-orange-50 shadow-[inset_3px_0_0_0_rgb(249,115,22)]'
                  : 'text-zinc-400 hover:border-orange-500/25 hover:bg-orange-950/30 hover:text-orange-100'
              }`}
              onClick={() => onSelectFile(file.id)}
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileCode2 size={14} className={`shrink-0 ${isActive ? 'text-orange-400' : 'text-orange-500/60'}`} />
                <span className="truncate font-mono text-xs">{file.name}</span>
              </div>
              {files.length > 1 && (
                <button
                  className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFile(file.id)
                  }}
                  title="Close file"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
