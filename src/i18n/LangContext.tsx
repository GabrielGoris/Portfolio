import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dictionaries, type Dict, type Lang } from './strings'

const STORAGE_KEY = 'gg-lang'

type LangValue = { lang: Lang; t: Dict; toggle: () => void }

const LangContext = createContext<LangValue | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    /* storage indisponível: segue o navegador */
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = t.meta.locale
    document.title = t.meta.title
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignora */
    }
  }, [lang, t])

  const toggle = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'))

  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang precisa estar dentro de <LangProvider>')
  return ctx
}
