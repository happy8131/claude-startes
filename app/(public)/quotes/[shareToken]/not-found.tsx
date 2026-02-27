import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 커스텀 404 페이지
 *
 * 유효하지 않은 shareToken으로 접근했을 때 표시됩니다.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          견적서를 찾을 수 없습니다
        </h2>
      </div>

      <p className="text-gray-600 max-w-md">
        요청하신 견적서가 존재하지 않습니다. 공유 링크가 만료되었거나 잘못된 링크일 수
        있습니다.
      </p>

      <Link href="/">
        <Button size="lg">홈으로 돌아가기</Button>
      </Link>
    </div>
  )
}
