import { getInvoices } from '@/lib/notion/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoiceTable } from '@/components/admin/invoice-table'

export const metadata = {
  title: '견적서 관리 - 관리자',
  description: '모든 견적서 조회 및 관리',
}

export default async function InvoicesPage() {
  // 모든 견적서 조회
  const invoices = await getInvoices()

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">견적서 관리</h1>
        <p className="text-muted-foreground mt-2">모든 견적서 조회 및 상태 관리</p>
      </div>

      {/* 견적서 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>견적서 목록</CardTitle>
          <CardDescription>
            총 {invoices.length}건의 견적서
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}
