import clsx from "classnames"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useFirstMountState, useLocalStorage, useMeasure } from "react-use"

import Button, { LinkButton, LinkButtonProps } from "~components/Button"
import { Tooltip } from "~components/Tooltip"
import {
  CarbonWorkspaceImport,
  IonMdExpand,
  MaterialSymbolsAddBoxOutlineSharp,
  MaterialSymbolsKeyboardSharp,
  NavLogo,
  NavLogoClosed,
  RiUser3Line
} from "~components/icons"

import ChromeNewTabButton from "./chrome/ChromeNewTabButton"
import {
  PANEL_CREATOR,
  PANEL_IMPORTER,
  PANEL_PROFILE,
  PANEL_SHORTCUTS,
  PanelConfig
} from "./utils/panel"
import { isExtension, isExtensionPopup } from "./utils/ua"

const getGroupParent = (elem: HTMLElement): HTMLElement | null => {
  return !elem || elem === document.body
    ? document.body
    : elem.classList.contains("group")
    ? elem
    : elem.parentElement
    ? getGroupParent(elem.parentElement)
    : null
}

const CollpasedLabel = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const groupEl = getGroupParent(wrapper)
    if (!groupEl) return
    groupEl.style.setProperty("--mywidth", `${width}px`)
  }, [width])
  return (
    <div
      ref={wrapperRef}
      className="w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all group-hover:w-[var(--mywidth)] group-hover:opacity-100">
      <div ref={ref} className="w-fit">
        {children}
      </div>
    </div>
  )
}

type DockProps = {
  children?: React.ReactNode
}

const Dock = (props: DockProps) => {
  const shouldReplace = (pannelConfig: PanelConfig) => !pannelConfig[1]

  // const [showAll, setShowAll] = useLocalStorage("__daidai_dockopen", true)
  const [showAll, setShowAll] = useState(false)
  const firstMount = useFirstMountState()

  return (
    <div className="fixed right-0 bottom-4 z-10">
      <div className="">
        <div
          className={clsx(
            "flex items-center handlebar-loose pr-2 border border-solid translate-x-full",
            firstMount ? "" : showAll ? "bounce-in-right" : "bounce-in-left"
          )}>
          <div className="tooltip" data-tip="Add">
            <LinkButton
              to={`/?panel=${PANEL_CREATOR[0]}`}
              replace={shouldReplace(PANEL_CREATOR)}
              className="group flex items-center gap-1 pr-2">
              <MaterialSymbolsAddBoxOutlineSharp className="text-lg" />
            </LinkButton>
          </div>
          <div className="tooltip" data-tip="Import Chrome Bookmarks">
            <LinkButton
              to={`/?panel=${PANEL_IMPORTER[0]}`}
              replace={shouldReplace(PANEL_IMPORTER)}
              className="group flex items-center gap-1 pr-2">
              <CarbonWorkspaceImport className="text-lg" />
            </LinkButton>
          </div>
          <div className="tooltip" data-tip="Shortcuts">
            <LinkButton
              to={`/?panel=${PANEL_SHORTCUTS[0]}`}
              replace={shouldReplace(PANEL_SHORTCUTS)}
              className="group flex items-center gap-1 pr-2">
              <MaterialSymbolsKeyboardSharp className="text-lg" />
            </LinkButton>
          </div>
          <Button className="text-base invisible">
            {showAll ? <NavLogo /> : <NavLogoClosed />}
          </Button>
        </div>
      </div>
      <div className="tooltip absolute right-0 top-0" data-tip="menu">
        <Button
          className="text-base"
          onClick={() => {
            setShowAll(!showAll)
          }}>
          {showAll ? <NavLogo /> : <NavLogoClosed />}
        </Button>
      </div>
    </div>
  )
}

export default Dock
