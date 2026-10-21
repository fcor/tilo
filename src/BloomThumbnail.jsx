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
function bloomImage(seed) {
  if (!images.has(seed)) {
    images.set(
      seed,
      getRenderer().then((p) => {
        p.push()
        p.background(...BACKGROUND)
        p.translate(IMAGE_SIZE / 2, IMAGE_SIZE / 2)
        drawBloom(p, seed, IMAGE_SIZE, 0) // t = 0: the bloom at rest, before any spin or pulse
        p.pop()
        return p.canvas.toDataURL()
      }),
    )
  }
  return images.get(seed)
}

// A still image of a bloom, for places that show many of them (the lineage tree).
export default function BloomThumbnail({ seed, onClick, className = '' }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let cancelled = false
    bloomImage(seed).then((url) => {
      if (!cancelled) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [seed])

  return (
    <div
      className={['bloom-canvas', onClick && 'clickable', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {src && <img src={src} alt="" draggable={false} />}
    </div>
  )
}
