import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceById, getInvoices } from '@/lib/notion/database'
import { validateNotionConfig } from '@/lib/notion/client'

/**
 * GET /api/notion/quotes
 *
 * Notion 데이터베이스에서 견적서 데이터 조회
 *
 * Query Parameters:
 * - id: Notion 페이지 ID (개별 조회)
 * - list: "true" (전체 목록 조회)
 *
 * Response:
 * - 200: 견적서 데이터 또는 목록
 * - 400: 파라미터 누락
 * - 404: 견적서 없음
 * - 500: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    // Notion 환경변수 검증
    validateNotionConfig()

    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('id')
    const listParam = searchParams.get('list')

    // 전체 목록 조회
    if (listParam === 'true') {
      const invoices = await getInvoices()

      return NextResponse.json(
        {
          success: true,
          data: invoices,
        },
        { status: 200 }
      )
    }

    // 개별 견적서 조회 - 파라미터 확인
    if (!invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'id 파라미터 또는 list=true 파라미터가 필요합니다.',
        },
        { status: 400 }
      )
    }

    // Notion 데이터베이스에서 견적서 조회
    const invoice = await getInvoiceById(invoiceId)

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: '견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API 오류:', error)

    return NextResponse.json(
      {
        success: false,
        error: '견적서 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
