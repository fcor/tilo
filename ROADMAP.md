# Tilo roadmap

Tilo is a casual creator: the goal is play, experimentation and the pleasure of watching something evolve, not reaching a fixed result. Every feature should keep that feeling: fast feedback, no wrong moves, nothing lost, and always something interesting to click next.

Design background is in [DESIGN-DIRECTION.md](DESIGN-DIRECTION.md), and the reasoning behind choices is logged in [DECISIONS.md](DECISIONS.md).

Items marked **❓** have open questions to think through before building them.

## Done

- [x] Parent bloom + 3×3 grid of seedlings (mutant shopping)
- [x] All blooms animate in sync (chorus line)
- [x] Seedlings are sprouted from the clicked bloom, not generated at random
- [x] Linear lineage strip; click an ancestor to go back
- [x] Lineage stored as a tree: nothing is ever deleted; returning to a bloom restores its seedlings
- [x] Growing-tree view in a left sidebar: root at the bottom, every branch visible and clickable
- [x] Re-sprout button: a fresh set of 9 seedlings from the same parent
- [x] Still thumbnails in the lineage tree, drawn once by a single shared p5 instance
- [x] Botanical naming (seed, trait, bloom, parent, seedlings, sprout, lineage)
- [x] README, roadmap, design direction, decision log

## Now

- [ ] **Garden layout with the sidebar.** At around 1200px wide the seedling grid wraps below the parent instead of sitting beside it: the 240px tree sidebar plus the parent and grid (480px each + gap) need about 1000px. That pushes the seedlings below the fold on many laptops and breaks the side-by-side chorus line. Let the parent and grid shrink to fit side by side before wrapping. Also check the grid now starts lower than the parent because of the re-sprout button's row.

## Next: evolving something meaningful

- [ ] ❓ **Mutation: related but perceptibly different.** Seedlings should clearly come from their parent, but never look identical to it ("1000 bowls of oatmeal"). Today the discrete traits (sides, copies) jump between whole numbers, which can make a seedling look unrelated.
  - How much should one pick change? Small steps feel like refining; big ones feel like creative leaps. The paper favors leaps.
  - Mutate every trait a little, or a few traits a lot?
  - Should the grid mix strengths, e.g. some "refine" and some "wild" seedlings? How would users tell them apart without labels or settings?
  - Should strength change over time, e.g. wilder at the start and finer deeper in a lineage?
- [ ] ❓ **Curious mode.** An idea to explore later; not defined yet.
  - What does "curious" mean here: wilder mutations, surprising trait combinations, jumping to an unexplored region, or something else?
  - Is it a mode the user switches on, or something that happens on its own now and then?
  - How does it fit "few, clear choices" without becoming a setting?
- [ ] **Starting styles.** Hand-made starting seeds (for example flower, star, jellyfish, crystal) instead of one random seed, so the first screen already looks good.
- [ ] **Perceptual traits.** Rebuild traits around what people see (spikiness, petals, sway, breathing) instead of how they're computed (sides, copies).
- [ ] **Richer traits.** Stroke vs. fill, a second color, layering, more kinds of motion (wobble, orbit, phase offset).
- [ ] ❓ **Trait locks.** Pin a trait you like so it stops mutating. Does this count as the editing we decided against, or is it still selection? Only if it stays playful and doesn't feel like settings.
- [ ] **Start over.** Plant a new random seed without losing the current tree.

## Later

- [ ] **Interface pass:** desktop first but mobile friendly; layout, typography, hover and selection states, transitions when seedlings sprout.
- [ ] **Identity:** logo, name in the header, credits (Compton & Mateas, *Casual Creators*, ICCC 2015; Funky Ikebana as the closest precedent) and an about panel.
- [ ] **Saving and export:** download a bloom as PNG, SVG or GIF; save and load a whole lineage as JSON.
- [ ] **Deploy:** GitHub Pages via a GitHub Actions workflow (set Vite's `base` to the repo name).

## Nice to have

- [ ] **Botanical names.** Generate a Latin-style name from each seed (e.g. *Tilia spinosa rubra*) to build pride and ownership, and to title exports.
- [ ] **Link sharing.** A seed in the URL is fairly simple and could come first; a link that carries the whole lineage is harder.
- [ ] ❓ **Speaking to the audience.** Tilo is for designers and the creatively curious. How should that show up: tone, presets, export formats, the about panel?
