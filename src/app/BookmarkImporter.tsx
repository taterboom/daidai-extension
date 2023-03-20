import clsx from "classnames"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { useUpdateEffect } from "react-use"

import Button from "~components/Button"
import Popup from "~components/Popup"
import { Tooltip } from "~components/Tooltip"
import {
  MaterialSymbolsSave,
  OpenmojiChrome,
  PhQuestion,
  Upload
} from "~components/icons"
import { useLocalstorageState } from "~components/useLocalstorageState"

import DaidaiObject from "./store/DaidaiObject"
import useDaiDaiStore from "./store/daidai"
import { Bookmark, bookmarkHTMLString2json } from "./utils/bookmarkHtml2json"
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
      className="upload p-8"
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
  return (
    <Button
      className="!btn-accent w-fit mt-8 btn-lg"
      onClick={handleImportFromChromeBookmarks}>
      Import from your Chrome bookmarks <OpenmojiChrome className="ml-2" />
    </Button>
  )
}

type BookmarkImporterPopupProps = {
  children?: React.ReactNode
  show: boolean
  onClose: () => void
}

const BookmarkImporterPopupPopup = (props: BookmarkImporterPopupProps) => {
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

const BookmarksSelect = ({
  value,
  onSubmit
}: {
  value: Bookmark[]
  onSubmit: (e: Bookmark[]) => void
}) => {
  const daidaiObjectUrlSet = useDaiDaiStore(
    (state) => new Set(state.data.map((item) => item.url))
  )
  const [ignoreFirstTagChecked, setIgnoreFirstTagChecked] =
    useLocalstorageState("__daidai_ift", false)
  const [ignoreDuplicatedItemsChecked, setIgnoreDuplicatedItemsChecked] =
    useLocalstorageState("__daidai_idi", false)
  const initCheckedItems = () => {
    const _checkedItemSet = new Set<number>()
    for (let i = 0; i < value.length; i++) {
      if (
        !(ignoreDuplicatedItemsChecked && daidaiObjectUrlSet.has(value[i].url))
      ) {
        _checkedItemSet.add(i)
      }
    }
    return _checkedItemSet
  }
  const [checkedItemSet, setCheckedItemSet] = useState(initCheckedItems)
  const selectAllRef = useRef<HTMLInputElement>(null)

  const displayValue = useMemo(
    () =>
      value.map((item, index) => ({
        ...item,
        duplicated: daidaiObjectUrlSet.has(item.url),
        checked: checkedItemSet.has(index)
      })),
    [checkedItemSet, daidaiObjectUrlSet, value]
  )

  useUpdateEffect(() => {
    if (ignoreDuplicatedItemsChecked) {
      setCheckedItemSet((v) => {
        const newSet = new Set(v)
        v.forEach((item) => {
          if (daidaiObjectUrlSet.has(value[item]?.url)) {
            newSet.delete(item)
          }
        })
        return newSet
      })
    }
  }, [ignoreDuplicatedItemsChecked])

  const submit = () => {
    onSubmit(
      displayValue
        .filter((item) => item.checked)
        .map((item) => ({
          url: item.url,
          title: item.title,
          tags: item.tags.slice(ignoreFirstTagChecked ? 1 : 0)
        }))
    )
  }

  useEffect(() => {
    if (!selectAllRef.current) return
    selectAllRef.current.indeterminate =
      checkedItemSet.size > 0 && checkedItemSet.size < value.length
  }, [checkedItemSet, value.length])

  return (
    <div className="overflow-y-auto max-w-[80vw] max-h-[80vh] w-[800px] 2xl:w-[1024px] h-[600px] 2xl:h-[768px]">
      <div className="flex justify-between items-center mt-4 handlebar px-4 py-2">
        <div className="flex flex-wrap">
          <label className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={ignoreFirstTagChecked}
              onChange={(e) =>
                setIgnoreFirstTagChecked(e.target.checked)
              }></input>

            <span className="label-text">
              Ignore first tag{" "}
              <div
                className="tooltip tooltip-bottom"
                data-tip="The first tag is created by chrome automatically, such as #Bookmarks Bar and #Other Bookmarks, they are useless.">
                <span className="text-info">
                  <PhQuestion className="inline" />
                </span>
              </div>
            </span>
          </label>
          <label className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={ignoreDuplicatedItemsChecked}
              onChange={(e) => {
                setIgnoreDuplicatedItemsChecked(e.target.checked)
              }}></input>
            <span className="label-text">
              Ignore duplicated items <br />
              highlight with{" "}
              <span className="inline-block h-2 w-3 bg-warning"></span>
            </span>
          </label>
        </div>
        <div className="divider divider-horizontal"></div>
        <Button
          className="flex items-center gap-1"
          onClick={() => {
            submit()
          }}>
          <MaterialSymbolsSave /> Save
        </Button>
      </div>
      <table className="table table-compact w-full mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="checkbox block"
                ref={selectAllRef}
                checked={checkedItemSet.size === value.length}
                onChange={(e) =>
                  e.target.checked
                    ? setCheckedItemSet(
                        new Set(
                          Array.from({ length: value.length }).map(
                            (_, index) => index
                          )
                        )
                      )
                    : setCheckedItemSet(new Set())
                }></input>
            </th>
            <th>Site</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {displayValue.map((item, index) => (
            <tr key={index} className={clsx(item.duplicated && "text-warning")}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox block"
                  checked={item.checked}
                  onChange={(e) =>
                    e.target.checked
                      ? setCheckedItemSet((v) => new Set(v).add(index))
                      : setCheckedItemSet((v) => {
                          const newSet = new Set(v)
                          newSet.delete(index)
                          return newSet
                        })
                  }></input>
              </td>
              <td>
                <a href={item.url}>{item.title}</a>
              </td>
              <td>
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={clsx(
                      index === 0 && ignoreFirstTagChecked && "line-through",
                      "px-1"
                    )}>
                    #{tag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookmarkImporterPopupPopup
