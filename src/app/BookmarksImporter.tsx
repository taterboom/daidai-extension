import React, { useCallback, useState } from "react"
import { toast } from "react-hot-toast"

import Button from "~components/Button"
import Popup from "~components/Popup"
import { Tooltip } from "~components/Tooltip"
import { OpenmojiChrome, Upload } from "~components/icons"

import { BookmarksSelect } from "./BookmarksSelect"
import DaidaiObject from "./store/DaidaiObject"
import useDaiDaiStore from "./store/daidai"
import { Bookmark, bookmarkHTMLString2json } from "./utils/bookmarkConvert"
import { isExtension } from "./utils/ua"

const HTMLInput = ({ onChange }: { onChange: (json: Bookmark[]) => void }) => {
  const handleFile = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      try {
        const json = bookmarkHTMLString2json((e.target?.result as string) || "")
        onChange(json)
      } catch (err) {
        //
      }
    }
    fileReader.readAsText(file)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.includes("html")) {
        handleFile(file)
      }
    }
  }

  return (
    <div
      className="upload"
      onDragOver={(e) => {
        e.preventDefault()
      }}
      onDrop={handleFileDrop}>
      <label
        htmlFor="dropzone-file"
        className="upload-content text-primary-content">
        <div className="upload-placeholder">
          <Upload />
          <p className="upload-tips mt-4">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="upload-tips">your bookmarks.html</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="upload-input"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}

const ChromeBookmarksReader = ({
  onChange
}: {
  onChange: (json: Bookmark[]) => void
}) => {
  const handleImportFromChromeBookmarks = useCallback(async () => {
    const bookmarkTreeRoot = await chrome.bookmarks.getTree()
    const bookmarks: Bookmark[] = []
    const traverse = (
      bookmarkTreeNode: chrome.bookmarks.BookmarkTreeNode,
      tags: string[]
    ) => {
      const { children, title, url } = bookmarkTreeNode
      if (children) {
        const _tags = title ? tags.concat(title) : tags
        children.forEach((item) => traverse(item, _tags))
      } else {
        if (title && url) {
          bookmarks.push({
            title,
            url,
            tags
          })
        }
      }
    }
    bookmarkTreeRoot.forEach((item) => traverse(item, []))
    onChange(bookmarks)
  }, [onChange])
  // return (
  //   <div className="px-8">
  //     <Button
  //       className="!btn-accent w-full mt-8 btn-lg"
  //       onClick={handleImportFromChromeBookmarks}>
  //       Sync with your browser bookmarks <OpenmojiChrome className="ml-2" />
  //     </Button>
  //   </div>
  // )
  return (
    <Button
      className="!btn-accent w-full mt-8 btn-lg"
      onClick={handleImportFromChromeBookmarks}>
      Sync with your browser bookmarks <OpenmojiChrome className="ml-2" />
    </Button>
  )
}

type BookmarkImporterPopupProps = {
  children?: React.ReactNode
  show: boolean
  onClose: () => void
}

const BookmarkImporterPopup = (props: BookmarkImporterPopupProps) => {
  return (
    <Popup show={props.show} onClose={props.onClose} closeOnClickAway={false}>
      <BookmarkImporter onClose={props.onClose} />
    </Popup>
  )
}

const BookmarkImporter = (props: { onClose: () => void }) => {
  const add = useDaiDaiStore((state) => state.add)
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null)

  const submit = (result: Bookmark[]) => {
    if (result && result.length > 0) {
      add(
        ...result.map((item) => DaidaiObject.generateFromBookmark(item))
      ).then(
        () => {
          toast.success("Success!")
          props.onClose?.()
        },
        (e) => {
          toast.error("Faild!")
          console.error("error: ", e)
        }
      )
    }
  }

  return (
    <div className="panel overflow-hidden max-w-[90vw]">
      {bookmarks ? (
        <BookmarksSelect value={bookmarks} onSubmit={submit} />
      ) : (
        <div className="flex flex-col items-center w-[768px] max-w-full">
          {isExtension && (
            <>
              <ChromeBookmarksReader onChange={(e) => setBookmarks(e)} />
              <div className="divider self-auto w-64 mt-10">OR</div>
            </>
          )}
          <HTMLInput onChange={(e) => setBookmarks(e)} />
        </div>
      )}
    </div>
  )
}

export default BookmarkImporterPopup
