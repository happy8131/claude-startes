import { Skeleton } from '@/components/ui/skeleton'

/**
 * 견적서 페이지 로딩 상태 표시
 *
 * Skeleton 컴포넌트를 사용하여 견적서와 동일한 구조의 로딩 UI 표시
 */
export default function QuoteLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-white p-8 text-black">
        {/* 헤더 섹션 스켈레톤 */}
        <div className="flex items-start justify-between border-b pb-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* 날짜 정보 스켈레톤 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* 클라이언트 정보 스켈레톤 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-48" />
          </div>
        </div>

        {/* 품목 테이블 스켈레톤 */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2 border rounded-md overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
            {/* 테이블 행 3개 */}
            {[1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 border-b p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* 합계 정보 스켈레톤 */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 border-t pt-4">
            <div className="flex justify-between pt-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 스켈레톤 */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
