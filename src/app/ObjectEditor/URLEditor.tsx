import { $getRoot, $getSelection } from "lexical"
import { InitialEditorStateType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import TreeViewPlugin from "./plugins/TreeViewPlugin"

type URLEditorProps = {
  initialEditorState?: InitialEditorStateType
  editable?: boolean
  children?: JSX.Element | string | (JSX.Element | string)[]
}

const URLEditor = (props: URLEditorProps) => {
  return (
    <a className="relative">
      <LexicalComposer
        initialConfig={{
          editorState: props.initialEditorState,
          editable: props.editable,
          namespace: "url-editor",
          onError: console.log,
          theme: {
            paragraph: "text-2xl font-semibold",
          },
        }}
      >
        <PlainTextPlugin
          contentEditable={<ContentEditable className="p-2" />}
          placeholder={
            <div className="absolute top-0 left-0 p-2 text-2xl font-semibold opacity-60 select-none pointer-events-none">
              Link
            </div>
          }
        ></PlainTextPlugin>
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              console.log("url-editor onChange:", editorState, $getRoot(), $getSelection())
            })
          }}
        ></OnChangePlugin>
        <HistoryPlugin />
        {/* <TreeViewPlugin /> */}
        <>{props.children}</>
      </LexicalComposer>
    </a>
  )
}

export default URLEditor
