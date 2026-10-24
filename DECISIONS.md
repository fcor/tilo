# Decision log

A running record of design decisions and why we made them, so the reasoning stays inspectable (and can be reused for a write-up later). Newest last. The checklist in [DESIGN-DIRECTION.md](DESIGN-DIRECTION.md) is a guide for these decisions, not a gate.

Each entry: **what** we decided, **why**, and anything left **open**.

---

### 2026-10-14 · Botanical naming
**What:** genome → seed, gene → trait, shape → bloom, children → seedlings, mutate → sprout, history → lineage.
**Why:** *Tilo* is Spanish for the linden tree, so plant-breeding terms give the project one consistent voice and make the code read like the experience.

### 2026-10-14 · "Parent", not "mother"
**What:** the selected bloom is called the parent.
**Why:** first tried "mother" (breeders' "mother plant"), then switched to the more familiar "parent".

### 2026-10-14 · Selection only, no editing
**What:** users move through the space only by picking seedlings (mutant shopping framing 1, as in *Picbreeder*). No sliders or direct editing of a bloom.
**Why:** keeps choices few and clear, supports fast and confident leaps, and keeps the focus on discovery rather than control.
**Open:** whether trait locks would count as editing.

### 2026-10-14 · Lineage as a growing tree
**What:** the lineage becomes a tree; going back never deletes anything, and a different pick starts a new branch. It's shown as a plant growing upward from the first seed.
**Why:** makes every action reversible (direct manipulation, flow), shows visible progress, and fits the botanical theme. Chosen over a git-style rail, a breadcrumb with sibling stacks, a radial burst and a generation grid.

### 2026-10-14 · Desktop first, mobile friendly
**What:** design for desktop, but the layout must work on phones.
**Why:** the tree view and the chorus line need space to compare blooms; mobile should still be usable.

### 2026-10-14 · Audience: designers and the creatively curious
**What:** the target users are designers and curious, creative people in general.
**Open:** how this should shape the product; parked as a nice-to-have.

### 2026-10-14 · No entertaining evaluations
**What:** we won't add playful reactions or a "critic" (paper pattern 4.4).
**Why:** not enough value for Tilo; the chorus line already makes browsing fun to watch.

### 2026-10-14 · Mutation strength left open
**What:** no decision yet on how strong mutations should be or whether to mix strengths. Open questions are listed in [ROADMAP.md](ROADMAP.md), alongside the "curious mode" idea.
**Why:** this is easier to judge by trying it once the tree exists.

### 2026-10-15 · Lineage tree in a left sidebar
**What:** the lineage is stored as nodes `{ id, seed, parentId, seedlings }` with a `currentId`, and drawn in a left sidebar as a plant: root at the bottom, each bloom above its first child so the first branch grows straight up and later branches fork to the right. The path to the current bloom is highlighted; other branches are dimmed but clickable. Each node keeps its 9 seedlings, so returning to it shows the same choices, and picking an already-picked seedling returns to its node instead of duplicating it. On phones the tree sits in a short band above the garden.
**Why:** a linear strip hid the old branch as soon as a new one started; seeing every branch makes each move visibly reversible. A sidebar gives the tree room to grow upward without squeezing the chorus line.

### 2026-10-15 · Re-sprout replaces the seedlings
**What:** a quiet ↻ icon above the grid sprouts 9 fresh seedlings from the current parent and replaces the stored set. The old set is not kept.
**Why:** simpler than flipping between sets; anything worth keeping was picked, and picked seedlings live on in the tree. A small icon keeps the "pick one" action as the main choice.

### 2026-10-15 · Still thumbnails in the tree
**What:** blooms in the lineage tree are still images of the bloom at rest (t = 0), drawn once by one hidden p5 instance and cached per seed. No animation, not even on hover.
**Why:** the tree is for finding your way, not comparing motion; the chorus line already covers motion. One loop per tree node would slow down as the tree grows.

### 2026-10-20 · Garden shrinks before it wraps; re-sprout below the grid
**What:** the parent and seedling grid share the row with a zero flex basis, growing up to 480px and shrinking down to 280px each before the grid wraps below the parent. The ↻ re-sprout icon moved from above the grid to below it, right-aligned.
**Why:** with the tree sidebar, fixed 480px blocks wrapped at common laptop widths and pushed the seedlings below the fold, breaking the side-by-side chorus line. With the icon above, the grid started 40px lower than the parent; below, both top edges line up.

### 2026-10-20 · Deploy to GitHub Pages with relative paths
**What:** a GitHub Actions workflow builds on every push to `master` and publishes `dist` to GitHub Pages. Vite's `base` is `'./'` instead of `'/tilo/'`.
**Why:** relative paths keep working if the repo is renamed or moved to a custom domain, and the dev server URL stays at `/`. Tilo is one page with no router, so relative paths are enough.

### 2026-10-20 · PNG export of the parent, frozen at the current frame
**What:** a quiet ↓ icon below the parent downloads it as a 2048×2048 PNG on the dark background, named by date and time (`tilo-20261020-143005.png`). It is drawn fresh by a throwaway p5 instance at the moment on the shared clock when the button was pressed. SVG, GIF and lineage JSON are left for later.
**Why:** redrawing at full size gives a sharp image regardless of screen size, unlike copying the on-screen canvas. Freezing the current frame means you get what you see. Only the parent can be exported: picking a seedling first keeps "pick one" the main action.
**Later:** since the Chrome Music Lab restyle (below), exports draw on white and the button is a pink circle like re-sprout.

### 2026-10-21 · Soft & playful interface
*Superseded by "Styled after Chrome Music Lab" below. The springy motion, the seedling pop-in ripple, reduced-motion support and the shared `BACKGROUND` were kept; the plum colors were not.*
**What:** the interface uses deep plum darks (`#1b1726`), rounded tiles and panels, Nunito, round icon buttons and a lavender accent, with colors kept as CSS variables in `index.css`. Hovered seedlings lift with a springy ring; a bloom pops in whenever its seed changes, with seedlings staggered into a quick ripple that starts at once, so feedback stays instant. The tile color behind blooms is shared with p5 through `BACKGROUND` in `drawBloom.js`, so canvases, thumbnails and PNG exports match. Motion is turned off for users who prefer reduced motion. A "✿ tilo" wordmark sits in a small header.
**Why:** chosen over a quiet "dark gallery" and a botanical "herbarium" look. A toy-like feel fits a casual creator: it invites play and makes picking feel rewarding. The chrome stays dark and low-contrast so the blooms remain the brightest thing on screen, which matters while their aesthetics are still being reworked.

### 2026-10-21 · Styled after Chrome Music Lab
**What:** the interface follows Chrome Music Lab. The page is white, with a white header and hairline gray lines. The parent and the 3×3 seedlings sit in an edge-to-edge hairline grid instead of rounded cards. Color comes in solid blocks: the tree grows in a sunny yellow (`#FFDD33`) bed with pink (`#E6215B`) stems, its blooms shown as white circles; the path to the current bloom is a thicker stem (not a faded one, since faded pink on yellow turns orange), and the current bloom has a pink ring. Off-path blooms fade only the bloom image, not the white circle, so stems never show through. Re-sprout and download are matching big pink circles with white icons; on hover ↻ spins half a turn and ↓ drops once. On click, the button plays a one-shot bounce (squash, overshoot, settle) added on top of its hover state, and the icon repeats its move: ↻ spins a full turn, and ↓ falls out through the bottom of the button and drops back in from the top, clipped by the circle (`press.js`, Web Animations with `composite: 'add'`). A plain extra dip for ↓ felt like a twitch next to the full spin; falling through reads as "sent". A CSS `:active` press was dropped: it only lasts while the button is held, so a quick click showed nothing. Hovering a seedling tints its cell light yellow and makes the bloom grow a little, with no border. The text is near-black lowercase "tilo" in Nunito with a pink ✿. Green (`#2FA838`) is not used in the interface. To allow the hover tint, live canvases are transparent (`p.clear()`) and sit in a `.bloom-stage` inside each cell, so the bloom alone pops and grows. Thumbnails and PNG exports still draw on white (`BACKGROUND`).
**Why:** earlier passes failed: plum darks with brand accents, then pages and blocks in all three brand colors at full strength. Chrome Music Lab is the closest precedent for a playful casual creator: a calm white interface lets bright content and a single accent stand out, and its feedback is bouncy motion, not outlines.
**Colors:** the brand yellow `#D9D600` is pure yellow in hue but darkened, so across a large panel it reads lime or olive. It was first replaced by a warmer `#F5CC1F`. The tree bed was tried in pink with yellow stems, but the user preferred the opposite. The interface now uses a brighter, sunnier `#FFDD33` everywhere yellow appears (tree bed, hover tint), because the duller `#F5CC1F` looked muddy.

### 2026-10-22 · Desktop workspace fits width and height
**What:** the parent and seedling grid share a centered board of equal square panels. Each panel fits the garden's available width and height, reserving 72px for its controls, and grows up to 800px. Padding, the gap and the lineage sidebar scale within bounds; the action buttons and tree nodes retain their size. The board stacks when the garden itself is 560px wide or less, and scrolls when it cannot fit a short window. Phones keep the tree above the garden. Live canvases respond to both container size and display density changes, with density capped at 2.
**Why:** the previous 480px cap and top alignment left the blooms small and stranded on larger monitors. Fitting both dimensions keeps the parent, all nine choices and their actions visible together on desktop, including wide but short windows. A maximum size keeps viewing and pointer travel comfortable on very large displays. Updating canvas density when moving between displays preserves sharpness without allocating unbounded pixel buffers for ten simultaneous animations.

### 2026-10-22 · Bloom art direction and visible inheritance
**What:** explore both flowing abstract forms (loops, ribbons, soft contours) and sharp geometric forms (stars, crystals, symmetry). Multiple options and evolution between forms are desirable. Floral imagery is optional. Each step should visibly come from the previous one through a combination of visual cues, rather than any single permanently fixed trait. Review the user's creative coding experiments before selecting algorithms.
**Why:** this is Tilo's main feature. Art direction and inheritance behavior need discussion and visual review with the user before implementation.
**Open:** which algorithms to adapt; whether a bloom can be a whole composition; how transitions between families work; how much changes at one step; which cues persist and for how long. See [BLOOM-STUDY.md](BLOOM-STUDY.md) for the reference assessment, which is a proposal rather than an algorithm selection.

### 2026-10-22 · Existing palettes and a color-only re-sprout action
**What:** source palettes from an existing collection; artist or movement references are also welcome. Descendants may evolve between palettes. Add a separate color re-sprout action that changes only the seedlings' colors, preserving their geometry and motion. The current parent stays unchanged. The existing re-sprout action continues to generate a fresh set of seedlings across all traits.
**Why:** comparing color alternatives on the same forms gives color exploration its own clear action while keeping the parent as a reference.
**Open:** palette collection, palette transitions and how color alternatives are distributed across the nine choices. The control has been agreed, but has not been implemented.

### 2026-10-22 · First interactive art study
**What:** after agreeing to explore a combination of simplicity, contrast and complexity, build six study examples: open and layered connected curves, ring/diamond compositions, and faceted forms. They adapt the referenced sketches and retain actual geometric structure between generations. The study has independent histories per example, saved branches, a shared animation clock, pause, PNG export and both agreed re-sprout actions. It is available at `study.html` from the main header.
**Palette material:** eight existing Chromotome palettes provide color alternatives in this study. Original colors are used, omitting near-white fills on the white canvas. These are examples to compare; no final palette collection or art-movement attribution is implied.
**Why:** judge the art and inheritance through actual parent-to-descendant choices before replacing the main renderer. A simpler and a layered composition in each direction gives us concrete examples of balance, tension and density.
**Open:** which examples to develop; mutation amounts; composition rules; palette relationships; transitions between algorithm families. The present family scaffolds and mutation bounds are study choices rather than permanent locks.


### 2026-10-22 · Static blooms and more visible evolution
**What:** the user prefers static artwork with no internal motion. Remove animation traits and the study pause control; draw canvases only when art or display properties change. Hover and click feedback remain. PNGs and thumbnails use the same static renderer. This supersedes the shared animation clock in earlier decisions.
**Feedback:** facets feel less interesting; retain them as study references, with lower priority for further development. The nine seedlings and successive generations looked too alike, despite their small geometry mutations.
**Agreed evolution:** change directions and add curves or figures across all study families. The revised study mixes larger reshaping, growth, redirection and simplification, preserving actual parts of the parent. Added geometry derives from inherited elements. Color-only re-sprouting continues to preserve every shape.
**First review:** the user found the revised evolution much better; keep the broader variation as the baseline.
**Open:** whether these larger changes balance visual variety, aesthetics and recognizable lineage; the role of facets; transitions between families. Bounds and the distribution of variations are provisional study implementation choices.


### 2026-10-23 · Main Tilo art and gradual mixing
**What:** start with nine random blooms from the four approved open/layered curve and contrast styles. Picking one plants the first root. Curves and geometric figures evolve together without fixed family separation. Facets stay in the study.
**Evolution:** preserve recognizable geometric parts and introduce new elements relative to inherited curves or figures. Maintain broad choices through reshaping, growth, direction changes, simplification and mixing. Selection focuses the composition; do not automatically reduce mutation strength as click count increases.
**Experience:** retain the desktop garden and branching tree, integrate Colors and All traits, and use one renderer for parent, seedlings, thumbnails and PNGs. New starting choices keep earlier roots and branches for the session.
**Why:** the user preferred the broader study variation and approved bringing it into the main app, with gradually mixed forms and focus through selection.
**Open:** review the main mixed compositions, ancestor readability and palette relationships. Exact mutation bounds remain subject to visual feedback.

### 2026-10-23 · Main interface feedback and shared actions
**What:** hide the reference study link from the main app, enlarge the logo slightly, and share the same round pink action button for color exploration, all-traits re-blooming and download. Match icon weight, hover feedback, focus and click bounce; supply tooltips and accessible labels.
**Feature request:** explore a richer curve composition with additional elements. The current open/layered variants form four starting options but only two main visual vocabularies. The new elements and composition rules still need discussion.
**Confirmed:** remove visible Parent/Seedlings headings, retaining named regions and generation information for screen readers. Use zoom/pan with Fit tree and Find current bloom. Automatic fitting stops at a readable thumbnail scale; explicit Fit can show the full overview. Dragging a thumbnail pans without selecting it, and keyboard focus brings off-screen nodes into view.
**Open:** lineage background color; comparisons prepared for bright yellow, pale buttery yellow and warm white. The richer curve composition remains a separate study proposal.

### 2026-10-24 · Invite returning to earlier blooms
**What:** retain the current sunny yellow (`#FFDD33`) lineage background. Add the approved combination of a one-time rounded pink hint (“Click an earlier bloom to return”) and a hover/focus invitation on previous blooms: a slight lift, pink outline and “Go back here” tooltip.
**Behavior:** the hint points to an earlier bloom without covering the thumbnails, follows the map camera, and disappears after the first return in the garden session. Escape dismisses it and the tooltip. The current bloom keeps its own marker. Dragging still pans without restoring a bloom. Reduced-motion settings disable the hint bounce and hover lift; the artwork remains static.
**Why:** make returning discoverable without permanently filling the tree with labels or badges.

### 2026-10-24 · Playful automatic hint dismissal
**What:** the return hint starts its exit 3.5 seconds after first appearing: a small upward bounce and overshoot, then a shrink and fade over 450ms. The pointer fades with it. It remains a one-time hint in the garden session; returning or pressing Escape can dismiss it sooner. Hover and keyboard cues remain available.
**Why:** the user prefers brief guidance with a playful exit rather than a hint that stays until returning.
**Motion:** reduced-motion users get a short fade without the bounce or shrink. Panning, zooming and hover do not restart the timer.
**Refinement:** the bubble and arrow now share one animation on their container for both entrance and exit, scaling around the bubble’s center so the pointer stays attached throughout.

### 2026-10-24 · Mobile blooms first and horizontal lineage
**What:** on mobile (720px wide or less), place the lineage below the blooms in the scrolling page, as confirmed by the user. Grow from left to right, with other branches and roots in separate rows. Desktop retains upward growth in the left sidebar.
**Behavior:** use the same saved nodes, stems and navigation in both orientations. Resizing across the breakpoint frames the current bloom at a readable scale without changing the garden. Horizontal auto-framing starts from the left and follows new growth; Fit shows the overview and Find centers the current bloom.
**Return cue:** route the pointer around a short horizontal row. Start the one-time hint’s animation and 3.5-second countdown when its bubble is actually on screen, so guidance does not expire before the user scrolls to it.
