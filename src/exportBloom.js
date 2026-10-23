import p5 from 'p5'
import { drawBloom, BACKGROUND } from './drawBloom.js'

const EXPORT_SIZE = 2048 // px; large enough to print or use as a wallpaper

// Downloads the same static composition at full resolution.
export async function downloadBloomPng(seed, renderer = drawBloom) {
  const blob = await renderBloom(seed, renderer)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tilo-${timestamp()}.png`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url)) // after the download has started
}

// A throwaway p5 instance draws one frame at full size, then is removed.
function renderBloom(seed, renderer) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    new p5((p) => {
      p.setup = () => {
        const cleanup = () => {
          p.remove()
          container.remove()
        }
        try {
          p.pixelDensity(1)
          p.createCanvas(EXPORT_SIZE, EXPORT_SIZE)
          p.colorMode(p.HSB, 360, 100, 100, 1)
          p.noLoop()
          p.background(...BACKGROUND)
          p.translate(EXPORT_SIZE / 2, EXPORT_SIZE / 2)
          renderer(p, seed, EXPORT_SIZE)
          p.canvas.toBlob((blob) => {
            cleanup()
            if (blob) resolve(blob)
            else reject(new Error('PNG encoding failed'))
          }, 'image/png')
        } catch (error) {
          cleanup()
          reject(error)
        }
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
