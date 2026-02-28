import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '@/lib/notion/client'
import { transformNotionPageToInvoice, getNumberProperty, getTextProperty } from '@/lib/notion/helpers'
import { Invoice, InvoiceItem, InvoiceStatus, INVOICE_STATUS_MAP } from '@/lib/types/invoice'

/**
 * 캐싱 전략:
 * 1. React.cache() - 단일 요청 중 중복 호출 방지 (자동 메모이제이션)
 * 2. unstable_cache() - 여러 요청 간 캐싱 (기본 60초)
 * 3. revalidateTag() - 필요시 캐시 무효화
 */

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
 * Items 페이지를 InvoiceItem으로 변환
 */
function transformNotionPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const props = page.properties

  const name = getTextProperty(props, '항목명')
  const quantity = getNumberProperty(props, '수량')
  const unitPrice = getNumberProperty(props, '단가')
  let amount = getNumberProperty(props, '금액')

  // 금액이 0이면 수량 × 단가로 자동 계산
  if (amount === 0 && quantity > 0 && unitPrice > 0) {
    amount = quantity * unitPrice
  }

  return {
    id: page.id,
    name,
    quantity,
    unitPrice,
    amount,
  }
}

/**
 * Invoice ID로 단일 견적서 조회 (내부 구현)
 *
 * Notion 페이지 ID를 사용하여 조회합니다.
 * Items 관계형 데이터베이스의 모든 항목을 함께 조회합니다.
 */
async function getInvoiceByIdImpl(invoiceId: string): Promise<Invoice | null> {
  try {
    const page = await notion.pages.retrieve({
      page_id: invoiceId,
    })

    const pageObj = page as PageObjectResponse
    const invoiceData = transformNotionPageToInvoice(pageObj)

    // Items 조회
    const items = await getInvoiceItems(invoiceData.itemIds)

    const invoice: Invoice = {
      ...invoiceData,
      items,
    }

    return invoice
  } catch (error) {
    console.error('견적서 조회 오류:', error)
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

/**
 * Item ID 목록으로 항목 조회
 *
 * 여러 Item 페이지를 병렬로 조회합니다.
 */
export async function getInvoiceItems(itemIds: string[]): Promise<InvoiceItem[]> {
  if (!itemIds.length) {
    return []
  }

  try {
    // 병렬로 모든 Item 페이지 조회
    const pagePromises = itemIds.map((id) =>
      notion.pages
        .retrieve({ page_id: id })
        .then((page) => transformNotionPageToInvoiceItem(page as PageObjectResponse))
        .catch((error) => {
          console.warn(`항목 조회 실패 (ID: ${id}):`, error)
          return null
        })
    )

    const itemsResult = await Promise.all(pagePromises)

    // null 값 필터링
    return itemsResult.filter((item): item is InvoiceItem => item !== null)
  } catch (error) {
    console.error('항목 목록 조회 오류:', error)
    return []
  }
}

/**
 * 전체 견적서 목록 조회 (내부 구현, 상태 필터 옵션)
 *
 * Notion REST API를 직접 호출하여 모든 견적서를 조회합니다.
 */
async function getInvoicesImpl(status?: InvoiceStatus): Promise<Invoice[]> {
  try {
    const databaseId = getDatabaseId()
    const apiKey = process.env.NOTION_API_KEY

    if (!apiKey) {
      throw new Error('NOTION_API_KEY 환경변수가 설정되지 않았습니다.')
    }

    // 상태 필터: TypeScript 타입(영어) → Notion 값(한국어) 변환
    const statusFilter = status
      ? Object.entries(INVOICE_STATUS_MAP).find(([_, value]) => value === status)?.[0]
      : null

    const filter = statusFilter
      ? {
          property: '상태',
          select: {
            equals: statusFilter,
          },
        }
      : undefined

    // Notion REST API 직접 호출
    const response = await fetch('https://api.notion.com/v1/databases/' + databaseId + '/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filter ? { filter } : {}),
    })

    if (!response.ok) {
      throw new Error(`Notion API 오류: ${response.statusText}`)
    }

    const data = (await response.json()) as { results?: PageObjectResponse[] }
    const results = data.results || []

    const invoices: Invoice[] = []

    for (const page of results) {
      try {
        const invoiceData = transformNotionPageToInvoice(page)

        // Items 조회
        const items = await getInvoiceItems(invoiceData.itemIds)

        const invoice: Invoice = {
          ...invoiceData,
          items,
        }

        invoices.push(invoice)
      } catch (err) {
        console.warn('견적서 변환 오류:', err)
        // 하나의 견적서 변환 실패해도 계속 진행
      }
    }

    return invoices
  } catch (error) {
    console.error('견적서 목록 조회 오류:', error)
    return []
  }
}

/**
 * 캐시된 단일 견적서 조회 (요청 중 중복 호출 방지)
 *
 * React.cache()를 사용하여 같은 요청 중 중복 호출을 방지합니다.
 * 예: 같은 페이지에서 여러 컴포넌트가 동일 ID로 조회해도 1번만 API 호출
 */
export const getInvoiceById = cache((invoiceId: string) => getInvoiceByIdImpl(invoiceId))

/**
 * 캐시된 견적서 목록 조회 (여러 요청 간 캐싱)
 *
 * unstable_cache()를 사용하여 60초간 캐싱합니다.
 * 예: 홈페이지와 목록 페이지가 동시에 로드되어도 캐시된 데이터 사용
 *
 * 캐시 무효화:
 * - 수동: import { revalidateTag } from 'next/cache'; revalidateTag('invoices')
 * - API: POST /api/revalidate?tag=invoices (Notion 웹훅 통합 시)
 */
export const getInvoices = unstable_cache(
  (status?: InvoiceStatus) => getInvoicesImpl(status),
  ['invoices'],
  {
    revalidate: 60, // 60초마다 재검증
    tags: ['invoices'], // 캐시 태그
  }
)
