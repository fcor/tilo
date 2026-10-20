import p5 from 'p5'
import { drawBloom } from './drawBloom.js'

const EXPORT_SIZE = 2048 // px; large enough to print or use as a wallpaper

// Downloads a bloom as a square PNG, frozen at time `t` (seconds on the shared clock),
// so the image matches the frame on screen when the button was pressed.
export async function downloadBloomPng(seed, t) {
  const blob = await renderBloom(seed, t)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tilo-${timestamp()}.png`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url)) // after the download has started
}

// A throwaway p5 instance draws one frame at full size, then is removed.
function renderBloom(seed, t) {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    new p5((p) => {
      p.setup = () => {
        p.pixelDensity(1)
        p.createCanvas(EXPORT_SIZE, EXPORT_SIZE)
        p.colorMode(p.HSB, 360, 100, 100, 1)
        p.noLoop()
        p.background(0, 0, 12)
        p.translate(EXPORT_SIZE / 2, EXPORT_SIZE / 2)
        drawBloom(p, seed, EXPORT_SIZE, t)
        p.canvas.toBlob((blob) => {
          p.remove()
          container.remove()
          resolve(blob)
        }, 'image/png')
      }
    }, container)
  })
}

// e.g. 20261020-143005, so downloads sort by when they were made.
function timestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}
