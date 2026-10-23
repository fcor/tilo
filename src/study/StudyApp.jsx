import { useEffect, useRef, useState } from 'react'
import BloomCanvas from '../BloomCanvas.jsx'
import BloomThumbnail from '../BloomThumbnail.jsx'
import { downloadBloomPng } from '../exportBloom.js'
import { drawStudyBloom } from './drawStudyBloom.js'
import { SPECIMENS, recolorStudy, sproutSet } from './seeds.js'
import { paletteFor } from './palettes.js'

function makeNode(id, seed, parentId) {
  return { id, seed, parentId, seedlings: sproutSet(seed) }
}

function startStudies() {
  return Object.fromEntries(SPECIMENS.map(({ id, seed }) => [
    id, { nodes: [makeNode(0, seed, null)], currentId: 0 },
  ]))
}

function ancestry(nodes, currentId) {
  const path = []
  for (let node = nodes[currentId]; node; node = nodes[node.parentId]) path.unshift(node)
  return path
}

export default function StudyApp() {
  const [studies, setStudies] = useState(startStudies)
  const [activeId, setActiveId] = useState(SPECIMENS[0].id)
  const [notice, setNotice] = useState('')
  const specimen = SPECIMENS.find(({ id }) => id === activeId)
  const { nodes, currentId } = studies[activeId]
  const current = nodes[currentId]
  const path = ancestry(nodes, currentId)
  const trailRef = useRef(null)

  useEffect(() => {
    trailRef.current?.querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId, currentId])

  function updateStudy(transform) {
    setStudies((previous) => ({ ...previous, [activeId]: transform(previous[activeId]) }))
  }

  function pickSeedling(seed) {
    updateStudy(({ nodes, currentId }) => {
      const existing = nodes.find((node) => node.parentId === currentId && node.seed === seed)
      if (existing) return { nodes, currentId: existing.id }
      const node = makeNode(nodes.length, seed, currentId)
      return { nodes: [...nodes, node], currentId: node.id }
    })
    setNotice('Seedling picked. The previous bloom is saved in your lineage.')
  }

  function goTo(id) {
    updateStudy((study) => ({ ...study, currentId: id }))
    setNotice('Earlier bloom restored with its saved seedlings.')
  }

  function resprout(colorsOnly) {
    updateStudy(({ nodes, currentId }) => ({
      currentId,
      nodes: nodes.map((node) => node.id === currentId
        ? { ...node, seedlings: colorsOnly ? node.seedlings.map((seed) => recolorStudy(seed)) : sproutSet(node.seed) }
        : node),
    }))
    setNotice(colorsOnly ? 'New seedling colors. Shapes kept.' : 'Nine new seedlings sprouted.')
  }

  async function download() {
    try {
      await downloadBloomPng(current.seed, drawStudyBloom)
      setNotice('Bloom downloaded as a PNG.')
    } catch {
      setNotice('The PNG could not be downloaded. Please try again.')
    }
  }

  return (
    <div className="study-app">
      <header className="study-header">
        <a className="study-home" href="./index.html" aria-label="Back to Tilo">
          <span className="logo-mark" aria-hidden="true">✿</span> tilo
        </a>
        <h1>Bloom study</h1>
      </header>

      <main className="study-main">
        <nav className="study-specimens" aria-label="Starting compositions">
          {SPECIMENS.map(({ id, name, seed }) => (
            <button
              key={id}
              className="study-specimen"
              type="button"
              aria-pressed={activeId === id}
              onClick={() => { setActiveId(id); setNotice('') }}
            >
              <BloomThumbnail seed={seed} renderer={drawStudyBloom} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="study-description">
          <p><strong>{specimen.source}</strong><span aria-hidden="true"> · </span>{specimen.description}</p>
          <p className="study-palette">Chromotome · {paletteFor(current.seed).name}</p>
        </div>

        <div className="study-garden">
          <div className="study-board">
            <section className="study-parent" aria-labelledby="study-parent-heading">
              <h2 id="study-parent-heading">Parent <span>generation {path.length - 1}</span></h2>
              <BloomCanvas seed={current.seed} renderer={drawStudyBloom} label="Current parent bloom" />
              <div className="study-toolbar">
                <button type="button" className="study-action study-download" onClick={download}>
                  <span aria-hidden="true">↓</span> Download PNG
                </button>
              </div>
            </section>

            <section className="study-seedlings" aria-labelledby="study-seedlings-heading">
              <h2 id="study-seedlings-heading">Seedlings <span>pick one to grow</span></h2>
              <div className="seedlings-grid">
                {current.seedlings.map((seed, i) => (
                  <BloomCanvas key={i} seed={seed} renderer={drawStudyBloom}
                    onClick={() => pickSeedling(seed)} label={`Pick seedling ${i + 1}`}
                    popDelay={60 + i * 30} />
                ))}
              </div>
              <div className="study-toolbar">
                <span className="study-toolbar-label">Re-sprout</span>
                <button type="button" className="study-action" aria-label="Re-sprout colors"
                  title="New colors, same seedling shapes" onClick={() => resprout(true)}>
                  <span className="study-color-icon" aria-hidden="true"><i /><i /><i /></span> Colors
                </button>
                <button type="button" className="study-action" aria-label="Re-sprout all traits"
                  title="New seedling shapes and colors" onClick={() => resprout(false)}>
                  <span aria-hidden="true">↻</span> All traits
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="study-history">
          <span className="study-history-label">Lineage</span>
          <nav className="study-trail" aria-label="Current bloom lineage" ref={trailRef}>
            <ol>
              {path.map((node, i) => (
                <li key={node.id}>
                  {i > 0 && <span className="study-trail-arrow" aria-hidden="true">→</span>}
                  <button type="button" aria-label={`Return to generation ${i}`}
                    aria-current={node.id === currentId ? 'step' : undefined}
                    onClick={() => goTo(node.id)}>
                    <BloomThumbnail seed={node.seed} renderer={drawStudyBloom} />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="study-saved">
            <label htmlFor="study-saved-blooms">Saved blooms</label>
            <select id="study-saved-blooms" value={currentId} onChange={(event) => goTo(Number(event.target.value))}>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.parentId === null ? 'First bloom' : `Bloom ${node.id + 1} · from ${node.parentId + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="study-live" role="status" aria-live="polite">{notice}</p>
      </main>
    </div>
  )
}
