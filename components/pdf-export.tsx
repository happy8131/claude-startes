'use client'

import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'
import { Invoice } from '@/lib/types/invoice'
import { useState } from 'react'

interface PdfExportProps {
  invoice: Invoice
  elementRef: React.RefObject<HTMLDivElement | null>
}

/**
 * PDF 내보내기 버튼 컴포넌트
 *
 * HTML 요소를 PDF로 변환 후 다운로드합니다.
 * 'use client' 컴포넌트로 브라우저에서만 실행됩니다.
 *
 * html2pdf.js를 사용하여 PDF 변환 기능을 제공합니다.
 */
export function PdfExport({ invoice, elementRef }: PdfExportProps) {
  const mounted = useMounted()
  const [isLoading, setIsLoading] = useState(false)

  if (!mounted) {
    return null
  }

  const handlePdfExport = async () => {
    if (!elementRef.current) {
      console.error('PDF 내보낼 요소를 찾을 수 없습니다.')
      return
    }

    setIsLoading(true)

    try {
      // html2pdf.js를 동적으로 로드
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js')) as any
      const doc = html2pdf.default

      // PDF 옵션 설정
      const opt = {
        margin: 10,
        filename: `견적서_${invoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      }

      // HTML을 PDF로 변환하여 다운로드
      doc()
        .set(opt)
        .from(elementRef.current)
        .save()
    } catch (error) {
      console.error('PDF 생성 오류:', error)
      alert('PDF 다운로드에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePdfExport}
      disabled={isLoading}
      variant="default"
    >
      {isLoading ? 'PDF 생성 중...' : 'PDF 다운로드'}
    </Button>
  )
}
