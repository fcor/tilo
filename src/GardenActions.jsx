import ActionButton from './ActionButton.jsx'

export default function GardenActions({ onColors, onForms }) {
  return (
    <div className="toolbar garden-actions" role="group" aria-label="Re-sprout options">
      <ActionButton action="colors" onClick={onColors} />
      <ActionButton action="forms" onClick={onForms} />
    </div>
  )
}
