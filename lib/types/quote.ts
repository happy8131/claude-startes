/**
 * 견적서 관련 TypeScript 타입 정의
 */

/**
 * 견적서 품목 인터페이스
 */
export interface QuoteItem {
  // 품목 고유 ID
  id: string
  // 품목명
  name: string
  // 상세 설명
  description?: string
  // 수량
  quantity: number
  // 단가
  unitPrice: number
  // 소계 (수량 * 단가)
  subtotal: number
}

/**
 * 통화 타입
 */
export type Currency = 'KRW' | 'USD' | 'EUR' | 'JPY'

/**
 * 견적서 상태
 */
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

/**
 * 견적서 전체 인터페이스
 */
export interface Quote {
  // Notion 페이지 ID (고유 식별자)
  id: string
  // 공유 토큰 (URL에 사용)
  shareToken: string
  // 클라이언트 이름
  clientName: string
  // 견적서 번호
  quoteNumber: string
  // 견적 발행일
  quoteDate: string
  // 유효 기한
  dueDate: string
  // 견적 품목 목록
  items: QuoteItem[]
  // 전체 금액 (세금 제외)
  subtotal: number
  // 세금액
  tax?: number
  // 최종 총액
  total: number
  // 통화
  currency: Currency
  // 견적서 상태
  status: QuoteStatus
  // 추가 메모/설명
  notes?: string
  // 생성일 (ISO 형식)
  createdAt: string
  // 수정일 (ISO 형식)
  updatedAt: string
}

/**
 * Notion API 응답 타입
 */
export interface NotionQuoteResponse {
  success: boolean
  data?: Quote
  error?: string
}
