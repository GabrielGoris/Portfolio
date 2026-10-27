import { profile } from '../data/profile'
import { useLang } from '../i18n/LangContext'

export function KingYellow() {
  const { t } = useLang()
  const k = t.kingYellow
  return (
    <>
      <div className="label">{k.label}</div>
      <h2 className="text-[22px] text-star">{k.title}</h2>
      <p>{k.desc}</p>
      {k.chips.map((c) => (
        <span key={c} className="chip">
          {c}
        </span>
      ))}
      <div className="mt-3 mb-4">
        <a className="btn" href={profile.kingInYellow.repo} target="_blank" rel="noreferrer">
          {k.code}
        </a>
      </div>

      <figure className="m-0 bevel-in bg-lo">
        <img
          src={profile.kingInYellow.screenshot}
          alt={k.shotLabel}
          loading="lazy"
          className="block w-full h-auto [image-rendering:pixelated]"
        />
        <figcaption className="px-2 py-0.5 text-xs text-mut border-t-2 border-hi bg-face">{k.shotCaption}</figcaption>
      </figure>
    </>
  )
}
