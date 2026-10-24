import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ActionButton from './ActionButton.jsx'
import BloomThumbnail from './BloomThumbnail.jsx'
import LineageReturnHint from './LineageReturnHint.jsx'
import { generationOf } from './lineage.js'
import { constrainPan, findBloom, fitTree, layoutTree, MAX_SCALE, READABLE_SCALE, revealBloom, zoomAround } from './treeView.js'

function stemOf(nodes, id) {
  const stem = new Set()
  for (let node = nodes[id]; node; node = nodes[node.parentId]) stem.add(node.id)
  return stem
}

export default function LineageTree({ nodes, currentId, onSelect }) {
  const layout = useMemo(() => layoutTree(nodes), [nodes])
  const stem = stemOf(nodes, currentId)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [dragging, setDragging] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)
  const dismissHint = useCallback(() => setHintDismissed(true), [])
  const [hoveredId, setHoveredId] = useState(null)
  const [focusedId, setFocusedId] = useState(null)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const viewportRef = useRef(null)
  const viewRef = useRef(view)
  const sceneRef = useRef(null)
  const modeRef = useRef('auto')
  const dragRef = useRef(null)
  const draggedRef = useRef(false)
  const clickTimerRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const helpId = useId()
  const tooltipId = useId()
  const previewId = hoveredId ?? focusedId
  const previousId = nodes[currentId]?.parentId ?? nodes.find((node) => node.id !== currentId)?.id
  const preview = layout.centers[previewId]
  const previewX = preview && preview.x * view.k + view.x
  const previewY = preview && preview.y * view.k + view.y
  const showTooltip = preview && previewId !== currentId && !tooltipDismissed && !dragging &&
    previewX >= 0 && previewX <= viewport.width && previewY >= 0 && previewY <= viewport.height
  const tooltipWidth = 104, tooltipHeight = 34
  const tooltipX = preview && Math.max(8, Math.min(viewport.width - tooltipWidth - 8,
    previewX - tooltipWidth / 2))
  const tooltipY = preview && Math.max(8, Math.min(viewport.height - tooltipHeight - 8,
    previewY - 24 * view.k - tooltipHeight - 10))
  viewRef.current = view

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setViewport({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(viewportRef.current)
    return () => {
      observer.disconnect()
      clearTimeout(clickTimerRef.current)
      clearTimeout(hoverTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const dismiss = (event) => {
      if (event.key === 'Escape') {
        if (previousId !== undefined) setHintDismissed(true)
        setTooltipDismissed(true)
      }
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [previousId])

  useEffect(() => {
    const previous = sceneRef.current
    const scene = { treeHeight: layout.height, count: nodes.length, currentId, ...viewport }
    sceneRef.current = scene
    if (!viewport.width || !viewport.height) return
    const changed = !previous || previous.count !== nodes.length || previous.currentId !== currentId
    const resized = !previous || previous.width !== viewport.width || previous.height !== viewport.height
    if (!changed && !resized) return
    setView((old) => {
      if (modeRef.current === 'auto') {
        return constrainPan(revealBloom(layout.centers[currentId], viewport,
          fitTree(layout, viewport, READABLE_SCALE)), layout, viewport)
      }
      const next = { ...old, y: old.y - (layout.height - (previous?.treeHeight ?? layout.height)) * old.k }
      if (resized && previous) {
        next.x += (viewport.width - previous.width) / 2
        next.y += (viewport.height - previous.height) / 2
      }
      if (changed) {
        return constrainPan(modeRef.current === 'overview'
          ? findBloom(layout.centers[currentId], viewport, next)
          : revealBloom(layout.centers[currentId], viewport, next), layout, viewport)
      }
      return constrainPan(next, layout, viewport)
    })
  }, [layout, nodes.length, currentId, viewport])

  useEffect(() => {
    const element = viewportRef.current
    function wheel(event) {
      event.preventDefault()
      modeRef.current = 'manual'
      if (event.ctrlKey || event.metaKey) {
        const rect = element.getBoundingClientRect()
        setView((old) => constrainPan(zoomAround(old, Math.exp(-event.deltaY * 0.01), {
          x: event.clientX - rect.left, y: event.clientY - rect.top,
        }), layout, viewport))
      } else {
        setView((old) => constrainPan({ ...old,
          x: old.x - (event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX),
          y: old.y - (event.shiftKey ? 0 : event.deltaY),
        }, layout, viewport))
      }
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [layout, viewport])

  function zoom(multiplier) {
    modeRef.current = 'manual'
    setView((old) => constrainPan(zoomAround(old, multiplier, {
      x: viewport.width / 2, y: viewport.height / 2,
    }), layout, viewport))
  }

  function fit() {
    modeRef.current = 'overview'
    setView(fitTree(layout, viewport))
  }

  function find() {
    modeRef.current = 'manual'
    setView((old) => constrainPan(findBloom(layout.centers[currentId], viewport, old), layout, viewport))
  }

  function pointerDown(event) {
    if (event.button !== 0 || !event.isPrimary) return
    setTooltipDismissed(true)
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view: viewRef.current, active: false }
    draggedRef.current = false
  }

  function pointerMove(event) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    if (!event.buttons) { pointerEnd(event); return }
    const x = event.clientX - drag.x, y = event.clientY - drag.y
    if (!drag.active && Math.hypot(x, y) <= 5) return
    if (!drag.active) {
      drag.active = true
      modeRef.current = 'manual'
      draggedRef.current = true
      viewportRef.current.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    event.preventDefault()
    setView(constrainPan({ ...drag.view, x: drag.view.x + x, y: drag.view.y + y }, layout, viewport))
  }

  function pointerEnd(event) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    if (viewportRef.current.hasPointerCapture(event.pointerId)) viewportRef.current.releasePointerCapture(event.pointerId)
    dragRef.current = null
    setDragging(false)
    clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => { draggedRef.current = false }, 0)
  }

  function keyDown(event) {
    if (event.target !== event.currentTarget) return
    const moves = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }
    if (moves[event.key]) {
      event.preventDefault()
      modeRef.current = 'manual'
      const [x, y] = moves[event.key]
      setView((old) => constrainPan({ ...old, x: old.x + x, y: old.y + y }, layout, viewport))
    } else if (['+', '=', '-', '0', 'f', 'F'].includes(event.key)) {
      event.preventDefault()
      if (event.key === '0') fit()
      else if (event.key.toLowerCase() === 'f') find()
      else zoom(event.key === '-' ? 1 / 1.25 : 1.25)
    }
  }

  function hover(id) {
    clearTimeout(hoverTimerRef.current)
    setHoveredId(id)
    setTooltipDismissed(false)
  }

  function leave() {
    clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = setTimeout(() => setHoveredId(null), 150)
  }

  return (
    <>
      <div className={`lineage-view${dragging ? ' dragging' : ''}`} ref={viewportRef}
        tabIndex={0} role="region" aria-label="Lineage map" aria-describedby={helpId}
        onPointerDown={pointerDown} onPointerMove={pointerMove}
        onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
        onLostPointerCapture={pointerEnd}
        onPointerLeave={() => { if (!dragRef.current?.active) dragRef.current = null }}
        onKeyDown={keyDown} onClickCapture={(event) => {
          if (draggedRef.current) { event.preventDefault(); event.stopPropagation() }
        }}>
        <p className="garden-live" id={helpId}>Click a previous bloom to return with its saved seedlings.
          Drag or scroll to pan. Control or Command plus scroll zooms.
          When the map is focused, arrow keys pan, plus and minus zoom, zero fits the tree, and F finds the current bloom.</p>
        <div className="tree" style={{ width: layout.width, height: layout.height,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
          <svg className="tree-stems" width={layout.width} height={layout.height} aria-hidden="true">
            {nodes.map((node) => {
              if (node.parentId === null) return null
              const from = layout.centers[node.parentId], to = layout.centers[node.id]
              const midY = (from.y + to.y) / 2
              return <path key={node.id} className={stem.has(node.id) ? 'on-stem' : ''}
                d={`M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`} />
            })}
          </svg>
          {nodes.map((node) => {
            const isCurrent = node.id === currentId
            const center = layout.centers[node.id]
            return (
              <div key={node.id} className={`tree-node${node.id === previewId ? ' previewed' : ''}`}
                style={{ left: center.x, top: center.y }}
                onPointerEnter={(event) => { if (event.pointerType !== 'touch') hover(node.id) }}
                onPointerLeave={leave}
                onBlurCapture={() => setFocusedId(null)}
                onFocusCapture={(event) => {
                  if (!event.target.matches(':focus-visible')) return
                  setFocusedId(node.id)
                  setTooltipDismissed(false)
                  modeRef.current = 'manual'
                  setView((old) => constrainPan(findBloom(center, viewport, old), layout, viewport))
                }}>
                <BloomThumbnail seed={node.seed} current={isCurrent}
                  descriptionId={isCurrent ? undefined : tooltipId}
                  label={`${isCurrent ? 'Current bloom' : 'Return to bloom'} ${node.id + 1}, generation ${generationOf(nodes, node.id)}`}
                  className={isCurrent ? 'current' : stem.has(node.id) ? '' : 'off-stem'}
                  onClick={() => {
                    if (!isCurrent) setHintDismissed(true)
                    setTooltipDismissed(true)
                    onSelect(node.id)
                  }} />
              </div>
            )
          })}
        </div>
        {!hintDismissed && previousId !== undefined && (
          <LineageReturnHint centers={layout.centers} targetId={previousId}
            viewport={viewport} view={view} hidden={dragging || showTooltip} onDismiss={dismissHint} />
        )}
        <span className={`action-tooltip lineage-return-tooltip${showTooltip ? ' visible' : ''}`}
          id={tooltipId} role="tooltip"
          style={{ left: tooltipX, top: tooltipY, width: tooltipWidth, height: tooltipHeight }}
          onPointerEnter={() => clearTimeout(hoverTimerRef.current)} onPointerLeave={leave}>
          Go back here
        </span>
      </div>
      <div className="lineage-controls" role="group" aria-label="Lineage navigation">
        <ActionButton action="zoomOut" compact onClick={() => zoom(1 / 1.25)} disabled={view.k <= 0.01} />
        <ActionButton action="zoomIn" compact onClick={() => zoom(1.25)} disabled={view.k >= MAX_SCALE} />
        <ActionButton action="fit" compact onClick={fit} />
        <ActionButton action="find" compact onClick={find} />
      </div>
    </>
  )
}
