import { get } from 'chromotome'

// Palettes from Kjetil Golid's Chromotome collection, not a final palette policy.
export const PALETTE_NAMES = [
  'miradors', 'hilda01', 'ducci_jb', 'kov_01',
  'rohlfs_2', 'spatial01', 'tundra1', 'cc239',
]

export const PALETTES = PALETTE_NAMES.map((name) => {
  const source = get(name)
  // Keep the original colors, omitting near-white fills on Tilo's white canvas.
  const colors = source.colors.filter((hex) => {
    const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16))
    return Math.min(...rgb) < 220
  })
  return { name, colors }
})

export function paletteFor(seed) {
  return PALETTES.find((palette) => palette.name === seed.palette)
}

export function colorsFor(seed) {
  const { colors } = paletteFor(seed)
  return Array.from({ length: 4 }, (_, i) => colors[(seed.colorOffset + i) % colors.length])
}
