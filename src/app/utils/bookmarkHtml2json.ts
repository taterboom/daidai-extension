import DaidaiObject from "../store/DaidaiObject"

export type Bookmark = {
  title: string
  url: string
  tags: string[]
}

export function bookmarkHTMLString2json(htmlString: string) {
  return bookmarkHTML2json(new DOMParser().parseFromString(htmlString, "text/html"))
}

export function bookmarkHTML2json(doc: Document, ignoreTags = ["书签栏"]) {
  const result: Bookmark[] = []
  function traverse(dl: Element, tags: string[] = []) {
    for (const childElement of dl.children) {
      if (childElement.tagName === "DT") {
        const fe = childElement.firstElementChild
        if (!fe) continue
        if (
          fe.tagName === "H3" &&
          fe.nextElementSibling &&
          fe.nextElementSibling.tagName === "DL"
        ) {
          traverse(fe.nextElementSibling, tags.concat(fe.textContent || ""))
        } else if (fe.tagName === "A") {
          result.push({
            title: fe.textContent || "",
            url: (<HTMLAnchorElement>fe).href,
            tags: tags.filter((t) => !ignoreTags.includes(t)),
          })
        }
      }
    }
  }
  traverse(doc.querySelector("dl") as Element)
  return result
}

export function jsonToBookmarksHTML(tagData: Record<string, DaidaiObject[]>) {
  let str = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><H3 ADD_DATE="1643212013" LAST_MODIFIED="1662518479" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks Bar</H3>
  <DL><p>`
  for (const [tag, daidaiObjs] of Object.entries(tagData)) {
    str += `
    <DT><H3>${tag}</H3>
    <DL><p>
      ${daidaiObjs
        .map((item, index) => `<DT><A HREF="${item.url}">${item.title}</A>`)
        .join(`\n      `)}
    </DL><p>`
  }
  str += `
  </DL><p>
</DL><p>
`

  return str
}
