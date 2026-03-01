'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Invoice, InvoiceStatus } from '@/lib/types/invoice'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface InvoiceTableProps {
  invoices: Invoice[]
}

// 상태별 배지 색상 매핑
const statusBadgeVariants = {
  pending: 'outline',
  approved: 'default',
  rejected: 'destructive',
} as const

// 상태별 한국어 레이블
const statusLabels = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
} as const

// 필터 탭 정의
const filterTabs = [
  { value: 'all', label: '전체', status: null as InvoiceStatus | null },
  { value: 'pending', label: '대기', status: 'pending' as InvoiceStatus },
  { value: 'approved', label: '승인', status: 'approved' as InvoiceStatus },
  { value: 'rejected', label: '거절', status: 'rejected' as InvoiceStatus },
]

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [activeTab, setActiveTab] = useState('all')

  // 선택된 탭에 따라 견적서 필터링
  const filteredInvoices = useMemo(() => {
    const status = filterTabs.find((tab) => tab.value === activeTab)?.status
    if (!status) {
      return invoices
    }
    return invoices.filter((inv) => inv.status === status)
  }, [invoices, activeTab])

  // 역순 정렬 (최신이 위에)
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort(
      (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    )
  }, [filteredInvoices])

  return (
    <div className="space-y-4">
      {/* 필터 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {filterTabs.map((tab) => {
            const count =
              tab.status === null
                ? invoices.length
                : invoices.filter((inv) => inv.status === tab.status).length
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>

        {filterTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {sortedInvoices.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>견적서 번호</TableHead>
                      <TableHead>클라이언트</TableHead>
                      <TableHead>발행일</TableHead>
                      <TableHead>마감일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead className="text-center">항목 수</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(invoice.dueDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusBadgeVariants[invoice.status]}
                            className="text-xs"
                          >
                            {statusLabels[invoice.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(invoice.totalAmount)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {invoice.items.length}개
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/quotes/${invoice.id}`}>
                            <Button variant="ghost" size="sm">
                              보기
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12 border rounded-lg">
                <p>해당하는 견적서가 없습니다.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
