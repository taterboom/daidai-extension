import { useEffect, useMemo, useRef, useState } from "react"
import tinykeys from "tinykeys"
import useDaiDaiStore from "./store/daidai"
import { selectActiveDaidaiObjects, selectVisibleDaidaiObjects } from "./store/selector"
import useSettingsStore from "./store/settings"
import SiteItem from "./SiteItem"
import clsx from "classnames"
import { useWindowSize } from "react-use"

const RESPONSIVE_DATA = {
  mobile: {
    size: 0,
    count: 2,
    className: "grid-cols-[repeat(2,_minmax(216px,_1fr))]",
  },
  sm: {
    size: 640,
    count: 2,
    className: "grid-cols-[repeat(2,_minmax(240px,_1fr))]",
  },
  md: {
    size: 768,
    count: 3,
    className: "grid-cols-[repeat(3,_minmax(220px,_1fr))]",
  },
  lg: {
    size: 1024,
    count: 4,
    className: "grid-cols-[repeat(4,_minmax(220px,_1fr))]",
  },
  xl: {
    size: 1280,
    count: 5,
    className: "grid-cols-[repeat(5,_minmax(220px,_1fr))]",
  },
  "2xl": {
    size: 1536,
    count: 6,
    className: "grid-cols-[repeat(6,_minmax(220px,_1fr))]",
  },
}
const RESPONSIVE_LEVEL: Array<keyof typeof RESPONSIVE_DATA> = [
  "2xl",
  "xl",
  "lg",
  "md",
  "sm",
  "mobile",
]

const getScreenLevel = (windowWidth: number) => {
  if (typeof window === "undefined") return 0
  for (let i = 0; i < RESPONSIVE_LEVEL.length; i++) {
    if (windowWidth >= RESPONSIVE_DATA[RESPONSIVE_LEVEL[i]].size) {
      return i
    }
  }
  return 0
}

const Sites = ({ disabled }: { disabled: boolean }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex
  const visibleDaidaiObjects = useDaiDaiStore(selectVisibleDaidaiObjects)
  const visibleDaidaiObjectsRef = useRef(visibleDaidaiObjects)
  visibleDaidaiObjectsRef.current = visibleDaidaiObjects
  const { width: windowWidth } = useWindowSize()

  const screenLevel = useMemo(() => getScreenLevel(windowWidth), [windowWidth])
  const screenLevelRef = useRef(screenLevel)
  screenLevelRef.current = screenLevel

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!disabled) {
      const nav = (url: string) =>
        useSettingsStore.getState().hrefTarget === "_blank"
          ? window.open(url)
          : window.location.assign(url)
      const generateNav = (index: number) => (e: Event) => {
        e.preventDefault()
        const site = visibleDaidaiObjectsRef.current[index]
        if (site.url) {
          nav(site.url)
        }
      }
      const enterNav = () => {
        const site = visibleDaidaiObjectsRef.current[activeIndexRef.current]
        if (site?.url) {
          nav(site.url)
        }
      }
      const generateMove = (type: "top" | "right" | "bottom" | "left") => (e: Event) => {
        e.preventDefault()
        switch (type) {
          case "right":
            setActiveIndex((index) =>
              Math.min(index + 1, visibleDaidaiObjectsRef.current.length - 1)
            )
            break
          case "left":
            setActiveIndex((index) => Math.max(index - 1, -1))
            break
          case "bottom":
            setActiveIndex((index) =>
              Math.min(
                (index === -1 ? 0 : index) +
                  RESPONSIVE_DATA[RESPONSIVE_LEVEL[screenLevelRef.current]].count,
                visibleDaidaiObjectsRef.current.length - 1
              )
            )
            break
          case "top":
            setActiveIndex((index) =>
              Math.max(index - RESPONSIVE_DATA[RESPONSIVE_LEVEL[screenLevelRef.current]].count, -1)
            )
            break
          default:
            break
        }
      }
      const unsubscribe = tinykeys(window, {
        "$mod+1": generateNav(0),
        "$mod+2": generateNav(1),
        "$mod+3": generateNav(2),
        "$mod+4": generateNav(3),
        "$mod+5": generateNav(4),
        "$mod+6": generateNav(5),
        "$mod+7": generateNav(6),
        "$mod+8": generateNav(7),
        "$mod+9": generateNav(8),
        ArrowUp: generateMove("top"),
        ArrowRight: generateMove("right"),
        ArrowDown: generateMove("bottom"),
        ArrowLeft: generateMove("left"),
        Enter: enterNav,
      })
      return () => {
        unsubscribe()
      }
    }
  }, [disabled])

  useEffect(() => {
    setActiveIndex(-1)
  }, [visibleDaidaiObjects])

  return (
    <section
      className={clsx(
        "grid gap-4 popup:gap-3",
        RESPONSIVE_DATA[RESPONSIVE_LEVEL[screenLevel]].className
      )}
    >
      {visibleDaidaiObjects.map((site, index) => (
        <SiteItem
          key={site.id}
          index={index}
          value={site}
          active={index === activeIndex}
        ></SiteItem>
      ))}
    </section>
  )
}

export default Sites
