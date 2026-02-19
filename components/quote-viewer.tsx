'use client'

import { Quote } from '@/lib/types/quote'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatCurrency } from '@/lib/format'
import { PdfExport } from '@/components/pdf-export'
import { useRef } from 'react'

interface QuoteViewerProps {
  quote: Quote
}

/**
 * 견적서 표시 컴포넌트
 *
 * 다음 정보를 표시합니다:
 * - 헤더 (회사 정보, 견적서 번호, 날짜)
 * - 클라이언트 정보
 * - 품목 테이블
 * - 합계 정보
 * - PDF 다운로드 버튼
 *
 * 'use client' 컴포넌트로 클라이언트에서 실행됩니다.
 */
export function QuoteViewer({ quote }: QuoteViewerProps) {
  const quoteRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div ref={quoteRef} className="space-y-6 bg-white p-8 text-black">
        {/* 헤더 섹션 */}
        <div className="flex items-start justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">견적서</h1>
            <p className="text-gray-600">Notion 견적서 뷰어</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">견적서 번호</p>
            <p className="text-2xl font-bold text-blue-600">
              {quote.quoteNumber}
            </p>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-600">발행일</p>
            <p className="text-lg">{formatDate(new Date(quote.quoteDate))}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">유효기한</p>
            <p className="text-lg text-red-600">
              {formatDate(new Date(quote.dueDate))}
            </p>
          </div>
        </div>

        {/* 클라이언트 정보 */}
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-600">청구 대상</p>
            <p className="text-xl font-semibold">{quote.clientName}</p>
          </div>
        </div>

        {/* 품목 테이블 */}
        <div className="space-y-4">
          <h2 className="font-semibold">견적 품목</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>품목명</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">소계</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 합계 정보 */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>소계</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            {quote.tax && quote.tax > 0 && (
              <div className="flex justify-between">
                <span>세금</span>
                <span>{formatCurrency(quote.tax)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>합계</span>
              <span>{formatCurrency(quote.total)}</span>
            </div>
          </div>
        </div>

        {/* 메모 */}
        {quote.notes && (
          <div className="space-y-2 border-t pt-6">
            <p className="font-semibold">메모</p>
            <p className="text-gray-700">{quote.notes}</p>
          </div>
        )}

        {/* 상태 표시 */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">
            상태:{' '}
            <span className="font-semibold capitalize">
              {getStatusLabel(quote.status)}
            </span>
          </p>
        </div>
      </div>

      {/* PDF 내보내기 버튼 */}
      <div className="flex justify-end">
        <PdfExport quote={quote} elementRef={quoteRef} />
      </div>
    </div>
  )
}

/**
 * 견적서 상태를 한국어로 변환
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: '임시저장',
    sent: '발송',
    accepted: '수락',
    rejected: '거절',
    expired: '만료',
  }
  return labels[status] || status
}
