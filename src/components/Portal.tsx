import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const PortalClient: React.FC<{ children: React.ReactNode }> = (props) => {
  const [root, setRoot] = useState<HTMLElement>()

  useEffect(() => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    setRoot(div)
    return () => {
      div.remove()
    }
  }, [])

  if (!root) return null
  return createPortal(props.children, root)
}

const Portal: React.FC<{ children: React.ReactNode }> = (props) => {
  if (typeof window === "undefined") return null
  return <PortalClient>{props.children}</PortalClient>
}

export default Portal
