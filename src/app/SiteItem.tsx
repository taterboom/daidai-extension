import clsx from "classnames"
import { useMemo } from "react"
import { toast } from "react-hot-toast"

import { LinkButton } from "~components/Button"
import {
  FluentDocumentPageTopLeft24Regular,
  IonIosLink,
  MaterialSymbolsDeleteOutlineSharp
} from "~components/icons"

import type DaidaiObject from "./store/DaidaiObject"
import useDaiDaiStore from "./store/daidai"
import { selectTags } from "./store/selector"
import useSettingsStore from "./store/settings"
import { isAnonymousDaidai } from "./utils/anonymous"
import { generateColorStr } from "./utils/generateColorStr"
import { PANEL_DELETER, PANEL_EDITOR, PanelConfig } from "./utils/panel"

const useTagsColorMap = () => {
  const tags = useDaiDaiStore(selectTags)
  const highlightColors = useSettingsStore((state) => state.highlightColors)
  return useMemo(() => {
    const tagsColorMap = new Map<string, { index: number; color: string }>()
    tags.forEach((tag, index) => {
      tagsColorMap.set(tag, {
        index,
        color: generateColorStr(highlightColors, index)
      })
    })
    return tagsColorMap
  }, [highlightColors, tags])
}

const SiteItem: React.FC<{
  index: number
  value: DaidaiObject
  active?: boolean
  disable?: boolean
}> = ({ index, value, active, disable }) => {
  const hrefTarget = useSettingsStore((state) => state.hrefTarget)
  const tagsColorMap = useTagsColorMap()
  const activeTags = useDaiDaiStore((state) => state.activeTags)
  const shouldReplace = (pannelConfig: PanelConfig) => !pannelConfig[1]

  return (
    <figure
      className={clsx(
        active && "!bg-primary-focus",
        "group relative flex items-center px-5 py-3 bg-main transition-colors hover:bg-main-focus popup:px-3 popup:py-2"
      )}>
      {/* cover */}
      {value.iconUrl ? (
        <div className="avatar">
          <div className="w-12 rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.iconUrl || ""}
              alt={value.title || ""}
              width="48"
              height="48"
              className="rounded-full w-12 h-12"
            />
          </div>
        </div>
      ) : (
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
            <span className="text-2xl uppercase">
              {value.title ? value.title.slice(0, 1) : <IonIosLink />}
            </span>
          </div>
        </div>
      )}
      {/* title and tags */}
      <figcaption className="ml-4 overflow-hidden">
        <a
          href={value.url || ""}
          target={hrefTarget}
          title={value.title || ""}
          className="line-clamp-2 text-white">
          <span className="absolute inset-0"></span>
          {value.title || value.url}
        </a>
        <ul className="flex flex-wrap gap-1 mt-2">
          {value.tags.map((tag) => {
            const isTagActive = activeTags.includes(tag)
            return (
              <li
                key={tag}
                className={clsx(
                  "relative px-1.5 border text-xs scale-90 origin-left transition-colors",
                  isTagActive ? "text-black" : "border-white text-white "
                )}
                style={{
                  backgroundColor: isTagActive
                    ? tagsColorMap.get(tag)?.color
                    : undefined,
                  borderColor: tagsColorMap.get(tag)?.color
                }}>
                {tag}
              </li>
            )
          })}
        </ul>
      </figcaption>
      {/* operation bar */}
      {!disable && (
        <div className="group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none absolute right-1 top-1 flex handlebar backdrop-blur-sm">
          <LinkButton
            className="!btn-xs pointer-events-auto"
            to={`/?panel=${PANEL_EDITOR[0]}&index=${index}`}
            replace={shouldReplace(PANEL_EDITOR)}
            title="edit"
            onClick={(e) => {
              if (isAnonymousDaidai(value.id)) {
                toast("This cannot be updated, you can delete it.")
                e.preventDefault()
              }
            }}>
            <FluentDocumentPageTopLeft24Regular />
          </LinkButton>
          <LinkButton
            className="!btn-xs pointer-events-auto"
            to={`/?panel=${PANEL_DELETER[0]}&index=${index}`}
            title="delete"
            replace={shouldReplace(PANEL_DELETER)}>
            <MaterialSymbolsDeleteOutlineSharp />
          </LinkButton>
        </div>
      )}
    </figure>
  )
}

export default SiteItem
