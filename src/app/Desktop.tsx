import React, { useEffect, useMemo, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import BookmarkImporter from "./BookmarkImporter"
import DaidaiObjectDeleter from "./DaidaiObjectDeleter"
import {
  DaidaiObjectCreator,
  DaidaiObjectCreatorInExtension,
  DaidaiObjectEditor
} from "./DaidaiObjectForm"
import Dock from "./Dock"
import ShortcutManualPopup from "./ShotcutsManual"
import Sites from "./Sites"
import Tags from "./Tags"
import TypeBox from "./TypeBox"
import useDaiDaiStore from "./store/daidai"
import {
  PANEL_CREATOR,
  PANEL_DELETER,
  PANEL_EDITOR,
  PANEL_IMPORTER,
  PANEL_SHORTCUTS,
  PanelConfig
} from "./utils/panel"
import { isExtension } from "./utils/ua"

const Desktop: React.FC = ({}) => {
  const initData = useDaiDaiStore((state) => state.initDatda)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const panel = searchParams.get("panel")

  const daidaiObjectIndex = useMemo(() => {
    const maybeStringIndex = searchParams.get("index")
    return maybeStringIndex === undefined ? undefined : +maybeStringIndex
  }, [searchParams])

  const pannelCanShow = (pannelConfig: PanelConfig) =>
    /*(pannelConfig[1] || user !== null) && */ panel === pannelConfig[0]

  const controlDisabled = typeof panel === "string"

  const onClosePanel = () => navigate("/")

  // prevent nextjs default scroll behavior
  // useEffect(() => {
  //   location.beforePopState((state) => {
  //     state.options.scroll = false
  //     return true
  //   })
  //   return () => {
  //     location.beforePopState((state) => true)
  //   }
  // }, [location])

  const preUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    initData()
  }, [initData])

  // useEffect(() => {
  //   const inPanelDonotSupportAnonymousButAnonymousNow = PANELS.some(
  //     ([name, supportAnonymous]) => name === panel && !supportAnonymous && user === null
  //   )
  //   if (inPanelDonotSupportAnonymousButAnonymousNow) {
  //     authToast()
  //   }
  // }, [panel, user])

  return (
    <>
      <Dock />
      <div className="min-w-[480px] min-h-[601px] p-16 popup:p-4">
        {/* <Popup closeable={false} show={dataLoading || (isLoading && !user)}>
        <Loading />
      </Popup> */}
        {/* <Settings></Settings> */}
        {/* {dataLoading && <progress className="progress w-56"></progress>} */}
        {!controlDisabled && <TypeBox />}
        <Tags></Tags>
        <Sites disabled={controlDisabled}></Sites>
        {isExtension ? (
          <DaidaiObjectCreatorInExtension
            show={pannelCanShow(PANEL_CREATOR)}
            onClose={onClosePanel}
          />
        ) : (
          <DaidaiObjectCreator
            show={pannelCanShow(PANEL_CREATOR)}
            onClose={onClosePanel}
          />
        )}
        <DaidaiObjectEditor
          index={daidaiObjectIndex}
          show={pannelCanShow(PANEL_EDITOR)}
          onClose={onClosePanel}
        />
        <DaidaiObjectDeleter
          index={daidaiObjectIndex}
          show={pannelCanShow(PANEL_DELETER)}
          onClose={onClosePanel}
        />
        <BookmarkImporter
          show={pannelCanShow(PANEL_IMPORTER)}
          onClose={onClosePanel}
        />
        <ShortcutManualPopup
          show={pannelCanShow(PANEL_SHORTCUTS)}
          onClose={onClosePanel}
        />
      </div>
    </>
  )
}

export default Desktop
