export const CELL = 64
export const READABLE_SCALE = 0.7
export const MAX_SCALE = 1.8

export function layoutTree(nodes) {
  const children = nodes.map(() => [])
  for (const node of nodes) if (node.parentId !== null) children[node.parentId].push(node.id)
  const positions = []
  let columns = 0
  let rows = 0
  const stack = nodes.filter((node) => node.parentId === null).reverse()
    .map((node) => ({ id: node.id, depth: 0, visited: false }))
  // An explicit stack also handles long lineages without recursive call limits.
  while (stack.length) {
    const item = stack.pop()
    if (!item.visited) {
      rows = Math.max(rows, item.depth + 1)
      stack.push({ ...item, visited: true })
      for (const id of [...children[item.id]].reverse()) {
        stack.push({ id, depth: item.depth + 1, visited: false })
      }
    } else {
      const first = children[item.id][0]
      positions[item.id] = {
        column: first === undefined ? columns++ : positions[first].column,
        depth: item.depth,
      }
    }
  }
  return {
    centers: positions.map(({ column, depth }) => ({
      x: (column + 0.5) * CELL,
      y: (rows - depth - 0.5) * CELL,
    })),
    width: columns * CELL,
    height: rows * CELL,
  }
}

export function fitTree(tree, viewport, minimum = 0) {
  const k = Math.max(minimum, Math.min(1,
    Math.max(1, viewport.width - 32) / tree.width,
    Math.max(1, viewport.height - 32) / tree.height,
  ))
  return {
    x: (viewport.width - tree.width * k) / 2,
    y: viewport.height - tree.height * k - 16,
    k,
  }
}

export function findBloom(center, viewport, view) {
  const k = Math.max(READABLE_SCALE, view.k)
  return { x: viewport.width / 2 - center.x * k, y: viewport.height / 2 - center.y * k, k }
}

export function revealBloom(center, viewport, view) {
  const padding = 24 * view.k + 8
  const x = center.x * view.k + view.x
  const y = center.y * view.k + view.y
  return {
    ...view,
    x: view.x + (x < padding ? padding - x : x > viewport.width - padding ? viewport.width - padding - x : 0),
    y: view.y + (y < padding ? padding - y : y > viewport.height - padding ? viewport.height - padding - y : 0),
  }
}

export function zoomAround(view, multiplier, point) {
  const k = Math.max(0.01, Math.min(MAX_SCALE, view.k * multiplier))
  const ratio = k / view.k
  return { x: point.x - (point.x - view.x) * ratio, y: point.y - (point.y - view.y) * ratio, k }
}

export function constrainPan(view, tree, viewport) {
  return {
    ...view,
    x: Math.max(24 - tree.width * view.k, Math.min(viewport.width - 24, view.x)),
    y: Math.max(24 - tree.height * view.k, Math.min(viewport.height - 24, view.y)),
  }
}
