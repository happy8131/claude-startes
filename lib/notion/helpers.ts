import { PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { Invoice, InvoiceItem, InvoiceStatus, INVOICE_STATUS_MAP, Currency } from '@/lib/types/invoice'

type PropertyItem = Record<string, unknown>

/**
 * Notion Rich Text 배열을 문자열로 변환
 */
export function getRichTextContent(richText: RichTextItemResponse[]): string {
  return richText
    .filter((block) => block.type === 'text' && 'text' in block)
    .map((block) => {
      if (block.type === 'text' && 'text' in block) {
        return block.text.content
      }
      return ''
    })
    .join('')
}

/**
 * Notion Properties에서 숫자 값 추출
 */
export function getNumberProperty(
  properties: Record<string, PropertyItem>,
  key: string
): number {
  const prop = properties[key]
  if (!prop || prop.type !== 'number') return 0
  if (prop.type === 'number' && 'number' in prop && prop.number) {
    return prop.number as number
  }
  return 0
}

/**
 * Notion Properties에서 텍스트 값 추출
 */
export function getTextProperty(
  properties: Record<string, PropertyItem>,
  key: string
): string {
  const prop = properties[key]
  if (!prop) return ''

  if (prop.type === 'title' && 'title' in prop) {
    const title = (prop.title as RichTextItemResponse[]) || []
    return getRichTextContent(title)
  }

  if (prop.type === 'rich_text' && 'rich_text' in prop) {
    const richText = (prop.rich_text as RichTextItemResponse[]) || []
    return getRichTextContent(richText)
  }

  return ''
}

/**
 * Notion Properties에서 날짜 값 추출
 */
export function getDateProperty(
  properties: Record<string, PropertyItem>,
  key: string
): string {
  const prop = properties[key]
  if (!prop || prop.type !== 'date') return ''
  if (prop.type === 'date' && 'date' in prop && prop.date) {
    const date = prop.date as { start?: string }
    return date.start || ''
  }
  return ''
}

/**
 * Notion Properties에서 선택 값 추출
 */
export function getSelectProperty(
  properties: Record<string, PropertyItem>,
  key: string
): string {
  const prop = properties[key]
  if (!prop || prop.type !== 'select') return ''
  if (prop.type === 'select' && 'select' in prop && prop.select) {
    const select = prop.select as { name?: string }
    return select.name || ''
  }
  return ''
}

/**
 * Notion Properties에서 Relation (관계) 값 추출
 * 관계형 DB의 페이지 ID 목록 반환
 */
export function getRelationProperty(
  properties: Record<string, PropertyItem>,
  key: string
): Array<{ id: string }> {
  const prop = properties[key]
  if (!prop || prop.type !== 'relation') return []
  if (prop.type === 'relation' && 'relation' in prop && Array.isArray(prop.relation)) {
    return (prop.relation as Array<{ id?: string }>)
      .filter((item) => item.id)
      .map((item) => ({ id: item.id as string }))
  }
  return []
}

/**
 * Notion Invoice 페이지를 Invoice 타입으로 변환
 *
 * 한국어 속성명을 사용하며, Items 관계형 DB의 ID만 추출합니다.
 * 실제 Item 데이터 조회는 getInvoiceItems() 함수에서 수행합니다.
 */
export function transformNotionPageToInvoice(
  page: PageObjectResponse
): Omit<Invoice, 'items'> & { itemIds: string[] } {
  const props = page.properties

  // 한국어 속성명 사용
  const invoiceNumber = getTextProperty(props, '견적서 번호')
  const clientName = getTextProperty(props, '클라이언트 이름')
  const issueDate = getDateProperty(props, '발행일')
  const dueDate = getDateProperty(props, '유효기간')
  const totalAmount = getNumberProperty(props, '총금액')
  const statusText = getSelectProperty(props, '상태')
  const notes = getTextProperty(props, '비고')

  // 상태값 매핑: 한국어 → 영어
  const status = (INVOICE_STATUS_MAP[statusText] || 'pending') as InvoiceStatus
  const currency = 'KRW' as Currency

  // Items 관계형 DB에서 ID 목록 추출
  const itemRelations = getRelationProperty(props, '항목')
  const itemIds = itemRelations.map((rel) => rel.id)

  const now = new Date().toISOString()

  return {
    id: page.id,
    invoiceNumber,
    clientName,
    issueDate,
    dueDate,
    status,
    totalAmount,
    currency,
    notes,
    createdAt: now,
    updatedAt: now,
    itemIds, // 실제 items는 database.ts에서 조회
  }
}
