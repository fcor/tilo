# Tilo roadmap

Tilo is a casual creator: the goal is play, experimentation and the pleasure of watching something evolve, not reaching a fixed result. Every feature should keep that feeling: fast feedback, no wrong moves, nothing lost, and always something interesting to click next.

Design background is in [DESIGN-DIRECTION.md](DESIGN-DIRECTION.md), and the reasoning behind choices is logged in [DECISIONS.md](DECISIONS.md).

Items marked **❓** have open questions to think through before building them.

## Done

- [x] Nine random starting blooms from open/layered curves and open/layered contrasts
- [x] Main art engine: static compositions with gradual mixing of curves and geometric figures
- [x] Color-only and all-traits re-sprouting in the main app
- [x] New starting blooms preserve previous trees in the current session

- [x] Parent bloom + 3×3 grid of seedlings (mutant shopping)
- [x] Static blooms compared side by side; redraw only when art or display changes (chorus line)
- [x] Seedlings are sprouted from the clicked bloom, not generated at random
- [x] Linear lineage strip; click an ancestor to go back
- [x] Lineage stored as a tree: nothing is ever deleted; returning to a bloom restores its seedlings
- [x] Growing-tree view in a left sidebar: root at the bottom, every branch visible and clickable
- [x] Re-sprout button: a fresh set of 9 seedlings from the same parent
- [x] Still thumbnails in the lineage tree, drawn once by a single shared p5 instance
- [x] Botanical naming (seed, trait, bloom, parent, seedlings, sprout, lineage)
- [x] README, roadmap, design direction, decision log
- [x] Garden layout: parent and grid share a row; re-sprout sits below the grid so tops line up
- [x] Desktop sizing: centered parent and grid fit available width and height, grow up to 800px per panel, and keep controls visible; canvases update density when changing displays
- [x] Deploy: GitHub Pages via a GitHub Actions workflow (Vite `base: './'`, so it works under `/tilo/`)
- [x] PNG export: the parent as a 2048×2048 PNG, matching the static composition
- [x] Interface pass, styled after Chrome Music Lab:
  - white page with an edge-to-edge hairline grid
  - sunny yellow tree bed with pink stems, white bloom circles and a pink ring on the current bloom
  - Nunito type with a pink ✿
  - seedling hover: a light yellow tint and the bloom grows, with no border
  - seedlings pop in as a ripple when they sprout
  - pink round buttons that spin (↻) or drop (↓) on hover, and on click bounce while the icon repeats its move

## Now

The revised artwork is integrated into the main Tilo experience. Opening choices are nine random blooms from the four curve/contrast starting styles. Descendants mix curves and figures gradually; the nine choices combine reshaping, growth, redirection, simplification and mixing. Selection focuses the visual direction without reducing mutation strength by click count. Both re-sprout actions, the lineage tree and PNG export use the shared art engine.

Review the main experience for aesthetics, clarity of ancestry and sibling variety across longer lineages. Facets remain in the reference study. See [BLOOM-STUDY.md](BLOOM-STUDY.md) for the history of the exploration.

## Bloom aesthetics

- [ ] **Richer curve composition:** develop a new study with additional compositional elements. The current four starting styles derive from two main visual vocabularies, curves and geometric figures. Choose the new elements and placement rules with the user.
- [x] **First main bloom renderer,** using stronger creative coding algorithms and compositions. The approved study variation is now the main baseline; visual refinement continues.
  - Explore flowing loops, ribbons and soft contours, plus stars, crystals and sharp symmetry. Floral imagery is not a requirement.
  - Keep each step visibly related to its parent through a combination of form, composition and symmetry; the exact mutation rules remain open.
  - Draw with opaque colors, reserving space for rotation and hover.
  - Use palettes from an existing collection, with artist or movement references as possible sources. Descendants can evolve between palettes. The collection and transitions remain to be chosen.
- [x] **Re-sprout colors:** regenerate only the nine seedlings' colors, keeping their geometry. The parent stays the reference. The existing re-sprout action regenerates all traits of the seedlings.
  - [x] Integrated into the main app, preserving the parent and every seedling’s geometry.

## Next: evolving something meaningful

All of these except "Start over" depend on the bloom rework above.

- [ ] ❓ **Mutation: related but perceptibly different.** Seedlings should clearly come from their parent, but never look identical to it ("1000 bowls of oatmeal"). The main renderer now offers structural changes and mixed geometry; continue judging recognizable ancestry and meaningful choice.
  - How much should one pick change? Small steps feel like refining; big ones feel like creative leaps. The paper favors leaps.
  - Mutate every trait a little, or a few traits a lot? Choose by judging recognizable parent-to-descendant sequences in the art study.
  - Should the grid mix strengths, e.g. some "refine" and some "wild" seedlings? How would users tell them apart without labels or settings?
  - Agreed: visual focus comes from selection; mutation strength does not automatically shrink with generation count.
- [ ] ❓ **Curious mode.** An idea to explore later; not defined yet.
  - What does "curious" mean here: wilder mutations, surprising trait combinations, jumping to an unexplored region, or something else?
  - Is it a mode the user switches on, or something that happens on its own now and then?
  - How does it fit "few, clear choices" without becoming a setting?
- [x] **Starting styles.** Four approved curve/contrast styles seed nine random opening choices.
- [ ] **Perceptual traits.** Rebuild traits around what people see (curvature, spikiness, density, overlap) instead of how they're computed (sides, copies).
- [ ] **Richer traits.** Stroke vs. fill, multiple colors, stroke weight, layering and richer composition.
- [ ] ❓ **Trait locks.** Pin a trait you like so it stops mutating. Does this count as the editing we decided against, or is it still selection? Only if it stays playful and doesn't feel like settings.
- [x] **New bloom.** Offer fresh starting choices without losing existing trees in the session.

## Later

- [x] **Lineage navigation:** drag/wheel panning, pointer-centered zoom, keyboard navigation, bounded automatic fitting, Fit tree and Find current bloom. Explicit Fit offers the full overview; Find restores readable scale. No visible scrollbars. Branch collapsing remains a possible later addition.
- [ ] **Lineage color:** comparison prepared for current bright yellow, pale buttery yellow and warm white; awaiting the user’s choice.
- [ ] **Identity:** a real logo (the header has a simple "✿ tilo" wordmark and favicon for now), credits (Compton & Mateas, *Casual Creators*, ICCC 2015; Funky Ikebana as the closest precedent; Chrome Music Lab as the interface reference) and an about panel.
- [ ] **Saving and export:** SVG of a bloom; save and load a whole lineage as JSON. (PNG is done.)
- [ ] **Tree polish:** blooms are drawn small inside the tree's white circles and read as dots; draw them larger so the tree is easier to scan.

## Nice to have

- [ ] **Botanical names.** Generate a Latin-style name from each seed (e.g. *Tilia spinosa rubra*) to build pride and ownership, and to title exports.
- [ ] **Link sharing.** A seed in the URL is fairly simple and could come first; a link that carries the whole lineage is harder.
- [ ] ❓ **Speaking to the audience.** Tilo is for designers and the creatively curious. How should that show up: tone, presets, export formats, the about panel?
