import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { drawBloom } from './drawBloom.js'

// One p5 instance per bloom. The instance is created once on mount;
// seed changes are picked up through a ref that the draw loop reads.
export default function BloomCanvas({ seed, onClick, className = '' }) {
  const containerRef = useRef(null)
  const seedRef = useRef(seed)
  seedRef.current = seed

  useEffect(() => {
    const container = containerRef.current

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(container.clientWidth, container.clientHeight)
        p.colorMode(p.HSB, 360, 100, 100, 1)
      }

      p.draw = () => {
        // A shared clock (not p.millis()) keeps every canvas in step.
        const t = performance.now() / 1000
        p.background(0, 0, 12)
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

  return (
    <div
      ref={containerRef}
      className={['bloom-canvas', onClick && 'clickable', className].filter(Boolean).join(' ')}
      onClick={onClick}
    />
  )
}
