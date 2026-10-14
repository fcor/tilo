// A genome is a plain object of genes, each a number from 0 to 1.
// How each gene becomes a visual property is decided in drawShape.js.
// To add a gene: add its name here, then read it in drawShape.js.

export const GENES = [
  'sides', // form: number of polygon sides
  'copies', // form: number of radial copies
  'size', // form: overall scale
  'hue', // color: hue (wraps around)
  'spin', // motion: rotation speed and direction
  'pulse', // motion: how much the shape breathes in and out
]

// Genes that wrap around instead of clamping at 0 and 1.
const WRAPPING_GENES = new Set(['hue'])

export const MUTATION_RATE = 0.15

export function randomGenome() {
  const genome = {}
  for (const gene of GENES) genome[gene] = Math.random()
  return genome
}

export function mutate(genome, rate = MUTATION_RATE) {
  const child = {}
  for (const gene of GENES) {
    const value = genome[gene] + gaussian() * rate
    child[gene] = WRAPPING_GENES.has(gene) ? wrap(value) : clamp(value)
  }
  return child
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
