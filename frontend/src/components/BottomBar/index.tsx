import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { CompileStatus } from '../../types'

type Props = {
  fileName: string
  lineCount: number
  renderError: string | null
  compileStatus: CompileStatus
  compileDuration: number | null
  compileError?: string | null
  generatedFileCount?: number | null
  onShowOutput?: () => void
}

export function BottomBar({
  fileName,
  lineCount,
  renderError,
  compileStatus,
  compileDuration,
  compileError = null,
  generatedFileCount = null,
  onShowOutput,
}: Props) {
  return (
    <div className="h-6 flex items-center px-3 gap-3 border-t border-orange-950/80 bg-zinc-950 shrink-0 text-xs font-mono text-zinc-500 shadow-[0_-1px_0_0_rgba(249,115,22,0.12)]">
      <span>{fileName}</span>
      <Separator orientation="vertical" className="h-3 bg-orange-600/35" />
      <span>{lineCount} lines</span>
      <Separator orientation="vertical" className="h-3 bg-orange-600/35" />
      <span>C++</span>
      <Separator orientation="vertical" className="h-3 bg-orange-600/35" />

      {renderError ? (
        <Badge variant="destructive" className="text-xs h-4 px-1.5">
          parse error
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs h-4 px-1.5 text-orange-400 border-orange-600/70 bg-orange-950/40">
          mermaid ok
        </Badge>
      )}

      {compileStatus === 'done' && compileDuration !== null && (
        <>
          <Separator orientation="vertical" className="h-3 bg-orange-600/35" />
          {onShowOutput && (generatedFileCount ?? 0) > 0 ? (
            <button
              onClick={onShowOutput}
              className="text-orange-400 hover:text-orange-300 hover:underline cursor-pointer"
              title="Show generated files"
            >
              compiled in {(compileDuration / 1000).toFixed(1)}s · {generatedFileCount} file{generatedFileCount === 1 ? '' : 's'}
            </button>
          ) : (
            <span className="text-orange-400">
              compiled in {(compileDuration / 1000).toFixed(1)}s
              {generatedFileCount !== null && ` · ${generatedFileCount} file${generatedFileCount === 1 ? '' : 's'}`}
            </span>
          )}
        </>
      )}

      {compileStatus === 'error' && (
        <>
          <Separator orientation="vertical" className="h-3 bg-orange-600/35" />
          <span
            className="text-red-400 truncate max-w-[40ch]"
            title={compileError ?? undefined}
          >
            {compileError ? `compile error: ${compileError.split('\n')[0]}` : 'compile error'}
          </span>
        </>
      )}
    </div>
  )
}
