const curves = new WeakMap()

// Geometry is shared by drawing and growth, so new figures can follow the
// actual curve instead of an unrelated random arrangement.
export function curveLayout(curve) {
  if (!curves.has(curve)) curves.set(curve, traceArcs(curve))
  const geometry = curves.get(curve)
  const factor = (curve.size ?? 1) / geometry.extent
  const offset = {
    x: (curve.x ?? 0) - geometry.center.x * factor,
    y: (curve.y ?? 0) - geometry.center.y * factor,
  }
  return {
    geometry, factor, offset,
    padding: (curve.weight + 0.13) * factor,
    points: geometry.samples.map((point) => ({
      x: offset.x + point.x * factor,
      y: offset.y + point.y * factor,
    })),
  }
}

function traceArcs(curve) {
  const path = []
  const samples = []
  let x = 0, y = 0, heading = curve.heading
  for (const arc of curve.arcs) {
    const normal = heading + arc.turn * Math.PI / 2
    const cx = x + Math.cos(normal) * arc.radius
    const cy = y + Math.sin(normal) * arc.radius
    const start = heading - arc.turn * Math.PI / 2
    const end = start + arc.turn * arc.sweep
    path.push({ x, y, cx, cy, start, end, ...arc })
    for (let i = 0; i <= 48; i++) {
      const a = start + (end - start) * i / 48
      samples.push({ x: cx + Math.cos(a) * arc.radius, y: cy + Math.sin(a) * arc.radius })
    }
    x = cx + Math.cos(end) * arc.radius
    y = cy + Math.sin(end) * arc.radius
    heading += arc.turn * arc.sweep
  }
  return { path, samples, ...bounds(samples, curve.weight + 0.13) }
}

export function bounds(points, padding) {
  const left = Math.min(...points.map((point) => point.x)) - padding
  const right = Math.max(...points.map((point) => point.x)) + padding
  const top = Math.min(...points.map((point) => point.y)) - padding
  const bottom = Math.max(...points.map((point) => point.y)) + padding
  const center = { x: (left + right) / 2, y: (top + bottom) / 2 }
  // Fit a circular bound so rotation and hover keep the artwork inside its cell.
  const extent = 2 * (Math.max(...points.map((point) => Math.hypot(point.x - center.x, point.y - center.y))) + padding)
  return { center, extent }
}
