// One-shot "boing" for round buttons, played on click so it always runs to the end
// however short the press. It is added on top of the hover transform, not instead of it.

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // same as --spring in index.css
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const BOUNCE = [
  { transform: 'scale(1)' },
  { transform: 'scale(0.82)', offset: 0.25 }, // squash
  { transform: 'scale(1.15)', offset: 0.6 }, // overshoot
  { transform: 'scale(1)' },
]

// Each icon repeats its hover move once more on click.
const GLYPH_MOVES = {
  spin: { keyframes: [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], duration: 500, easing: SPRING },
  // The arrow falls out through the bottom of the button and drops back in from the top,
  // landing with the same spring and duration as the ↻ spin. The button clips it (index.css).
  drop: {
    keyframes: [
      { transform: 'translateY(0)', easing: 'ease-in' },
      { transform: 'translateY(40px)', offset: 0.35 },
      { transform: 'translateY(-40px)', offset: 0.36, easing: SPRING },
      { transform: 'translateY(0)' },
    ],
    duration: 500,
  },
}

export function playPress(button, move) {
  if (reducedMotion.matches) return
  button.animate(BOUNCE, { duration: 450, easing: 'ease-out', composite: 'add' })
  const glyph = button.querySelector('.icon-glyph')
  const { keyframes, ...timing } = GLYPH_MOVES[move]
  glyph?.animate(keyframes, { ...timing, composite: 'add' })
}
