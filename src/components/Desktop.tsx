import { useRef, type ReactNode } from 'react'
import { WINDOW_IDS, type WinId, type WindowManager } from '../hooks/useWindowManager'
import { About } from '../windows/About'
import { Contact } from '../windows/Contact'
import { Experience } from '../windows/Experience'
import { Horizon } from '../windows/Horizon'
import { KingYellow } from '../windows/KingYellow'
import { NewCad } from '../windows/NewCad'
import { PortfolioApp } from '../windows/PortfolioApp'
import { Projects } from '../windows/Projects'
import { Resume } from '../windows/Resume'
import { Snake } from '../windows/Snake'
import { Stack } from '../windows/Stack'
import { Terminal } from '../windows/Terminal'
import { Trash } from '../windows/Trash'
import { DesktopIcons } from './DesktopIcons'
import { Wallpaper } from './Wallpaper'
import { Window } from './Window'

type Ctx = { wm: WindowManager; onShutdown: () => void }

const WINDOWS: Record<WinId, { width: number; body?: string; render: (c: Ctx) => ReactNode }> = {
  sobre: { width: 520, render: () => <About /> },
  newcad: { width: 860, render: () => <NewCad /> },
  horizon: { width: 660, render: () => <Horizon /> },
  experiencia: { width: 580, render: () => <Experience /> },
  curriculo: { width: 680, render: () => <Resume /> },
  stack: { width: 560, render: () => <Stack /> },
  contato: { width: 480, render: () => <Contact /> },
  cmd: { width: 620, body: 'p-0', render: ({ wm, onShutdown }) => <Terminal wm={wm} onShutdown={onShutdown} /> },
  snake: {
    width: 380,
    render: ({ wm }) => <Snake active={wm.state.active === 'snake' && !wm.state.windows.snake.minimized} />,
  },
  lixeira: { width: 640, render: () => <Trash /> },
  projetos: { width: 560, render: ({ wm }) => <Projects open={wm.open} /> },
  portfolio: { width: 560, render: () => <PortfolioApp /> },
  reiamarelo: { width: 640, render: () => <KingYellow /> },
}

export function Desktop({ wm, onShutdown }: Ctx) {
  const deskRef = useRef<HTMLDivElement>(null)

  return (
    <main ref={deskRef} className="flex-1 relative min-h-0 dots">
      <Wallpaper />
      <DesktopIcons onOpen={wm.open} deskRef={deskRef} />

      {WINDOW_IDS.map((id) => (
        <Window key={id} id={id} width={WINDOWS[id].width} bodyClassName={WINDOWS[id].body} wm={wm} deskRef={deskRef}>
          {WINDOWS[id].render({ wm, onShutdown })}
        </Window>
      ))}
    </main>
  )
}
