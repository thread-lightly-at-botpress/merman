import CodeMirror from '@uiw/react-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { FileCode2 } from 'lucide-react'
import type { GeneratedCppFile } from '../../types'

type Props = {
  files: GeneratedCppFile[]
  activePath: string | null
  onSelectPath: (path: string) => void
}

export function CppOutput({ files, activePath, onSelectPath }: Props) {
  const active =
    files.find((f) => f.path === activePath) ?? files[0] ?? null

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-l border-orange-500/15 bg-zinc-950">
      <div className="flex shrink-0 items-center justify-between border-b border-orange-900/40 px-3 py-2">
        <span className="text-xs font-mono uppercase tracking-wide text-orange-400/90">
          Generated C++
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          {files.length > 0 ? `${files.length} file${files.length === 1 ? '' : 's'}` : '—'}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <nav className="w-44 shrink-0 overflow-y-auto border-r border-orange-900/40 bg-orange-950/15 py-1">
          {files.length === 0 ? (
            <p className="px-3 py-4 text-[11px] leading-relaxed text-zinc-500">
              Run <span className="text-orange-400">Compile</span> to generate headers and sources here.
            </p>
          ) : (
            files.map((f) => {
              const isH = f.path.endsWith('.h') || f.path.endsWith('.hpp')
              const selected = active?.path === f.path
              return (
                <button
                  key={f.path}
                  type="button"
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-mono transition-colors ${
                    selected
                      ? 'border-l-2 border-orange-500 bg-orange-950/40 text-orange-100'
                      : 'border-l-2 border-transparent text-zinc-400 hover:bg-orange-950/25 hover:text-orange-200'
                  }`}
                  onClick={() => onSelectPath(f.path)}
                >
                  <FileCode2 size={13} className={isH ? 'text-orange-300' : 'text-orange-500/80'} />
                  <span className="truncate">{f.path}</span>
                </button>
              )
            })
          )}
        </nav>

        <div className="min-w-0 flex-1 overflow-hidden">
          {!active ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-600">
              No generated files yet
            </div>
          ) : (
            <CodeMirror
              value={active.content}
              height="100%"
              theme={oneDark}
              extensions={[cpp()]}
              editable={false}
              readOnly
              onChange={() => {}}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
              }}
              className="h-full text-sm [&_.cm-editor]:outline-none [&_.cm-scroller]:font-mono"
            />
          )}
        </div>
      </div>
    </div>
  )
}
