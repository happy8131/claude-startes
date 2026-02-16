import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ArrowRight, Zap, Palette, Shield, Code } from 'lucide-react'

export default function Home() {
  return (
    <MainLayout>
      {/* 히어로 섹션 */}
      <section className="container flex flex-col items-center gap-8 py-24 md:py-32">
        <Badge variant="secondary" className="mb-4">
          Next.js 16 + React 19
        </Badge>
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          모던 웹 애플리케이션
          <br />
          <span className="text-primary">스타터킷</span>
        </h1>
        <p className="max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
          Next.js, TypeScript, Tailwind CSS, shadcn/ui로 구축된
          <br />
          프로덕션 레디 스타터 템플릿
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              시작하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/components">컴포넌트 보기</Link>
          </Button>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="container py-24 md:py-32">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            주요 특징
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            빠른 개발을 위한 모든 것이 준비되어 있습니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>초고속 성능</CardTitle>
              <CardDescription>
                Next.js 16의 최신 기능과 최적화로 빠른 로딩 속도
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>아름다운 UI</CardTitle>
              <CardDescription>
                shadcn/ui와 Tailwind CSS로 세련된 디자인 시스템
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>타입 안전성</CardTitle>
              <CardDescription>
                TypeScript로 안전하고 확장 가능한 코드베이스
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>개발자 경험</CardTitle>
              <CardDescription>
                최신 개발 도구와 패턴으로 생산성 향상
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="border-t bg-muted/50 py-24 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              기술 스택
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              최신 기술로 구축된 견고한 기반
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>프레임워크</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js 16 (App Router)</li>
                  <li>• React 19</li>
                  <li>• TypeScript 5</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>스타일링</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tailwind CSS 4.0</li>
                  <li>• shadcn/ui</li>
                  <li>• Radix UI</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개발 도구</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• ESLint 9</li>
                  <li>• next-themes</li>
                  <li>• lucide-react</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
