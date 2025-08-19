declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: {
      type?: string
      quality?: number
    }
    html2canvas?: {
      scale?: number
      useCORS?: boolean
      allowTaint?: boolean
      scrollX?: number
      scrollY?: number
      width?: number
      height?: number
      windowWidth?: number
      windowHeight?: number
    }
    jsPDF?: {
      unit?: string
      format?: string | number[]
      orientation?: string
    }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: Element | string): Html2Pdf
    save(): Promise<void>
  }

  function html2pdf(): Html2Pdf

  export = html2pdf
}