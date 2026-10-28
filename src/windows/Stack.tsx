import { useLang } from '../i18n/LangContext'
import { FileIcon } from '../components/Icons'

const FOLDERS = {
  front: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
  mobile: ['Capacitor', 'Android'],
  api: ['tRPC', 'Prisma', 'Vercel', 'GitHub Actions'],
  three: ['React Three Fiber', 'Three.js', 'Drei'],
  desktop: ['Electron', 'SQLite', 'Vitest'],
} as const

export function Stack() {
  const { t } = useLang()
  const total = Object.values(FOLDERS).reduce((n, f) => n + f.length, 0)
  return (
    <>
      <div className="bevel-in bg-desk px-2 py-1 mb-4 text-[13px] text-mut flex items-center gap-2">
        <FileIcon id="stack" className="size-4" />
        C:\stack
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {(Object.keys(FOLDERS) as (keyof typeof FOLDERS)[]).map((k) => (
          <div key={k}>
            <h3 className="text-[15px] text-acc">{t.stack.folders[k]}</h3>
            {FOLDERS[k].map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 bevel-in px-2 text-xs text-mut">{t.stack.status(total)}</div>
    </>
  )
}
