import { FileIcon } from '../components/Icons'
import { PROJECT_IDS, type WinId } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'

export function Projects({ open }: { open: (id: WinId) => void }) {
  const { t } = useLang()

  return (
    <>
      <div className="bevel-in bg-desk px-2 py-1 mb-4 text-[13px] text-mut flex items-center gap-2">
        <FileIcon id="projetos" className="size-4" />
        {t.projects.path}
      </div>

      <ul className="m-0 p-0 list-none grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {PROJECT_IDS.map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => open(id)}
              className="w-full h-full bg-transparent border border-transparent p-3 flex flex-col items-center gap-2 text-center text-txt hover:border-acc hover:bg-white/5 focus-visible:border-acc focus-visible:bg-white/5"
            >
              <FileIcon id={id} className="size-12" />
              <span className="text-[13px] leading-tight">{t.files[id].icon}</span>
              <span className="text-[11px] leading-tight text-mut">{t.projects.kinds[id]}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 bevel-in px-2 text-xs text-mut">{t.projects.status(PROJECT_IDS.length)}</div>
    </>
  )
}
