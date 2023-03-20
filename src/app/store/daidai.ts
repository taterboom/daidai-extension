import create from "zustand"
import { immer } from "zustand/middleware/immer"

import { ANONYMOUS_DAIDAIS, isAnonymousDaidai } from "../utils/anonymous"
import DaidaiObject from "./DaidaiObject"
import logger from "./plugins/logger"
import { selectTags } from "./selector"

export type DaidaiState = {
  data: DaidaiObject[]
  activeTags: string[]

  initDatda: () => Promise<void>
  reset: (daidaiObjects: DaidaiObject[]) => void
  add: (...daidaiObjects: DaidaiObject[]) => Promise<void>
  update: (index: number, daidaiObject: DaidaiObject) => Promise<void>
  remove: (index: number) => Promise<void>
  toggleTag: (tag: string) => void
  typeTag: (text: string) => void
}

const useDaiDaiStore = create<DaidaiState>()(
  logger(
    immer((set, get) => ({
      user: null,
      data: [],
      activeTags: [],

      initDatda: async () => {
        // offline mode
        console.time("init with localStorage")
        const localStr = localStorage.getItem(LOCAL_KEY)
        let _data
        if (localStr) {
          const result = JSON.parse(localStr)
          _data = result.state.data
            .map((item: any) => DaidaiObject.hydrate(item))
            .filter(Boolean)
        } else {
          _data = ANONYMOUS_DAIDAIS.map(
            (item) =>
              new DaidaiObject({
                url: item.url,
                contentHTML: item.c_html,
                id: item.id
              })
          )
        }
        console.timeEnd("init with localStorage")
        set({
          data: _data
        })
      },
      reset: (daidaiObjects) => {
        set({
          data: daidaiObjects
        })
      },
      add: async (...daidaiObjects) => {
        const state = get()
        set((state) => {
          state.data.push(...daidaiObjects)
        })
      },
      update: async (index, daidaiObject) => {
        const state = get()
        const preDaidaiObject = state.data[index]
        if (!preDaidaiObject) return
        if (isAnonymousDaidai(preDaidaiObject.id)) {
          return
        }
        set((state) => {
          if (index in state.data) {
            state.data[index] = daidaiObject
          }
        })
      },
      remove: async (index) => {
        const state = get()
        const daidaiObject = state.data[index]
        if (!daidaiObject) return
        set((state) => {
          state.data.splice(index, 1)
        })
      },
      toggleTag: (tag: string) => {
        const index = get().activeTags.indexOf(tag)
        if (index === -1) {
          set((state) => {
            state.activeTags.push(tag)
          })
        } else {
          set((state) => {
            state.activeTags.splice(index, 1)
          })
        }
      },
      typeTag: (text) => {
        if (!text)
          set({
            activeTags: []
          })
        if (!text.trim()) return
        const tags = selectTags(get())
        set((state) => {
          state.activeTags = tags.filter((tag) =>
            tag.toUpperCase().startsWith(text.toUpperCase())
          )
        })
      }
    }))
  )
)

const LOCAL_KEY = "__DAIDAI__"

useDaiDaiStore.subscribe((state, prevState) => {
  if (state.data !== prevState.data) {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({
        state: {
          // ...omit(localState.state, "activeTags"),
          data: state.data.map((item) => item.dehydrate())
        }
      })
    )
  }
})

export default useDaiDaiStore
