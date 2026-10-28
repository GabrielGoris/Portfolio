import type { ReactNode } from 'react'
import { Cursor } from '../components/BootScreen'
import { useLang } from '../i18n/LangContext'

type Entry = { when: string; title: string; role: string; desc: string; tags?: string[] }

export function Experience() {
  const { t } = useLang()
  const { command, entries, next, academicCommand, academic } = t.experience

  return (
    <>
      <Prompt command={command} />
      <Timeline entries={entries}>
        <li className="relative pl-5">
          <span aria-hidden="true" className="absolute -left-[7px] top-1.5 size-3 border-2 border-acc bg-desk" />
          <div className="text-[13px] text-star">
            {next} <Cursor />
          </div>
        </li>
      </Timeline>

      <div className="mt-7">
        <Prompt command={academicCommand} />
        <Timeline entries={academic} />
      </div>
    </>
  )
}

function Prompt({ command }: { command: string }) {
  return (
    <div className="text-[13px] text-mut mb-4">
      <span className="text-acc">C:\GG&gt;</span> {command}
    </div>
  )
}

function Timeline({ entries, children }: { entries: Entry[]; children?: ReactNode }) {
  return (
    <ol className="m-0 p-0 list-none border-l-2 border-hi ml-1.5">
      {entries.map((e, i) => (
        <li key={e.title} className={`relative pl-5 ${i < entries.length - 1 || children ? 'pb-5' : ''}`}>
          <span aria-hidden="true" className="absolute -left-[7px] top-1.5 size-3 bg-acc bevel" />
          <div className="text-xs text-acc tracking-widest uppercase">{e.when}</div>
          <h3 className="text-[17px] mt-0.5 mb-0.5">{e.title}</h3>
          <div className="text-[13px] text-txt mb-1.5">{e.role}</div>
          <p className={`text-sm ${e.tags?.length ? 'mb-2' : 'mb-0'}`}>{e.desc}</p>
          {e.tags?.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </li>
      ))}
      {children}
    </ol>
  )
}
