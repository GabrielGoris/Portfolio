import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import foto from '../assets/foto.jpg'

export function About() {
  const { t } = useLang()
  return (
    <>
      <div className="flex items-center gap-5 mb-4 max-[420px]:flex-col max-[420px]:items-start">
        <figure className="m-0 shrink-0 bevel bg-face p-1.5 shadow-hard">
          <img src={foto} alt={t.about.photoAlt} width={128} height={128} className="block size-32 object-cover bevel-in" />
          <figcaption className="mt-1 text-[11px] text-mut text-center">gabriel.jpg</figcaption>
        </figure>
        <div className="min-w-0">
          <div className="label">{t.about.label}</div>
          <h1 className="text-[26px]">{profile.name}</h1>
        </div>
      </div>
      <p>{t.about.p1}</p>
      <p>{t.about.p2}</p>
      <p className="mt-4 mb-0 text-acc">{t.about.hint}</p>
    </>
  )
}
