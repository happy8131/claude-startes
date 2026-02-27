import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Eye, Lock } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="container mx-auto flex flex-col items-center gap-8 py-24 md:py-32">
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Notion 견적서
          <br />
          <span className="text-primary">웹 뷰어</span>
        </h1>
        <p className="max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
          Notion 데이터베이스에 입력한 견적서를
          <br />
          웹 링크로 쉽게 공유하고 PDF로 다운로드하세요
        </p>
      </section>

      {/* 특징 섹션 */}
      <section className="container mx-auto py-24 md:py-32">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            주요 기능
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Eye className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>웹으로 확인</CardTitle>
              <CardDescription>
                공유 링크를 통해 견적서를 깔끔하게 표시
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>PDF 다운로드</CardTitle>
              <CardDescription>
                버튼 클릭으로 쉽게 PDF 파일로 저장
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>안전한 공유</CardTitle>
              <CardDescription>
                공유 토큰으로만 접근 가능한 안전한 링크
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="border-t bg-muted/50 py-24 md:py-32">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              사용 방법
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <CardTitle>Notion에 입력</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notion 데이터베이스에 견적서 정보를 입력하세요
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <CardTitle>공유 토큰 생성</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  고유한 공유 토큰을 할당하세요
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <CardTitle>링크 공유</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  생성된 공유 링크를 클라이언트에게 전달하세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
