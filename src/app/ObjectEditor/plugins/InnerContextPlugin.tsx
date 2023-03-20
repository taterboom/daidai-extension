import {
  LexicalComposerContextWithEditor,
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext"
import { forwardRef, useImperativeHandle } from "react"

const InnerContextPlugin = forwardRef<LexicalComposerContextWithEditor>(
  function InnerContextPluginImpl(_, ref) {
    const context = useLexicalComposerContext()

    useImperativeHandle(ref, () => context, [context])

    return null
  }
)

export default InnerContextPlugin
