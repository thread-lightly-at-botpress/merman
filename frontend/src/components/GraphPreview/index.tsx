import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  svg: string | null
  error: string | null
}

export function GraphPreview({ svg, error }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  function handleFit() {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0 })
    }
  }

  return (
    <div
      className="relative h-full w-full overflow-auto border-l border-orange-500/10 bg-zinc-950"
      ref={containerRef}
    >
      <div className="absolute top-3 right-3 z-10">
        <Button variant="outline" size="sm" onClick={handleFit}>
          Fit
        </Button>
      </div>

      {!svg && !error && (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-orange-400/70">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="18" height="18" rx="3" stroke="#fb923c" strokeWidth="2" />
            <rect x="26" y="26" width="18" height="18" rx="3" stroke="#f97316" strokeWidth="2" />
            <rect x="4" y="26" width="18" height="18" rx="3" stroke="#fdba74" strokeWidth="2" />
            <line x1="13" y1="22" x2="13" y2="26" stroke="#9a3412" strokeWidth="1.5" />
            <line x1="22" y1="13" x2="35" y2="13" stroke="#9a3412" strokeWidth="1.5" />
            <line x1="35" y1="13" x2="35" y2="26" stroke="#9a3412" strokeWidth="1.5" />
          </svg>
          <p className="text-sm font-mono text-orange-300/80">Edit the diagram to preview</p>
        </div>
      )}

      {error && (
        <div className="m-4 rounded-lg border border-red-800 bg-red-950/40 p-4">
          <Badge variant="destructive" className="mb-2">
            Parse Error
          </Badge>
          <p className="whitespace-pre-wrap text-xs font-mono text-red-300">{error}</p>
        </div>
      )}

      {svg && !error && (
        <div
          className="p-6 min-h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  )
}
