async function extractPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const buffer  = await file.arrayBuffer()
  const pdf     = await pdfjsLib.getDocument({ data: buffer }).promise
  const pages   = []
  const limit   = Math.min(pdf.numPages, 25)

  for (let i = 1; i <= limit; i++) {
    const page    = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text    = content.items.map(item => item.str).join(' ')
    pages.push(text)
  }

  return pages.join('\n\n').slice(0, 20000)
}

export async function extractTextFromFile(file) {
  if (!file) return ''
  try {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return await extractPDF(file)
    }
    return await file.text()
  } catch {
    return ''
  }
}
