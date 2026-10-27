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
    <div className="@container">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-5 @2xl:grid-cols-[auto_minmax(0,1fr)] @2xl:grid-rows-[auto_1fr]">
        <div className="min-w-0 @2xl:col-start-2 @2xl:row-start-1">
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
        </div>

        {/* viewport 3D com cara de CAD */}
        <div className="bevel-in bg-desk self-start w-full max-w-[min(100%,calc(100dvh-190px))] mx-auto mb-5 @2xl:mb-0 @2xl:mx-0 @2xl:col-start-1 @2xl:row-start-1 @2xl:row-span-2 @2xl:w-[min(calc(50cqw-10px),calc(100dvh-190px))]">
          <div role="img" aria-label={t.newcad.sceneHint} className="aspect-square touch-none">
            <Suspense fallback={<div className="h-full grid place-items-center text-mut text-[13px]">{t.newcad.loading}</div>}>
              <RoomScene selected={selected} onSelect={setSelected} />
            </Suspense>
          </div>
          <div className="px-2 py-0.5 text-xs text-mut border-t-2 border-hi bg-face">
            <div className={`truncate ${mod ? 'text-txt' : ''}`}>
              {mod
                ? `${t.newcad.selected}: ${t.newcad.modules[mod.kind]} · ${mod.size.map(toMm).join(' × ')} mm`
                : t.newcad.noSelection}
            </div>
            <div className="truncate">{t.newcad.sceneHint}</div>
          </div>
        </div>

        <div className="min-w-0 @2xl:col-start-2 @2xl:row-start-2">
          <h3 className="text-[15px] text-acc mt-1">{t.newcad.roleTitle}</h3>
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
        </div>
      </div>
    </div>
  )
}
