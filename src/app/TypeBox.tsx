import { useEffect, useRef, useState } from "react"

import Portal from "~components/Portal"

import useDaiDaiStore from "./store/daidai"

const TypeBox = () => {
  const typeTag = useDaiDaiStore((state) => state.typeTag)
  const [text, setText] = useState("")
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    const onType = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === "BACKSPACE") {
        const newText =
          e.metaKey || e.altKey ? "" : textRef.current.slice(0, -1)
        setText(newText)
        typeTag(newText)
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const tagName = (e.target as HTMLElement).tagName.toUpperCase()
      if (tagName === "INPUT" || tagName === "TEXTAREA") return
      if (/^\w$/.test(e.key)) {
        const newText = textRef.current.concat(e.key)
        setText(newText)
        typeTag(newText)
      }
    }
    document.addEventListener("keydown", onType)
    return () => {
      document.removeEventListener("keydown", onType)
    }
  }, [typeTag])

  if (!text) return null
  return (
    <Portal>
      <div className="fixed top-0 right-0 px-2 py-0.5 pointer-events-none bg-gray-100 rounded-bl-md border border-gray-200 backdrop-blur-sm">
        {text}
      </div>
    </Portal>
  )
}

export default TypeBox
