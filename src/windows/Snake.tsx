import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useLang } from '../i18n/LangContext'

const N = 18
const CELL = 18
const SIZE = N * CELL
const BEST_KEY = 'gg-snake-best'

const COLORS = { bg: '#1A1424', dot: '#2A2038', body: '#A58FE0', head: '#EDE8F5', food: '#E3B866' }

type P = { x: number; y: number }
type Status = 'idle' | 'running' | 'paused' | 'over'
type Dir = 'up' | 'down' | 'left' | 'right'

const VEC: Record<Dir, P> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
const KEYS: Record<string, Dir> = {
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
}

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function randomFood(snake: P[]): P {
  for (;;) {
    const f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f
  }
}

function newGame() {
  const snake = [
    { x: 6, y: 9 },
    { x: 5, y: 9 },
    { x: 4, y: 9 },
  ]
  return { snake, dir: 'right' as Dir, queue: [] as Dir[], food: randomFood(snake), score: 0 }
}

export function Snake({ active }: { active: boolean }) {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const game = useRef(newGame())
  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [step, setStep] = useState(0)
  const swipe = useRef<P | null>(null)

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { snake, food } = game.current
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, SIZE, SIZE)
    ctx.fillStyle = COLORS.dot
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2)
    ctx.fillStyle = COLORS.food
    ctx.fillRect(food.x * CELL + 4, food.y * CELL + 4, CELL - 8, CELL - 8)
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? COLORS.head : COLORS.body
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2)
    })
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = window.devicePixelRatio || 1
    c.width = SIZE * dpr
    c.height = SIZE * dpr
    c.getContext('2d')?.scale(dpr, dpr)
    draw()
  }, [draw])

  const start = useCallback(() => {
    game.current = newGame()
    setScore(0)
    setStatus('running')
    draw()
  }, [draw])

  const turn = useCallback((d: Dir) => {
    const g = game.current
    const last = g.queue.at(-1) ?? g.dir
    if (d !== last && d !== OPPOSITE[last] && g.queue.length < 3) g.queue.push(d)
  }, [])

  useEffect(() => {
    if (status !== 'running') return
    const g = game.current
    const timer = setTimeout(() => {
      if (!active) {
        setStatus('paused')
        return
      }
      g.dir = g.queue.shift() ?? g.dir
      const head = { x: g.snake[0].x + VEC[g.dir].x, y: g.snake[0].y + VEC[g.dir].y }
      const ate = head.x === g.food.x && head.y === g.food.y
      const body = ate ? g.snake : g.snake.slice(0, -1)
      const dead =
        head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || body.some((s) => s.x === head.x && s.y === head.y)

      if (dead) {
        setStatus('over')
        if (g.score > best) {
          setBest(g.score)
          try {
            localStorage.setItem(BEST_KEY, String(g.score))
          } catch {
            /* ignora */
          }
        }
        return
      }
      g.snake = [head, ...body]
      if (ate) {
        g.score += 1
        g.food = randomFood(g.snake)
        setScore(g.score)
      }
      draw()
      setStep((n) => n + 1)
    }, Math.max(65, 140 - g.score * 4))
    return () => clearTimeout(timer)
  }, [status, step, best, draw, active])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      const d = KEYS[e.key]
      if (d) {
        e.preventDefault()
        if (status === 'running') turn(d)
        else if (status === 'idle' || status === 'paused') {
          if (status === 'idle') start()
          else setStatus('running')
          turn(d)
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (status === 'running') setStatus('paused')
        else if (status === 'paused') setStatus('running')
        else start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, status, start, turn])

  const onOverlay = () => (status === 'paused' ? setStatus('running') : start())

  const onDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onUp = (e: PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s || status !== 'running') return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  const overlay =
    status === 'idle'
      ? [t.files.snake.icon, t.snake.start]
      : status === 'paused'
        ? [t.snake.paused, '']
        : status === 'over'
          ? [t.snake.gameOver, t.snake.restart]
          : null

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full flex justify-between text-[13px]">
        <span>
          {t.snake.score}: <b className="text-acc font-medium">{score}</b>
        </span>
        <span className="text-mut">
          {t.snake.best}: <b className="text-star font-medium">{best}</b>
        </span>
      </div>

      <div className="relative bevel-in touch-none max-w-full" onPointerDown={onDown} onPointerUp={onUp}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t.snake.boardLabel}
          className="block max-w-full"
          style={{ width: SIZE, maxWidth: '100%', height: 'auto', aspectRatio: '1' }}
        />
        {overlay && (
          <button
            type="button"
            onClick={onOverlay}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-lo/75 border-0 text-txt"
          >
            <span className="text-lg font-medium uppercase tracking-widest">{overlay[0]}</span>
            {overlay[1] && <span className="text-xs text-mut">{overlay[1]}</span>}
          </button>
        )}
      </div>

      <div className="hidden pointer-coarse:grid grid-cols-3 gap-1">
        {(
          [
            ['', null],
            ['▲', 'up'],
            ['', null],
            ['◀', 'left'],
            ['▼', 'down'],
            ['▶', 'right'],
          ] as const
        ).map(([label, d], i) =>
          d ? (
            <button
              key={i}
              type="button"
              aria-label={t.snake[d]}
              onClick={() =>
                status === 'running' ? turn(d) : status === 'idle' || status === 'over' ? start() : setStatus('running')
              }
              className="size-12 bg-face text-acc bevel active:bevel-in"
            >
              {label}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>

      <div className="text-xs text-mut pointer-coarse:hidden">{t.snake.controls}</div>
    </div>
  )
}
