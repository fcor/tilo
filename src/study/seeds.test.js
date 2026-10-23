import assert from 'node:assert/strict'
import test from 'node:test'
import { SPECIMENS, sproutStudy, sproutSet, recolorStudy } from './seeds.js'
import { PALETTE_NAMES, colorsFor } from './palettes.js'

function randomStream() {
  let value = 314159
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function geometry(seed) {
  const { palette, colorOffset, ...shape } = seed
  return shape
}

function finiteTree(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value))
  else if (value && typeof value === 'object') Object.values(value).forEach(finiteTree)
}

test('color exploration changes palettes without changing a seedling’s form', () => {
  const random = randomStream()
  for (const { seed } of SPECIMENS) {
    const original = structuredClone(seed)
    const recolored = recolorStudy(seed, random)
    assert.notEqual(recolored.palette, seed.palette)
    assert.deepEqual(geometry(recolored), geometry(seed))
    assert.deepEqual(seed, original)
    assert.ok(PALETTE_NAMES.includes(recolored.palette))
    assert.equal(colorsFor(recolored).length, 4)
  }
})

function elements(seed) {
  return seed.curve?.arcs ?? seed.motifs ?? seed.facets.rays
}

test('each sprout retains part of its parent while offering different structures', () => {
  const random = randomStream()
  for (const { seed } of SPECIMENS) {
    const original = structuredClone(seed)
    const children = sproutSet(seed, random)
    assert.equal(children.length, 9)
    const parentParts = elements(seed).map((part) => JSON.stringify(part))
    const counts = new Set(children.map((child) => elements(child).length))
    assert.ok(counts.size >= 3, `${seed.family}: choices should include growth and simplification`)
    for (const child of children) {
      assert.equal(child.family, seed.family)
      assert.notDeepEqual(geometry(child), geometry(seed))
      assert.ok(elements(child).some((part) => parentParts.includes(JSON.stringify(part))),
        `${seed.family}: at least one actual parent element should remain`)
      finiteTree(child)
    }
    assert.deepEqual(seed, original)
  }
})

test('direction changes and new figures evolve from the parent', () => {
  const random = randomStream()
  for (const { seed } of SPECIMENS) {
    const child = sproutStudy(seed, random, 'redirect')
    if (seed.curve) {
      assert.notDeepEqual(child.curve.arcs.map((arc) => arc.turn), seed.curve.arcs.map((arc) => arc.turn))
    }
    if (seed.motifs) {
      assert.notDeepEqual(child.motifs.map((motif) => motif.type), seed.motifs.map((motif) => motif.type))
    }
    if (seed.facets) {
      assert.notDeepEqual(child.facets.rays.map((ray) => ray.angle), seed.facets.rays.map((ray) => ray.angle))
    }
  }
})

test('long lineages stay finite, bounded and retain valid opposing facet pairs', () => {
  const random = randomStream()
  for (const specimen of SPECIMENS) {
    let seed = specimen.seed
    for (let i = 0; i < 500; i++) {
      seed = sproutStudy(seed, random)
      finiteTree(seed)
      assert.ok(PALETTE_NAMES.includes(seed.palette))
      assert.ok(!('motion' in seed))
      const count = elements(seed).length
      assert.ok(count >= 2 && count <= (seed.curve ? 8 : seed.motifs ? 10 : 12))
      for (const arc of seed.curve?.arcs ?? []) {
        assert.ok(arc.radius >= 0.09 && arc.radius <= 0.52)
        assert.ok(arc.sweep >= 0.65 && arc.sweep <= Math.PI * 1.8)
        assert.ok(arc.turn === 1 || arc.turn === -1)
      }
      for (const motif of seed.motifs ?? []) {
        assert.ok(['ring', 'diamond', 'bar', 'dot'].includes(motif.type))
        assert.ok(Math.abs(motif.x) <= 0.6 && Math.abs(motif.y) <= 0.6)
      }
      if (seed.facets) {
        const rays = seed.facets.rays
        assert.ok(rays.length >= 4 && rays.length % 2 === 0)
        for (let i = 0; i < rays.length / 2; i++) {
          const ray = rays[i]
          const opposite = rays[i + rays.length / 2]
          assert.ok(Math.abs(opposite.angle - ray.angle - Math.PI) < 1e-9)
          for (const point of [ray, opposite]) {
            assert.ok(point.inner >= 0.08 && point.inner <= 0.32)
            assert.ok(point.outer >= 0.24 && point.outer <= 0.65)
          }
          if (i > 0) assert.ok(ray.angle > rays[i - 1].angle)
        }
      }
    }
  }
})
