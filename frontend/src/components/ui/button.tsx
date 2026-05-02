import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={joinClasses(
        'inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'outline'
          ? 'border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-orange-500/70 hover:bg-orange-950/40 hover:text-orange-100'
          : 'bg-orange-500 text-zinc-950 hover:bg-orange-400',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
        className
      )}
      {...props}
    />
  )
}
