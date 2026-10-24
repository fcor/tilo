import { useEffect, useRef, useState } from 'react'

// Keep the hint at screen size while the tree zooms, leaving the blooms uncovered.
export default function LineageReturnHint({ centers, targetId, viewport, view, hidden, onDismiss }) {
  const bouncedRef = useRef(false)
  const hintRef = useRef(null)
  const [appeared, setAppeared] = useState(false)

  useEffect(() => {
    if (!appeared) return
    let exit
    const timer = setTimeout(() => {
      const hint = hintRef.current
      if (!hint) { onDismiss(); return }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const duration = reduced ? 120 : 450
      exit = hint.animate(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-6px) scale(1.08)', opacity: 1, offset: 0.3 },
        { transform: 'translateY(4px) scale(0.92)', opacity: 0.8, offset: 0.55 },
        { transform: 'translateY(12px) scale(0.2)', opacity: 0 },
      ], { duration, easing: 'ease-out', fill: 'forwards' })
      exit.onfinish = onDismiss
    }, 3500)
    return () => {
      clearTimeout(timer)
      if (exit) { exit.onfinish = null; exit.cancel() }
    }
  }, [appeared, onDismiss])

  const radius = 24 * view.k
  const points = centers.map((center) => ({
    x: center.x * view.k + view.x, y: center.y * view.k + view.y,
  }))
  const target = points[targetId]
  if (!target || !viewport.width || !viewport.height) return null
  const visible = points.filter((point) =>
    point.x + radius > 0 && point.x - radius < viewport.width &&
    point.y + radius > 0 && point.y - radius < viewport.height)
  const within = target.x - radius >= 0 && target.x + radius <= viewport.width &&
    target.y - radius >= 0 && target.y + radius <= viewport.height
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
  const free = (card) => visible.every((point) =>
    point.x + radius + 6 < card.x || point.x - radius - 6 > card.x + card.width ||
    point.y + radius + 6 < card.y || point.y - radius - 6 > card.y + card.height)
  const candidates = []

  // Wide, short maps (phones) have room beside the earlier bloom.
  for (const side of ['left', 'right']) {
    const room = side === 'left'
      ? target.x - radius - 24 : viewport.width - target.x - radius - 24
    if (room < 112) continue
    const width = Math.min(140, room), height = 68
    candidates.push({
      x: side === 'left' ? target.x - radius - 12 - width : target.x + radius + 12,
      y: clamp(target.y - height / 2, 8, viewport.height - height - 8),
      width, height, side,
    })
  }
  // A small desktop tree has empty space above it. Curve the pointer around it.
  const width = Math.min(174, viewport.width - 24), height = 58
  const top = Math.min(...visible.map((point) => point.y - radius)) - height - 20
  if (top >= 8) candidates.push({
    x: clamp(target.x - width / 2, 12, viewport.width - width - 12),
    y: top, width, height, side: 'above',
  })
  const card = within && candidates.find(free)
  if (!card) return null

  const from = card.side === 'above'
    ? { x: card.x + 16, y: card.y + card.height }
    : { x: card.side === 'left' ? card.x + card.width : card.x, y: card.y + card.height / 2 }
  const to = { x: target.x + (card.side === 'right' ? radius + 5 : -radius - 5), y: target.y }
  const path = card.side === 'above'
    ? `M ${from.x} ${from.y} C ${from.x} ${to.y}, ${to.x - 24} ${to.y}, ${to.x} ${to.y}`
    : `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`
  const direction = card.side === 'right' ? 1 : -1

  return (
    <div className={`lineage-return-hint${hidden ? ' cue-hidden' : ''}`}
      style={{ transformOrigin: `${card.x + card.width / 2}px ${card.y + card.height / 2}px` }}
      ref={(hint) => {
        hintRef.current = hint
        if (!hint || hidden || bouncedRef.current) return
        bouncedRef.current = true
        setAppeared(true)
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        hint.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(-7px)', offset: 0.35 },
          { transform: 'translateY(2px)', offset: 0.65 },
          { transform: 'translateY(0)' },
        ], { duration: 650, easing: 'ease-out' })
      }}>
      <svg className="return-hint-pointer" width={viewport.width} height={viewport.height} aria-hidden="true">
        <path d={path} />
        <path d={`M ${to.x + direction * 5} ${to.y - 4} L ${to.x} ${to.y} L ${to.x + direction * 5} ${to.y + 4}`} />
      </svg>
      <p className="return-hint-bubble" role="note"
        style={{ left: card.x, top: card.y, width: card.width, height: card.height }}>
        Click an earlier bloom to return.
      </p>
    </div>
  )
}
