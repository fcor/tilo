# Bloom reference study

Status: reference study retained; the approved curves and contrasts are integrated into the main app, October 23, 2026. Open `study.html` directly; the study is no longer advertised in Tilo's header. It keeps six separate examples for comparison; the main app uses four starting styles and gradual mixing within one lineage.

## Agreed direction

- Flowing loops, ribbons and soft contours alongside stars, crystals and sharp geometric symmetry.
- A broad range of options, including evolution between forms.
- A visible family relationship through a combination of contour, composition and symmetry. No permanent symmetry or palette lock has been agreed.
- Palettes from an existing collection, possibly with artist or movement references; descendants can evolve between palettes.
- Two re-sprout actions, both affecting only the nine seedlings: all traits, or colors alone. The color action preserves geometry; the parent stays unchanged.
- Explore a combination of balance and simplicity, tension and contrast, and density and complexity through visual examples.

## First interactive study

Six starting compositions pair a simpler and a more layered example in three directions:

| Direction | Examples | What to judge |
|---|---|---|
| Connected curves | Open curves, Layered curves | Curvature, ribbon weight, crossings, negative space and rhythm. |
| Rings and geometry | Open contrasts, Layered contrasts | Relationships between rings, diamonds, lines and small accents. |
| Faceted forms | Open facets, Layered facets | Sharp silhouettes, opposing points, elongated proportions and opaque color planes. |

The study adapts the geometry of the references rather than reproducing each full sketch. Geometry is stored in the seed: arc parameters, positioned motifs or radial facet points. Each sprout keeps at least one actual parent element while reshaping other parts. New curves or figures are added relative to inherited elements; directions and element counts can also change. The current mutation ranges and opposing-point rule in the facet examples are provisional tools for judging inheritance.

Each example keeps its own history for the current session. Picking a seedling grows a branch; the lineage strip shows the current ancestry, and **Saved blooms** allows returning to other branches with their saved seedlings. Switching examples preserves their session histories.

**Colors** re-sprouts the existing nine seedlings' palettes and color arrangements, preserving geometry. **All traits** generates a fresh set from the parent. Both preserve the parent and previously picked blooms.

The palette material comes from Chromotome 1.21.4 by Kjetil Golid: `miradors`, `hilda01`, `ducci_jb`, `kov_01`, `rohlfs_2`, `spatial01`, `tundra1` and `cc239`. Their original colors are used, with near-white fills omitted on the white canvas. This is a collection to compare in the study, not a final palette selection or a claim that these examples represent specific art movements.

All artwork is static. Canvases redraw only when their seed, renderer, size or display density changes. Hover and click feedback remain. **Download PNG** exports the current parent at 2048px with the same static renderer.

## Feedback and revised evolution · October 22

- **Static artwork:** no motion inside blooms. The motion traits and pause control have been removed.
- **Facets:** less promising to the user; keep the examples for comparison, with lower priority for further development.
- **Too similar:** the first study changed small parts of a fixed structure. Colors made those subtle geometry changes hard to notice, and siblings offered too little variety.
- **Agreed response:** larger geometric changes across all examples, including changes in direction and additional curves or figures.

Each new set of nine now mixes growth, reshaping, redirection and simplification, in shuffled positions:

| Direction | Expanded evolution | Inherited connection |
|---|---|---|
| Connected curves | Larger changes in bends and ribbon weight; reversed turns; added or removed arc segments. | Actual arc parameters survive from the parent, and new segments continue its connected path. |
| Rings and geometry | More pronounced changes in placement, size and orientation; new or removed figures; variation in figure type. | Existing figures remain, and additions are positioned relative to one of them. |
| Faceted forms | Larger proportional changes; new or removed opposing points; changes in point direction, inset and notches. | Existing point structure survives; new points are placed between inherited neighbors. |

Counts are bounded to keep the study legible over many generations (2–8 arcs, 2–10 figures, 4–12 facet points). The October 22 study keeps evolution within each reference family; the main integration below now mixes curves and figures. Continue reviewing visible variety and recognizable lineage together.

The user's first reaction to this revision was “much much better.” Keep this broader variation as the baseline for further refinement.

## Main Tilo integration · October 23

The user approved nine random opening choices from the four curve/contrast starting styles, with no separation between families during evolution. The main seed contains optional curves and positioned figures; all drawing, placement and color code is shared with this study.

Mixed growth introduces a small figure around inherited curve geometry, or a short curved stroke around an inherited figure. Further choices can reshape, expand or simplify those components. Each grid keeps broad variation. Selection focuses the composition; there is no automatic reduction in mutation strength based on the number of clicks.

The main lineage supports multiple starting roots and saved branches. New bloom choices retain existing trees; both re-sprout actions affect only the current nine options, and PNGs use the same renderer. Facets remain study material.

## References inspected

Sources are in `~/Desktop/CreativeCoding/p5-sketches/shape/`. All 29 `sketch.js` variants across the six requested collections were inspected by reading their drawing and generation logic. Browser captures cover the 28 canvas variants; the plotter variant was viewed through its existing `2.svg` export. Packing was advanced to show its growing arrangement, with the original image display enabled in Build 2.

| Collection | What fits | What would need adaptation for Tilo |
|---|---|---|
| **Punto y linea**, especially Builds 3–4 | Connected arc chains, smooth changes of curvature, and combinations of curves, circles and straight links. Strongest reference for flowing forms. | The paths are open; “loop” in Build 3 refers to iteration, not guaranteed geometric closure. Closed loops and ribbons need further development. Inherit arc structure and vary radius/sweep locally; rerolling the random seed changes the whole path. Ensure small or early-ending curves remain readable. |
| **Joyful contrasts**, especially Builds 4–6 | Bold rings, squares, diamonds, lines, scale contrast and overlapping geometry. Useful for both individual motifs and abstract compositions. Build 7 adds repeated dots inside rounded bars. | Preserve an arrangement and alter its parts, rather than regenerate every grid split and motif. Thin plotter lines need adaptation for small previews. Whether the whole composition fits depends on the intended scope of a bloom. |
| **Triangles**, especially Builds 1 and 3 | Alternating triangular forms and overlapping facets; useful ingredients for sharp geometry and rhythmic symmetry. | These builds make tiled patterns, rather than radial stars or crystals. Such forms would require a new arrangement of the triangular elements. Preserve facet positions and relationships between generations. Build 2 currently draws construction points with its triangle drawing commented out. |
| **Mondrian**, especially Builds 2–3 | Oriented triangles within subdivided cells; useful geometric composition ingredients. Other builds explore nested circles and rectangles. | A changed subdivision can rearrange the whole image. Inherit a partition and change a split or motif locally. The glow studies use dark backgrounds and layered transparency, so their appearance on Tilo's white canvas would need review. |
| **Packing**, especially Build 3's local motif | Radiating starbursts and connecting structures; Build 2 uses concentric-ring SVG motifs. Those parts could contribute to geometric or layered forms. | The packing itself makes a growing scatter of objects. Re-running placement does not preserve a parent's arrangement. Build 3 redraws random rays each frame; stable inherited ray geometry would be needed. Evaluate the motif separately from the full packing composition. |
| **Duality**, especially Build 1 | Opposing bar lengths, progression, negative space and a central accent. A readable reference for balance and rhythm. | Its current visual vocabulary is farther from flowing ribbons and star/crystal forms. Could contribute an additional composition family or a rule for arranging contrasting parts; lower priority for the first study. |

## Proposed shortlist

1. **Punto y linea** for the flowing direction.
2. **Joyful contrasts** for rings, diamonds and contrasting geometric arrangements.
3. **Triangles / Mondrian Builds 2–3** for facets and sharp geometry; lower priority after the first review.
4. Consider **Packing's starburst motif** separately from its placement algorithm.

The full Mondrian grid and Duality's bars could become additional composition families if that is part of the intended experience.

## Inheritance to investigate

The experiments provide drawing and composition ideas, but do not yet provide Tilo's mutation model. A reproducible random seed reconstructs an image; assigning a different random seed does not ensure the resulting image looks like its parent.

For a visible lineage, a seed may need to retain the actual structure: arc parameters, element positions, facet relationships or split locations. Descendants could modify parts of that structure while preserving several recognizable cues. Which cues change, and how much, remains a decision to make with visual examples.

## Next decisions after trying the study

- Explore a richer curve composition with additional elements. The current four starting styles use two visual vocabularies; open/layered variants alone do not provide a third distinct direction. Decide the new elements and their relationship to the curve with the user before implementation.
- Which of the six examples feels worth developing? Which feels too sparse, busy or generic?
- What parent-to-descendant changes feel both related and worth choosing?
- Should we change the balance between shape changes and palette changes?
- Which palette relationships work best?
- Does the gradual mixing in the main app feel connected to its parent and aesthetically coherent?

The main renderer is now integrated. Use the study to compare references and the main app to review the actual mixed evolution.
