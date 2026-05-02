import * as React from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'

type ResizablePanelGroupProps = Omit<React.ComponentProps<typeof Group>, 'orientation'> & {
  direction?: 'horizontal' | 'vertical'
}

export function ResizablePanelGroup(
  { direction = 'horizontal', ...props }: ResizablePanelGroupProps
) {
  return <Group orientation={direction} {...props} />
}

export function ResizablePanel(props: React.ComponentProps<typeof Panel>) {
  return <Panel {...props} />
}

export function ResizableHandle(
  props: React.ComponentProps<typeof Separator>
) {
  return <Separator {...props} />
}
