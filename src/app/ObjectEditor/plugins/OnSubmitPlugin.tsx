import {
  LexicalComposerContextWithEditor,
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from "lexical"
import { useEffect, useRef } from "react"

type OnSubmitPluginProps = {
  onSubmit: (context: LexicalComposerContextWithEditor) => void
}

function OnSubmitPlugin(props: OnSubmitPluginProps) {
  const context = useLexicalComposerContext()
  const onSubmitRef = useRef(props.onSubmit)
  onSubmitRef.current = props.onSubmit
  useEffect(() => {
    const [editor] = context
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        e?.preventDefault()
        onSubmitRef.current(context)
        return true
      },
      COMMAND_PRIORITY_LOW
    )
  }, [context])
  return null
}

export default OnSubmitPlugin
