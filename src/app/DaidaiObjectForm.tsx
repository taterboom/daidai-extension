import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"

import Popup from "~components/Popup"

import ObjectEditor, {
  ObjectEditorProps,
  Result
} from "./ObjectEditor/ObjectEditor"
import DaidaiObject from "./store/DaidaiObject"
import useDaiDaiStore from "./store/daidai"

const DaidaiObjectArea = (props: ObjectEditorProps) => {
  return (
    <div className="panel w-[320px] popup:w-[400px] sm:w-[500px] md:w-[640px] lg:w-[768px] xl:w-[1024px]">
      <ObjectEditor {...props}></ObjectEditor>
    </div>
  )
}

function withTimeout<T>(promise: Promise<T>, time: number = 500): Promise<T> {
  return Promise.race([
    new Promise((_, reject) => {
      setTimeout(() => {
        reject("timeout")
      }, time)
    }),
    promise
  ]) as Promise<T>
}

export const DaidaiObjectCreatorInExtension = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)
  const [error, setError] = useState<any>(null)
  useEffect(() => {
    let isMounted = true
    withTimeout(
      chrome.tabs.query({
        active: true,
        currentWindow: true
      })
    )
      .then((tabs) => {
        if (!isMounted) return
        const firstTab = tabs[0]
        if (firstTab && firstTab.url) {
          setCurrentTab(firstTab)
        } else {
          throw new Error("invalid tab")
        }
      })
      .catch((e) => {
        setError(e)
        console.log(e)
      })
    return () => {
      isMounted = false
    }
  }, [])
  const initialValue = useMemo(
    () =>
      currentTab
        ? DaidaiObject.generateFromBookmark({
            url: currentTab.url!,
            title: currentTab.title || "",
            tags: []
          })
        : null,
    [currentTab]
  )

  if (!initialValue && !error) return null
  return (
    <DaidaiObjectCreator
      initialValue={initialValue || undefined}
      show={show}
      onClose={onClose}></DaidaiObjectCreator>
  )
}

export const DaidaiObjectCreator = ({
  show,
  onClose,
  initialValue
}: {
  show: boolean
  onClose: () => void
  initialValue?: DaidaiObject
}) => {
  const add = useDaiDaiStore((state) => state.add)

  return (
    <Popup show={show} onClose={onClose} closeOnClickAway={false}>
      <DaidaiObjectArea
        editable
        initialValue={initialValue}
        onSubmit={(result) => {
          add(new DaidaiObject(result)).then(
            () => {
              toast.success("Success!")
              onClose()
            },
            (e) => {
              toast.error("Faild!")
              console.error("error:", e)
            }
          )
        }}></DaidaiObjectArea>
    </Popup>
  )
}

export const DaidaiObjectEditor = ({
  show,
  onClose,
  index
}: {
  show: boolean
  onClose: () => void
  index?: number
}) => {
  const popupShow = show && index !== undefined
  const daidaiObject = useDaiDaiStore((state) =>
    index === undefined ? undefined : state.data[index]
  )
  const update = useDaiDaiStore((state) => state.update)
  return (
    <Popup show={popupShow} onClose={onClose} closeOnClickAway={false}>
      <DaidaiObjectArea
        editable
        initialValue={daidaiObject}
        onSubmit={(result) => {
          update(index!, new DaidaiObject(result)).then(
            () => {
              toast.success("Success!")
              onClose()
            },
            (e) => {
              toast.error("Faild!")
              console.error("error: ", e)
            }
          )
        }}></DaidaiObjectArea>
    </Popup>
  )
}
