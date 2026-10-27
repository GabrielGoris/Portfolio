import { lazy, Suspense, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { MODULES, toMm } from '../three/modules'

const RoomScene = lazy(() => import('../three/RoomScene'))

const STACK = ['React Three Fiber', 'Three.js', 'TypeScript', 'tRPC', 'Prisma']

export function NewCad() {
  const { t } = useLang()
  const [selected, setSelected] = useState<string | null>(null)
  const mod = MODULES.find((m) => m.id === selected)

  return (
    <>
      <div className="label">{t.newcad.label}</div>
      <h2 className="text-[22px]">NewCAD</h2>
      <p>{t.newcad.desc}</p>
      <div className="mb-4">
        {[...t.newcad.chips, ...STACK].map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      {/* viewport 3D com cara de CAD */}
      <div className="bevel-in bg-desk">
        <div role="img" aria-label={t.newcad.sceneHint} className="h-[300px] max-[720px]:h-[260px] touch-none">
          <Suspense fallback={<div className="h-full grid place-items-center text-mut text-[13px]">{t.newcad.loading}</div>}>
            <RoomScene selected={selected} onSelect={setSelected} />
          </Suspense>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 px-2 py-0.5 text-xs text-mut border-t-2 border-hi bg-face">
          <span className={mod ? 'text-txt' : ''}>
            {mod
              ? `${t.newcad.selected}: ${t.newcad.modules[mod.kind]} · ${mod.size.map(toMm).join(' × ')} mm`
              : t.newcad.noSelection}
          </span>
          <span>{t.newcad.sceneHint}</span>
        </div>
      </div>

      <h3 className="text-[15px] text-acc mt-5">{t.newcad.roleTitle}</h3>
      <ul className="m-0 pl-0 list-none text-mut">
        {t.newcad.role.map((r) => (
          <li key={r} className="flex gap-2 mb-1.5">
            <span aria-hidden="true" className="text-acc">
              ›
            </span>
            {r}
          </li>
        ))}
      </ul>
    </>
  )
}
