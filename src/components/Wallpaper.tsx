import { profile } from '../data/profile'
import { useLang } from '../i18n/LangContext'

const STRIPES = [
  { y: 112, h: 2 },
  { y: 124, h: 3 },
  { y: 136, h: 4 },
  { y: 148, h: 5 },
  { y: 160, h: 6 },
  { y: 172, h: 7 },
  { y: 184, h: 8 },
]

const HORIZON_ROWS = [0, 6, 14, 25, 40, 60, 86, 120]
const HORIZON_COLS = Array.from({ length: 17 }, (_, i) => i - 8)

export function Wallpaper() {
  const { t } = useLang()

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[min(92vw,960px)]">
        <div className="relative w-[min(48vh,64vw,420px)] aspect-square">
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full drop-shadow-[0_0_40px_rgba(255,110,199,0.35)]">
            <defs>
              <linearGradient id="wp-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffd6f2" />
                <stop offset="45%" stopColor="#ff7ac8" />
                <stop offset="100%" stopColor="#a63fbf" />
              </linearGradient>
              <mask id="wp-stripes">
                <rect width="200" height="200" fill="white" />
                {STRIPES.map((s) => (
                  <rect key={s.y} x="0" y={s.y} width="200" height={s.h} fill="black" />
                ))}
              </mask>
            </defs>
            <circle cx="100" cy="100" r="100" fill="url(#wp-sun)" mask="url(#wp-stripes)" opacity="0.9" />
          </svg>

          <span className="absolute left-1/2 top-[66%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            <span className="block animate-float font-medium leading-none tracking-tight text-white text-[clamp(34px,6.4vw,92px)] [text-shadow:0_0_6px_#ff6ec7,0_0_22px_#ff6ec7,0_0_48px_rgba(255,110,199,0.55)]">
              {profile.name}
            </span>
          </span>
          <span className="absolute left-1/2 top-[calc(100%+16px)] -translate-x-1/2 whitespace-nowrap uppercase tracking-[0.35em] text-pink text-[clamp(11px,1.3vw,17px)] [text-shadow:0_0_4px_#1a1424,0_0_10px_#1a1424,0_0_14px_rgba(255,110,199,0.8)]">
            {t.wallpaper.subtitle}
          </span>
        </div>

        <svg viewBox="-400 0 800 120" preserveAspectRatio="none" className="w-full h-[min(14vh,120px)] -mt-[2px] opacity-45">
          <defs>
            <linearGradient id="wp-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6ec7" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff6ec7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="url(#wp-fade)" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
            {HORIZON_ROWS.map((y) => (
              <line key={y} x1="-400" y1={y} x2="400" y2={y} />
            ))}
            {HORIZON_COLS.map((c) => (
              <line key={c} x1={c * 22} y1="0" x2={c * 110} y2="120" />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
