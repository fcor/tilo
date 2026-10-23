# Tilo

A small creative tool for breeding static abstract forms. It is based on the "mutant shopping" and "chorus line" patterns from Compton & Mateas, *Casual Creators* (ICCC 2015).

Tilo opens with nine random blooms drawn from four starting styles: open and layered curves, and open and layered geometric compositions. Pick one to plant it. The selected parent appears beside nine evolving seedlings; picking a seedling grows the next generation.

Curves and geometric figures can mix gradually within the same lineage. Growth follows actual inherited geometry: new figures appear around curves or existing figures, and curves develop around figures. Selection focuses the visual direction, while each generation keeps varied possibilities. Artwork stays static.

The lineage sidebar shows every picked bloom and branch. Drag or scroll to pan, and use the round controls to zoom, fit the whole tree or find the current bloom. Control/Command plus scroll zooms around the pointer. Returning to a bloom restores its saved seedlings. **Colors** changes only the nine choices’ colors; **All traits** generates new shapes and colors. **New bloom** opens another set of starting choices while retaining existing trees, and ↓ downloads the parent as a 2048px PNG. Histories are kept for the current browser session.

The interface is styled after Chrome Music Lab: a white page, a hairline grid, solid color blocks and bouncy motion. Garden actions share round pink buttons and playful icon feedback; hints appear on hover or focus. Visible garden headings are omitted, with accessible section names retained.

- **Bloom study:** open `study.html` directly for reference experiments. It is kept out of the main interface. Compare six evolving compositions, explore branches, and try color alternatives. [BLOOM-STUDY.md](BLOOM-STUDY.md) records the experiments and proposals.
- [ROADMAP.md](ROADMAP.md): planned features and open questions
- [DESIGN-DIRECTION.md](DESIGN-DIRECTION.md): design foundation from the *Casual Creators* paper
- [DECISIONS.md](DECISIONS.md): design decisions and the reasoning behind them

## Run

```sh
npm install
npm run dev
```

Run the art and lineage checks with `npm test`; study-only checks are available through `npm run test:study`.

Palettes come from Kjetil Golid's [Chromotome](https://github.com/kgolid/chromotome), used under the [MIT license](public/chromotome-license.txt).

## Deploy

Every push to `master` builds the app and publishes it to GitHub Pages at <https://fcor.github.io/tilo/> (`.github/workflows/deploy.yml`). It can also be run by hand from the Actions tab.

## Naming

*Tilo* is Spanish for the linden tree, so the code uses plant-breeding terms:

| Term | Meaning |
|---|---|
| **seed** | The data a bloom grows from: visual traits and inherited geometric structure |
| **trait** | A visual property such as curvature, ribbon weight, figure position or palette |
| **bloom** | The static artwork drawn from a seed |
| **parent** | The current selected bloom |
| **seedlings** | The 9 mutated variations of the parent |
| **sprout** | Evolving inherited geometry and color into a new choice |
| **lineage** | Every picked bloom and branch, including additional starting roots |

## Files

```
src/
  art/             shared presets, geometry, evolution, palettes and renderer
  seed.js          startingSet(), sproutSet(), recolorSeed(); no React or p5
  lineage.js       starting choices, selection, saved branches and re-sprouting
  drawBloom.js     shared renderer entry point used by canvas, thumbnails and export
  BloomCanvas.jsx  one p5 instance (instance mode) per bloom, redrawn only when its seed or display changes
  BloomThumbnail.jsx  still image of a bloom, drawn once by a shared p5 instance
  LineageTree.jsx  interactive lineage map and navigation
  treeView.js      tree layout, fitting, focus and zoom geometry
  exportBloom.js   renders a bloom at 2048px and downloads it as a PNG
  press.js         one-shot click bounce for the round buttons
  App.jsx          main experience and garden layout
  GardenActions.jsx  Colors and All traits controls
  ActionButton.jsx   shared round action buttons, tooltips and playful states
  index.css        all styles; the colors are variables at the top
```

## Extending the artwork

The main seed contains optional connected curves and positioned figures, with no fixed family label. Update inherited geometry in `src/art/seeds.js` and the shared evolution helpers. Drawing and placement share `src/art/geometry.js`; the renderer is in `src/art/render.js`. Keep new growth tied to the parent and verify color-only exploration preserves geometry.
