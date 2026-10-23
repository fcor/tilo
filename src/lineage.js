import { startingSet, sproutSet, recolorSeed } from './seed.js'

export function createGarden(random = Math.random) {
  return { nodes: [], currentId: null, starts: startingSet(random), choosing: true }
}

export function pickBloom(garden, seed, random = Math.random) {
  const parentId = garden.choosing ? null : garden.currentId
  const existing = garden.nodes.find((node) => node.parentId === parentId && node.seed === seed)
  if (existing) return { ...garden, currentId: existing.id, choosing: false }
  const node = {
    id: garden.nodes.length, seed, parentId, seedlings: sproutSet(seed, random),
  }
  return { ...garden, nodes: [...garden.nodes, node], currentId: node.id, choosing: false }
}

export function restoreBloom(garden, id) {
  return { ...garden, currentId: id, choosing: false }
}

export function showStarts(garden, random = Math.random) {
  return { ...garden, starts: startingSet(random), choosing: true }
}

export function resproutGarden(garden, colorsOnly, random = Math.random) {
  if (garden.choosing) {
    return {
      ...garden,
      starts: colorsOnly ? garden.starts.map((seed) => recolorSeed(seed, random)) : startingSet(random),
    }
  }
  return {
    ...garden,
    nodes: garden.nodes.map((node) => node.id === garden.currentId ? {
      ...node,
      seedlings: colorsOnly
        ? node.seedlings.map((seed) => recolorSeed(seed, random))
        : sproutSet(node.seed, random),
    } : node),
  }
}

export function generationOf(nodes, id) {
  let generation = -1
  for (let node = nodes[id]; node; node = nodes[node.parentId]) generation++
  return generation
}
