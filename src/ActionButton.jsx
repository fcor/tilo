import { useEffect, useId, useState } from 'react'
import { playPress } from './press.js'

const ACTIONS = {
  colors: { label: 'Re-sprout colors', hint: 'Colors · keep the shapes', move: 'color' },
  forms: { label: 'Re-sprout all traits', hint: 'Re-bloom · new shapes and colors', move: 'spin' },
  download: { label: 'Download PNG', hint: 'Download your bloom', move: 'drop' },
  zoomIn: { label: 'Zoom in on lineage', hint: 'Zoom in', move: 'color' },
  zoomOut: { label: 'Zoom out on lineage', hint: 'Zoom out', move: 'color' },
  fit: { label: 'Fit lineage tree', hint: 'Fit the whole tree', move: 'color' },
  find: { label: 'Find current bloom', hint: 'Find current bloom', move: 'color' },
}

function Glyph({ action }) {
  return (
    <svg className="icon-glyph" width="26" height="26" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {action === 'colors' ? (
        <>
          <path d="M12 3C7 3 3 6.5 3 11.5S6.8 20 11.5 20H13c1.8 0 2.5-1.8 1.3-3-.8-.8-.7-1.9.2-2.5.9-.6 2.3-.2 3.8-.8 2-1 2.7-2.7 2.7-4.3C21 5.6 17.2 3 12 3Z" />
          <circle cx="7.5" cy="9" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="11.7" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="16" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
        </>
      ) : action === 'forms' ? (
        <>
          <path d="M20 10a8 8 0 1 0-1.1 6.6" />
          <path d="m16 5 4 5 1-6" />
        </>
      ) : action === 'download' ? (
        <>
          <path d="M12 4v13m-5-5 5 5 5-5" />
          <path d="M5 20h14" />
        </>
      ) : action === 'zoomIn' || action === 'zoomOut' ? (
        <>
          <path d="M5 12h14" />
          {action === 'zoomIn' && <path d="M12 5v14" />}
        </>
      ) : action === 'fit' ? (
        <path d="M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5" />
      ) : (
        <>
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        </>
      )}
    </svg>
  )
}

export default function ActionButton({ action, onClick, busy = false, compact = false, disabled = false }) {
  const id = useId()
  const [dismissed, setDismissed] = useState(false)
  const { label, hint, move } = ACTIONS[action]
  useEffect(() => {
    const dismiss = (event) => { if (event.key === 'Escape') setDismissed(true) }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [])
  return (
    <span className="action-control" onPointerEnter={() => setDismissed(false)}
      onFocus={() => setDismissed(false)}>
      <button type="button"
        className={`icon-button primary action-button action-${action}${compact ? ' compact' : ''}`}
        aria-label={label} aria-describedby={id}
        aria-busy={busy || undefined} disabled={busy || disabled}
        onClick={(event) => { playPress(event.currentTarget, move); onClick() }}>
        <Glyph action={action} />
      </button>
      <span className="action-tooltip" role="tooltip" id={id} hidden={dismissed}>{busy ? 'Preparing PNG…' : hint}</span>
    </span>
  )
}
