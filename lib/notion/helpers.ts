import { PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { Quote, QuoteItem, Currency } from '@/lib/types/quote'

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
 * Notion Page를 Quote 타입으로 변환
 */
export function transformNotionPageToQuote(
  page: PageObjectResponse,
  shareToken: string
): Quote | null {
  try {
    const props = page.properties

    const clientName = getTextProperty(props, 'Client Name')
    const quoteNumber = getTextProperty(props, 'Quote Number')
    const quoteDate = getDateProperty(props, 'Quote Date')
    const dueDate = getDateProperty(props, 'Due Date')
    const amount = getNumberProperty(props, 'Amount')
    const currency = (getSelectProperty(props, 'Currency') || 'KRW') as Currency
    const status = getSelectProperty(props, 'Status')
    const description = getTextProperty(props, 'Description')

    // 임시 샘플 아이템 (실제 구현에서는 관계형 데이터베이스 활용)
    const items: QuoteItem[] = [
      {
        id: '1',
        name: '서비스 항목',
        quantity: 1,
        unitPrice: amount,
        subtotal: amount,
      },
    ]

    const now = new Date().toISOString()

    const quoteStatus = (status || 'draft') as Quote['status']

    const quote: Quote = {
      id: page.id,
      shareToken,
      clientName,
      quoteNumber,
      quoteDate,
      dueDate,
      items,
      subtotal: amount,
      tax: 0,
      total: amount,
      currency,
      status: quoteStatus,
      notes: description,
      createdAt: now,
      updatedAt: now,
    }

    return quote
  } catch (error) {
    console.error('견적서 변환 오류:', error)
    return null
  }
}
