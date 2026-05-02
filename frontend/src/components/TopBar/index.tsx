import { Button } from '@/components/ui/button'
import {
  Play,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
  Bot,
} from 'lucide-react'
import type { CompileStatus } from '../../types'

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const LOGO_SRC = `${baseUrl}${encodeURIComponent('(2).svg')}`

type Props = {
  activeFileName: string
  sidebarOpen: boolean
  compileStatus: CompileStatus
  onToggleSidebar: () => void
  onOpenFiles: () => void
  onAddFile: () => void
  onRenameActiveFile: () => void
  onRemoveActiveFile: () => void
  onToggleAiPanel: () => void
  aiPanelOpen: boolean
  onCompile: () => void
}

export function TopBar({
  activeFileName,
  sidebarOpen,
  compileStatus,
  onToggleSidebar,
  onOpenFiles,
  onAddFile,
  onRenameActiveFile,
  onRemoveActiveFile,
  onToggleAiPanel,
  aiPanelOpen,
  onCompile,
}: Props) {
  const isCompiling = compileStatus === 'running'

  return (
    <div className="relative z-50 flex h-11 shrink-0 items-stretch border-b border-orange-950/90 bg-zinc-950 shadow-[0_1px_0_0_rgba(249,115,22,0.12)]">
      <div className="flex items-center gap-3 px-3 border-r border-orange-900/40 shrink-0">
        <img
          src={LOGO_SRC}
          alt=""
          width={120}
          height={32}
          className="h-8 w-auto max-h-8 max-w-[min(140px,28vw)] object-contain object-left"
          draggable={false}
        />
        <span className="hidden sm:inline text-xs font-bold tracking-tight text-zinc-400 font-mono border-l border-orange-900/40 pl-3">
          <span className="text-orange-400">UML</span>
          <span className="text-orange-600/80 mx-1">→</span>
          <span className="text-zinc-300">C++</span>
        </span>
      </div>

      <div className="flex flex-1 items-center px-3">
        <span className="truncate font-mono text-xs text-orange-200/90">{activeFileName}</span>
      </div>

      <div className="flex items-center gap-2 px-3 border-l border-orange-900/40 shrink-0">
        <Button size="sm" variant="outline" className="h-8 px-2" onClick={onToggleSidebar}>
          {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onOpenFiles}>
          <FolderOpen size={13} /> Open
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onAddFile}>
          <Plus size={13} /> New
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onRenameActiveFile}>
          <Pencil size={13} /> Rename
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onRemoveActiveFile}>
          <Trash2 size={13} /> Delete
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`h-8 gap-1 px-2 ${aiPanelOpen ? 'border-orange-500/70 bg-orange-950/40 text-orange-100' : ''}`}
          onClick={onToggleAiPanel}
          title="AI assistant"
        >
          <Bot size={13} /> AI
        </Button>
        <Button
          size="sm"
          onClick={onCompile}
          disabled={isCompiling}
          className="gap-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-mono text-xs shadow-[0_0_20px_-4px_rgba(249,115,22,0.65)]"
        >
          {isCompiling ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Compiling...
            </>
          ) : (
            <>
              <Play size={13} /> Compile
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
