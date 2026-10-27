import { useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'

const STACK = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Capacitor', 'Vercel']

export function Horizon() {
  const { t } = useLang()
  return (
    <>
      <div className="label">{t.horizon.label}</div>
      <h2 className="text-[22px]">Horizon</h2>
      <p>{t.horizon.desc}</p>
      {STACK.map((s) => (
        <span key={s} className="chip">
          {s}
        </span>
      ))}
      <div className="mt-3 mb-4">
        <a className="btn" href={profile.horizon.site} target="_blank" rel="noreferrer">
          {t.horizon.site}
        </a>
        <a className="btn" href={profile.horizon.repo} target="_blank" rel="noreferrer">
          {t.horizon.code}
        </a>
      </div>
      <DemoVideo />
    </>
  )
}

function DemoVideo() {
  const { t } = useLang()
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)
  const { video, poster } = profile.horizon

  return (
    <div className="bevel-in bg-desk">
      <div className="relative aspect-[1908/943]">
        {started && !failed ? (
          <video
            src={video}
            poster={poster}
            aria-label={t.horizon.videoLabel}
            autoPlay
            controls
            loop
            muted
            playsInline
            preload="none"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-contain bg-lo"
          />
        ) : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            disabled={failed}
            aria-label={t.horizon.play}
            className="group absolute inset-0 size-full p-0 border-0 bg-lo cursor-pointer disabled:cursor-default"
          >
            <img src={poster} alt="" className="size-full object-contain opacity-70 group-hover:opacity-90 group-disabled:opacity-40" />
            {!failed && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-3 bg-face bevel px-4 py-2 text-txt group-hover:bg-tl group-active:bevel-in">
                  <span aria-hidden="true" className="text-acc group-hover:text-txt">
                    ▶
                  </span>
                  {t.horizon.play}
                </span>
              </span>
            )}
          </button>
        )}
      </div>
      {failed && <div className="px-2 py-1 text-xs text-star border-t-2 border-hi">{t.horizon.videoMissing}</div>}
    </div>
  )
}
