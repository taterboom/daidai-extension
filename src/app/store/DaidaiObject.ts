import type { SerializedHeadingNode } from "@lexical/rich-text"
import type {
  SerializedEditorState,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode
} from "lexical"
import { nanoid } from "nanoid"

import type { SerializedTagNode } from "../ObjectEditor/Tag/TagNode"
import type { Bookmark } from "../utils/bookmarkConvert"

function isSerializedHeadingNode(node: any): node is SerializedHeadingNode {
  return node.type === "heading"
}

function isSerializedTextNode(node: any): node is SerializedTextNode {
  return node.type === "text"
}

export type DaidaiJSON = SerializedEditorState

export type DaidaiHTML = string

export type PlainObject = {
  _url: string
  _contentHTML: DaidaiHTML
  id: string
}

class DaidaiObject {
  static hydrate(plainObject: PlainObject): DaidaiObject | null {
    if (
      plainObject._url === undefined ||
      plainObject._contentHTML === undefined
    )
      return null
    return new DaidaiObject({
      url: plainObject._url,
      contentHTML: plainObject._contentHTML,
      id: plainObject.id
    })
  }

  //"<h1 class="editor-heading-h1"><span>Baidu</span></h1><p class="editor-paragraph"><span class="editor-tag" data-lexical-tag="search"></span><span class="editor-tag" data-lexical-tag="seo"></span><span> </span></p>"
  static generateFromBookmark(bookmark: Bookmark): DaidaiObject {
    return new DaidaiObject({
      url: bookmark.url,
      contentHTML: `<h1 class="editor-heading-h1">${
        bookmark.title
      }</h1><p class="editor-paragraph">${bookmark.tags
        .map(
          (tag) => `<span class="editor-tag" data-lexical-tag="${tag}"></span>`
        )
        .join("")}</p>`
    })
  }

  static generateFromUrl(url: string): DaidaiObject {
    return new DaidaiObject({
      url: url,
      contentHTML: ""
    })
  }

  dehydrate(): PlainObject {
    return {
      id: this.id,
      _url: this._url,
      _contentHTML: this._contentHTML
    }
  }

  private _contentHTML: DaidaiHTML
  private _contentJSON?: DaidaiJSON
  private _cachedDOM?: Document
  private _url: string
  id: string

  constructor({
    url,
    contentHTML,
    contentJSON,
    id
  }: {
    url: string
    contentHTML: DaidaiHTML
    contentJSON?: DaidaiJSON
    id?: string
  }) {
    this._url = url
    this._contentHTML = contentHTML
    this._contentJSON = contentJSON
    this.id = id || nanoid()
  }

  get url() {
    return this._url
  }

  get contentHTML() {
    return this._contentHTML
  }

  get contentJSON() {
    return this._contentJSON
  }

  getContentDOM() {
    if (!this._cachedDOM) {
      this._cachedDOM = this.getContentDomFromHTML()
    }
    return this._cachedDOM
  }

  get title() {
    return this.getTitleFromHTML()
  }

  get tags() {
    return this.getTagsFromHTML()
  }

  get iconUrl() {
    return this.url && getGoogleFaviconUrl(getHost(this.url))
  }

  getTitleFromJSON() {
    if (!this._contentJSON) return null
    let title = ""
    const handle = (node: SerializedLexicalNode | SerializedElementNode) => {
      if (isSerializedHeadingNode(node) && node.tag === "h1") {
        const firstChild = node.children[0]
        if (isSerializedTextNode(firstChild)) {
          title = firstChild.text
        }
      } else if ("children" in node) {
        node.children.forEach(handle)
      }
    }
    this._contentJSON.root.children.forEach(handle)
    return title
  }

  getTagsFromJSON() {
    if (!this._contentJSON) return null
    const _tags: Set<string> = new Set()
    const handle = (node: SerializedLexicalNode | SerializedElementNode) => {
      if (node.type === "tag") {
        _tags.add((node as SerializedTagNode).tag)
      } else if ("children" in node) {
        node.children.forEach(handle)
      }
    }
    this._contentJSON.root.children.forEach(handle)
    return [..._tags]
  }

  getContentDomFromHTML() {
    const dom = new DOMParser().parseFromString(this._contentHTML, "text/html")
    return dom
  }

  getTitleFromHTML() {
    const h1 = this.getContentDOM().querySelector("h1")
    return h1?.textContent || ""
  }

  getTagsFromHTML() {
    const _tags: Set<string> = new Set()
    this.getContentDOM()
      .querySelectorAll<HTMLSpanElement>("[data-lexical-tag]")
      .forEach((item) => {
        if (item.dataset.lexicalTag) {
          _tags.add(item.dataset.lexicalTag)
        }
      })
    return [..._tags]
  }
}

function getHost(url: string) {
  try {
    return new URL(url).host
  } catch (err) {
    // console.warn(err)
    return ""
  }
}

function getGoogleFaviconUrl(host?: string) {
  if (!host) return ""
  // return `https://www.google.com/s2/favicons?domain=${decodeURIComponent(host)}&sz=128`
  return `https://icon.horse/icon/${decodeURIComponent(host)}`
}

export default DaidaiObject
