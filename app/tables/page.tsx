import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TablesPage() {
  // 샘플 사용자 데이터
  const users = [
    {
      id: 1,
      name: '홍길동',
      email: 'hong@example.com',
      role: '관리자',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: '김영희',
      email: 'kim@example.com',
      role: '사용자',
      status: 'active',
      createdAt: '2024-02-03',
    },
    {
      id: 3,
      name: '이순신',
      email: 'lee@example.com',
      role: '사용자',
      status: 'inactive',
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      name: '박지성',
      email: 'park@example.com',
      role: '게스트',
      status: 'active',
      createdAt: '2024-02-10',
    },
    {
      id: 5,
      name: '최민준',
      email: 'choi@example.com',
      role: '사용자',
      status: 'active',
      createdAt: '2024-02-08',
    },
  ]

  // 샘플 제품 데이터
  const products = [
    {
      id: 1,
      name: '노트북',
      category: '전자제품',
      price: '1,500,000',
      stock: 25,
    },
    {
      id: 2,
      name: '마우스',
      category: '액세서리',
      price: '35,000',
      stock: 150,
    },
    {
      id: 3,
      name: '키보드',
      category: '액세서리',
      price: '120,000',
      stock: 85,
    },
    {
      id: 4,
      name: '모니터',
      category: '전자제품',
      price: '450,000',
      stock: 12,
    },
    {
      id: 5,
      name: '웹캠',
      category: '액세서리',
      price: '80,000',
      stock: 45,
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">테이블/리스트</h1>
          <p className="text-muted-foreground">
            shadcn/ui 테이블 컴포넌트 예제
          </p>
        </div>

        <div className="space-y-8">
          {/* 사용자 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 목록</CardTitle>
              <CardDescription>
                등록된 사용자 정보
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>가입일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {user.status === 'active' ? '활성' : '비활성'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 제품 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>제품 목록</CardTitle>
              <CardDescription>
                판매 중인 제품 정보
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>재고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.id}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.stock > 50
                                ? 'default'
                                : product.stock > 0
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {product.stock}개
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
