import { Children, cloneElement, isValidElement, useEffect, useRef } from "react"

const ClickAway: React.FC<{
  children: React.ReactNode
  onClickAway?: () => void
}> = ({ children, onClickAway }) => {
  const nodeRef = useRef<Node>()
  const onClickAwayRef = useRef(onClickAway)
  onClickAwayRef.current = onClickAway
  useEffect(() => {
    const listener = (e: Event) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        onClickAwayRef.current?.()
      }
    }
    document.addEventListener("click", listener, true)
    return () => document.removeEventListener("click", listener, true)
  }, [])
  if (!isValidElement(children) || !Children.only(children)) return null
  return cloneElement(children, {
    ...children.props,
    ref: nodeRef,
  })
}

export default ClickAway
