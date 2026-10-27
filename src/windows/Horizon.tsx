import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'

const STACK = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Capacitor', 'Vercel']

export function Horizon() {
  const { t } = useLang()
  return (
    <div className="grid gap-6 items-center grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      <div>
        <div className="label">{t.horizon.label}</div>
        <h2 className="text-[22px]">Horizon</h2>
        <p>{t.horizon.desc}</p>
        {STACK.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
        <div className="mt-3">
          <a className="btn" href={profile.horizon.site} target="_blank" rel="noreferrer">
            {t.horizon.site}
          </a>
          <a className="btn" href={profile.horizon.repo} target="_blank" rel="noreferrer">
            {t.horizon.code}
          </a>
        </div>
      </div>
      <PhoneMock />
    </div>
  )
}

function PhoneMock() {
  const { t } = useLang()
  const items = [
    { w: 90, stars: 5, rated: true },
    { w: 70, stars: 4, rated: true },
    { w: 80, stars: 0, rated: false },
  ]
  return (
    <div role="img" aria-label={t.horizon.mockLabel} className="w-[210px] justify-self-center bevel bg-desk p-3.5 text-xs">
      <div className="flex gap-1.5 mb-3">
        {t.horizon.tabs.map((tab, i) =>
          i === 0 ? (
            <span key={tab} className="bg-tl px-2 py-0.5">
              {tab}
            </span>
          ) : (
            <span key={tab} className="border border-hi px-2 py-px text-mut">
              {tab}
            </span>
          ),
        )}
      </div>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2.5 mb-2.5 last:mb-0">
          <div className="w-11 h-[58px] bg-to" />
          <div>
            <div className="h-[7px] bg-hi" style={{ width: it.w }} />
            <div className="mt-2" aria-hidden="true">
              {Array.from({ length: 5 }, (_, s) => (
                <span key={s} className={it.rated && s < it.stars ? 'text-star' : 'text-hi'}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
