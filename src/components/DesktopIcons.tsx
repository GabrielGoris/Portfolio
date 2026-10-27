import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { PAD, useIconLayout } from '../hooks/useIconLayout'
import { useIsMobile } from '../hooks/useMediaQuery'
import { DESKTOP_IDS, type WinId } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'
import { FileIcon } from './Icons'

const DRAG_THRESHOLD = 5

type Props = { onOpen: (id: WinId) => void; deskRef: RefObject<HTMLElement | null> }

type Drag = { id: WinId; startX: number; startY: number; dx: number; dy: number; moving: boolean }

export function DesktopIcons({ onOpen, deskRef }: Props) {
  const isMobile = useIsMobile()
  return isMobile ? <MobileIcons onOpen={onOpen} /> : <FreeIcons onOpen={onOpen} deskRef={deskRef} />
}

function MobileIcons({ onOpen }: { onOpen: (id: WinId) => void }) {
  const { t } = useLang()
  return (
    <>
      <div className="absolute left-3 right-3 top-3 flex flex-row flex-wrap content-start gap-1.5">
        {DESKTOP_IDS.filter((id) => id !== 'lixeira').map((id) => (
          <IconButton key={id} label={t.files[id].icon} id={id} onClick={() => onOpen(id)} />
        ))}
      </div>
      <div className="absolute right-3 bottom-3">
        <IconButton label={t.files.lixeira.icon} id="lixeira" onClick={() => onOpen('lixeira')} />
      </div>
    </>
  )
}

function FreeIcons({ onOpen, deskRef }: Props) {
  const { t } = useLang()
  const { positions, stepX, stepY, moveTo, reset, ready } = useIconLayout(DESKTOP_IDS, 'lixeira', deskRef)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [selected, setSelected] = useState<WinId | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    const desk = deskRef.current
    if (!desk) return
    const onContext = (e: MouseEvent) => {
      if (e.target !== desk) return
      e.preventDefault()
      const r = desk.getBoundingClientRect()
      setMenu({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
    const onDown = (e: globalThis.PointerEvent) => {
      if (e.target === desk) setSelected(null)
      if (!(e.target as HTMLElement).closest('[data-desk-menu]')) setMenu(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null)
    desk.addEventListener('contextmenu', onContext)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      desk.removeEventListener('contextmenu', onContext)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [deskRef])

  if (!ready) return null

  const onPointerDown = (id: WinId) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    setSelected(id)
    setDrag({ id, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, moving: false })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const moving = drag.moving || Math.hypot(dx, dy) > DRAG_THRESHOLD
    setDrag({ ...drag, dx, dy, moving })
  }

  const onPointerUp = () => {
    if (!drag) return
    if (drag.moving) {
      const p = positions[drag.id]
      moveTo(drag.id, PAD + p.col * stepX + drag.dx, PAD + p.row * stepY + drag.dy)
      suppressClick.current = true
    }
    setDrag(null)
  }

  const onClick = (id: WinId) => () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    onOpen(id)
  }

  return (
    <>
      {DESKTOP_IDS.map((id) => {
        const p = positions[id]
        const dragging = drag?.id === id && drag.moving
        return (
          <IconButton
            key={id}
            id={id}
            label={t.files[id].icon}
            selected={selected === id}
            dragging={dragging}
            style={{
              left: PAD + p.col * stepX,
              top: PAD + p.row * stepY,
              transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px)` : undefined,
            }}
            onPointerDown={onPointerDown(id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
            onClick={onClick(id)}
          />
        )
      })}

      {menu && (
        <div
          data-desk-menu
          role="menu"
          className="absolute z-[9000] w-48 p-1 bg-face bevel shadow-hard"
          style={{ left: menu.x, top: menu.y }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              reset()
              setMenu(null)
            }}
            className="block w-full text-left bg-transparent border-0 px-3 py-1.5 text-[13px] text-txt hover:bg-tl focus-visible:bg-tl"
          >
            {t.ui.arrangeIcons}
          </button>
        </div>
      )}
    </>
  )
}

type IconButtonProps = {
  id: WinId
  label: string
  selected?: boolean
  dragging?: boolean
  style?: CSSProperties
  onClick: () => void
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void
  onPointerMove?: (e: PointerEvent<HTMLButtonElement>) => void
  onPointerUp?: () => void
  onPointerCancel?: () => void
}

function IconButton({ id, label, selected, dragging, style, ...handlers }: IconButtonProps) {
  return (
    <button
      type="button"
      style={style}
      {...handlers}
      className={`${style ? 'absolute touch-none select-none' : ''} ${dragging ? 'z-[5] opacity-80 cursor-grabbing' : ''} ${
        selected ? 'border-acc bg-tl/30' : 'border-transparent bg-transparent'
      } w-[92px] max-[720px]:w-[84px] border px-1 py-1.5 flex flex-col items-center gap-1 text-xs max-[720px]:text-[11px] text-txt hover:border-acc hover:bg-white/5 focus-visible:border-acc focus-visible:bg-white/5`}
    >
      <FileIcon id={id} />
      <IconLabel name={label} />
    </button>
  )
}

function IconLabel({ name }: { name: string }) {
  const dot = name.lastIndexOf('.')
  return (
    <span className="max-w-full text-center leading-tight [overflow-wrap:anywhere]">
      {dot > 0 ? (
        <>
          {name.slice(0, dot)}
          <wbr />
          {name.slice(dot)}
        </>
      ) : (
        name
      )}
    </span>
  )
}
