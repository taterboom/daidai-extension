import {
  $createTextNode,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $isTextNode,
  createCommand,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
  SerializedLexicalNode,
} from "lexical"

import { TagComponent } from "./TagComponent"

export type SerializedTagNode = SerializedLexicalNode & {
  type: "tag"
  version: 1
  tag: string
}

function convertAnchorElement(domNode: Node): DOMConversionOutput {
  let node = null
  if (domNode instanceof HTMLSpanElement && domNode.dataset.lexicalTag) {
    node = $createTagNode(domNode.dataset.lexicalTag)
  }
  return { node }
}

export class TagNode extends DecoratorNode<JSX.Element> {
  __tag: string

  static getType(): string {
    return "tag"
  }

  static clone(node: TagNode): TagNode {
    return new TagNode(node.__tag)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: Node) => ({
        conversion: convertAnchorElement,
        priority: 1,
      }),
    }
  }

  constructor(tag: string, key?: NodeKey) {
    super(key)
    this.__tag = tag
  }

  setTag(tag: string) {
    // getWritable() creates a clone of the node
    // if needed, to ensure we don't try and mutate
    // a stale version of this node.
    const self = this.getWritable()
    self.__tag = tag
  }

  getTag(): string {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest()
    return self.__tag
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLSpanElement {
    const tag = document.createElement("span")
    tag.classList.add("editor-tag")
    tag.dataset.lexicalTag = this.__tag

    return tag
  }

  updateDOM(_prevNode: TagNode, _dom: HTMLElement, _config: EditorConfig): false {
    return false
  }

  isTopLevel(): true {
    return true
  }

  getTextContent(): string {
    return `#${this.__tag} `
  }

  static importJSON(serializedNode: SerializedTagNode): TagNode {
    return $createTagNode(serializedNode.tag)
  }

  exportJSON(): SerializedTagNode {
    return {
      version: 1,
      type: "tag",
      tag: this.__tag,
    }
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return <TagComponent tag={this.__tag} nodeKey={this.__key} />
  }
}

export function $createTagNode(tag: string) {
  return new TagNode(tag)
}

export function $isTagNode(node: any): node is TagNode {
  return node instanceof TagNode
}

export const TOGGLE_TAG_COMMAND: LexicalCommand<string | null> = createCommand()

export function toggleTag(tag: string | null): boolean {
  const selection = $getSelection()
  if (tag === null) {
    if (!$isNodeSelection(selection)) return false
    const [node] = selection.extract()
    if (!$isTagNode(node)) return false
    node.insertBefore($createTextNode(node.getTextContent()))
    node.remove()
    return true
  } else {
    if (!$isRangeSelection(selection)) return false
    const focusNode = selection.focus.getNode()
    if (!$isTextNode(focusNode)) return false
    const focusNodeTextContent = focusNode.getTextContent().trim()
    const tagNode = $createTagNode(
      tag ||
        (focusNodeTextContent.startsWith("#")
          ? focusNodeTextContent.slice(1)
          : focusNodeTextContent)
    )
    focusNode.insertBefore(tagNode)
    focusNode.setTextContent(" ")
    focusNode.select()
    return true
  }
}

export default TagNode
