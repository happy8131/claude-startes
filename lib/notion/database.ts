import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '@/lib/notion/client'
import { transformNotionPageToQuote } from '@/lib/notion/helpers'
import { Quote } from '@/lib/types/quote'

/**
 * 데이터베이스 ID 확인
 */
function getDatabaseId(): string {
  const dbId = process.env.NOTION_DATABASE_ID
  if (!dbId) {
    throw new Error('NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.')
  }
  return dbId
}

/**
 * shareToken으로 견적서 조회
 *
 * 주의: Notion SDK 버전에 따라 query() 메서드가 없을 수 있습니다.
 * 이 경우 관리자가 직접 Notion에서 shareToken을 관리하고
 * notion.pages.retrieve()로 특정 페이지를 조회해야 합니다.
 */
export async function getQuoteByShareToken(
  shareToken: string
): Promise<Quote | null> {
  try {
    // 주의: notion.databases에 query 메서드가 없는 경우,
    // 다음 중 하나를 구현해야 합니다:
    // 1. shareToken을 페이지 ID로 직접 사용
    // 2. Notion 페이지의 공개 URL에서 ID 추출
    // 3. 관리자가 유지하는 매핑 테이블 사용

    // 현재 구현: shareToken을 Notion 페이지 ID로 간주
    const page = await notion.pages.retrieve({
      page_id: shareToken,
    })

    const pageObj = page as PageObjectResponse
    const quote = transformNotionPageToQuote(pageObj, shareToken)

    return quote
  } catch (error) {
    console.error('견적서 조회 오류:', error)
    // 페이지를 찾을 수 없으면 null 반환
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

/**
 * 전체 견적서 목록 조회
 *
 * 주의: Notion SDK의 query() 메서드가 없는 경우 이 함수는 사용할 수 없습니다.
 */
export async function getQuotes(status?: string): Promise<Quote[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notion_any = notion as any

    // notion.databases.query가 존재하는지 확인
    if (!notion_any.databases?.query) {
      console.warn('notion.databases.query는 사용할 수 없습니다.')
      return []
    }

    const databaseId = getDatabaseId()

    const filter: { property: string; select: { equals: string } } | undefined =
      status
        ? {
            property: 'Status',
            select: {
              equals: status,
            },
          }
        : undefined

    const response = await notion_any.databases.query({
      database_id: databaseId,
      ...(filter && { filter }),
    })

    const quotes: Quote[] = []

    for (const page of response.results) {
      const pageObj = page as PageObjectResponse
      // 실제 페이지마다 고유한 shareToken이 필요
      const shareTokenProp = pageObj.properties['Share Token']
      let shareToken = pageObj.id
      if (shareTokenProp && shareTokenProp.type === 'rich_text' && 'rich_text' in shareTokenProp) {
        const firstText = shareTokenProp.rich_text?.[0]
        if (firstText && 'text' in firstText && firstText.text) {
          shareToken = firstText.text.content
        }
      }
      const quote = transformNotionPageToQuote(pageObj, shareToken)
      if (quote) {
        quotes.push(quote)
      }
    }

    return quotes
  } catch (error) {
    console.error('견적서 목록 조회 오류:', error)
    throw error
  }
}
