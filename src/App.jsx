import { useState } from 'react'
import BloomCanvas from './BloomCanvas.jsx'
import LineageTree from './LineageTree.jsx'
import { randomSeed, sprout, MUTATION_RATE } from './seed.js'

const NUM_SEEDLINGS = 9

function sproutSeedlings(parent) {
  return Array.from({ length: NUM_SEEDLINGS }, () => sprout(parent, MUTATION_RATE))
}

// A node is one picked bloom in the lineage tree. It keeps its seedlings,
// so returning to it shows exactly what was on screen before.
function makeNode(id, seed, parentId) {
  return { id, seed, parentId, seedlings: sproutSeedlings(seed) }
}

// The lineage is a tree of every bloom picked so far. Nodes are never removed,
// so a node's id is its index in `nodes`. `currentId` is the parent on screen.
function startLineage() {
  return { nodes: [makeNode(0, randomSeed(), null)], currentId: 0 }
}

export default function App() {
  const [lineage, setLineage] = useState(startLineage)
  const { nodes, currentId } = lineage
  const current = nodes[currentId]

  function pickSeedling(seedling) {
    // A seedling picked before already has a node; return to it instead of growing a duplicate.
    const existing = nodes.find((node) => node.parentId === currentId && node.seed === seedling)
    if (existing) {
      setLineage({ nodes, currentId: existing.id })
      return
    }

    // Otherwise grow a new node; if the parent already had children, this starts a new branch.
    const node = makeNode(nodes.length, seedling, currentId)
    setLineage({ nodes: [...nodes, node], currentId: node.id })
  }

  // Replaces the current parent's seedlings with a fresh set. Seedlings that were
  // picked live on in the tree; the rest of the old set is gone.
  function resprout() {
    const resprouted = { ...current, seedlings: sproutSeedlings(current.seed) }
    setLineage({ nodes: nodes.map((node) => (node.id === currentId ? resprouted : node)), currentId })
  }

  // Selecting a node in the tree only moves the pointer; nothing is discarded.
  function goTo(id) {
    setLineage({ nodes, currentId: id })
  }

  return (
    <main className="app">
      <aside className="lineage">
        <LineageTree nodes={nodes} currentId={currentId} onSelect={goTo} />
      </aside>

      <div className="garden">
        <section className="parent">
          <BloomCanvas seed={current.seed} />
        </section>
        <section className="seedlings">
          <div className="seedlings-grid">
            {current.seedlings.map((seedling, i) => (
              // Index keys keep each p5 instance alive; only its seed changes.
              <BloomCanvas key={i} seed={seedling} onClick={() => pickSeedling(seedling)} />
            ))}
          </div>
          <div className="seedlings-bar">
            <button className="icon-button" onClick={resprout} title="Re-sprout" aria-label="Re-sprout">
              ↻
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
