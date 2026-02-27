import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '@/lib/notion/client'
import { transformNotionPageToInvoice, getNumberProperty, getTextProperty } from '@/lib/notion/helpers'
import { Invoice, InvoiceItem, InvoiceStatus, INVOICE_STATUS_MAP } from '@/lib/types/invoice'

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
 * Invoice ID로 단일 견적서 조회
 *
 * Notion 페이지 ID를 사용하여 조회합니다.
 * Items 관계형 데이터베이스의 모든 항목을 함께 조회합니다.
 */
export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
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
 * 전체 견적서 목록 조회 (상태 필터 옵션)
 *
 * Notion REST API를 직접 호출하여 모든 견적서를 조회합니다.
 */
export async function getInvoices(status?: InvoiceStatus): Promise<Invoice[]> {
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
