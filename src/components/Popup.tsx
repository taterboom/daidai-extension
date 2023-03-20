import clsx from "classnames"
import React, { useEffect } from "react"

import Button from "./Button"
import ClickAway from "./ClickAway"
import Fade from "./Fade"
import Portal from "./Portal"
import { Close, IcRoundClose } from "./icons"

const usePreventScroll = (on: boolean) => {
  useEffect(() => {
    if (on) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.removeProperty("overflow")
      }
    }
  }, [on])
}

const Popup: React.FC<{
  show: boolean
  closeIcon?: React.ReactElement
  centerX?: boolean
  centerY?: boolean
  children: React.ReactNode
  closeOnClickAway?: boolean
  closeable?: boolean
  className?: string
  wrapperClassName?: string
  onClose?: () => void
}> = ({
  children,
  show,
  closeIcon = <Close />,
  closeOnClickAway = true,
  closeable = true,
  centerX = true,
  centerY = true,
  wrapperClassName,
  className,
  onClose
}) => {
  usePreventScroll(show)
  const body = (
    <div className={clsx(`relative`, wrapperClassName)}>
      {closeable && (
        <div className="absolute right-0 -top-1 -translate-y-full text-2xl">
          <Button onClick={() => show && onClose?.()}>{closeIcon}</Button>
        </div>
      )}
      {children}
    </div>
  )
  return (
    <Portal>
      <Fade in={show}>
        <div
          className={clsx(
            `fixed inset-0 z-20 bg-[#282B75]/30 backdrop-blur-2xl overflow-auto py-4 flex`,
            centerX && "justify-center",
            centerY && "items-center",
            className
          )}>
          {closeOnClickAway ? (
            <ClickAway onClickAway={() => show && onClose?.()}>
              {body}
            </ClickAway>
          ) : (
            body
          )}
        </div>
      </Fade>
    </Portal>
  )
}

export default Popup
