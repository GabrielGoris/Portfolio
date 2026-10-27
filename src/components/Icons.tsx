import type { WinId } from '../hooks/useWindowManager'
import horizonIcon from '../assets/icons/horizon.png'
import newcadIcon from '../assets/icons/newcad.png'

const appIcons: Partial<Record<WinId, string>> = {
  horizon: horizonIcon,
  newcad: newcadIcon,
}

const paths: Record<WinId, string> = {
  sobre: 'M9 4h13l6 6v22H9ZM22 4v6h6M13 16h10M13 21h10M13 26h7',
  newcad: 'M18 4l12 7v14l-12 7-12-7V11ZM18 18v14M6 11l12 7 12-7',
  horizon:
    'M5 12h26a3 3 0 013 3v8a3 3 0 01-3 3H5a3 3 0 01-3-3v-8a3 3 0 013-3ZM10 16v6M7 19h6M25 17h.01M28 21h.01',
  stack: 'M4 10h10l3 4h15v16H4Z',
  contato: 'M4 8h28v20H4ZM4 8l14 11L32 8',
  experiencia: 'M8 4h20v28H8ZM12 11h.01M16 11h8M12 17h.01M16 17h8M12 23h.01M16 23h5',
  curriculo: 'M9 4h13l6 6v22H9ZM22 4v6h6M13 15h4M13 19h10M12 24h12v4H12Z',
  cmd: 'M3 7h30v22H3ZM3 12h30M8 17l4 3.5-4 3.5M15 25h7',
  snake: 'M5 27h10v-9h10V9h-5M27 26h3v3h-3Z',
  lixeira: 'M7 9h22M14 9V5h8v4M9 9l2 23h14l2-23M15 14v13M21 14v13',
  projetos: 'M4 10h10l3 4h15v16H4ZM14 19l-3 3 3 3M22 19l3 3-3 3M19.5 18l-3 8',
  portfolio: 'M3 6h30v20H3ZM13 32h10M18 26v6M3 11h30M7 15h9v7H7ZM20 15h9M20 19h6',
  reiamarelo: 'M14 4h8M18 4v3M11 7h14l-2 4H13ZM13 11v14M23 11v14M11 25h14v5H11ZM18 15v5',
}

const tints: Partial<Record<WinId, string>> = {
  reiamarelo: 'stroke-star',
}

export function FileIcon({ id, className = 'size-[38px]' }: { id: WinId; className?: string }) {
  const src = appIcons[id]
  if (src) {
    return <img src={src} alt="" aria-hidden="true" draggable={false} className={`${className} shrink-0 select-none`} />
  }
  return (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      className={`${className} shrink-0 fill-none ${tints[id] ?? 'stroke-acc'} [stroke-width:1.8] [stroke-linecap:round] [stroke-linejoin:round]`}
    >
      <path d={paths[id]} />
    </svg>
  )
}
