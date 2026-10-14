// A seed is a plain object of traits, each a number from 0 to 1.
// How each trait becomes a visual property is decided in drawBloom.js.
// To add a trait: add its name here, then read it in drawBloom.js.

export const TRAITS = [
  'sides', // form: number of polygon sides
  'copies', // form: number of radial copies
  'size', // form: overall scale
  'hue', // color: hue (wraps around)
  'spin', // motion: rotation speed and direction
  'pulse', // motion: how much the bloom breathes in and out
]

// Traits that wrap around instead of clamping at 0 and 1.
const WRAPPING_TRAITS = new Set(['hue'])

export const MUTATION_RATE = 0.15

export function randomSeed() {
  const seed = {}
  for (const trait of TRAITS) seed[trait] = Math.random()
  return seed
}

// Returns a new seed: a slightly mutated copy of the parent seed.
export function sprout(parent, rate = MUTATION_RATE) {
  const seedling = {}
  for (const trait of TRAITS) {
    const value = parent[trait] + gaussian() * rate
    seedling[trait] = WRAPPING_TRAITS.has(trait) ? wrap(value) : clamp(value)
  }
  return seedling
}

// Standard normal random number (Box–Muller transform).
function gaussian() {
  const u = 1 - Math.random() // avoid log(0)
  const v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function clamp(x) {
  return Math.min(1, Math.max(0, x))
}

function wrap(x) {
  return ((x % 1) + 1) % 1
}
