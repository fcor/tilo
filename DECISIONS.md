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
