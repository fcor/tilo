import { useEffect, useRef, useState } from 'react'
import BloomCanvas from './BloomCanvas.jsx'
import GardenActions from './GardenActions.jsx'
import ActionButton from './ActionButton.jsx'
import LineageTree from './LineageTree.jsx'
import { downloadBloomPng } from './exportBloom.js'
import { createGarden, generationOf, pickBloom, resproutGarden, restoreBloom, showStarts } from './lineage.js'

export default function App() {
  const [garden, setGarden] = useState(createGarden)
  const [notice, setNotice] = useState('')
  const [downloading, setDownloading] = useState(false)
  const { nodes, currentId, starts, choosing } = garden
  const current = nodes[currentId]
  const headingRef = useRef(null)

  useEffect(() => {
    if (nodes.length) headingRef.current?.focus({ preventScroll: true })
  }, [choosing])

  function pick(seed) {
    setGarden((previous) => pickBloom(previous, seed))
    setNotice(choosing ? 'Your bloom is planted. Pick a seedling to grow it.' : 'Bloom selected. Your previous bloom is saved in the lineage.')
  }

  function resprout(colorsOnly) {
    setGarden((previous) => resproutGarden(previous, colorsOnly))
    setNotice(colorsOnly ? 'New colors. All nine shapes kept.' : 'Nine new blooms to explore.')
  }

  function goTo(id) {
    setGarden((previous) => restoreBloom(previous, id))
    setNotice('Bloom restored with its saved seedlings.')
  }

  async function downloadPng() {
    if (downloading) return
    setDownloading(true)
    try {
      await downloadBloomPng(current.seed)
      setNotice('Bloom downloaded as a PNG.')
    } catch {
      setNotice('The PNG could not be downloaded. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const actions = <GardenActions onColors={() => resprout(true)} onForms={() => resprout(false)} />

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo"><span className="logo-mark" aria-hidden="true">✿</span> tilo</h1>
        <nav className="header-actions" aria-label="Tilo navigation">
          {nodes.length > 0 && (
            <button type="button" className="header-choice" onClick={() => {
              if (choosing) goTo(currentId)
              else { setGarden((previous) => showStarts(previous)); setNotice('Choose a new bloom. Your existing lineage is saved.') }
            }}>
              {choosing ? 'Back to garden' : 'New bloom'}
            </button>
          )}
        </nav>
      </header>

      <main className="workspace">
        {nodes.length > 0 && (
          <aside className="lineage" aria-label="Bloom lineage">
            <LineageTree nodes={nodes} currentId={currentId} onSelect={goTo} />
          </aside>
        )}
        {choosing ? (
          <div className="garden starting-garden">
            <section className="starting-board" aria-labelledby="starting-heading">
              <div className="starting-intro">
                <h2 id="starting-heading" className="starting-heading" tabIndex={-1} ref={headingRef}>Pick a bloom to begin</h2>
                <p>Choose something that catches your eye. See where it grows.</p>
              </div>
              <div className="seedlings-grid starting-grid">
                {starts.map((seed, i) => (
                  <BloomCanvas key={i} seed={seed} onClick={() => pick(seed)}
                    label={`Choose starting bloom ${i + 1}`} popDelay={60 + i * 30} />
                ))}
              </div>
              {actions}
            </section>
          </div>
        ) : (
          <div className="garden">
            <div className="garden-board">
              <section className="parent" aria-label={`Parent bloom, generation ${generationOf(nodes, currentId)}`}
                tabIndex={-1} ref={headingRef}>
                <BloomCanvas seed={current.seed} label="Current parent bloom" />
                <div className="toolbar">
                  <ActionButton action="download" onClick={downloadPng} busy={downloading} />
                </div>
              </section>
              <section className="seedlings" aria-label="Seedlings. Pick one to grow">
                <div className="seedlings-grid">
                  {current.seedlings.map((seed, i) => (
                    <BloomCanvas key={i} seed={seed} onClick={() => pick(seed)}
                      label={`Pick seedling ${i + 1}`} popDelay={60 + i * 30} />
                  ))}
                </div>
                {actions}
              </section>
            </div>
          </div>
        )}
      </main>
      <p className="garden-live" role="status" aria-live="polite">{notice}</p>
    </div>
  )
}
