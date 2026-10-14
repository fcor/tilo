import { useState } from 'react'
import ShapeCanvas from './ShapeCanvas.jsx'
import { randomGenome, mutate, MUTATION_RATE } from './genome.js'

const NUM_CHILDREN = 9

function makeChildren(parent) {
  return Array.from({ length: NUM_CHILDREN }, () => mutate(parent, MUTATION_RATE))
}

export default function App() {
  const [parent, setParent] = useState(randomGenome)
  const [children, setChildren] = useState(() => makeChildren(parent))

  function select(child) {
    setParent(child)
    setChildren(makeChildren(child))
  }

  return (
    <main className="app">
      <section className="parent">
        <ShapeCanvas genome={parent} />
      </section>
      <section className="children">
        {children.map((child, i) => (
          // Index keys keep each p5 instance alive; only its genome changes.
          <ShapeCanvas key={i} genome={child} onClick={() => select(child)} />
        ))}
      </section>
    </main>
  )
}
