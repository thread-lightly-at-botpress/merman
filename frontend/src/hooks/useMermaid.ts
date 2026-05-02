import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background: '#09090b',
    primaryColor: '#1c1410',
    primaryTextColor: '#fff7ed',
    primaryBorderColor: '#ea580c',
    secondaryBorderColor: '#f97316',
    lineColor: '#fb923c',
    secondaryColor: '#292524',
    tertiaryColor: '#18181b',
    clusterBorder: '#f97316',
    edgeLabelBackground: '#292524',
  },
})

export function useMermaid(source: string, debounceMs = 400) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(0)

  useEffect(() => {
    if (!source.trim()) {
      setSvg(null)
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      idRef.current += 1
      const currentId = idRef.current
      const renderId = `mermaid-${Date.now()}`

      try {
        const { svg: rendered } = await mermaid.render(renderId, source)
        if (currentId === idRef.current) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err: unknown) {
        if (currentId === idRef.current) {
          setSvg(null)
          setError(err instanceof Error ? err.message : 'Parse error')
        }
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [source, debounceMs])

  return { svg, error }
}
