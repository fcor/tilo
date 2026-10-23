import assert from 'node:assert/strict'
import test from 'node:test'
import { STARTING_STYLES } from './presets.js'
import { startingSet, sprout, sproutSet, recolorSeed } from './seeds.js'
import { colorsFor } from './palettes.js'
import { curveLayout } from './geometry.js'
import { createGarden, pickBloom, restoreBloom, showStarts, resproutGarden } from '../lineage.js'

function randomStream() {
  let state = 271828
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function fromStyle(style) {
  const seed = structuredClone(style.seed)
  delete seed.family
  seed.motifs ??= []
  if (seed.curve) Object.assign(seed.curve, { x: 0, y: 0, size: 1 })
  else seed.curve = null
  return seed
}

function parts(seed) {
  return [...(seed.curve?.arcs ?? []), ...seed.motifs].map((part) => JSON.stringify(part))
}

function validate(seed) {
  function finite(value) {
    if (typeof value === 'number') assert.ok(Number.isFinite(value))
    else if (value && typeof value === 'object') Object.values(value).forEach(finite)
  }
  finite(seed)
  assert.ok(!('family' in seed) && !('facets' in seed) && !('motion' in seed))
  assert.ok(parts(seed).length <= 12)
  assert.ok(seed.curve || seed.motifs.length >= 2)
  if (seed.curve) {
    assert.ok(seed.curve.arcs.length >= 2 && seed.curve.arcs.length <= 8)
    assert.ok(seed.curve.size >= 0.35 && seed.curve.size <= 1.5)
    const layout = curveLayout(seed.curve)
    assert.ok(layout.factor > 0 && layout.points.length > 0)
    finite(layout)
  }
  assert.ok(colorsFor(seed).every((color) => /^#[0-9a-f]{6}$/i.test(color)))
}

test('nine random starting options derive from the four agreed styles', () => {
  assert.equal(STARTING_STYLES.length, 4)
  const random = randomStream()
  const starts = startingSet(random)
  assert.equal(starts.length, 9)
  assert.equal(new Set(starts.map((seed) => JSON.stringify(seed))).size, 9)
  assert.ok(starts.some((seed) => seed.curve))
  assert.ok(starts.some((seed) => !seed.curve))
  starts.forEach(validate)
})

test('both directions introduce new geometry gradually and retain parent structure', () => {
  const random = randomStream()
  for (const style of STARTING_STYLES) {
    const parent = fromStyle(style)
    const saved = structuredClone(parent)
    const children = sproutSet(parent, random)
    assert.equal(children.length, 9)
    assert.ok(children.filter((child) => child.curve && child.motifs.length).length >= 2)
    assert.ok(children.some((child) => !child.curve || !child.motifs.length))
    assert.equal(new Set(children.map((child) => JSON.stringify(child))).size, 9)
    for (const child of children) {
      assert.ok(parts(child).some((part) => parts(parent).includes(part)))
      validate(child)
    }
    assert.deepEqual(parent, saved)
    const blended = sprout(parent, random, 'blend')
    if (parent.curve) {
      assert.deepEqual(blended.curve, parent.curve)
      assert.equal(blended.motifs.length, 1)
    } else {
      assert.deepEqual(blended.motifs, parent.motifs)
      assert.equal(blended.curve.arcs.length, 2)
    }
    const recolored = recolorSeed(blended, random)
    assert.notEqual(recolored.palette, blended.palette)
    assert.strictEqual(recolored.curve, blended.curve)
    assert.strictEqual(recolored.motifs, blended.motifs)
  }
})

test('long mixed lineages retain bounded geometry and meaningful structural variety', () => {
  const random = randomStream()
  for (const style of STARTING_STYLES) {
    let seed = fromStyle(style)
    for (let i = 0; i < 500; i++) {
      const children = sproutSet(seed, random)
      children.forEach(validate)
      for (const child of children) {
        assert.ok(parts(child).some((part) => parts(seed).includes(part)))
      }
      assert.equal(new Set(children.map((child) => JSON.stringify(child))).size, 9)
      seed = children[Math.floor(random() * 9)]
    }
  }
})

test('branching, re-sprouting and fresh roots preserve picked blooms and saved choices', () => {
  const random = randomStream()
  let garden = createGarden(random)
  const starts = garden.starts
  garden = pickBloom(garden, starts[0], random)
  assert.equal(garden.nodes[0].parentId, null)
  const firstChoices = garden.nodes[0].seedlings
  garden = pickBloom(garden, firstChoices[0], random)
  const firstBranch = garden.nodes[1]
  garden = restoreBloom(garden, 0)
  assert.strictEqual(garden.nodes[0].seedlings, firstChoices)
  garden = pickBloom(garden, firstChoices[1], random)
  assert.equal(garden.nodes.length, 3)
  assert.strictEqual(garden.nodes[1], firstBranch)
  garden = restoreBloom(garden, 0)
  garden = pickBloom(garden, firstChoices[0], random)
  assert.equal(garden.nodes.length, 3)
  const parent = garden.nodes[1].seed
  garden = resproutGarden(garden, true, random)
  assert.strictEqual(garden.nodes[1].seed, parent)
  assert.strictEqual(garden.nodes[0].seedlings, firstChoices)
  garden = showStarts(garden, random)
  const savedNodes = garden.nodes
  garden = resproutGarden(garden, false, random)
  assert.strictEqual(garden.nodes, savedNodes)
  garden = pickBloom(garden, garden.starts[0], random)
  assert.equal(garden.nodes.length, 4)
  assert.equal(garden.nodes[3].parentId, null)
  garden = restoreBloom(garden, 1)
  assert.strictEqual(garden.nodes[1].seed, parent)
})
