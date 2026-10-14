# Design Reference: Casual Creators

Source: Kate Compton & Michael Mateas, *Casual Creators*, Proceedings of the Sixth International Conference on Computational Creativity (ICCC), 2015.

This document is the design foundation for **Tilo**. Use it to guide product and UX decisions. Sections marked **"For Tilo"** are our interpretation, not claims from the paper.

**Terminology:** the "For Tilo" notes use Tilo's botanical terms. A **seed** is the set of numbers a **bloom** (the animated shape) grows from; the paper and other systems call this a genome or DNA. Each value in a seed is a **trait**. The **parent** is the selected bloom, and its **seedlings** are mutated variations sprouted from it. The **lineage** is the history of picks.

---

## 1. Definition

> A Casual Creator is an interactive system that encourages the **fast, confident, and pleasurable exploration of a possibility space**, resulting in the **creation or discovery of surprising new artifacts** that bring feelings of **pride, ownership, and creativity** to the users that make them.

Key ideas:

- **Autotelic creativity.** Making things is enjoyable in itself. Productivity and output quality are not the goal, and the artifact may even be thrown away.
- **Casual user.** Assume no domain knowledge, no technical skill, and no learning curve. The good experience has to happen in the **first few minutes**, even if the user never masters the tool.
- **Interactive and mixed-initiative.** The user drives. The computer generates, suggests and evaluates as a partner. It is never fully autonomous.
- **Possibility space.** Each tool has a set of all artifacts it can make. The user creates by moving through this space. In a rich, multidimensional space, "searching" and "creating" become the same thing.

## 2. The possibility space

- **Narrow enough** to exclude broken or bad artifacts. Users should never get stuck among bad results.
- **Broad enough** to contain surprises. Surprise drives exploration and creates pride ("I found something special").
- **Ownership grows with agency.** The more users credit a discovery to their own choices, the more they feel ownership. Pride grows when the artifact feels rare or special within the space.
- **Encourage creative leaps.** Aim for fast, confident jumps across the space, not tentative tiny steps.
- **Generative methods fit casual users.** Professionals need precise control. Casual users happily trade control for speed, power and surprise.

### Anti-pattern: "1000 bowls of oatmeal"
Artifacts that are technically different to the computer but look the same to people. Variation has to be **perceptible**. A space full of broken artifacts and a space full of good but identical artifacts are both failures.

**For Tilo:** tune each trait's range so that a mutation produces a visible difference. If seedlings look indistinguishable from their parent, the space is too flat.

## 3. Theoretical foundations

### Reflection-in-action (Donald Schön)
The designer "sees, moves, and sees again." The loop is evaluate → plan → modify → re-evaluate, done *in dialogue with the material*, not in the head. "Seeing" means both looking and **judging** fitness. Computation can provide new ways of seeing.

### Direct manipulation (Ben Shneiderman)
- Continuous representation of the object of interest
- Rapid, **incremental**, **reversible** operations
- Effects immediately visible

Reversible actions let people experiment without anxiety. Incremental actions make subtle changes visible. Rapid feedback keeps the learning loop running.

### Flow (Mihály Csikszentmihalyi)
Requirements:

- Goals that create a sense of progress. It's often better to let users **form their own internal goals**, which may change over time.
- Immediate feedback, so progress can be felt
- Balance between perceived skill and challenge

Flow breakers to avoid: **frustration, intimidation, choice paralysis, hard failures.**

### Creativity Support Tools (Resnick et al.)
Relevant principles: *Support exploration*; *Make it as simple as possible, and maybe even simpler*; *Low threshold, high ceiling, wide walls*; *Support many paths and many styles*; *Choose black boxes carefully*; *Support collaboration and open interchange*.

Creativity happens **in the app and in the community around it**. Data formats, sharing and modifiability matter as much as the UI.

### "Magic Crayons" (Chaim Gingold)
Computational, accessible, sketchable, expressive systems that invite play and reward the discovery of hidden secrets and affordances.

---

## 4. Design patterns

### 4.1 Instant feedback
Every change is visible in the artifact immediately. Re-rendering alone may not be enough: **simulate and visualize evaluations** the user would otherwise have to work out in their head (stability, behavior, performance), so they can judge at a glance.

**For Tilo:** sprout seedlings with no perceptible delay after a click.

### 4.2 The chorus line *(sub-pattern of instant feedback)*
Named after dancers performing the same routine in unison. First used in *Spore* as an internal tool to test animations across many creature bodies.

When the output is a **space of artifacts** rather than one, show **many examples at once**, overlaid spatially, temporally or graphically, so subtle differences and similarities stand out.

**For Tilo:** all blooms animate together and in sync, so differences in motion traits (spin, pulse) can be compared directly. Some traits are only visible in motion.

### 4.3 Simulation and approximate feedback
When an artifact takes too long to judge directly (for example a game level), show a **proxy** of its evaluation. For a casual creator, accuracy matters less than giving the **perception of progress** that flow requires.

### 4.4 Entertaining evaluations
Because evaluation doesn't have to be accurate, it can be **fun**. Spore creatures laugh or wiggle at new body parts, and the reaction is arbitrary. A playful "critic" can suggest a direction to users who don't have one, and they can ignore it.

### 4.5 No blank canvas
A blank canvas scares beginners. Give them a **starting artifact or a prompt**, so the first move is a single decision: keep it or discard it. After that first step, the next ones get easier.

**For Tilo:** always open with a parent and seedlings already on screen. Never an empty state.

### 4.6 Limiting actions to encourage exploration
Fewer, clearer choices lead to faster, more confident decisions, which support flow. Techniques:

- **Modal interaction:** show only the actions for the current mode.
- **Progressive unlocking:** reveal capabilities over time. A temporarily smaller space helps users understand it.

**For Tilo:** the minimal UI (no sliders, a single "pick one" action) applies this directly. A fixed number of seedlings (9 in Tilo; the paper's example uses 10) prevents choice paralysis.

### 4.7 Mutant shopping
Offer **suggested alternatives near the current artifact**. Three framings:

1. **Selection only** (*Picbreeder*): users move only by picking parents for the next generation.
2. **Selection + editing** (*Dryad*): browse variants, then edit the one you found.
3. **Editing + suggestions** (*Sentient Sketchbook*): users edit normally, and the system proposes variants that are "nearby" by an abstract metric, not by the underlying representation.

It resembles a human-guided evolutionary algorithm, but the aim is **the enjoyment of browsing and discovery, not optimization**, hence "shopping."

**For Tilo:** core mechanic, framing 1 (selection only). We decided not to add editing; see [DECISIONS.md](DECISIONS.md). Pairs with the chorus line: the chorus line is the shop window, and mutant shopping is choosing from it.

### 4.8 Modifying the meaningful
Controls should change **high-level, perceptually meaningful properties**, not raw parameters. Spore's handles change a jaw from overbite to underbite instead of setting a z-scale. PendantMaker's "bloom" and IceMaker's "wiggle" and "sharpness" describe how the result looks, not how it's computed.

**For Tilo:** design traits around what people perceive ("spikiness", "sway") rather than implementation details. Tilo has no editing controls, so this applies to how traits are designed, named and mutated.

### 4.9 Saving and sharing
Creativity continues outside the app. Save in **common, human-readable, easy-to-host formats** (JSON, images, URLs). Spore hid creature data inside PNGs, Twine 2 embeds the editable story in its HTML output, and IceMaker encoded each snowflake in a shareable URL. That lets communities form on existing platforms.

**For Tilo (future):** a seed is a small set of numbers, ideal for encoding in a URL or a PNG.

### 4.10 Hosted communities
A built-in showcase for publishing, tagging and commenting supports pride and ownership. If artifacts can be remixed, **show their ancestry and notify the original creators**.

**For Tilo (future):** lineage is already part of the model, so remixes can carry their family tree.

### 4.11 Modding, hacking, teaching
Users will want more than the tool offers. Make it easy to find, import, modify and republish hacks, so knowledge spreads through the community.

---

## 5. Case studies from the paper

| System | What it is | Patterns shown |
|---|---|---|
| **PendantMaker** | 3D-printable pendants. The user's scribble is mirrored into symmetrical extruded tubes. | Instant feedback, a restricted space that guarantees valid prints, sliders for meaningful properties ("bloom") |
| **IceMaker** | 3D snowflakes from a particle simulation, with sliders for "complexity", "wiggle" and "sharpness" | Modifying the meaningful; saving and sharing (the snowflake is encoded in a URL) |
| **Funky Ikebana** | L-system flowers from a "DNA" of floats. Pick one, and 10 children appear instantly. The flowers dance. | Mutant shopping, chorus line, limited choices, instant regeneration |
| **Tiny Dancer** | Evolves ragdoll dancer bodies *and* how they respond to music | Mutant shopping on a chorus line |
| **BotPrint** | Laser-cut robot kits for kids. Many bots are simulated in an arena. | Chorus line, mutant shopping, entertaining evaluations, direct editing |
| **Binary Fission** | Crowdsourced science game for building decision trees. Many candidate filters are shown, each colored by quality. | Chorus line / instant feedback for an otherwise hard evaluation |

Lesson from Funky Ikebana: the user's preferences **drift** ("pick small, simple flowers" changes the moment they spot something better). Support changing goals instead of a fixed target.

---

## 6. Design checklist for Tilo

- [ ] Does the user see something interesting **in the first seconds**, with no blank canvas?
- [ ] Is every action **instant and reversible**?
- [ ] Are choices **few and clear**? No choice paralysis.
- [ ] Do mutations produce **perceptibly different** results? No oatmeal.
- [ ] Is the space **safe**, with no broken or ugly-by-default artifacts?
- [ ] Are variants shown **together and in sync** (chorus line)?
- [ ] Do traits map to **meaningful, perceptible** qualities?
- [ ] Does the user feel the discovery is **theirs**?
- [ ] Is it **fun to watch** while browsing, not just a means to an end?
- [ ] (Later) Can a creation be **saved and shared** in an open, easy-to-host format?