# Contributing to Tilo

Bug reports, visual feedback and art experiments are welcome. For bugs, include steps to reproduce and your browser and screen size. For visual feedback, a screenshot or parent-to-descendant sequence helps.

## Development

Follow the setup in [README.md](README.md). Run `npm test` and `npm run build` for code changes; `npm run preview` serves the production build locally.

## Where to work

| Area | Files |
|---|---|
| Artwork and inheritance | [src/art/](src/art/): presets, seeds, evolution, geometry, palettes and renderer |
| Public art entry points | [seed.js](src/seed.js), [drawBloom.js](src/drawBloom.js) |
| Garden and saved choices | [lineage.js](src/lineage.js), [App.jsx](src/App.jsx) |
| Canvases, thumbnails and PNGs | [BloomCanvas.jsx](src/BloomCanvas.jsx), [BloomThumbnail.jsx](src/BloomThumbnail.jsx), [exportBloom.js](src/exportBloom.js) |
| Lineage layout and navigation | [treeView.js](src/treeView.js), [LineageTree.jsx](src/LineageTree.jsx) |
| Actions, hints and motion | [ActionButton.jsx](src/ActionButton.jsx), [GardenActions.jsx](src/GardenActions.jsx), [LineageReturnHint.jsx](src/LineageReturnHint.jsx), [press.js](src/press.js) |
| Styles | [index.css](src/index.css), including color variables |

## Extending the artwork

The seed combines optional connected curves and positioned figures, with no fixed family label. Evolve inherited geometry in [seeds.js](src/art/seeds.js) and the shared evolution helpers. Placement uses [geometry.js](src/art/geometry.js); drawing uses [render.js](src/art/render.js).

Keep each generation visibly related to its parent, geometry bounded, and color-only exploration faithful to the original shapes. Parent, seedlings, thumbnails and PNGs share the same static renderer. Respect reduced motion for interface feedback.

Open `study.html` on the dev server to explore reference compositions without adding them to the main experience. Study-only checks run with `npm run test:study`. See [BLOOM-STUDY.md](BLOOM-STUDY.md) for the experiments and open art questions.

## Naming

*Tilo* is Spanish for the linden tree. A **seed** holds visual **traits**; its artwork is a **bloom**. The selected **parent** sprouts nine **seedlings**. Picking one grows the **lineage**, which preserves branches and additional roots.

## Deployment

[deploy.yml](.github/workflows/deploy.yml) builds pushes to `master` and publishes `dist` to GitHub Pages. It also supports manual runs from the Actions tab. Vite uses relative asset paths.
