import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { drawBloom } from './drawBloom.js'

// A small springy pop whenever a bloom gets a new seed. It starts at once, so it
// never delays the instant feedback; `popDelay` staggers a grid into a ripple.
const POP = [
  { transform: 'scale(0.7)', opacity: 0 },
  { transform: 'scale(1)', opacity: 1 },
]
const POP_TIMING = { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
// Keep ten canvases sharp without unbounded backing stores on dense displays.
const displayDensity = () => Math.min(window.devicePixelRatio || 1, 2)

// One p5 instance per bloom. The instance is created once on mount;
// Draw only when the seed, renderer, size or display density changes.
// The cell (outer div) owns the background and grid lines; the stage inside it
// holds the transparent canvas, so the bloom alone can pop and grow on hover.
export default function BloomCanvas({
  seed, onClick, className = '', popDelay = 0,
  renderer = drawBloom, label = 'Bloom',
}) {
  const stageRef = useRef(null)
  const seedRef = useRef(seed)
  const rendererRef = useRef(renderer)
  const instanceRef = useRef(null)
  seedRef.current = seed
  rendererRef.current = renderer

  useEffect(() => {
    const container = stageRef.current

    const sketch = (p) => {
      p.setup = () => {
        p.pixelDensity(displayDensity())
        p.createCanvas(container.clientWidth, container.clientHeight)
        p.colorMode(p.HSB, 360, 100, 100, 1)
        p.noLoop()
      }

      p.draw = () => {
        p.clear() // transparent, so the cell's background (and its hover tint) shows through
        p.translate(p.width / 2, p.height / 2)
        rendererRef.current(p, seedRef.current, Math.min(p.width, p.height))
      }
    }

    const instance = new p5(sketch, container)
    instanceRef.current = instance

    let resizeFrame = 0
    function scheduleResize() {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        if (!instance.canvas) return
        const width = container.clientWidth
        const height = container.clientHeight
        if (width === 0 || height === 0) return
        const density = displayDensity()
        let changed = false
        if (instance.pixelDensity() !== density) {
          instance.pixelDensity(density)
          changed = true
        }
        if (instance.width !== width || instance.height !== height) {
          instance.resizeCanvas(width, height, true)
          changed = true
        }
        if (changed) instance.redraw()
      })
    }

    const observer = new ResizeObserver(scheduleResize)
    observer.observe(container)

    // A monitor change can alter pixel density without changing the CSS size.
    // Re-arm the query against the new density after each change.
    let densityQuery
    function watchDensity() {
      densityQuery?.removeEventListener('change', watchDensity)
      densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      densityQuery.addEventListener('change', watchDensity)
      scheduleResize()
    }
    watchDensity()

    return () => {
      observer.disconnect()
      densityQuery.removeEventListener('change', watchDensity)
      cancelAnimationFrame(resizeFrame)
      instance.remove()
      if (instanceRef.current === instance) instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (instanceRef.current?.canvas) instanceRef.current.redraw()
  }, [seed, renderer])

  useEffect(() => {
    if (reducedMotion.matches) return
    const animation = stageRef.current.animate(POP, { ...POP_TIMING, delay: popDelay })
    return () => animation.cancel()
  }, [seed])

  const Cell = onClick ? 'button' : 'div'
  return (
    <Cell
      className={['bloom-canvas', onClick && 'clickable', className].filter(Boolean).join(' ')}
      type={onClick ? 'button' : undefined}
      aria-label={label}
      role={onClick ? undefined : 'img'}
      onClick={onClick}
    >
      <div ref={stageRef} className="bloom-stage" aria-hidden="true" />
    </Cell>
  )
}
