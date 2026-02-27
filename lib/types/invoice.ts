/**
 * Invoice (견적서) 관련 타입 정의
 * Notion Invoice Database와 Items Database 스키마에 기반함
 */

export type InvoiceStatus = 'pending' | 'rejected' | 'approved'
export type Currency = 'KRW' | 'USD' | 'EUR' | 'JPY'

/**
 * 발주 항목
 */
export interface InvoiceItem {
  id: string           // Notion 페이지 ID
  name: string         // 항목명
  quantity: number     // 수량
  unitPrice: number    // 단가
  amount: number       // 금액 (수량 × 단가)
}

/**
 * 견적서 메인 데이터
 */
export interface Invoice {
  id: string              // Notion 페이지 ID (invoiceNumber와 다름)
  invoiceNumber: string   // 견적서 번호 (예: INV-2025-001)
  clientName: string      // 클라이언트 이름
  issueDate: string       // 발행일 (ISO 8601 형식)
  dueDate: string         // 유효기간/마감일 (ISO 8601 형식)
  status: InvoiceStatus   // 상태 (pending/rejected/approved)
  totalAmount: number     // 총금액
  currency: Currency      // 통화 (기본값: KRW)
  items: InvoiceItem[]    // 항목 목록
  notes?: string          // 비고 (선택사항)
  createdAt: string       // 생성일시 (ISO 8601)
  updatedAt: string       // 수정일시 (ISO 8601)
}

/**
 * Notion API 응답 구조
 */
export interface NotionInvoiceResponse {
  success: boolean
  data?: Invoice
  error?: string
}

/**
 * Notion 상태 값(한국어) → TypeScript 타입(영어) 매핑
 */
export const INVOICE_STATUS_MAP: Record<string, InvoiceStatus> = {
  '대기': 'pending',
  '거절': 'rejected',
  '승인': 'approved',
}

/**
 * TypeScript 타입(영어) → 표시용 레이블(한국어) 매핑
 */
export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: '대기',
  rejected: '거절',
  approved: '승인',
}
