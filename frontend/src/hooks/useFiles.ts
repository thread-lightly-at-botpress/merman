import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { MmdFile } from '../types'

const DEFAULT_SOURCE = `classDiagram
  class Animal {
    +name : String
    +age : int
    +makeSound() String
  }
  class Dog {
    +breed : String
    +fetch() void
  }
  class Cat {
    +indoor : bool
    +purr() void
  }
  Animal <|-- Dog
  Animal <|-- Cat`

export function useFiles() {
  const [files, setFiles] = useState<MmdFile[]>([
    { id: uuidv4(), name: 'diagram1.mmd', source: DEFAULT_SOURCE },
  ])
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id)

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0]

  const updateSource = useCallback(
    (source: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, source } : f))
      )
    },
    [activeFileId]
  )

  const addFile = useCallback(() => {
    const newFile: MmdFile = {
      id: uuidv4(),
      name: `diagram${files.length + 1}.mmd`,
      source: 'classDiagram\n  class MyClass {\n    +field : String\n  }',
    }
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }, [files.length])

  const renameFile = useCallback((id: string, name: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)))
  }, [])

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id)
        if (next.length === 0) return prev
        return next
      })
      setActiveFileId((prev) => {
        if (prev !== id) return prev
        const remaining = files.filter((f) => f.id !== id)
        return remaining[0]?.id ?? files[0].id
      })
    },
    [files]
  )

  const importFiles = useCallback((items: Array<{ name: string; source: string }>) => {
    if (items.length === 0) return
    const added = items.map((item) => ({
      id: uuidv4(),
      name: item.name,
      source: item.source,
    }))
    setFiles((prev) => [...prev, ...added])
    setActiveFileId(added[added.length - 1].id)
  }, [])

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateSource,
    addFile,
    renameFile,
    removeFile,
    importFiles,
  }
}
