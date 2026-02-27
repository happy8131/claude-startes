import { MainLayout } from '@/components/layout/main-layout'

interface PublicLayoutProps {
  children: React.ReactNode
}

// 공개 섹션 레이아웃 - Header와 Footer가 자동으로 적용됨
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
