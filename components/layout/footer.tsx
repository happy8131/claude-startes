import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Next.js 스타터킷</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 16, TypeScript, Tailwind CSS로 구축된 모던 웹 애플리케이션 스타터킷
            </p>
          </div>

          {/* 링크 섹션 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">페이지</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  대시보드
                </Link>
              </li>
              <li>
                <Link href="/components" className="text-muted-foreground hover:text-foreground">
                  컴포넌트
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">리소스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://nextjs.org/docs" target="_blank" className="text-muted-foreground hover:text-foreground">
                  Next.js 문서
                </Link>
              </li>
              <li>
                <Link href="https://ui.shadcn.com" target="_blank" className="text-muted-foreground hover:text-foreground">
                  shadcn/ui
                </Link>
              </li>
              <li>
                <Link href="https://tailwindcss.com" target="_blank" className="text-muted-foreground hover:text-foreground">
                  Tailwind CSS
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">기술 스택</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js 16</li>
              <li>React 19</li>
              <li>TypeScript 5</li>
              <li>Tailwind CSS 4</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Next.js 스타터킷. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
