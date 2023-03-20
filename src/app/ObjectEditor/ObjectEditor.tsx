import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { LexicalComposerContextWithEditor } from "@lexical/react/LexicalComposerContext"
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $parseSerializedNode,
  SerializedEditor,
  SerializedEditorState,
} from "lexical"
import { useRef } from "react"
import DaidaiObject, { DaidaiJSON } from "../store/DaidaiObject"
import ContentEditor from "./ContentEditor"
import InnerContextPlugin from "./plugins/InnerContextPlugin"
import OnSubmitPlugin from "./plugins/OnSubmitPlugin"
import TitleEditor from "./TitleEditor"
import URLEditor from "./URLEditor"

export type Result = { url: string; contentHTML: string }

export type ObjectEditorProps = {
  initialValue?: DaidaiObject
  editable?: boolean
  onSubmit?: (result: Result) => void
}

function ObjectEditor({ editable, initialValue, onSubmit }: ObjectEditorProps) {
  // const titleEditorContextRef = useRef<LexicalComposerContextWithEditor>(null)
  const urlEditorContextRef = useRef<LexicalComposerContextWithEditor>(null)
  const contentEditorContextRef = useRef<LexicalComposerContextWithEditor>(null)

  return (
    <div className="editor--dark">
      <URLEditor
        editable={editable}
        initialEditorState={() => {
          if (initialValue?.url) {
            $getRoot().append($createParagraphNode().append($createTextNode(initialValue.url)))
          }
        }}
      >
        <OnSubmitPlugin
          onSubmit={([editor]) => {
            setTimeout(() => {
              contentEditorContextRef.current?.[0].focus()
            })
          }}
        />
        <InnerContextPlugin ref={urlEditorContextRef} />
      </URLEditor>
      {/* <TitleEditor>
        <OnSubmitPlugin
          onSubmit={([editor]) => {
            setTimeout(() => {
              contentEditorContextRef.current?.[0].focus()
            })
          }}
        />
        <InnerContextPlugin ref={titleEditorContextRef} />
      </TitleEditor> */}
      <ContentEditor
        editable={editable}
        initialEditorState={(editor) => {
          if (initialValue) {
            // editor.setEditorState(editor.parseEditorState(initialValue.content))
            const nodes = $generateNodesFromDOM(editor, initialValue.getContentDOM())
            $getRoot().append(...nodes)
          }
        }}
        onSubmit={() => {
          contentEditorContextRef.current![0].update(() => {
            const url = urlEditorContextRef
              .current![0].getEditorState()
              .read(() => $getRoot().getTextContent())
            const contentHTML = $generateHtmlFromNodes(contentEditorContextRef.current![0], null)
            const result: Result = { url, contentHTML }
            onSubmit?.(result)
          })
        }}
      >
        <InnerContextPlugin ref={contentEditorContextRef} />
      </ContentEditor>
    </div>
  )
}

export default ObjectEditor
