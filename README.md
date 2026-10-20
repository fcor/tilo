# Tilo

A small creative tool for breeding animated shapes. It is based on the "mutant shopping" and "chorus line" patterns from Compton & Mateas, *Casual Creators* (ICCC 2015).

A parent bloom is shown large, next to 9 mutated seedlings. Click a seedling to make it the new parent, and 9 fresh seedlings sprout. All blooms animate in sync, so differences in motion are easy to compare. The panel on the left shows the lineage as a plant growing upward from the first seed. Click any bloom in it to make it the parent again, with the same seedlings it had. Nothing is ever discarded: picking a different seedling grows a new branch.

- [ROADMAP.md](ROADMAP.md): planned features and open questions
- [DESIGN-DIRECTION.md](DESIGN-DIRECTION.md): design foundation from the *Casual Creators* paper
- [DECISIONS.md](DECISIONS.md): design decisions and the reasoning behind them

## Run

```sh
npm install
npm run dev
```

## Deploy

Every push to `master` builds the app and publishes it to GitHub Pages at <https://fcor.github.io/tilo/> (`.github/workflows/deploy.yml`). It can also be run by hand from the Actions tab.

## Naming

*Tilo* is Spanish for the linden tree, so the code uses plant-breeding terms:

| Term | Meaning |
|---|---|
| **seed** | The data a bloom grows from: a plain object of traits, each from 0 to 1 |
| **trait** | One value in a seed (sides, copies, size, hue, spin, pulse) |
| **bloom** | The animated shape drawn from a seed |
| **parent** | The current selected bloom |
| **seedlings** | The 9 mutated variations of the parent |
| **sprout** | Making a seedling from the parent by adding Gaussian noise to its traits |
| **lineage** | Every parent picked so far, stored as a tree |

## Files

```
src/
  seed.js          traits, randomSeed(), sprout(); no React or p5
  drawBloom.js     maps traits to visuals and draws one bloom with p5
  BloomCanvas.jsx  one p5 instance (instance mode) per animated bloom
  BloomThumbnail.jsx  still image of a bloom, drawn once by a shared p5 instance
  LineageTree.jsx  lays out and draws the lineage tree
  App.jsx          lineage tree state, layout
  index.css
```

## Adding a trait

1. Add its name to `TRAITS` in `src/seed.js`. If it should wrap around like hue does, also add it to `WRAPPING_TRAITS`.
2. Read `seed.yourTrait` in `src/drawBloom.js` and map it to a visual range with `p.lerp(min, max, …)`.
