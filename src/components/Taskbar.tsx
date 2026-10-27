import { useEffect, useRef, useState } from 'react'
import { WINDOW_IDS, type WindowManager } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'
import { FileIcon } from './Icons'

type Props = { wm: WindowManager; onShutdown: () => void }

export function Taskbar({ wm, onShutdown }: Props) {
  const { t, lang, toggle } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <div ref={menuRef} className="contents">
      {menuOpen && (
        <nav
          aria-label={t.ui.start}
          className="absolute left-1.5 bottom-[50px] w-[230px] z-[9999] flex bg-face bevel shadow-hard"
        >
          <div className="w-7 bg-to flex items-end justify-center pb-2">
            <span className="[writing-mode:vertical-rl] rotate-180 text-xs tracking-[.2em] text-acc font-medium">
              GG-OS
            </span>
          </div>
          <div className="flex-1 p-1">
            {WINDOW_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  wm.open(id)
                  setMenuOpen(false)
                }}
                className="flex items-center gap-2.5 w-full text-left bg-transparent border-0 px-3 py-2 text-txt hover:bg-tl focus-visible:bg-tl"
              >
                <FileIcon id={id} className="size-5" />
                {t.files[id].icon}
              </button>
            ))}
            <div className="h-0.5 my-1 mx-1 border-t border-lo border-b border-b-hi" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onShutdown()
              }}
              className="flex items-center gap-2.5 w-full text-left bg-transparent border-0 px-3 py-2 text-txt hover:bg-tl focus-visible:bg-tl"
            >
              <span aria-hidden="true" className="w-5 text-center text-acc">
                ⏻
              </span>
              {t.ui.shutdown}...
            </button>
          </div>
        </nav>
      )}

      <footer className="h-11 flex-none flex items-center gap-1.5 px-1.5 bg-face border-t-2 border-hi">
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className={`h-8 px-3 flex items-center gap-1.5 font-medium bg-face text-txt ${menuOpen ? 'bevel-in' : 'bevel'}`}
        >
          ▣ {t.ui.start}
        </button>

        <div className="flex gap-1.5 min-w-0 overflow-hidden">
          {wm.state.order.map((id) => {
            const on = wm.state.active === id && !wm.state.windows[id].minimized
            return (
              <button
                key={id}
                type="button"
                onClick={() => wm.taskClick(id)}
                className={`h-8 px-3 flex items-center gap-1.5 max-w-40 min-w-0 whitespace-nowrap text-txt ${
                  on ? 'bevel-in bg-desk' : 'bevel bg-face'
                }`}
              >
                <FileIcon id={id} className="size-4 shrink-0" />
                <span className="truncate max-[480px]:hidden">{t.files[id].task}</span>
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-1 h-8 pl-1 pr-2 bevel-in">
          <button
            type="button"
            onClick={toggle}
            title={t.ui.language}
            aria-label={t.ui.language}
            className="px-1.5 bg-transparent border-0 text-acc text-[13px] font-medium hover:text-txt"
          >
            {lang.toUpperCase()}
          </button>
          <Clock locale={t.meta.locale} />
        </div>
      </footer>
    </div>
  )
}

function Clock({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(i)
  }, [])
  return (
    <time className="text-mut text-[13px]" dateTime={now.toISOString()}>
      {now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
    </time>
  )
}
