import type { HTMLAttributes } from 'react'

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'} ${className ?? ''}`}
      {...props}
    />
  )
}
