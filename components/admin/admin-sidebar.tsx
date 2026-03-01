'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

// 사이드바 메뉴 항목
const menuItems = [
  {
    label: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: '견적서 관리',
    href: '/admin/invoices',
    icon: FileText,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* 로고/헤더 */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">관리자</h1>
        <p className="text-xs text-muted-foreground mt-1">견적서 관리 시스템</p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 하단 버튼 */}
      <div className="p-4 border-t border-border space-y-3">
        <Link href="/" className="w-full block">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Home className="w-4 h-4" />
            공개 사이트
          </Button>
        </Link>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
