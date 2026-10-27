// Layout de uma cozinha em "L" simples. Unidades em metros (Three.js).
// Parede do fundo em z = -1.5, parede lateral em x = -2.

export type ModuleKind = 'base' | 'sink' | 'drawers' | 'upper' | 'tall'
export type Front = 'doors1' | 'doors2' | 'drawers3' | 'oven'

export type ModuleDef = {
  id: string
  kind: ModuleKind
  size: [w: number, h: number, d: number]
  position: [x: number, y: number, z: number]
  front: Front
}

const WALL_Z = -1.5
const BASE_H = 0.85
const BASE_D = 0.58
const UP_H = 0.7
const UP_D = 0.35
const UP_Y = 1.45

const base = (id: string, kind: ModuleKind, x: number, w: number, front: Front): ModuleDef => ({
  id,
  kind,
  size: [w, BASE_H, BASE_D],
  position: [x, BASE_H / 2, WALL_Z + BASE_D / 2],
  front,
})

const upper = (id: string, x: number, w: number, front: Front): ModuleDef => ({
  id,
  kind: 'upper',
  size: [w, UP_H, UP_D],
  position: [x, UP_Y + UP_H / 2, WALL_Z + UP_D / 2],
  front,
})

export const MODULES: ModuleDef[] = [
  {
    id: 'tall-1',
    kind: 'tall',
    size: [0.6, 2.2, BASE_D],
    position: [-1.7, 1.1, WALL_Z + BASE_D / 2],
    front: 'oven',
  },
  base('sink-1', 'sink', -1.0, 0.8, 'doors2'),
  base('base-1', 'base', -0.3, 0.6, 'doors1'),
  base('drawers-1', 'drawers', 0.3, 0.6, 'drawers3'),
  base('base-2', 'base', 0.9, 0.6, 'doors1'),
  upper('upper-1', -1.0, 0.8, 'doors2'),
  upper('upper-2', -0.3, 0.6, 'doors1'),
]

export const COUNTERTOP = {
  from: -1.4,
  to: 1.2,
  y: BASE_H + 0.015,
  thickness: 0.03,
  depth: BASE_D + 0.04,
  z: WALL_Z + (BASE_D + 0.04) / 2,
}

export const toMm = (m: number) => Math.round(m * 1000)
