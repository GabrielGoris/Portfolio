import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import { Cursor } from '../components/BootScreen'

const ICONS = {
  email: 'M4 8h28v20H4ZM4 8l14 11L32 8',
  linkedin: 'M4 8h28v20H4ZM15 15a3 3 0 1 1-6 0a3 3 0 1 1 6 0M7 24c1-4 7-4 8 0M19 14h9M19 19h9M19 24h6',
  github: 'M14 8a3 3 0 1 1-6 0a3 3 0 1 1 6 0M14 28a3 3 0 1 1-6 0a3 3 0 1 1 6 0M28 10a3 3 0 1 1-6 0a3 3 0 1 1 6 0M11 11v14M25 13c0 7-14 5-14 12',
}

const TIP_ALIGN = ['left-0', 'left-1/2 -translate-x-1/2', 'right-0']

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function Contact() {
  const { t } = useLang()

  const links = [
    { key: 'email', label: t.contact.email, href: profile.email && `mailto:${profile.email}`, shown: profile.email, external: false },
    { key: 'linkedin', label: 'LinkedIn', href: profile.linkedin, shown: strip(profile.linkedin), external: true },
    { key: 'github', label: 'GitHub', href: profile.github, shown: strip(profile.github), external: true },
  ] as const

  return (
    <>
      <h2 className="text-[22px]">
        {t.contact.prompt}
        <Cursor />
      </h2>
      <p className="text-xs mb-10 pointer-coarse:mb-4">
        <span className="pointer-coarse:hidden">{t.contact.hint}</span>
        <span className="hidden pointer-coarse:inline">{t.contact.hintTouch}</span>
      </p>

      <ul className="m-0 p-0 list-none grid gap-2 grid-cols-3">
        {links.map((l, i) => (
          <li key={l.key} className="relative">
            {l.href ? (
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                aria-label={`${l.label}: ${l.shown}`}
                className="group w-full p-3 flex flex-col items-center gap-2 text-center text-txt no-underline border border-transparent hover:border-acc hover:bg-white/5 focus-visible:border-acc focus-visible:bg-white/5"
              >
                <svg
                  viewBox="0 0 36 36"
                  aria-hidden="true"
                  className="size-12 fill-none stroke-acc [stroke-width:1.8] [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <path d={ICONS[l.key]} />
                </svg>
                <span className="text-[13px] leading-tight">{l.label}</span>
                <span className="hidden pointer-coarse:block text-[11px] leading-tight text-mut break-all">{l.shown}</span>
                <span
                  role="tooltip"
                  className={`pointer-coarse:hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 transition-opacity absolute bottom-full mb-1 z-10 whitespace-nowrap bg-face bevel shadow-hard px-2 py-1 text-xs text-txt ${TIP_ALIGN[i]}`}
                >
                  {l.shown}
                </span>
              </a>
            ) : (
              <div className="p-3 text-center text-xs text-star">{t.contact.missing}</div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 bevel-in px-2 text-xs text-mut">{t.contact.status(links.length)}</div>
    </>
  )
}
