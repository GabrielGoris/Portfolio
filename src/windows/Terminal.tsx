import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { WINDOW_IDS, type WinId, type WindowManager } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'
import { dictionaries, type Dict } from '../i18n/strings'

const PROMPT = 'C:\\GG>'

type Line = { id: number; kind: 'in' | 'out' | 'err' | 'ok'; text: string }

const ALIASES: Record<string, WinId> = {}
for (const id of WINDOW_IDS) {
  ALIASES[id] = id
  for (const d of Object.values(dictionaries)) {
    const name = d.files[id].icon.toLowerCase()
    ALIASES[name] = id
    ALIASES[name.replace(/\.[a-z]+$/, '')] = id
  }
}

const COMMANDS = ['help', 'whoami', 'dir', 'open', 'lang', 'date', 'echo', 'cls', 'exit', 'shutdown'] as const

function helpLines(t: Dict): string[] {
  const h = t.terminal.help
  return [h.title, ...COMMANDS.map((c) => `  ${c.padEnd(10)}${h[c]}`), '', h.tip]
}

let nextId = 0
const mk = (kind: Line['kind'], text: string): Line => ({ id: nextId++, kind, text })

type Props = { wm: WindowManager; onShutdown: () => void }

export function Terminal({ wm, onShutdown }: Props) {
  const { t, setLang } = useLang()
  const [lines, setLines] = useState<Line[]>(() => [
    ...t.terminal.banner.map((b) => mk('out', b)),
    mk('out', ''),
    mk('in', 'help'),
    ...helpLines(t).map((l) => mk('out', l)),
    mk('out', ''),
  ])
  const [input, setInput] = useState('')
  const history = useRef<string[]>([])
  const histIdx = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const run = (raw: string) => {
    const cmdLine = raw.trim()
    const out: Line[] = [mk('in', raw)]
    const say = (text: string, kind: Line['kind'] = 'out') => {
      out.push(mk(kind, text))
    }
    const [cmd = '', ...args] = cmdLine.split(/\s+/)
    const arg = args.join(' ').toLowerCase()

    const openApp = (name: string) => {
      const id = ALIASES[name]
      if (!id) {
        say(t.terminal.notFound(name), 'err')
        return
      }
      say(t.terminal.opening(t.files[id].icon), 'ok')
      setTimeout(() => wm.open(id), 150)
    }

    switch (cmd.toLowerCase()) {
      case '':
        break
      case 'help':
      case 'ajuda':
      case '?':
        helpLines(t).forEach((l) => say(l))
        break
      case 'whoami':
        t.terminal.whoami.forEach((l) => say(l))
        break
      case 'dir':
      case 'ls':
        WINDOW_IDS.forEach((id) => {
          const name = t.files[id].icon
          const kind = id === 'stack' || id === 'lixeira' || id === 'projetos' ? '<DIR>' : name.endsWith('.exe') ? '<APP>' : '     '
          say(`  ${kind}  ${name}`)
        })
        say(`  ${t.stack.status(WINDOW_IDS.length)}`)
        break
      case 'open':
      case 'start':
        if (!arg) say(t.terminal.openUsage)
        else openApp(arg)
        break
      case 'lang':
        if (arg === 'pt' || arg === 'en') {
          setLang(arg)
          say(dictionaries[arg].terminal.langSet, 'ok')
        } else say(t.terminal.langUsage)
        break
      case 'date':
      case 'time':
        say(new Date().toLocaleString(t.meta.locale))
        break
      case 'echo':
        say(args.join(' '))
        break
      case 'cls':
      case 'clear':
        setLines([])
        return
      case 'exit':
        wm.close('cmd')
        return
      case 'shutdown':
        onShutdown()
        return
      case 'sudo':
        say(t.terminal.sudo, 'err')
        break
      default: {
        const name = cmdLine.toLowerCase()
        if (ALIASES[name]) openApp(name)
        else say(t.terminal.unknown(cmd), 'err')
      }
    }
    out.push(mk('out', ''))
    setLines((l) => [...l, ...out])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = history.current
    if (e.key === 'Enter') {
      if (input.trim()) h.push(input)
      histIdx.current = h.length
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' && h.length) {
      e.preventDefault()
      histIdx.current = Math.max(0, histIdx.current - 1)
      setInput(h[histIdx.current])
    } else if (e.key === 'ArrowDown' && h.length) {
      e.preventDefault()
      histIdx.current = Math.min(h.length, histIdx.current + 1)
      setInput(h[histIdx.current] ?? '')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="h-[380px] max-[720px]:h-full overflow-auto bg-lo p-3 text-[13px] leading-[1.55] cursor-text"
      onClick={() => !getSelection()?.toString() && inputRef.current?.focus()}
    >
      {lines.map((l) => (
        <div
          key={l.id}
          className={`whitespace-pre-wrap break-words min-h-[1.55em] ${
            l.kind === 'err' ? 'text-star' : l.kind === 'ok' ? 'text-acc' : l.kind === 'in' ? 'text-txt' : 'text-mut'
          }`}
        >
          {l.kind === 'in' && <span className="text-acc">{PROMPT} </span>}
          {l.text}
        </div>
      ))}
      <div ref={endRef} className="flex">
        <span className="text-acc shrink-0">{PROMPT}&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t.terminal.inputLabel}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 min-w-0 bg-transparent border-0 p-0 text-txt font-mono text-[13px] outline-none caret-acc"
        />
      </div>
    </div>
  )
}
