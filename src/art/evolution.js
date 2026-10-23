import { PALETTE_NAMES, paletteFor } from './palettes.js'

const PI = Math.PI

const VARIATIONS = ['reshape', 'grow', 'redirect', 'simplify']
export const MOTIF_LIMITS = { dot: [0.035, 0.1], ring: [0.1, 0.48], diamond: [0.1, 0.37], bar: [0.2, 0.8] }
const pick = (values, random) => values[Math.floor(random() * values.length)]
export const angle = (value) => ((value + PI) % (PI * 2) + PI * 2) % (PI * 2) - PI
const rayAngle = (value) => ((value + PI / 2) % (PI * 2) + PI * 2) % (PI * 2) - PI / 2

// Keep an unchanged part of the parent's structure, and make larger changes
// around it. Growth and direction changes are inherited, never random layouts.
// These bounds remain study material to judge together.
export function sproutStudy(parent, random = Math.random, variation = pick(VARIATIONS, random)) {
  const seed = structuredClone(parent)
  // Avoid mostly imperceptible changes clustered around zero.
  const shift = (amount) => (random() < 0.5 ? -1 : 1) * amount * (0.5 + random() * 0.5)
  if (seed.family === 'curves') evolveCurves(seed, random, shift, variation)
  else if (seed.family === 'contrast') evolveContrasts(seed, random, shift, variation)
  else evolveFacets(seed, random, shift, variation)
  seed.tilt = angle(seed.tilt + shift(0.65))
  // Some relatives change palette; others explore a new arrangement of its colors.
  return random() < 0.35
    ? recolorStudy(seed, random)
    : { ...seed, colorOffset: (seed.colorOffset + 1) % paletteFor(seed).colors.length }
}

export function recolorStudy(seed, random = Math.random) {
  const alternatives = PALETTE_NAMES.filter((name) => name !== seed.palette)
  const palette = alternatives[Math.floor(random() * alternatives.length)]
  const recolored = { ...seed, palette }
  return {
    ...recolored,
    colorOffset: Math.floor(random() * paletteFor(recolored).colors.length),
  }
}

export function sproutSet(seed, random = Math.random) {
  // Every set offers growth, reshaping, redirection and simplification.
  // Shuffle them so the grid doesn't assign fixed meanings to its positions.
  const variations = ['grow', 'grow', 'grow', 'reshape', 'reshape', 'reshape', 'redirect', 'redirect', 'simplify']
  for (let i = variations.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[variations[i], variations[j]] = [variations[j], variations[i]]
  }
  return variations.map((variation) => sproutStudy(seed, random, variation))
}

function changedIndices(length, random) {
  if (length === 1) return [0]
  const anchor = Math.floor(random() * length)
  const indices = Array.from({ length }, (_, i) => i).filter((i) => i !== anchor)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, Math.max(1, Math.ceil(length / 2)))
}

export function evolveCurves(seed, random, shift, variation, maxArcs = 8) {
  const arcs = seed.curve.arcs
  const indices = changedIndices(arcs.length, random)
  for (const i of indices) {
    arcs[i].radius = reflect(arcs[i].radius + shift(0.15), 0.09, 0.52)
    arcs[i].sweep = reflect(arcs[i].sweep + shift(1.15), 0.65, PI * 1.8)
  }
  const i = indices[0]
  if (variation === 'redirect') arcs[i].turn *= -1
  if (variation === 'grow' && arcs.length < maxArcs) {
    const additions = Array.from({ length: Math.min(maxArcs - arcs.length, random() < 0.5 ? 1 : 2) }, () => ({
      radius: reflect(arcs[i].radius + shift(0.1), 0.09, 0.52),
      sweep: reflect(arcs[i].sweep + shift(1.2), 0.65, PI * 1.8),
      turn: random() < 0.75 ? -arcs[i].turn : arcs[i].turn,
    }))
    arcs.splice(i + 1, 0, ...additions)
  } else if (variation === 'simplify' && arcs.length > 2) {
    arcs.splice(i, 1)
  }
  seed.curve.weight = reflect(seed.curve.weight + shift(0.035), 0.035, 0.14)
  seed.curve.echo = reflect(seed.curve.echo + shift(0.35), 0, 1)
}

export function evolveContrasts(seed, random, shift, variation, maxMotifs = 10) {
  const motifs = seed.motifs
  const indices = changedIndices(motifs.length, random)
  for (const i of indices) {
    const motif = motifs[i]
    motif.x = reflect(motif.x + shift(0.24), -0.6, 0.6)
    motif.y = reflect(motif.y + shift(0.24), -0.6, 0.6)
    motif.size = reflect(motif.size + shift(0.14), ...MOTIF_LIMITS[motif.type])
    motif.angle = angle(motif.angle + shift(0.85))
    if (motif.type !== 'dot') motif.weight = reflect(motif.weight + shift(0.02), 0.018, 0.085)
  }
  const i = indices[0]
  if (variation === 'redirect') {
    const motif = motifs[i]
    motif.type = pick(Object.keys(MOTIF_LIMITS).filter((type) => type !== motif.type), random)
    motif.size = reflect(motif.size, ...MOTIF_LIMITS[motif.type])
    motif.weight = Math.max(0.025, motif.weight)
  } else if (variation === 'grow' && motifs.length < maxMotifs) {
    // Place new figures relative to an inherited figure, keeping a relationship.
    const neighbor = pick(motifs, random)
    const count = Math.min(maxMotifs - motifs.length, random() < 0.5 ? 1 : 2)
    for (let n = 0; n < count; n++) {
      const type = pick(Object.keys(MOTIF_LIMITS), random)
      const direction = neighbor.angle + random() * PI * 2
      const distance = neighbor.size * 0.7 + 0.16
      motifs.push({
        type,
        x: reflect(neighbor.x + Math.cos(direction) * distance, -0.6, 0.6),
        y: reflect(neighbor.y + Math.sin(direction) * distance, -0.6, 0.6),
        size: reflect(neighbor.size * (0.55 + random() * 0.5), ...MOTIF_LIMITS[type]),
        angle: angle(neighbor.angle + shift(0.85)),
        weight: Math.max(0.025, neighbor.weight),
        role: (neighbor.role + n + 1) % 3,
      })
    }
  } else if (variation === 'simplify' && motifs.length > 2) {
    motifs.splice(i, 1)
  }
}

function evolveFacets(seed, random, shift, variation) {
  const rays = seed.facets.rays
  const half = rays.length / 2
  const indices = changedIndices(half, random)
  for (const i of indices) {
    const growth = shift(0.15)
    const notch = shift(0.08)
    for (const j of [i, i + half]) {
      rays[j].outer = reflect(rays[j].outer + growth, 0.24, 0.65)
      rays[j].inner = reflect(rays[j].inner + notch, 0.08, 0.32)
    }
  }
  const i = indices[0]
  if (variation === 'grow' && rays.length < 12) {
    const next = rays[(i + 1) % half]
    const gap = (i === half - 1 ? next.angle + PI : next.angle) - rays[i].angle
    const direction = rays[i].angle + gap / 2
    const ray = {
      angle: rayAngle(direction),
      outer: reflect((rays[i].outer + next.outer) / 2 + shift(0.1), 0.24, 0.65),
      inner: reflect((rays[i].inner + next.inner) / 2 + shift(0.06), 0.08, 0.32),
    }
    rays.push(ray, { ...ray, angle: rayAngle(direction + PI) })
  } else if (variation === 'simplify' && rays.length > 4) {
    seed.facets.rays = rays.filter((_, j) => j !== i && j !== i + half)
  } else if (variation === 'redirect') {
    const previous = rays[(i + half - 1) % half].angle - (i === 0 ? PI : 0)
    const next = rays[(i + 1) % half].angle + (i === half - 1 ? PI : 0)
    const turn = shift(Math.min(rays[i].angle - previous, next - rays[i].angle) * 0.35)
    for (const j of [i, i + half]) {
      // Canonical range keeps sorted, opposite pairs across later generations.
      rays[j].angle = rayAngle(rays[j].angle + turn)
    }
  }
  seed.facets.rays.sort((a, b) => a.angle - b.angle)
  seed.facets.aspect = reflect(seed.facets.aspect + shift(0.3), 0.55, 1.7)
  seed.facets.depth = reflect(seed.facets.depth + shift(0.3), 0.08, 0.85)
  seed.facets.twist = reflect(seed.facets.twist + shift(0.13), -0.25, 0.25)
}

export function reflect(value, min, max) {
  const range = max - min
  const position = ((value - min) % (range * 2) + range * 2) % (range * 2)
  return min + (position <= range ? position : range * 2 - position)
}
