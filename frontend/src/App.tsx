import { useState, useCallback, useEffect, useRef, type ChangeEvent } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { TopBar } from './components/TopBar'
import { Editor } from './components/Editor'
import { GraphPreview } from './components/GraphPreview'
import { BottomBar } from './components/BottomBar'
import { Sidebar } from './components/Sidebar'
import { useFiles } from './hooks/useFiles'
import { useMermaid } from './hooks/useMermaid'
import { compileMermaid } from './api/compile'
import type { CompileStatus } from './types'
import type { CompileResult } from './types/api'
import { readTextFiles } from './utils/readLocalFiles'

export default function App() {
  const importInputRef = useRef<HTMLInputElement>(null)

  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateSource,
    addFile,
    renameFile,
    removeFile,
    importFiles,
  } = useFiles()

  const { svg, error: renderError } = useMermaid(activeFile.source)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [compileStatus, setCompileStatus] = useState<CompileStatus>('idle')
  const [compileDuration, setCompileDuration] = useState<number | null>(null)
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null)
  const [compileError, setCompileError] = useState<string | null>(null)

  const handleCompile = useCallback(async () => {
    setCompileStatus('running')
    setCompileError(null)
    const t0 = Date.now()
    try {
      const result = await compileMermaid(activeFile.source, {
        targetLanguage: 'cpp',
      })
      setCompileResult(result)
      setCompileDuration(Date.now() - t0)
      if (result.errors.length > 0) {
        setCompileStatus('error')
        setCompileError(result.errors.map((e) => `${e.code}: ${e.message}`).join('\n'))
      } else {
        setCompileStatus('done')
      }
    } catch (err) {
      setCompileResult(null)
      setCompileStatus('error')
      setCompileError(err instanceof Error ? err.message : 'Compile request failed')
    }
  }, [activeFile.source])

  const handleRenameActiveFile = useCallback(() => {
    const nextName = window.prompt('Rename file', activeFile.name)
    if (!nextName) return
    renameFile(activeFile.id, nextName)
  }, [activeFile.id, activeFile.name, renameFile])

  const handleRemoveActiveFile = useCallback(() => {
    removeFile(activeFile.id)
  }, [activeFile.id, removeFile])

  const openFilePicker = useCallback(() => {
    importInputRef.current?.click()
  }, [])

  const handleImportInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files
      e.target.value = ''
      if (!list?.length) return
      try {
        const items = await readTextFiles(Array.from(list))
        importFiles(items)
      } catch {
        console.error('[import] Failed to read one or more files')
      }
    },
    [importFiles]
  )

  useEffect(() => {
    function isTypingContext(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA'
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isTypingContext(e.target)) return

      const key = e.key.toLowerCase()
      const cmdOrCtrl = e.metaKey || e.ctrlKey

      if (cmdOrCtrl && key === 'n') {
        e.preventDefault()
        addFile()
        return
      }

      if (cmdOrCtrl && key === 'o') {
        e.preventDefault()
        importInputRef.current?.click()
        return
      }

      if (cmdOrCtrl && key === 's') {
        e.preventDefault()
        void handleCompile()
        return
      }

      if (e.key === 'F2') {
        e.preventDefault()
        handleRenameActiveFile()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [addFile, handleCompile, handleRenameActiveFile])

  const lineCount = activeFile.source.split('\n').length

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-orange-500/30 selection:text-orange-100">
      <input
        ref={importInputRef}
        type="file"
        multiple
        accept=".mmd,.txt,.md,.markdown,text/plain,text/markdown"
        className="hidden"
        aria-hidden
        onChange={handleImportInputChange}
      />

      <TopBar
        activeFileName={activeFile.name}
        sidebarOpen={sidebarOpen}
        compileStatus={compileStatus}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenFiles={openFilePicker}
        onAddFile={addFile}
        onRenameActiveFile={handleRenameActiveFile}
        onRemoveActiveFile={handleRemoveActiveFile}
        onCompile={handleCompile}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {sidebarOpen && (
          <>
            <ResizablePanel defaultSize={20} minSize={14}>
              <Sidebar
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onAddFile={addFile}
                onOpenFiles={openFilePicker}
                onRemoveFile={removeFile}
              />
            </ResizablePanel>

            <ResizableHandle className="w-px bg-zinc-800 hover:bg-orange-500 transition-colors" />
          </>
        )}

        <ResizablePanel defaultSize={80} minSize={40}>
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={25}>
              <Editor value={activeFile.source} onChange={updateSource} />
            </ResizablePanel>

            <ResizableHandle className="w-px bg-zinc-800 hover:bg-orange-500 transition-colors" />

            <ResizablePanel defaultSize={50} minSize={25}>
              <GraphPreview svg={svg} error={renderError} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      <BottomBar
        fileName={activeFile.name}
        lineCount={lineCount}
        renderError={renderError}
        compileStatus={compileStatus}
        compileDuration={compileDuration}
        compileError={compileError}
        generatedFileCount={compileResult?.files.length ?? null}
      />
    </div>
  )
}
