import { useEffect, useState } from 'react'
import p5 from 'p5'
import { drawBloom, BACKGROUND } from './drawBloom.js'

const IMAGE_SIZE = 96 // px; twice the tree's bloom size so it stays sharp on retina screens

// One hidden p5 instance draws every thumbnail. p5 may start asynchronously,
// so it is handed out through a promise once its canvas exists.
let rendererPromise = null
function getRenderer() {
  rendererPromise ??= new Promise((resolve) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    new p5((p) => {
      p.setup = () => {
        p.pixelDensity(1)
        p.createCanvas(IMAGE_SIZE, IMAGE_SIZE)
        p.colorMode(p.HSB, 360, 100, 100, 1)
        p.noLoop()
        resolve(p)
      }
    }, container)
  })
  return rendererPromise
}

// Seeds are never changed after they're made, so each one is drawn at most once.
const images = new WeakMap()
function bloomImage(seed, renderer) {
  if (!images.has(seed)) images.set(seed, new Map())
  const renders = images.get(seed)
  if (!renders.has(renderer)) {
    renders.set(
      renderer,
      getRenderer().then((p) => {
        p.push()
        p.background(...BACKGROUND)
        p.translate(IMAGE_SIZE / 2, IMAGE_SIZE / 2)
        renderer(p, seed, IMAGE_SIZE * 1.15)
        p.pop()
        return p.canvas.toDataURL()
      }),
    )
  }
  return renders.get(renderer)
}

// A still image of a bloom, for places that show many of them (the lineage tree).
export default function BloomThumbnail({
  seed, onClick, className = '', renderer = drawBloom, label, current = false,
}) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let cancelled = false
    bloomImage(seed, renderer).then((url) => {
      if (!cancelled) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [seed, renderer])

  const Cell = onClick ? 'button' : 'div'
  return (
    <Cell
      className={['bloom-canvas', onClick && 'clickable', className].filter(Boolean).join(' ')}
      type={onClick ? 'button' : undefined}
      aria-label={label ?? (onClick ? 'Return to this bloom' : undefined)}
      aria-current={current ? 'step' : undefined}
      role={!onClick && label ? 'img' : undefined}
      onClick={onClick}
    >
      {src && <img src={src} alt="" draggable={false} />}
    </Cell>
  )
}
