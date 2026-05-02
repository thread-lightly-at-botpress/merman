import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | 'outline'
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={joinClasses(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variant === 'destructive' && 'border-red-700 bg-red-900 text-red-200',
        variant === 'outline' && 'border-orange-600/45 text-orange-200 bg-orange-950/35',
        variant === 'default' && 'border-orange-700/50 bg-orange-950/50 text-orange-100',
        className
      )}
      {...props}
    />
  )
}
