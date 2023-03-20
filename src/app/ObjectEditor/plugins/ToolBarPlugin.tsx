import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage
} from "@lexical/code"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text"
import { $isAtNodeEnd, $wrapLeafNodesInElements } from "@lexical/selection"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import clsx from "classnames"
import {
  $createParagraphNode,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from "lexical"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"

import Button, { ButtonProps } from "~components/Button"
import {
  BiListOl,
  BiListTask,
  BiListUl,
  FoundationQuote,
  IcBaselineTag,
  IcSharpSettings,
  MaterialSymbolsSave,
  RadixBold,
  RadixCode,
  RadixHeading,
  RadixItalic,
  RadixLink,
  RadixStrikethrough,
  RadixUnderline
} from "~components/icons"

import { IS_APPLE } from "../../utils/environment"
import { $isTagNode, TOGGLE_TAG_COMMAND } from "../Tag/TagNode"
import { FloatingLinkEditor } from "./FloatingLinkEditor"

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

const formatElement = (
  editor: LexicalEditor,
  createElement: () => ElementNode
) => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $wrapLeafNodesInElements(selection, createElement)
    }
  })
}

const CheckButton = (props: ButtonProps & { checked?: boolean }) => {
  return (
    <Button
      {...props}
      className={clsx(props.checked && "bg-base-100/50", props.className)}>
      {props.children}
    </Button>
  )
}

const TagButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Tag"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          editor.dispatchCommand(TOGGLE_TAG_COMMAND, null)
        } else {
          editor.dispatchCommand(TOGGLE_TAG_COMMAND, "")
        }
      }}>
      <IcBaselineTag></IcBaselineTag>
    </CheckButton>
  )
}

const HeadingButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Title"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          formatElement(editor, () => $createParagraphNode())
        } else {
          formatElement(editor, () => $createHeadingNode("h1"))
        }
      }}>
      <RadixHeading></RadixHeading>
    </CheckButton>
  )
}

const QuoteButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Quote"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          formatElement(editor, () => $createParagraphNode())
        } else {
          formatElement(editor, () => $createQuoteNode())
        }
      }}>
      <FoundationQuote></FoundationQuote>
    </CheckButton>
  )
}

const CodeButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Code block"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          formatElement(editor, () => $createParagraphNode())
        } else {
          formatElement(editor, () => $createCodeNode())
        }
      }}>
      <RadixCode></RadixCode>
    </CheckButton>
  )
}

const LinkButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <>
      <CheckButton
        title="Link"
        checked={props.checked}
        onClick={() => {
          if (props.checked) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "")
          }
        }}>
        <RadixLink></RadixLink>
      </CheckButton>
      {props.checked && createPortal(<FloatingLinkEditor />, document.body)}
    </>
  )
}

const BulletListButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Bullet list"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      }}>
      <BiListUl></BiListUl>
    </CheckButton>
  )
}

const NumberListButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Number list"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      }}>
      <BiListOl></BiListOl>
    </CheckButton>
  )
}

const CheckListButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Check list"
      checked={props.checked}
      onClick={() => {
        if (props.checked) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        }
      }}>
      <BiListTask></BiListTask>
    </CheckButton>
  )
}

const FormatBoldButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
      checked={props.checked}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
      <RadixBold></RadixBold>
    </CheckButton>
  )
}

const FormatItalicButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
      checked={props.checked}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
      <RadixItalic></RadixItalic>
    </CheckButton>
  )
}

const FormatUnderlineButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
      checked={props.checked}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
      <RadixUnderline></RadixUnderline>
    </CheckButton>
  )
}

const FormatStikeThroughButton = (props: { checked?: boolean }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <CheckButton
      title="Strikethrough"
      checked={props.checked}
      onClick={() =>
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
      }>
      <RadixStrikethrough></RadixStrikethrough>
    </CheckButton>
  )
}

const ToolBarPlugin = ({ onSubmit }: { onSubmit: () => void }) => {
  const [editor] = useLexicalComposerContext()
  const [currentBlock, setCurrentBlock] = useState<null | {
    key: string
    type: string
    remark?: any
  }>(null)
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isInlineCode, setIsInlineCode] = useState(false)

  const updateToolBar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          setCurrentBlock({
            key: elementKey,
            ...(parentList
              ? { type: parentList.getType(), remark: parentList.getListType() }
              : { type: element.getType(), remark: element.getListType() })
          })
        } else {
          const block: { key: string; type: string; remark?: any } = {
            key: elementKey,
            type: element.getType(),
            remark: null
          }
          if ($isHeadingNode(element)) {
            block.remark = element.getTag()
          }
          if ($isCodeNode(element)) {
            block.remark = element.getLanguage() || getDefaultCodeLanguage()
          }
          setCurrentBlock(block)
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      setIsInlineCode(selection.hasFormat("code"))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    } else if ($isNodeSelection(selection)) {
      const firstNode = selection.getNodes()[0]
      if ($isTagNode(firstNode)) {
        setCurrentBlock({
          key: firstNode.getKey(),
          type: firstNode.getType(),
          remark: firstNode.getTag()
        })
      }
    } else {
      setCurrentBlock(null)
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolBar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolBar()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateToolBar])

  return (
    <div className="flex items-center justify-between flex-wrap handlebar !bg-main-accent">
      <div className="flex items-center flex-wrap">
        <TagButton checked={currentBlock?.type === "tag"} />
        <HeadingButton
          checked={currentBlock?.type === "heading"}></HeadingButton>
        <FormatBoldButton checked={isBold}></FormatBoldButton>
        <FormatItalicButton checked={isItalic}></FormatItalicButton>
        <FormatUnderlineButton checked={isUnderline}></FormatUnderlineButton>
        <FormatStikeThroughButton
          checked={isStrikethrough}></FormatStikeThroughButton>
        <LinkButton checked={isLink}></LinkButton>
        <CodeButton checked={currentBlock?.type === "code"}></CodeButton>
        <BulletListButton
          checked={
            currentBlock?.type === "list" && currentBlock?.remark === "bullet"
          }></BulletListButton>
        <NumberListButton
          checked={
            currentBlock?.type === "list" && currentBlock?.remark === "number"
          }></NumberListButton>
        {/* <CheckListButton
          checked={currentBlock?.type === "list" && currentBlock?.remark === "check"}
        ></CheckListButton> */}
        <QuoteButton checked={currentBlock?.type === "quote"}></QuoteButton>
      </div>
      <Button
        className="flex items-center gap-1"
        onClick={() => {
          onSubmit()
        }}>
        <MaterialSymbolsSave className="text-[1.2em]" /> Save
      </Button>
    </div>
  )
}

export default ToolBarPlugin
