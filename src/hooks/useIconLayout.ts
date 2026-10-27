import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react'
import type { WinId } from './useWindowManager'

export const CELL_W = 96
export const CELL_H = 86
export const PAD = 12
const ICON_W = 92
const ICON_H = 86

const STORAGE_KEY = 'gg-icons'

export type Cell = { col: number; row: number }
type Saved = Partial<Record<WinId, Cell>>

function readSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Saved) : {}
  } catch {
    return {}
  }
}

function writeSaved(saved: Saved) {
  try {
    if (Object.keys(saved).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignora */
  }
}

const key = (c: Cell) => `${c.col},${c.row}`

function nearestFree(target: Cell, cols: number, rows: number, taken: Set<string>): Cell {
  let best = target
  let bestDist = Infinity
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (taken.has(key({ col, row }))) continue
      const d = (col - target.col) ** 2 + (row - target.row) ** 2
      if (d < bestDist) {
        bestDist = d
        best = { col, row }
      }
    }
  }
  return best
}

function useDeskSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

export function useIconLayout(ids: readonly WinId[], pinnedBottomRight: WinId, deskRef: RefObject<HTMLElement | null>) {
  const { w, h } = useDeskSize(deskRef)
  const [saved, setSaved] = useState<Saved>(readSaved)

  const cols = Math.max(1, Math.floor((w - PAD * 2 - ICON_W) / CELL_W) + 1)
  const rows = Math.max(1, Math.floor((h - PAD * 2 - ICON_H) / CELL_H) + 1)
  const stepX = cols > 1 ? (w - PAD * 2 - ICON_W) / (cols - 1) : CELL_W
  const stepY = rows > 1 ? (h - PAD * 2 - ICON_H) / (rows - 1) : CELL_H

  const positions = useMemo(() => {
    const clamp = (c: Cell): Cell => ({ col: Math.min(Math.max(c.col, 0), cols - 1), row: Math.min(Math.max(c.row, 0), rows - 1) })
    const defaults: Partial<Record<WinId, Cell>> = {}
    let i = 0
    for (const id of ids) {
      if (id === pinnedBottomRight) defaults[id] = { col: cols - 1, row: rows - 1 }
      else {
        defaults[id] = { col: Math.floor(i / rows), row: i % rows }
        i++
      }
    }
    const order = [...ids.filter((id) => saved[id]), ...ids.filter((id) => !saved[id])]
    const taken = new Set<string>()
    const result = {} as Record<WinId, Cell>
    for (const id of order) {
      const cell = nearestFree(clamp(saved[id] ?? defaults[id]!), cols, rows, taken)
      taken.add(key(cell))
      result[id] = cell
    }
    return result
  }, [ids, pinnedBottomRight, saved, cols, rows])

  const moveTo = useCallback(
    (id: WinId, x: number, y: number) => {
      const target = {
        col: Math.min(Math.max(Math.round((x - PAD) / stepX), 0), cols - 1),
        row: Math.min(Math.max(Math.round((y - PAD) / stepY), 0), rows - 1),
      }
      const taken = new Set(
        Object.entries(positions)
          .filter(([other]) => other !== id)
          .map(([, c]) => key(c)),
      )
      const cell = nearestFree(target, cols, rows, taken)
      setSaved((prev) => {
        const next = { ...prev }
        for (const other of ids) if (other !== id && !next[other]) next[other] = positions[other]
        next[id] = cell
        writeSaved(next)
        return next
      })
    },
    [cols, rows, stepX, stepY, ids, positions],
  )

  const reset = useCallback(() => {
    writeSaved({})
    setSaved({})
  }, [])

  return { positions, stepX, stepY, moveTo, reset, ready: w > 0 && h > 0 }
}
