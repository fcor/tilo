import { useEffect, useRef, useState } from 'react'
import BloomCanvas from './BloomCanvas.jsx'
import { randomSeed, sprout, MUTATION_RATE } from './seed.js'

const NUM_SEEDLINGS = 9

function sproutSeedlings(parent) {
  return Array.from({ length: NUM_SEEDLINGS }, () => sprout(parent, MUTATION_RATE))
}

export default function App() {
  // The lineage is every parent picked so far, oldest first.
  // The current parent is always the last one.
  const [lineage, setLineage] = useState(() => [randomSeed()])
  const [seedlings, setSeedlings] = useState(() => sproutSeedlings(lineage[0]))
  const parent = lineage[lineage.length - 1]

  // Keep the newest end of the lineage strip in view.
  const lineageRef = useRef(null)
  useEffect(() => {
    const strip = lineageRef.current
    strip.scrollLeft = strip.scrollWidth
  }, [lineage.length])

  function pickSeedling(seedling) {
    setLineage([...lineage, seedling])
    setSeedlings(sproutSeedlings(seedling))
  }

  // Going back to an ancestor makes it the parent again and
  // drops everything that grew after it.
  function returnTo(index) {
    setLineage(lineage.slice(0, index + 1))
    setSeedlings(sproutSeedlings(lineage[index]))
  }

  return (
    <main className="app">
      <section className="lineage" ref={lineageRef}>
        {lineage.map((ancestor, i) => {
          const isParent = i === lineage.length - 1
          return (
            // Index keys are safe: the lineage only grows or is cut at the end.
            <BloomCanvas
              key={i}
              seed={ancestor}
              className={isParent ? 'current' : ''}
              onClick={isParent ? undefined : () => returnTo(i)}
            />
          )
        })}
      </section>

      <div className="garden">
        <section className="parent">
          <BloomCanvas seed={parent} />
        </section>
        <section className="seedlings">
          {seedlings.map((seedling, i) => (
            // Index keys keep each p5 instance alive; only its seed changes.
            <BloomCanvas key={i} seed={seedling} onClick={() => pickSeedling(seedling)} />
          ))}
        </section>
      </div>
    </main>
  )
}
