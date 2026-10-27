import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import { Cursor } from '../components/BootScreen'

export function Contact() {
  const { t } = useLang()
  const linkedinLabel = profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')
  return (
    <>
      <h2 className="text-[22px]">
        {t.contact.prompt}
        <Cursor />
      </h2>
      <p>
        {t.contact.email}:{' '}
        {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : <Missing />}
      </p>
      <p>
        linkedin:{' '}
        {profile.linkedin ? (
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            {linkedinLabel}
          </a>
        ) : (
          <Missing />
        )}
      </p>
      <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
        {profile.github.replace('https://', '')}
      </a>
    </>
  )
}

function Missing() {
  const { t } = useLang()
  return <span className="text-star">{t.contact.missing}</span>
}
