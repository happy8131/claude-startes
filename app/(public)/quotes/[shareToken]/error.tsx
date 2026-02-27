'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 에러 바운더리 페이지
 *
 * 견적서 페이지에서 발생한 에러를 처리합니다.
 * 'use client' 지시어는 필수입니다 (에러 바운더리는 클라이언트 컴포넌트).
 */
export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-red-600">오류 발생</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          견적서를 불러올 수 없습니다
        </h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-left">
        <p className="text-sm text-gray-600 font-mono">
          {error.message || 'Unknown error'}
        </p>
      </div>

      <p className="text-gray-600 max-w-md">
        일시적인 오류가 발생했습니다. 다시 시도하거나 나중에 다시 접속해주세요.
      </p>

      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          다시 시도
        </Button>
        <Link href="/">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  )
}
