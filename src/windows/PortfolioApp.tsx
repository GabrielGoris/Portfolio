import { profile } from '../data/profile'
import { useLang } from '../i18n/LangContext'

const STACK = ['React', 'TypeScript', 'Vite', 'Tailwind', 'React Three Fiber', 'pdf.js']

export function PortfolioApp() {
  const { t } = useLang()
  return (
    <>
      <div className="label">{t.portfolioApp.label}</div>
      <h2 className="text-[22px] flex items-center gap-3 flex-wrap">
        Portfolio
        <span className="text-xs font-normal text-star border border-star px-2 py-0.5 tracking-widest uppercase">
          ◉ {t.portfolioApp.here}
        </span>
      </h2>
      <p>{t.portfolioApp.desc}</p>
      {STACK.map((s) => (
        <span key={s} className="chip">
          {s}
        </span>
      ))}
      <div className="mt-3">
        <a className="btn" href={profile.portfolio.repo} target="_blank" rel="noreferrer">
          {t.portfolioApp.code}
        </a>
      </div>
    </>
  )
}
