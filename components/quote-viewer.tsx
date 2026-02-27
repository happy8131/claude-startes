'use client'

import { Invoice, INVOICE_STATUS_LABEL } from '@/lib/types/invoice'
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

interface InvoiceViewerProps {
  invoice: Invoice
}

/**
 * 견적서(Invoice) 표시 컴포넌트
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
export function QuoteViewer({ invoice }: InvoiceViewerProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div ref={invoiceRef} className="space-y-6 bg-white p-8 text-black">
        {/* 헤더 섹션 */}
        <div className="flex items-start justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">견적서</h1>
            <p className="text-gray-600">Notion 견적서 뷰어</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">견적서 번호</p>
            <p className="text-2xl font-bold text-blue-600">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-600">발행일</p>
            <p className="text-lg">{formatDate(new Date(invoice.issueDate))}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">유효기한</p>
            <p className="text-lg text-red-600">
              {formatDate(new Date(invoice.dueDate))}
            </p>
          </div>
        </div>

        {/* 클라이언트 정보 */}
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-600">청구 대상</p>
            <p className="text-xl font-semibold">{invoice.clientName}</p>
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
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 합계 정보 */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 border-t pt-4">
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>합계</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 비고 */}
        {invoice.notes && (
          <div className="space-y-2 border-t pt-6">
            <p className="font-semibold">비고</p>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* 상태 표시 */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">
            상태:{' '}
            <span className="font-semibold">
              {INVOICE_STATUS_LABEL[invoice.status]}
            </span>
          </p>
        </div>
      </div>

      {/* PDF 내보내기 버튼 */}
      <div className="flex justify-end">
        <PdfExport invoice={invoice} elementRef={invoiceRef} />
      </div>
    </div>
  )
}
