import { omit } from "lodash"
import React, { useCallback } from "react"

import Button, { ButtonProps } from "~components/Button"

type ChromeNewTabButtonProps = { href: string } & ButtonProps

function ChromeNewTabButton(props: ChromeNewTabButtonProps) {
  const openTab = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e)
      chrome.tabs.create({
        url: props.href.startsWith("/")
          ? `https://www.daidai.cyou${props.href}`
          : props.href
      })
    },
    [props]
  )
  return <Button {...omit(props, "href")} onClick={openTab} />
}

export default ChromeNewTabButton
