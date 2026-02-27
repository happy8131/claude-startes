'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/format'
import { INVOICE_STATUS_LABEL } from '@/lib/types/invoice'
import type { Invoice } from '@/lib/types/invoice'
import { ChevronRight } from 'lucide-react'

/**
 * 견적서 목록 페이지
 *
 * Notion 데이터베이스의 모든 견적서를 리스트로 표시합니다.
 */
export default function QuotesListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/notion/quotes?list=true')
        const data = (await response.json()) as { success: boolean; data?: Invoice[]; error?: string }

        if (!data.success || !data.data) {
          setError(data.error || '견적서를 불러올 수 없습니다.')
          return
        }

        setInvoices(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">견적서 목록</h1>
          <p className="text-gray-600">Notion에 저장된 모든 견적서를 확인하세요.</p>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">견적서를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">오류: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && invoices.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">견적서가 없습니다.</p>
            </CardContent>
          </Card>
        )}

        {/* 견적서 목록 */}
        {!isLoading && !error && invoices.length > 0 && (
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Link key={invoice.id} href={`/quotes/${invoice.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {invoice.invoiceNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-2">
                          {invoice.clientName}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{INVOICE_STATUS_LABEL[invoice.status]}</Badge>
                          <span className="text-xs text-gray-500">
                            발행일: {formatDate(new Date(invoice.issueDate))}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">금액</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(
                            invoice.items.reduce((sum, item) => sum + item.amount, 0)
                          )}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 총 개수 */}
        {!isLoading && !error && invoices.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            총 {invoices.length}개의 견적서
          </div>
        )}
      </div>
    </div>
  )
}
