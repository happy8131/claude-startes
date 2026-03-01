import { AdminSidebar } from '@/components/admin/admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

// 관리자 섹션 레이아웃 - 사이드바 네비게이션 포함
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
