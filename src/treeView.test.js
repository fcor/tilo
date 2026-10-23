import assert from 'node:assert/strict'
import test from 'node:test'
import { findBloom, fitTree, layoutTree, READABLE_SCALE, revealBloom, zoomAround } from './treeView.js'

test('large lineages and multiple roots have stable, distinct positions', () => {
  const nodes = Array.from({ length: 10000 }, (_, id) => ({ id, parentId: id ? id - 1 : null }))
  nodes.push({ id: 10000, parentId: null }, { id: 10001, parentId: 0 })
  const layout = layoutTree(nodes)
  assert.equal(layout.centers.length, nodes.length)
  assert.equal(new Set(layout.centers.map(({ x, y }) => `${x},${y}`)).size, nodes.length)
  assert.ok(layout.centers[0].y > layout.centers[9999].y)
  assert.ok(layout.centers[10000].x > layout.centers[10001].x)
})

test('explicit Fit includes a large tree; automatic fitting preserves readable nodes', () => {
  const tree = { width: 1280, height: 2560 }
  const viewport = { width: 200, height: 600 }
  const fit = fitTree(tree, viewport)
  assert.ok(fit.x >= 16 && fit.y >= 16)
  assert.ok(fit.x + tree.width * fit.k <= viewport.width - 16)
  assert.ok(fit.y + tree.height * fit.k <= viewport.height - 16)
  const auto = fitTree(tree, viewport, READABLE_SCALE)
  assert.ok(auto.k >= READABLE_SCALE)
  const current = { x: 32, y: 32 }
  const revealed = revealBloom(current, viewport, auto)
  assert.ok(current.x * revealed.k + revealed.x + 1e-9 >= 24 * revealed.k + 8)
  assert.ok(current.y * revealed.k + revealed.y + 1e-9 >= 24 * revealed.k + 8)
})

test('Find restores readable scale and centers a selected bloom from an overview', () => {
  const center = { x: 600, y: 900 }
  const viewport = { width: 200, height: 600 }
  const found = findBloom(center, viewport, { x: -80, y: -50, k: 0.1 })
  assert.ok(found.k >= READABLE_SCALE)
  assert.equal(center.x * found.k + found.x, viewport.width / 2)
  assert.equal(center.y * found.k + found.y, viewport.height / 2)
})

test('zoom retains the point beneath the pointer, including at zoom limits', () => {
  const view = { x: -40, y: 120, k: 0.75 }
  const point = { x: 90, y: 180 }
  for (const multiplier of [0.7, 1.25, 50]) {
    const zoomed = zoomAround(view, multiplier, point)
    assert.ok(Math.abs((point.x - zoomed.x) / zoomed.k - (point.x - view.x) / view.k) < 1e-9)
    assert.ok(Math.abs((point.y - zoomed.y) / zoomed.k - (point.y - view.y) / view.k) < 1e-9)
  }
})
