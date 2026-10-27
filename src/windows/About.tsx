import type { WinId } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'

export function About({ open }: { open: (id: WinId) => void }) {
  const { t } = useLang()
  return (
    <>
      <div className="label">{t.about.label}</div>
      <h1 className="text-[26px]">{profile.name}</h1>
      <p>{t.about.p1}</p>
      <p>{t.about.p2}</p>
      <p className="mt-4">{t.about.hint}</p>
      <button type="button" className="btn" onClick={() => open('newcad')}>
        {t.about.openNewcad}
      </button>
      <button type="button" className="btn" onClick={() => open('horizon')}>
        {t.about.openHorizon}
      </button>
      <button type="button" className="btn" onClick={() => open('contato')}>
        {t.about.contact}
      </button>
    </>
  )
}
