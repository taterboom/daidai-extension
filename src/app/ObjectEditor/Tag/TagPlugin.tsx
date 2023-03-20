import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
  LexicalNode,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { useCallback, useEffect, useState } from "react"
import { FloatingTagEditor } from "./FloatingTagEditor"
import TagNode, { toggleTag, TOGGLE_TAG_COMMAND } from "./TagNode"

const TAG_REGEXP = /^#\S*$/

function canConvertToTag(node: LexicalNode) {
  const textContent = node.getTextContent().trimStart()
  return $isTextNode(node) && $isParagraphNode(node.getParent()) && TAG_REGEXP.test(textContent)
}

const TagPlugin = () => {
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([TagNode])) {
      throw new Error("TagPlugin: TagNode not registered on editor")
    }
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_TAG_COMMAND,
      (tag) => {
        return toggleTag(tag)
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  const updateEditingTag = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection) && selection.isCollapsed()) {
      const node = selection.anchor.getNode()
      if (canConvertToTag(node)) {
        setEditingTag(node.getTextContent().trim().slice(1))
      } else {
        setEditingTag(null)
      }
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateEditingTag()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateEditingTag()
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection) && selection.isCollapsed()) {
            const node = selection.anchor.getNode()
            const textContent = node.getTextContent().trim()
            if (canConvertToTag(node)) {
              if (event !== null) {
                event.preventDefault()
              }
              return editor.dispatchCommand(TOGGLE_TAG_COMMAND, textContent.slice(1))
            }
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, updateEditingTag])

  const onFloatingEditorChange = useCallback(
    (v: string) => {
      editor.dispatchCommand(TOGGLE_TAG_COMMAND, v)
      setEditingTag(null)
    },
    [editor]
  )

  return (
    <>
      {editingTag !== null && (
        <FloatingTagEditor value={editingTag} onChange={onFloatingEditorChange}></FloatingTagEditor>
      )}
    </>
  )
}

export default TagPlugin
