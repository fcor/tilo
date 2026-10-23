const PI = Math.PI

function curveSeed(layered) {
  return {
    family: 'curves',
    palette: layered ? 'rohlfs_2' : 'miradors',
    colorOffset: 0,
    tilt: layered ? -0.1 : -0.3,
    curve: {
      heading: 0,
      arcs: layered
        ? [
            { radius: 0.25, sweep: PI * 1.3, turn: 1 },
            { radius: 0.18, sweep: PI * 0.85, turn: -1 },
            { radius: 0.3, sweep: PI * 1.45, turn: 1 },
            { radius: 0.2, sweep: PI * 0.8, turn: -1 },
          ]
        : [
            { radius: 0.26, sweep: PI * 0.9, turn: 1 },
            { radius: 0.3, sweep: PI * 1.1, turn: -1 },
            { radius: 0.2, sweep: PI * 0.8, turn: 1 },
          ],
      weight: layered ? 0.08 : 0.065,
      echo: layered ? 0.75 : 0.08,
      stripe: layered ? 0.5 : 0.25,
    },
  }
}

function contrastSeed(layered) {
  return {
    family: 'contrast',
    palette: layered ? 'hilda01' : 'ducci_jb',
    colorOffset: 0,
    tilt: 0,
    motifs: [
      { type: 'ring', x: -0.14, y: 0.12, size: 0.3, angle: 0, weight: 0.04, role: 0 },
      { type: 'diamond', x: 0.23, y: -0.2, size: 0.19, angle: PI / 4, weight: 0.028, role: 1 },
      { type: 'bar', x: 0.14, y: 0.3, size: 0.5, angle: -0.18, weight: 0.045, role: 2 },
      ...(layered
        ? [
            { type: 'ring', x: 0.18, y: -0.02, size: 0.23, angle: 0, weight: 0.035, role: 1 },
            { type: 'diamond', x: -0.24, y: -0.23, size: 0.24, angle: PI / 4, weight: 0.02, role: 2 },
            { type: 'dot', x: 0.32, y: 0.28, size: 0.045, angle: 0, weight: 0, role: 0 },
          ]
        : []),
    ],
  }
}

function facetSeed(layered) {
  const count = layered ? 8 : 6
  return {
    family: 'facets',
    palette: layered ? 'kov_01' : 'spatial01',
    colorOffset: 0,
    tilt: layered ? PI / 8 : 0,
    facets: {
      rays: Array.from({ length: count }, (_, i) => ({
        angle: (i * PI * 2) / count - PI / 2,
        outer: i % 2 === 0 ? 0.47 : 0.39,
        inner: layered ? 0.24 : 0.15,
      })),
      aspect: layered ? 0.8 : 1,
      depth: layered ? 0.65 : 0.25,
      twist: layered ? 0.14 : 0,
    },
  }
}

export const SPECIMENS = [
  { id: 'curve-open', name: 'Open curves', source: 'Punto y línea', seed: curveSeed(false),
    description: 'A continuous sweep, a quiet color accent, and room to breathe.' },
  { id: 'curve-layered', name: 'Layered curves', source: 'Punto y línea', seed: curveSeed(true),
    description: 'Curling ribbons and a second contour that creates crossings and tension.' },
  { id: 'contrast-open', name: 'Open contrasts', source: 'Joyful contrasts', seed: contrastSeed(false),
    description: 'A ring, a diamond and a line, held together by their scale and placement.' },
  { id: 'contrast-layered', name: 'Layered contrasts', source: 'Joyful contrasts', seed: contrastSeed(true),
    description: 'Overlapping rings and diamonds, with small accents balancing larger forms.' },
  { id: 'facet-open', name: 'Open facets', source: 'Triangles / Mondrian', seed: facetSeed(false),
    description: 'A sharp silhouette with alternating facets and a clear center.' },
  { id: 'facet-layered', name: 'Layered facets', source: 'Triangles / Mondrian', seed: facetSeed(true),
    description: 'An elongated crystal with an inset structure and several color planes.' },
]

export const STARTING_STYLES = SPECIMENS.filter(({ seed }) => !seed.facets)
