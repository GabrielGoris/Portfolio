import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useLang } from '../i18n/LangContext'

const LINE_DELAY = 450

export function BootScreen({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const lines = t.boot.lines

  useEffect(() => {
    if (reduced) return onDone()
    const timer = setTimeout(() => (count < lines.length ? setCount(count + 1) : onDone()), LINE_DELAY)
    return () => clearTimeout(timer)
  }, [count, reduced, lines.length, onDone])

  // Qualquer tecla pula o boot
  useEffect(() => {
    const skip = () => onDone()
    document.addEventListener('keydown', skip)
    return () => document.removeEventListener('keydown', skip)
  }, [onDone])

  return (
    <div onClick={onDone} className="fixed inset-0 z-[99999] bg-lo text-mut p-8 cursor-pointer">
      {lines.slice(0, count).map((l) => (
        <div key={l}>{l}</div>
      ))}
      <Cursor />
      <div className="mt-6 text-xs">{t.boot.skip}</div>
    </div>
  )
}

export function ShutdownScreen({ onRestart }: { onRestart: () => void }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={onRestart}
      className="fixed inset-0 z-[99999] bg-lo border-0 flex flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <span className="text-star text-xl max-w-md">{t.shutdown.message}</span>
      <span className="text-mut text-xs">{t.shutdown.restart}</span>
    </button>
  )
}

export function Cursor() {
  return <span aria-hidden="true" className="inline-block w-[9px] h-4 bg-acc align-middle animate-blink" />
}
