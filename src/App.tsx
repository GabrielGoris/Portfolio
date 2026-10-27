import { useCallback, useState } from 'react'
import { BootScreen, ShutdownScreen } from './components/BootScreen'
import { Desktop } from './components/Desktop'
import { Taskbar } from './components/Taskbar'
import { useWindowManager } from './hooks/useWindowManager'

type Phase = 'boot' | 'desktop' | 'off'

export default function App() {
  const wm = useWindowManager()
  const [phase, setPhase] = useState<Phase>('boot')
  const { open, closeAll } = wm

  const finishBoot = useCallback(() => {
    open('sobre')
    setPhase('desktop')
  }, [open])

  const shutdown = useCallback(() => {
    closeAll()
    setPhase('off')
  }, [closeAll])

  return (
    <div className="h-full flex flex-col">
      <Desktop wm={wm} />
      <Taskbar wm={wm} onShutdown={shutdown} />
      {phase === 'boot' && <BootScreen onDone={finishBoot} />}
      {phase === 'off' && <ShutdownScreen onRestart={() => setPhase('boot')} />}
    </div>
  )
}
