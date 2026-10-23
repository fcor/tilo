import { colorsFor } from './palettes.js'
import { bounds, curveLayout } from './geometry.js'

const TAU = Math.PI * 2
const models = new WeakMap()

// Adapted from the referenced sketches' geometry, with inherited structures and
// normalized framing. Geometry stays still for comparison and export.
export function drawComposition(p, seed, size) {
  if (!models.has(seed)) models.set(seed, modelFor(seed))
  const model = models.get(seed)
  const colors = colorsFor(seed)
  const scale = size * 0.72 / model.extent
  p.push()
  const ctx = p.drawingContext
  ctx.rotate(seed.tilt)
  ctx.scale(scale, scale)
  ctx.translate(-model.center.x, -model.center.y)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (model.curve) {
    ctx.save()
    ctx.translate(model.curve.offset.x, model.curve.offset.y)
    ctx.scale(model.curve.factor, model.curve.factor)
    drawCurves(ctx, seed, model.curve.geometry, colors)
    ctx.restore()
  }
  if (seed.motifs?.length) drawContrasts(ctx, seed, colors)
  if (seed.facets) drawFacets(ctx, seed, model, colors)
  p.pop()
}

function modelFor(seed) {
  if (!seed.facets) {
    const curve = seed.curve ? curveLayout(seed.curve) : null
    const points = (seed.motifs ?? []).flatMap((motif) => {
      const radius = motif.type === 'diamond' ? motif.size * Math.SQRT2 : motif.size
      return [
        { x: motif.x - radius, y: motif.y - radius },
        { x: motif.x + radius, y: motif.y + radius },
      ]
    })
    if (curve) points.push(...curve.points)
    return { curve, ...bounds(points, Math.max(curve?.padding ?? 0, seed.motifs?.length ? 0.055 : 0)) }
  }
  const points = seed.facets.rays.flatMap((ray, i, rays) => {
    const next = rays[(i + 1) % rays.length].angle + (i === rays.length - 1 ? TAU : 0)
    const gap = next - ray.angle
    // New points inherit their neighbors; notch angles follow the actual spacing.
    const notch = ray.angle + gap / 2 + Math.max(-gap * 0.3, Math.min(gap * 0.3, seed.facets.twist))
    return [
      { x: Math.cos(ray.angle) * ray.outer, y: Math.sin(ray.angle) * ray.outer / seed.facets.aspect },
      { x: Math.cos(notch) * ray.inner, y: Math.sin(notch) * ray.inner / seed.facets.aspect },
    ]
  })
  return { points, ...bounds(points, 0.035) }
}

function traceCurve(ctx, path) {
  ctx.beginPath()
  ctx.moveTo(path[0].x, path[0].y)
  for (const arc of path) {
    ctx.arc(arc.cx, arc.cy, arc.radius, arc.start, arc.end, arc.turn < 0)
  }
}

function drawCurves(ctx, seed, model, colors) {
  const { weight, echo, stripe } = seed.curve
  if (echo > 0.15) {
    ctx.save()
    ctx.translate(model.center.x, model.center.y)
    ctx.rotate(echo * 0.4)
    ctx.scale(0.84, 0.84)
    ctx.translate(-model.center.x, -model.center.y)
    traceCurve(ctx, model.path)
    ctx.strokeStyle = colors[1]
    ctx.lineWidth = weight * (0.45 + echo * 0.25)
    ctx.stroke()
    ctx.restore()
  }
  traceCurve(ctx, model.path)
  ctx.strokeStyle = colors[0]
  ctx.lineWidth = weight
  ctx.stroke()
  traceCurve(ctx, model.path)
  ctx.strokeStyle = colors[2]
  ctx.lineWidth = weight * stripe * 0.45
  ctx.stroke()
  // One solid end accent balances the open ribbon.
  const last = model.path.at(-1)
  const x = last.cx + Math.cos(last.end) * last.radius
  const y = last.cy + Math.sin(last.end) * last.radius
  ctx.beginPath()
  ctx.arc(x, y, weight * 0.7, 0, TAU)
  ctx.fillStyle = colors[1]
  ctx.fill()
}

function drawContrasts(ctx, seed, colors) {
  for (const motif of seed.motifs) {
    ctx.save()
    ctx.translate(motif.x, motif.y)
    ctx.rotate(motif.angle)
    ctx.strokeStyle = colors[motif.role]
    ctx.fillStyle = colors[motif.role]
    ctx.lineWidth = motif.weight
    ctx.beginPath()
    if (motif.type === 'ring') {
      ctx.arc(0, 0, motif.size, 0, TAU)
      ctx.stroke()
    } else if (motif.type === 'diamond') {
      ctx.rect(-motif.size, -motif.size, motif.size * 2, motif.size * 2)
      ctx.stroke()
    } else if (motif.type === 'bar') {
      ctx.moveTo(-motif.size / 2, 0)
      ctx.lineTo(motif.size / 2, 0)
      ctx.stroke()
    } else {
      ctx.arc(0, 0, motif.size, 0, TAU)
      ctx.fill()
    }
    ctx.restore()
  }
}

function polygon(ctx, points) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y)
  ctx.closePath()
}

function drawFacets(ctx, seed, model, colors) {
  const points = model.points
  polygon(ctx, points)
  ctx.fillStyle = colors[0]
  ctx.fill()
  for (let i = 0; i < points.length; i += 2) {
    polygon(ctx, [{ x: 0, y: 0 }, points[i], points[(i + 1) % points.length]])
    ctx.fillStyle = colors[(i / 2) % 2 + 1]
    ctx.fill()
  }
  const depth = seed.facets.depth
  const inset = points.map((point) => ({ x: point.x * depth, y: point.y * depth }))
  polygon(ctx, inset)
  ctx.fillStyle = colors[1]
  ctx.fill()
  // A faceted inner plane adds depth with opaque color rather than a glow.
  polygon(ctx, [{ x: 0, y: 0 }, inset[0], inset[1], inset[2]])
  ctx.fillStyle = colors[0]
  ctx.fill()
}
