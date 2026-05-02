/** Read plain-text contents from browser File objects (user-selected from disk). */
export async function readTextFiles(files: File[]): Promise<{ name: string; source: string }[]> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<{ name: string; source: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({ name: file.name, source: String(reader.result ?? '') })
          reader.onerror = () => reject(reader.error ?? new Error('read failed'))
          reader.readAsText(file)
        })
    )
  )
}
