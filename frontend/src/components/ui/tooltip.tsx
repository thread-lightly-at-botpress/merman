import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export function TooltipProvider({
  delayDuration = 100,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

export function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

export function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger {...props} />
}

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={`z-50 rounded-md border border-orange-600/40 bg-zinc-900 px-2 py-1 text-xs text-orange-50 shadow-md shadow-orange-950/40 ${className ?? ''}`}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}
