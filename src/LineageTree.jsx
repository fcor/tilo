import { useEffect, useRef } from 'react'
import BloomThumbnail from './BloomThumbnail.jsx'

const CELL = 64 // px per row and column; each bloom is drawn a bit smaller

// Lays the tree out like a plant: depth sets the row (root at the bottom) and
// leaves take consecutive columns. Each node sits above its first child, so the
// first branch grows straight up and later branches fork off to the right.
function layoutTree(nodes) {
  const children = nodes.map(() => [])
  for (const node of nodes) if (node.parentId !== null) children[node.parentId].push(node.id)

  const positions = []
  let columns = 0
  let rows = 0
  function place(id, depth) {
    rows = Math.max(rows, depth + 1)
    for (const child of children[id]) place(child, depth + 1)
    const column = children[id].length > 0 ? positions[children[id][0]].column : columns++
    positions[id] = { column, depth }
  }
  place(0, 0)

  // Pixel centers, with row 0 (the root) at the bottom.
  const centers = positions.map(({ column, depth }) => ({
    x: (column + 0.5) * CELL,
    y: (rows - depth - 0.5) * CELL,
  }))
  return { centers, width: columns * CELL, height: rows * CELL }
}

// Ids of the node and all its ancestors.
function stemOf(nodes, id) {
  const stem = new Set()
  for (let node = nodes[id]; node; node = nodes[node.parentId]) stem.add(node.id)
  return stem
}

export default function LineageTree({ nodes, currentId, onSelect }) {
  const { centers, width, height } = layoutTree(nodes)
  const stem = stemOf(nodes, currentId)

  // Keep the current bloom in view as the tree grows.
  const treeRef = useRef(null)
  useEffect(() => {
    treeRef.current.querySelector('.current')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [currentId, nodes.length])

  return (
    <div className="tree" ref={treeRef} style={{ width, height }}>
      <svg className="tree-stems" width={width} height={height}>
        {nodes.map((node) => {
          if (node.parentId === null) return null
          const from = centers[node.parentId]
          const to = centers[node.id]
          const midY = (from.y + to.y) / 2
          return (
            <path
              key={node.id}
              className={stem.has(node.id) ? 'on-stem' : ''}
              d={`M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`}
            />
          )
        })}
      </svg>

      {nodes.map((node) => {
        const isCurrent = node.id === currentId
        const { x, y } = centers[node.id]
        return (
          <div key={node.id} className="tree-node" style={{ left: x, top: y }}>
            <BloomThumbnail
              seed={node.seed}
              className={isCurrent ? 'current' : stem.has(node.id) ? '' : 'off-stem'}
              onClick={isCurrent ? undefined : () => onSelect(node.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
