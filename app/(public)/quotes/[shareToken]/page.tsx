import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getQuoteByShareToken } from '@/lib/notion/database'
import { QuoteViewer } from '@/components/quote-viewer'

interface QuotePageProps {
  params: {
    shareToken: string
  }
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata(
  { params }: QuotePageProps
): Promise<Metadata> {
  try {
    const quote = await getQuoteByShareToken(params.shareToken)

    if (!quote) {
      return {
        title: '견적서 - 찾을 수 없음',
        description: '요청한 견적서를 찾을 수 없습니다.',
      }
    }

    return {
      title: `견적서 ${quote.quoteNumber} - ${quote.clientName}`,
      description: `${quote.clientName}님의 견적서입니다. 발행일: ${quote.quoteDate}`,
      openGraph: {
        title: `견적서 ${quote.quoteNumber}`,
        description: `${quote.clientName}님의 견적서입니다.`,
        type: 'website',
      },
    }
  } catch (error) {
    console.error('메타데이터 생성 오류:', error)
    return {
      title: '견적서 - 오류',
      description: '메타데이터 생성 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 견적서 뷰 페이지
 *
 * shareToken 파라미터로 Notion 데이터베이스에서 견적서를 조회하여 표시합니다.
 * Server Component로 구성되어 API 키는 안전하게 서버에서만 사용됩니다.
 */
export default async function QuotePage({ params }: QuotePageProps) {
  // Notion에서 견적서 조회
  const quote = await getQuoteByShareToken(params.shareToken)

  // 견적서가 없으면 404 처리
  if (!quote) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <QuoteViewer quote={quote} />
      </div>
    </div>
  )
}
