// STUB — replace internals with real POST /compile when backend is ready
export async function compileUML(
  source: string
): Promise<{ code: string }> {
  console.log('[stub] compileUML called')
  console.log('[stub] source preview:', source.slice(0, 120))
  await new Promise((r) => setTimeout(r, 1200))
  return { code: '// C++ output will appear here once the backend is connected.' }
}
