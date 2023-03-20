import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { CHECK_LIST, TRANSFORMERS } from "@lexical/markdown"
import { TextFormatTransformer } from "@lexical/markdown"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import {
  InitialEditorStateType,
  LexicalComposer
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $parseSerializedNode
} from "lexical"

import { IcBaselineTag, MaterialSymbolsSpaceBar } from "~components/icons"

import TagNode from "./Tag/TagNode"
import TagPlugin from "./Tag/TagPlugin"
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import ToolBarPlugin from "./plugins/ToolBarPlugin"
import TreeViewPlugin from "./plugins/TreeViewPlugin"

export const TRANSFORMER_UNDERLINE: TextFormatTransformer = {
  format: ["underline"],
  tag: "~",
  type: "text-format"
}

const transformers = [CHECK_LIST, TRANSFORMER_UNDERLINE, ...TRANSFORMERS]

const nodes = [
  TagNode,
  HeadingNode,
  HorizontalRuleNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode
]

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5"
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem"
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
    listitemChecked: "editor-listitem--checked",
    listitemUnchecked: "editor-listitem--unchecked"
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code"
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable"
  }
}

type ContentEditorProps = {
  initialEditorState?: InitialEditorStateType
  editable?: boolean
  children?: React.ReactElement
  onSubmit: () => void
}

const ContentEditor = (props: ContentEditorProps) => {
  const initialConfig = {
    editorState: props.initialEditorState,
    editable: props.editable,
    namespace: "object-editor",
    nodes: nodes,
    theme: theme,
    onError: console.log
  }
  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="p-2 min-h-[256px] max-h-[80vh] overflow-y-auto" />
          }
          placeholder={
            <div className="absolute left-0 top-0 p-2 opacity-60 select-none pointer-events-none">
              <p className="font-medium">
                Type{" "}
                <kbd className="kbd kbd-sm">
                  <IcBaselineTag />
                </kbd>{" "}
                <kbd className="kbd kbd-sm">
                  <MaterialSymbolsSpaceBar className="align-bottom" />
                </kbd>{" "}
                for title
              </p>
              <p className="text-sm mt-1">
                Type{" "}
                <kbd className="kbd kbd-sm">
                  <IcBaselineTag />
                </kbd>{" "}
                for tags
              </p>
            </div>
          }></RichTextPlugin>
        <ToolBarPlugin onSubmit={props.onSubmit} />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              console.log("onChange:", editorState, $getRoot(), $getSelection())
            })
          }}></OnChangePlugin>
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <CodeHighlightPlugin />
        <MarkdownShortcutPlugin transformers={transformers} />
        <TagPlugin />
        {/* <TreeViewPlugin /> */}
        {props.children !== undefined ? props.children : <></>}
      </LexicalComposer>
    </div>
  )
}

export default ContentEditor
