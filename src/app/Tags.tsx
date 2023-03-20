import clsx from "classnames"
import { useCallback, useMemo } from "react"

import { IcBaselineTag } from "~components/icons"

import TypeBox from "./TypeBox"
import useDaiDaiStore from "./store/daidai"
import { selectTags } from "./store/selector"
import useSettingsStore from "./store/settings"
import { generateColorStr } from "./utils/generateColorStr"

const TagItem = ({
  value,
  active,
  color,
  onClick
}: {
  value: string
  active: boolean
  color: string
  onClick?: () => void
}) => {
  return (
    <button
      className={clsx(
        "group relative inline-flex justify-center items-center gap-0.5 whitespace-nowrap px-2 py-0.5 text-sm border transition-all",
        active ? "text-black" : "border-white text-white "
      )}
      style={{
        backgroundColor: active ? color : undefined,
        borderColor: active ? color : undefined
      }}
      onClick={() => {
        onClick?.()
      }}>
      <IcBaselineTag
        color={color}
        className={clsx("transition-opacity", active && "opacity-0")}
      />
      <span
        className={clsx(active && "-translate-x-2", "transition-transform")}>
        {value}
      </span>
    </button>
  )
}

const Tags = () => {
  const tags = useDaiDaiStore(selectTags)
  const activeTags = useDaiDaiStore((state) => state.activeTags)
  const toggleTag = useDaiDaiStore((state) => state.toggleTag)
  const highlightColors = useSettingsStore((state) => state.highlightColors)

  return (
    <section>
      <ul className="flex flex-wrap gap-2.5 mb-10 popup:mb-4">
        {tags.map((tag, index) => (
          <li key={tag} className="">
            <TagItem
              value={tag}
              active={activeTags.includes(tag)}
              color={generateColorStr(highlightColors, index)}
              onClick={() => toggleTag(tag)}></TagItem>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Tags
