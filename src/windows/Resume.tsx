import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { profile } from '../data/profile'
import { useLang } from '../i18n/LangContext'

type Status = 'loading' | 'ok' | 'missing'

async function loadPdf(url: string) {
  const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs.getDocument(url).promise
}

async function renderPages(doc: PDFDocumentProxy, container: HTMLElement, isCancelled: () => boolean) {
  const width = container.clientWidth
  const dpr = window.devicePixelRatio || 1
  const canvases: HTMLCanvasElement[] = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: (width / base.width) * dpr })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    canvas.className = 'block w-full h-auto bg-white shadow-hard'
    canvas.setAttribute('aria-hidden', 'true')
    await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport }).promise
    if (isCancelled()) return
    canvases.push(canvas)
  }
  container.replaceChildren(...canvases)
}

export function Resume() {
  const { t } = useLang()
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    const container = pagesRef.current
    if (!container) return
    let doc: PDFDocumentProxy | null = null
    let version = 0
    let lastWidth = 0
    let timer: ReturnType<typeof setTimeout>

    const draw = () => {
      if (!doc || container.clientWidth === lastWidth) return
      lastWidth = container.clientWidth
      const v = ++version
      renderPages(doc, container, () => v !== version).catch(() => setStatus('missing'))
    }

    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(draw, 150)
    })

    loadPdf(profile.cv)
      .then((d) => {
        doc = d
        setNumPages(d.numPages)
        setStatus('ok')
        draw()
        observer.observe(container)
      })
      .catch(() => setStatus('missing'))

    return () => {
      version++
      clearTimeout(timer)
      observer.disconnect()
      doc?.destroy()
    }
  }, [])

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-2 mb-3">
        <a className="btn" href={profile.cv} download="curriculo-gabriel-goris.pdf">
          {t.cv.download}
        </a>
        <a className="btn" href={profile.cv} target="_blank" rel="noreferrer">
          {t.cv.openTab}
        </a>
        {status === 'ok' && <span className="ml-auto mb-2 text-xs text-mut">{t.cv.pages(numPages)}</span>}
      </div>

      <div className="bevel-in bg-desk p-3">
        <div ref={pagesRef} role="document" aria-label={t.cv.pageLabel} className="flex flex-col gap-3" />
        {status === 'loading' && <div className="py-10 text-center text-[13px] text-mut">{t.cv.loading}</div>}
        {status === 'missing' && <div className="py-10 text-center text-[13px] text-star">{t.cv.missing}</div>}
      </div>
    </>
  )
}
