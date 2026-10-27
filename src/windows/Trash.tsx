import { useState } from 'react'
import { useLang } from '../i18n/LangContext'

export function Trash() {
  const { t } = useLang()
  const [emptied, setEmptied] = useState(false)
  const items = emptied ? [] : t.trash.items

  return (
    <>
      <div className="mb-3">
        <button type="button" className="btn" disabled={emptied} onClick={() => setEmptied(true)}>
          {t.trash.empty}
        </button>
      </div>

      <div className="bevel-in bg-desk text-[13px]">
        <div className="grid grid-cols-[minmax(0,1.3fr)_80px_minmax(0,1.5fr)] max-[560px]:grid-cols-[minmax(0,1fr)_72px] bg-face border-b-2 border-hi">
          <span className="px-2 py-1 border-r border-hi">{t.trash.cols.name}</span>
          <span className="px-2 py-1 border-r border-hi text-right">{t.trash.cols.size}</span>
          <span className="px-2 py-1 max-[560px]:hidden">{t.trash.cols.reason}</span>
        </div>

        {items.length === 0 ? (
          <div className="px-2 py-8 text-center text-mut">{t.trash.emptied}</div>
        ) : (
          <ul className="m-0 p-0 list-none">
            {items.map((it) => (
              <li
                key={it.name}
                title={it.reason}
                className="grid grid-cols-[minmax(0,1.3fr)_80px_minmax(0,1.5fr)] max-[560px]:grid-cols-[minmax(0,1fr)_72px] hover:bg-tl"
              >
                <span className="px-2 py-1 truncate text-txt">{it.name}</span>
                <span className="px-2 py-1 text-right text-mut">{it.size}</span>
                <span className="px-2 py-1 text-mut max-[560px]:col-span-2 max-[560px]:pt-0 max-[560px]:text-xs">
                  {it.reason}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-3 bevel-in px-2 text-xs text-mut">{t.trash.status(items.length)}</div>
    </>
  )
}
