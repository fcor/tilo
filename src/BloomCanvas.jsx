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

// One p5 instance per bloom. The instance is created once on mount;
// seed changes are picked up through a ref that the draw loop reads.
// The cell (outer div) owns the background and grid lines; the stage inside it
// holds the transparent canvas, so the bloom alone can pop and grow on hover.
export default function BloomCanvas({ seed, onClick, className = '', popDelay = 0 }) {
  const stageRef = useRef(null)
  const seedRef = useRef(seed)
  seedRef.current = seed

  useEffect(() => {
    const container = stageRef.current

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(container.clientWidth, container.clientHeight)
        p.colorMode(p.HSB, 360, 100, 100, 1)
      }

      p.draw = () => {
        // A shared clock (not p.millis()) keeps every canvas in step.
        const t = performance.now() / 1000
        p.clear() // transparent, so the cell's background (and its hover tint) shows through
        p.translate(p.width / 2, p.height / 2)
        drawBloom(p, seedRef.current, Math.min(p.width, p.height), t)
      }
    }

    const instance = new p5(sketch, container)

    const observer = new ResizeObserver(() => {
      instance.resizeCanvas(container.clientWidth, container.clientHeight)
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      instance.remove()
    }
  }, [])

  useEffect(() => {
    if (reducedMotion.matches) return
    const animation = stageRef.current.animate(POP, { ...POP_TIMING, delay: popDelay })
    return () => animation.cancel()
  }, [seed])

  return (
    <div
      className={['bloom-canvas', onClick && 'clickable', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <div ref={stageRef} className="bloom-stage" />
    </div>
  )
}
