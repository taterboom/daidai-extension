import { $getRoot, $getSelection } from "lexical"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import TreeViewPlugin from "./plugins/TreeViewPlugin"

type TitleEditorProps = {
  children?: JSX.Element | string | (JSX.Element | string)[]
}

const TitleEditor = (props: TitleEditorProps) => {
  return (
    <div className="relative">
      <LexicalComposer
        initialConfig={{
          namespace: "title-editor",
          onError: console.log,
          theme: { paragraph: "text-lg font-semibold" },
        }}
      >
        <PlainTextPlugin
          contentEditable={<ContentEditable className="p-2" />}
          placeholder={
            <div className="absolute left-0 top-0 p-2 text-lg font-semibold opacity-60 select-none pointer-events-none">
              Title
            </div>
          }
        ></PlainTextPlugin>
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              console.log("title-editor onChange:", editorState, $getRoot(), $getSelection())
            })
          }}
        ></OnChangePlugin>
        <HistoryPlugin />
        {/* <TreeViewPlugin /> */}
        <>{props.children}</>
      </LexicalComposer>
    </div>
  )
}

export default TitleEditor
