import { HTMLAttributeAnchorTarget } from "react"
import create from "zustand"
import { immer } from "zustand/middleware/immer"

type RGB = [number, number, number]

type SettingsStore = {
  hrefTarget: HTMLAttributeAnchorTarget
  highlightColors: RGB[]
}

const HIGHTLIGHT_COLORS: RGB[] = [
  [244, 113, 181],
  [243, 178, 9],
  [43, 212, 189],
  [250, 74, 73],
  [254, 215, 102],
  [42, 183, 202],
  [149, 68, 66],
  [253, 244, 152],
  [123, 192, 67],
  [255, 187, 238],
  [243, 119, 54],
  [168, 230, 207],
]

const useSettingsStore = create<SettingsStore>()(
  immer((set, get) => ({
    hrefTarget: "_blank",
    highlightColors: HIGHTLIGHT_COLORS,
  }))
)

export default useSettingsStore
