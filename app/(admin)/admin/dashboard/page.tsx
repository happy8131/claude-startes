import { getInvoices } from '@/lib/notion/database'
import { InvoiceStatus } from '@/lib/types/invoice'
import { formatCurrency, formatNumber } from '@/lib/format'
import { StatCard } from '@/components/admin/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: '대시보드 - 관리자',
  description: '견적서 관리 대시보드',
}

// 상태별 배지 색상 매핑
const statusBadgeVariants = {
  pending: 'outline',
  approved: 'default',
  rejected: 'destructive',
} as const

// 상태별 아이콘 매핑
const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
} as const

// 상태별 한국어 레이블
const statusLabels = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
} as const

export default async function DashboardPage() {
  // 모든 견적서 조회
  const allInvoices = await getInvoices()

  // 상태별 통계 계산
  const pending = allInvoices.filter((inv) => inv.status === 'pending')
  const approved = allInvoices.filter((inv) => inv.status === 'approved')
  const rejected = allInvoices.filter((inv) => inv.status === 'rejected')

  // 금액 계산
  const totalAmount = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const pendingAmount = pending.reduce((sum, inv) => sum + inv.totalAmount, 0)

  // 최근 5건 (역순 정렬)
  const recentInvoices = [...allInvoices]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground mt-2">견적서 관리 시스템 현황</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 견적서"
          value={formatNumber(allInvoices.length)}
          icon={FileText}
          description="총 건수"
        />
        <StatCard
          title="대기 중"
          value={formatNumber(pending.length)}
          icon={Clock}
          color="yellow"
          description="승인 대기"
        />
        <StatCard
          title="승인됨"
          value={formatNumber(approved.length)}
          icon={CheckCircle}
          color="green"
          description="완료됨"
        />
        <StatCard
          title="거절됨"
          value={formatNumber(rejected.length)}
          icon={XCircle}
          color="red"
          description="거절됨"
        />
      </div>

      {/* 금액 통계 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <StatCard
          title="전체 금액"
          value={formatCurrency(totalAmount)}
          description="모든 견적서의 총액"
          color="green"
        />
        <StatCard
          title="대기 금액"
          value={formatCurrency(pendingAmount)}
          description="승인 대기 중인 금액"
          color="yellow"
        />
      </div>

      {/* 최근 견적서 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 견적서</CardTitle>
          <CardDescription>최근 5건의 견적서</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>견적서 번호</TableHead>
                    <TableHead>클라이언트</TableHead>
                    <TableHead>발행일</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={statusBadgeVariants[invoice.status]}
                          className="text-xs"
                        >
                          {statusLabels[invoice.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/invoices?status=${invoice.status}`}>
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
            <div className="text-center text-muted-foreground py-8">
              <p>아직 견적서가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
