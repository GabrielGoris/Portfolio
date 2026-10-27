import { useRef, type ReactNode } from 'react'
import { WINDOW_IDS, type WinId, type WindowManager } from '../hooks/useWindowManager'
import { useLang } from '../i18n/LangContext'
import { About } from '../windows/About'
import { Contact } from '../windows/Contact'
import { Horizon } from '../windows/Horizon'
import { NewCad } from '../windows/NewCad'
import { Stack } from '../windows/Stack'
import { FileIcon } from './Icons'
import { Window } from './Window'

const WINDOWS: Record<WinId, { width: number; render: (wm: WindowManager) => ReactNode }> = {
  sobre: { width: 520, render: (wm) => <About open={wm.open} /> },
  newcad: { width: 720, render: () => <NewCad /> },
  horizon: { width: 660, render: () => <Horizon /> },
  stack: { width: 560, render: () => <Stack /> },
  contato: { width: 480, render: () => <Contact /> },
}

export function Desktop({ wm }: { wm: WindowManager }) {
  const { t } = useLang()
  const deskRef = useRef<HTMLDivElement>(null)

  return (
    <main ref={deskRef} className="flex-1 relative min-h-0 dots">
      <div className="absolute left-3 top-3 flex flex-col flex-wrap gap-2 max-h-[calc(100%-24px)] max-[720px]:flex-row max-[720px]:right-3">
        {WINDOW_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => wm.open(id)}
            className="w-[92px] max-[720px]:w-[84px] bg-transparent border border-transparent px-1 py-2 flex flex-col items-center gap-1.5 text-xs text-txt hover:border-acc hover:bg-white/5 focus-visible:border-acc focus-visible:bg-white/5"
          >
            <FileIcon id={id} />
            {t.files[id].icon}
          </button>
        ))}
      </div>

      {WINDOW_IDS.map((id) => (
        <Window key={id} id={id} width={WINDOWS[id].width} wm={wm} deskRef={deskRef}>
          {WINDOWS[id].render(wm)}
        </Window>
      ))}
    </main>
  )
}
