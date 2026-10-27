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
      className={`${className} shrink-0 fill-none stroke-acc [stroke-width:1.8] [stroke-linecap:round] [stroke-linejoin:round]`}
    >
      <path d={paths[id]} />
    </svg>
  )
}
