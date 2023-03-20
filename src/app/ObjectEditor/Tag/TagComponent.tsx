import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import clsx from "classnames"
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey
} from "lexical"
import { useCallback, useEffect, useRef } from "react"

import { IcBaselineTag } from "~components/icons"

import { $isTagNode } from "./TagNode"

export const TagComponent = ({
  tag,
  nodeKey
}: {
  tag: string
  nodeKey: NodeKey
}) => {
  const [editor] = useLexicalComposerContext()
  const elRef = useRef<HTMLElement>(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isTagNode(node)) {
          node.remove()
        }
        setSelected(false)
      }
      return false
    },
    [isSelected, nodeKey, setSelected]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const container = elRef.current

          // @ts-ignore
          if (container?.contains(event.target)) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, onDelete, setSelected])

  return (
    <span
      ref={elRef}
      className={clsx(
        "relative inline-flex justify-center items-center gap-0.5 whitespace-nowrap px-2 py-0.5 text-sm border transition-all",
        isSelected ? " border-primary-focus" : "border-base-content"
      )}>
      <IcBaselineTag />
      <span className="">{tag}</span>
    </span>
  )
}

export default TagComponent
