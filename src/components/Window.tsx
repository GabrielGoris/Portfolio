import { useRef, type PointerEvent, type ReactNode, type RefObject } from 'react'
import type { WinId, WindowManager } from '../hooks/useWindowManager'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useLang } from '../i18n/LangContext'
import { FileIcon } from './Icons'

type Props = {
  id: WinId
  width: number
  wm: WindowManager
  deskRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}

export function Window({ id, width, wm, deskRef, children }: Props) {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const w = wm.state.windows[id]
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const title = t.files[id].title
  const full = isMobile || w.maximized

  if (!w.open) return null

  const onTitleDown = (e: PointerEvent<HTMLDivElement>) => {
    if (full || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - w.x, dy: e.clientY - w.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onTitleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const desk = deskRef.current
    const maxX = (desk?.clientWidth ?? innerWidth) - 90
    const maxY = (desk?.clientHeight ?? innerHeight) - 30
    wm.move(
      id,
      Math.max(0, Math.min(maxX, e.clientX - drag.current.dx)),
      Math.max(0, Math.min(maxY, e.clientY - drag.current.dy)),
    )
  }

  const endDrag = () => (drag.current = null)

  const active = wm.state.active === id

  return (
    <section
      aria-label={title}
      onPointerDown={() => wm.focus(id)}
      className={`absolute flex flex-col bg-face bevel shadow-hard ${w.minimized ? 'hidden' : ''}`}
      style={
        full
          ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: w.z }
          : {
              left: w.x,
              top: w.y,
              width,
              maxWidth: 'calc(100% - 8px)',
              maxHeight: `calc(100% - ${w.y}px - 8px)`,
              zIndex: w.z,
            }
      }
    >
      <div
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => !isMobile && wm.toggleMax(id)}
        className={`flex items-center justify-between gap-2 py-[3px] pr-1 pl-2.5 font-medium select-none touch-none ${
          full ? '' : 'cursor-move'
        } ${active ? 'bg-tl' : 'bg-to'}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <FileIcon id={id} className="size-4" />
          <span className="truncate">{title}</span>
        </span>
        <span className="flex gap-[3px] shrink-0">
          <TitleButton label={t.ui.minimize} onClick={() => wm.minimize(id)}>
            _
          </TitleButton>
          {!isMobile && (
            <TitleButton label={t.ui.maximize} onClick={() => wm.toggleMax(id)}>
              □
            </TitleButton>
          )}
          <TitleButton label={t.ui.close} onClick={() => wm.close(id)}>
            ×
          </TitleButton>
        </span>
      </div>
      <div className="p-5 overflow-auto min-h-0">{children}</div>
    </section>
  )
}

function TitleButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="w-[26px] h-6 p-0 leading-none bg-face text-txt bevel active:bevel-in"
    >
      {children}
    </button>
  )
}
