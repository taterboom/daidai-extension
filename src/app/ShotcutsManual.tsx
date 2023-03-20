import Popup from "~components/Popup"

type ShortcutManualProps = {
  children?: React.ReactNode
}

const ShortcutManual = (props: ShortcutManualProps) => {
  return (
    <div className="panel">
      <table className="table table-compact w-full p-4">
        <tbody>
          <tr>
            <td>
              <kbd className="kbd">▲</kbd> <kbd className="kbd">▼</kbd>{" "}
              <kbd className="kbd">◀︎</kbd> <kbd className="kbd">▶︎</kbd>
            </td>
            <td>Move to select</td>
          </tr>
          <tr>
            <td>
              <kbd className="kbd">Cmd</kbd> + <kbd className="kbd">1</kbd> ~{" "}
              <kbd className="kbd">9</kbd>
            </td>
            <td>Open the No.1 ~ No.9 link</td>
          </tr>
          <tr>
            <td>
              <kbd className="kbd">A</kbd> ~ <kbd className="kbd">Z</kbd>
            </td>
            <td>Type to select tag</td>
          </tr>
          <tr>
            <td>
              <kbd className="kbd">Enter</kbd>
            </td>
            <td>Open the selected link</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const ShortcutManualPopup = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  return (
    <Popup show={show} onClose={onClose}>
      <ShortcutManual />
    </Popup>
  )
}

export default ShortcutManualPopup
