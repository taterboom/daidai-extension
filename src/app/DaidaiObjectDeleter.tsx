import { toast } from "react-hot-toast"

import Button from "~components/Button"
import Popup from "~components/Popup"

import useDaiDaiStore from "./store/daidai"

type DaidaiObjectDeleterProps = {
  show: boolean
  onClose: () => void
  index?: number
}

const DaidaiObjectDeleter = (props: DaidaiObjectDeleterProps) => {
  const popupShow = props.show && props.index !== undefined
  const remove = useDaiDaiStore((state) => state.remove)

  return (
    <Popup show={popupShow} onClose={props.onClose} closeOnClickAway={false}>
      <div className="panel">
        <p className="font-bold text-xl mb-2">Are you sure to delete this?</p>
        <div className="flex justify-end gap-4">
          <Button
            className="opacity-70 btn-outline"
            onClick={() => props.onClose()}>
            No
          </Button>
          <Button
            className="!btn-error"
            onClick={() => {
              remove(props.index!).then(
                () => {
                  toast.success("Success!")
                  props.onClose()
                },
                (e) => {
                  toast.error("Faild!")
                  console.error("error: ", e)
                }
              )
            }}>
            Yes
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default DaidaiObjectDeleter
