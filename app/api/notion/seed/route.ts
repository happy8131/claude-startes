import { NextResponse } from 'next/server'

/**
 * POST /api/notion/seed
 *
 * Notion 데이터베이스에 샘플 견적서 데이터 생성
 *
 * 주의: 개발 목적으로만 사용하세요.
 */
export async function POST() {
  try {
    const apiKey = process.env.NOTION_API_KEY
    const invoiceDatabaseId = process.env.NOTION_DATABASE_ID
    const itemsDatabaseId = '31485627029d8023bb07eebc76d6c665' // Items 데이터베이스 ID

    if (!apiKey || !invoiceDatabaseId) {
      return NextResponse.json(
        { success: false, error: 'Notion 환경변수가 없습니다.' },
        { status: 400 }
      )
    }

    console.log('🌱 샘플 데이터 생성 시작...')

    // 1. Items 생성 (3개)
    const items = [
      { name: '웹사이트 디자인', quantity: 1, unitPrice: 300000 },
      { name: '로고 제작', quantity: 2, unitPrice: 50000 },
      { name: '명함 디자인', quantity: 100, unitPrice: 10000 },
    ]

    const itemIds: string[] = []

    for (const item of items) {
      const itemProperties: Record<string, unknown> = {
        '항목명': {
          title: [{ text: { content: item.name } }],
        },
        '수량': {
          number: item.quantity,
        },
        '단가': {
          number: item.unitPrice,
        },
        '금액': {
          number: item.quantity * item.unitPrice,
        },
      }

      const itemResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { database_id: itemsDatabaseId },
          properties: itemProperties,
        }),
      })

      const itemData = (await itemResponse.json()) as { id?: string; message?: string }
      if (itemData.id) {
        itemIds.push(itemData.id)
        console.log(`✅ Item 생성: ${item.name}`)
      } else {
        console.warn(`⚠️  Item 생성 실패: ${item.name}`, itemData.message)
      }
    }

    // 2. Invoice 생성
    const invoiceProperties: Record<string, unknown> = {
      '견적서 번호': {
        title: [{ text: { content: 'INV-2026-002' } }],
      },
      '클라이언트 이름': {
        rich_text: [{ text: { content: 'XYZ 디자인' } }],
      },
      '발행일': {
        date: { start: new Date().toISOString().split('T')[0] },
      },
      '유효기간': {
        date: {
          start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      },
      '총금액': {
        number: 1450000,
      },
      '항목': {
        relation: itemIds.map((id) => ({ id })),
      },
    }

    const invoiceResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: invoiceDatabaseId },
        properties: invoiceProperties,
      }),
    })

    const invoiceData = (await invoiceResponse.json()) as { id?: string; message?: string }

    if (!invoiceData.id) {
      return NextResponse.json(
        {
          success: false,
          error: invoiceData.message || 'Invoice 생성 실패',
        },
        { status: 500 }
      )
    }

    console.log(`✅ Invoice 생성 완료: ${invoiceData.id}`)

    return NextResponse.json(
      {
        success: true,
        message: '샘플 데이터가 성공적으로 생성되었습니다!',
        invoice: {
          id: invoiceData.id,
          number: 'INV-2026-002',
          itemCount: itemIds.length,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ 데이터 생성 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}
