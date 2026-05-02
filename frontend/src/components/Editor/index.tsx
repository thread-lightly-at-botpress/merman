import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: Props) {
  return (
    <div className="h-full w-full overflow-hidden border-l border-orange-500/15 bg-zinc-950 transition-colors focus-within:border-orange-500/45 focus-within:shadow-[inset_0_0_0_1px_rgba(249,115,22,0.15)]">
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={[markdown()]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
        }}
        className="h-full text-sm"
      />
    </div>
  )
}
