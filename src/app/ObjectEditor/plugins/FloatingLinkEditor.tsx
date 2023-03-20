import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from "lexical"
import { useCallback, useEffect, useRef, useState } from "react"

import Button from "~components/Button"
import { MaterialSymbolsDone, MaterialSymbolsEdit } from "~components/icons"

import { setFloatingElemPosition } from "../utils"
import { getSelectedNode } from "./ToolBarPlugin"

export function FloatingLinkEditor() {
  const [editor] = useLexicalComposerContext()
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [lastSelection, setLastSelection] = useState<RangeSelection | null>(
    null
  )
  const [isEditMode, setEditMode] = useState(false)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl("")
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null || !$isRangeSelection(selection)) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      nativeSelection &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0)
      let rect
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange.getBoundingClientRect()
      }
      setFloatingElemPosition(rect, editorElem, document.body)
      setLastSelection(selection)
    } else if (!activeElement || activeElement !== inputRef.current) {
      setFloatingElemPosition(null, editorElem, document.body)
      setLastSelection(null)
      setLinkUrl("")
      setEditMode(false)
    }

    return true
  }, [editor])

  useEffect(() => {
    const scrollerElem = document.body
    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor()
      })
    }
    window.addEventListener("resize", update)
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update)
    }
    return () => {
      window.removeEventListener("resize", update)
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update)
      }
    }
  }, [editor, updateLinkEditor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditMode])

  const done = useCallback(() => {
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
      }
      setEditMode(false)
    }
  }, [editor, lastSelection, linkUrl])

  return (
    <div
      ref={editorRef}
      className="fixed z-40 max-w-xs w-full p-2 opacity-0 bg-neutral-800/30 shadow-md transition-opacity backdrop-blur-2xl border border-solid"
      style={{ left: -9999, top: -9999 }}>
      {isEditMode ? (
        <div className="flex">
          <input
            ref={inputRef}
            className="flex-1 bg-transparent"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                done()
              } else if (event.key === "Escape") {
                event.preventDefault()
                setEditMode(false)
              }
            }}
          />
          <Button onClick={() => done()}>
            <MaterialSymbolsDone />
          </Button>
        </div>
      ) : (
        <div className="flex">
          <div className="w-0 flex-1 flex items-center">
            {linkUrl ? (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-600">
                {linkUrl}
              </a>
            ) : (
              <span
                className="flex-1 opacity-60"
                onClick={() => {
                  setEditMode(true)
                }}>
                Edit the link here
              </span>
            )}
          </div>
          <Button
            className=""
            tabIndex={0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setEditMode(true)
            }}>
            <MaterialSymbolsEdit />
          </Button>
        </div>
      )}
    </div>
  )
}
