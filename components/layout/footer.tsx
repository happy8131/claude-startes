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
            <h3 className="text-lg font-semibold">Notion 견적서 뷰어</h3>
            <p className="text-sm text-muted-foreground">
              Notion 데이터베이스의 견적서를 웹으로 확인하고 PDF로 다운로드하세요
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
            © {currentYear} Notion 견적서 뷰어. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
