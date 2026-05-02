import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, X, FileCode2, Copy, Check } from 'lucide-react'
import type { CompileResult } from '../../types/api'

type Props = {
  result: CompileResult
  onClose: () => void
}

function languageFromPath(path: string): string {
  if (path.endsWith('.hpp') || path.endsWith('.h')) return 'cpp-header'
  if (path.endsWith('.cpp') || path.endsWith('.cc')) return 'cpp'
  if (path.endsWith('.py')) return 'python'
  return 'text'
}

export function CompileOutput({ result, onClose }: Props) {
  const [activePath, setActivePath] = useState<string | null>(
    result.files[0]?.path ?? null
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setActivePath(result.files[0]?.path ?? null)
  }, [result])

  const active = result.files.find((f) => f.path === activePath) ?? result.files[0]

  function downloadActive() {
    if (!active) return
    const blob = new Blob([active.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = active.path.split('/').pop() ?? 'file.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function copyActive() {
    if (!active) return
    try {
      await navigator.clipboard.writeText(active.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 border-t border-orange-950/90">
      <div className="flex items-center gap-2 px-3 h-9 border-b border-orange-950/80 shrink-0">
        <span className="text-xs font-mono uppercase tracking-wide text-orange-400/90">
          Output
        </span>
        <Badge
          variant="outline"
          className="text-xs h-4 px-1.5 text-orange-400 border-orange-600/70 bg-orange-950/40"
        >
          {result.metadata.targetLanguage}
        </Badge>
        <span className="text-xs font-mono text-zinc-500">
          {result.metadata.classCount} class{result.metadata.classCount === 1 ? '' : 'es'}
          {' · '}
          {result.files.length} file{result.files.length === 1 ? '' : 's'}
        </span>

        {result.warnings.length > 0 && (
          <Badge variant="outline" className="text-xs h-4 px-1.5 text-yellow-400 border-yellow-600/70 bg-yellow-950/30">
            {result.warnings.length} warning{result.warnings.length === 1 ? '' : 's'}
          </Badge>
        )}

        <div className="flex-1" />

        <Button size="sm" variant="outline" className="h-7 px-2 gap-1" onClick={copyActive} disabled={!active}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-2 gap-1" onClick={downloadActive} disabled={!active}>
          <Download size={12} />
          Download
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-2" onClick={onClose} title="Hide output">
          <X size={12} />
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-56 shrink-0 overflow-y-auto border-r border-orange-950/70 py-1">
          {result.files.map((f) => {
            const isActive = f.path === active?.path
            return (
              <button
                key={f.path}
                onClick={() => setActivePath(f.path)}
                className={`group mx-1 mb-0.5 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-mono ${
                  isActive
                    ? 'border-orange-500/40 bg-orange-950/50 text-orange-50 shadow-[inset_3px_0_0_0_rgb(249,115,22)]'
                    : 'border-transparent text-zinc-400 hover:border-orange-500/25 hover:bg-orange-950/30 hover:text-orange-100'
                }`}
                title={f.path}
              >
                <FileCode2
                  size={12}
                  className={`shrink-0 ${isActive ? 'text-orange-400' : 'text-orange-500/60'}`}
                />
                <span className="truncate">{f.path}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-w-0 overflow-auto">
          {active ? (
            <pre
              className="text-xs font-mono leading-relaxed text-zinc-200 px-4 py-3 whitespace-pre"
              data-language={languageFromPath(active.path)}
            >
              {active.content}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-500">
              No files generated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
