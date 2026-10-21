// Draws one bloom from a seed, centered at the origin.
// `size` is the canvas size in pixels, `t` is the time in seconds.
// This is where traits (0–1) are mapped to visual values.

const PULSE_SPEED = 2 // radians per second, shared by every bloom so they dance in sync

// Behind every bloom, in HSB. Matches --tile in index.css (white).
export const BACKGROUND = [0, 0, 100]

export function drawBloom(p, seed, size, t) {
  const sides = Math.round(p.lerp(3, 8, seed.sides))
  const copies = Math.round(p.lerp(1, 6, seed.copies))
  const radius = size * p.lerp(0.15, 0.4, seed.size)
  const hue = seed.hue * 360
  const spin = p.lerp(-1.5, 1.5, seed.spin) // radians per second; negative spins the other way
  const pulse = p.lerp(0, 0.35, seed.pulse)

  const scale = 1 + pulse * Math.sin(t * PULSE_SPEED)

  p.push()
  p.rotate(t * spin)
  p.scale(scale)
  p.noStroke()
  p.fill(hue, 70, 90, 0.75)

  // With one copy the polygon sits in the center; with more they fan out radially.
  const offset = copies > 1 ? radius * 0.45 : 0
  const polyRadius = copies > 1 ? radius * 0.6 : radius
  for (let i = 0; i < copies; i++) {
    p.push()
    p.rotate((p.TWO_PI * i) / copies)
    p.translate(offset, 0)
    polygon(p, sides, polyRadius)
    p.pop()
  }
  p.pop()
}

function polygon(p, sides, radius) {
  p.beginShape()
  for (let i = 0; i < sides; i++) {
    const a = (p.TWO_PI * i) / sides - p.HALF_PI
    p.vertex(radius * Math.cos(a), radius * Math.sin(a))
  }
  p.endShape(p.CLOSE)
}
