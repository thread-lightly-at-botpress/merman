import { useState, useCallback, useEffect, useRef, type ChangeEvent } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { TopBar } from './components/TopBar'
import { Editor } from './components/Editor'
import { GraphPreview } from './components/GraphPreview'
import { CppOutput } from './components/CppOutput'
import { BottomBar } from './components/BottomBar'
import { Sidebar } from './components/Sidebar'
import { AiAgentPanel } from './components/AiAgentPanel'
import { useFiles } from './hooks/useFiles'
import { useMermaid } from './hooks/useMermaid'
import { compileUML } from './api/compile'
import type { AiChatMessage, CompileStatus, GeneratedCppFile } from './types'
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
  const [generatedCppFiles, setGeneratedCppFiles] = useState<GeneratedCppFile[]>([])
  const [activeGeneratedPath, setActiveGeneratedPath] = useState<string | null>(null)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([])

  useEffect(() => {
    setGeneratedCppFiles([])
    setActiveGeneratedPath(null)
  }, [activeFileId])

  const handleCompile = useCallback(async () => {
    setCompileStatus('running')
    const t0 = Date.now()
    try {
      const { files } = await compileUML(activeFile.source)
      setGeneratedCppFiles(files)
      setActiveGeneratedPath(files[0]?.path ?? null)
      setCompileStatus('done')
      setCompileDuration(Date.now() - t0)
    } catch {
      setCompileStatus('error')
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
        onToggleAiPanel={() => setAiPanelOpen((prev) => !prev)}
        aiPanelOpen={aiPanelOpen}
        onCompile={handleCompile}
      />

      <AiAgentPanel
        open={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        diagramSource={activeFile.source}
        messages={aiMessages}
        onMessagesChange={setAiMessages}
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
            <ResizablePanel defaultSize={34} minSize={18}>
              <Editor value={activeFile.source} onChange={updateSource} />
            </ResizablePanel>

            <ResizableHandle className="w-px bg-zinc-800 hover:bg-orange-500 transition-colors" />

            <ResizablePanel defaultSize={33} minSize={18}>
              <GraphPreview svg={svg} error={renderError} />
            </ResizablePanel>

            <ResizableHandle className="w-px bg-zinc-800 hover:bg-orange-500 transition-colors" />

            <ResizablePanel defaultSize={33} minSize={18}>
              <CppOutput
                files={generatedCppFiles}
                activePath={activeGeneratedPath}
                onSelectPath={setActiveGeneratedPath}
              />
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
      />
    </div>
  )
}
