import { useCallback, useReducer } from 'react'

export const WINDOW_IDS = [
  'sobre',
  'newcad',
  'horizon',
  'experiencia',
  'curriculo',
  'stack',
  'contato',
  'cmd',
  'snake',
  'lixeira',
  'projetos',
  'portfolio',
  'reiamarelo',
] as const
export type WinId = (typeof WINDOW_IDS)[number]

export const PROJECT_IDS = ['newcad', 'horizon', 'portfolio', 'reiamarelo'] as const satisfies readonly WinId[]

export const DESKTOP_IDS: readonly WinId[] = [
  'sobre',
  'projetos',
  'experiencia',
  'curriculo',
  'stack',
  'contato',
  'cmd',
  'snake',
  'lixeira',
]

export type WinState = {
  open: boolean
  minimized: boolean
  maximized: boolean
  x: number
  y: number
  z: number
  placed: boolean
}

type State = {
  windows: Record<WinId, WinState>
  order: WinId[] // ordem na barra de tarefas
  active: WinId | null
  topZ: number
  cascade: number
}

type Action =
  | { type: 'open'; id: WinId }
  | { type: 'close'; id: WinId }
  | { type: 'minimize'; id: WinId }
  | { type: 'toggleMax'; id: WinId }
  | { type: 'focus'; id: WinId }
  | { type: 'move'; id: WinId; x: number; y: number }
  | { type: 'closeAll' }

const blank: WinState = { open: false, minimized: false, maximized: false, x: 0, y: 0, z: 0, placed: false }

const initial: State = {
  windows: Object.fromEntries(WINDOW_IDS.map((id) => [id, blank])) as Record<WinId, WinState>,
  order: [],
  active: null,
  topZ: 10,
  cascade: 0,
}

function reducer(s: State, a: Action): State {
  const set = (id: WinId, patch: Partial<WinState>) => ({ ...s.windows, [id]: { ...s.windows[id], ...patch } })

  switch (a.type) {
    case 'open': {
      const w = s.windows[a.id]
      const z = s.topZ + 1
      const pos = w.placed ? {} : { x: 110 + (s.cascade % 6) * 30, y: 16 + (s.cascade % 6) * 28, placed: true }
      return {
        ...s,
        windows: set(a.id, { ...pos, open: true, minimized: false, z }),
        order: s.order.includes(a.id) ? s.order : [...s.order, a.id],
        active: a.id,
        topZ: z,
        cascade: w.placed ? s.cascade : s.cascade + 1,
      }
    }
    case 'close':
      return {
        ...s,
        windows: set(a.id, { open: false, minimized: false, maximized: false }),
        order: s.order.filter((id) => id !== a.id),
        active: s.active === a.id ? null : s.active,
      }
    case 'minimize':
      return { ...s, windows: set(a.id, { minimized: true }), active: s.active === a.id ? null : s.active }
    case 'toggleMax':
      return { ...s, windows: set(a.id, { maximized: !s.windows[a.id].maximized }) }
    case 'focus': {
      if (s.active === a.id) return s
      const z = s.topZ + 1
      return { ...s, windows: set(a.id, { z }), active: a.id, topZ: z }
    }
    case 'move':
      return { ...s, windows: set(a.id, { x: a.x, y: a.y }) }
    case 'closeAll':
      return initial
  }
}

export function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, initial)

  const open = useCallback((id: WinId) => dispatch({ type: 'open', id }), [])
  const close = useCallback((id: WinId) => dispatch({ type: 'close', id }), [])
  const minimize = useCallback((id: WinId) => dispatch({ type: 'minimize', id }), [])
  const toggleMax = useCallback((id: WinId) => dispatch({ type: 'toggleMax', id }), [])
  const focus = useCallback((id: WinId) => dispatch({ type: 'focus', id }), [])
  const move = useCallback((id: WinId, x: number, y: number) => dispatch({ type: 'move', id, x, y }), [])
  const closeAll = useCallback(() => dispatch({ type: 'closeAll' }), [])

  const taskClick = useCallback(
    (id: WinId) => {
      const w = state.windows[id]
      if (w.minimized) open(id)
      else if (state.active === id) minimize(id)
      else focus(id)
    },
    [state, open, minimize, focus],
  )

  return { state, open, close, minimize, toggleMax, focus, move, closeAll, taskClick }
}

export type WindowManager = ReturnType<typeof useWindowManager>
