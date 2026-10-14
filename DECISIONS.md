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
