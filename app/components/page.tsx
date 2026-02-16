import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Check, X, AlertCircle } from 'lucide-react'

export default function ComponentsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">컴포넌트 쇼케이스</h1>
          <p className="text-muted-foreground">
            shadcn/ui 컴포넌트 라이브러리 예제
          </p>
        </div>

        <div className="space-y-8">
          {/* 버튼 */}
          <Card>
            <CardHeader>
              <CardTitle>버튼</CardTitle>
              <CardDescription>다양한 스타일의 버튼 컴포넌트</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>기본 버튼</Button>
                <Button variant="secondary">보조 버튼</Button>
                <Button variant="outline">아웃라인 버튼</Button>
                <Button variant="ghost">고스트 버튼</Button>
                <Button variant="destructive">삭제 버튼</Button>
                <Button variant="link">링크 버튼</Button>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-4">
                <Button size="sm">작은 크기</Button>
                <Button size="default">기본 크기</Button>
                <Button size="lg">큰 크기</Button>
                <Button size="icon">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 배지 */}
          <Card>
            <CardHeader>
              <CardTitle>배지</CardTitle>
              <CardDescription>상태 표시 배지</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge>기본</Badge>
                <Badge variant="secondary">보조</Badge>
                <Badge variant="outline">아웃라인</Badge>
                <Badge variant="destructive">삭제</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 입력 필드 */}
          <Card>
            <CardHeader>
              <CardTitle>입력 필드</CardTitle>
              <CardDescription>폼 입력 컴포넌트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">알림 수신</Label>
              </div>
            </CardContent>
          </Card>

          {/* 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>카드</CardTitle>
              <CardDescription>콘텐츠 컨테이너</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Check className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle className="text-lg">성공</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      작업이 성공적으로 완료되었습니다.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <X className="h-8 w-8 text-red-500 mb-2" />
                    <CardTitle className="text-lg">오류</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      작업 중 오류가 발생했습니다.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                    <CardTitle className="text-lg">경고</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      주의가 필요한 항목이 있습니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
