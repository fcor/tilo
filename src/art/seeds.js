import { STARTING_STYLES } from './presets.js'
import { angle, evolveCurves, evolveContrasts, recolorStudy, reflect } from './evolution.js'
import { paletteFor } from './palettes.js'
import { curveLayout } from './geometry.js'

const pick = (values, random) => values[Math.floor(random() * values.length)]
const partCount = (seed) => (seed.curve?.arcs.length ?? 0) + seed.motifs.length
const CAPACITY = 12

export function startingSet(random = Math.random) {
  return Array.from({ length: 9 }, () => randomSeed(random))
}

export function randomSeed(random = Math.random) {
  const source = pick(STARTING_STYLES, random).seed
  const seed = {
    palette: source.palette, colorOffset: 0, tilt: source.tilt,
    curve: source.curve ? { ...structuredClone(source.curve), x: 0, y: 0, size: 1 } : null,
    motifs: structuredClone(source.motifs ?? []),
  }
  // The four starting styles provide structure; each option is its own bloom.
  return recolorSeed(sprout(seed, random, pick(['reshape', 'grow', 'redirect'], random)), random)
}

export function recolorSeed(seed, random = Math.random) {
  return recolorStudy(seed, random)
}

// Selection focuses the composition. Mutation strength never depends on the
// number of clicks, and no family field can prevent curves and figures mixing.
export function sprout(parent, random = Math.random, variation = 'reshape') {
  const seed = structuredClone(parent)
  const shift = (amount) => (random() < 0.5 ? -1 : 1) * amount * (0.5 + random() * 0.5)
  if (variation === 'blend') {
    if (!seed.curve) addCurve(seed, random)
    else if (partCount(seed) < CAPACITY) addFigure(seed, random)
    else reshape(seed, random, shift, 'reshape')
  } else {
    const change = variation === 'grow' && partCount(seed) >= CAPACITY ? 'reshape' : variation
    reshape(seed, random, shift, change)
  }
  seed.tilt = angle(seed.tilt + shift(0.65))
  return random() < 0.35
    ? recolorSeed(seed, random)
    : { ...seed, colorOffset: (seed.colorOffset + 1) % paletteFor(seed).colors.length }
}

export function sproutSet(parent, random = Math.random) {
  const variations = ['reshape', 'reshape', 'grow', 'grow', 'redirect', 'redirect', 'simplify', 'blend', 'blend']
  for (let i = variations.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[variations[i], variations[j]] = [variations[j], variations[i]]
  }
  return variations.map((variation) => sprout(parent, random, variation))
}

function reshape(seed, random, shift, variation) {
  // In mixed blooms one component changes while the other retains its structure.
  if (seed.curve && (!seed.motifs.length || random() < 0.5)) {
    if (variation === 'simplify' && seed.curve.arcs.length === 2 &&
        seed.curve.size <= 0.6 && seed.motifs.length >= 2) {
      seed.curve = null
      return
    }
    evolveCurves(seed, random, shift, variation, Math.min(8, CAPACITY - seed.motifs.length))
    seed.curve.x = reflect(seed.curve.x + shift(0.12), -0.6, 0.6)
    seed.curve.y = reflect(seed.curve.y + shift(0.12), -0.6, 0.6)
    seed.curve.size = variation === 'simplify'
      ? Math.max(0.35, seed.curve.size - Math.abs(shift(0.2)))
      : reflect(seed.curve.size + shift(0.2), 0.35, 1.5)
  } else {
    if (variation === 'simplify' && seed.curve && seed.motifs.length <= 2) {
      seed.motifs.pop()
      return
    }
    evolveContrasts(seed, random, shift, variation, Math.min(10, CAPACITY - (seed.curve?.arcs.length ?? 0)))
  }
}

function addFigure(seed, random) {
  const curve = curveLayout(seed.curve)
  const anchor = pick(curve.points, random)
  const near = seed.motifs.length ? pick(seed.motifs, random) : anchor
  const type = pick(['ring', 'diamond', 'bar', 'dot'], random)
  const direction = random() * Math.PI * 2
  const distance = 0.06 + random() * 0.1
  const size = type === 'dot' ? 0.035 + random() * 0.035 : 0.12 + random() * 0.12
  seed.motifs.push({
    type,
    x: reflect(near.x + Math.cos(direction) * distance, -0.6, 0.6),
    y: reflect(near.y + Math.sin(direction) * distance, -0.6, 0.6),
    size, angle: angle(direction), weight: 0.025 + random() * 0.02,
    role: (seed.motifs.length + 1) % 3,
  })
}

function addCurve(seed, random) {
  const figure = pick(seed.motifs, random)
  const radius = Math.max(0.12, Math.min(0.3, figure.size))
  seed.curve = {
    x: figure.x, y: figure.y, size: Math.max(0.35, Math.min(0.7, figure.size * 2)),
    heading: figure.angle, weight: 0.06, echo: 0.12, stripe: 0.3,
    arcs: [
      { radius, sweep: Math.PI * (0.65 + random() * 0.5), turn: 1 },
      { radius: radius * 0.8, sweep: Math.PI * (0.6 + random() * 0.6), turn: -1 },
    ],
  }
}
