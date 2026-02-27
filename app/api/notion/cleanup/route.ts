import { NextResponse } from 'next/server'

/**
 * POST /api/notion/cleanup
 *
 * 중복된 견적서 제거
 */
export async function POST() {
  try {
    const apiKey = process.env.NOTION_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'NOTION_API_KEY가 설정되지 않았습니다.' },
        { status: 400 }
      )
    }

    // 모든 견적서 조회
    const response = await fetch('http://localhost:3001/api/notion/quotes?list=true')
    const data = (await response.json()) as {
      success: boolean
      data?: Array<{ id: string; invoiceNumber: string; clientName: string; createdAt: string }>
    }

    if (!data.success || !data.data) {
      return NextResponse.json(
        { success: false, error: '견적서 조회 실패' },
        { status: 500 }
      )
    }

    // invoiceNumber별로 그룹화
    const grouped: Record<string, Array<{ id: string; createdAt: string }>> = {}
    data.data.forEach((invoice) => {
      if (!grouped[invoice.invoiceNumber]) {
        grouped[invoice.invoiceNumber] = []
      }
      grouped[invoice.invoiceNumber].push({
        id: invoice.id,
        createdAt: invoice.createdAt,
      })
    })

    // 중복 찾기 (같은 번호의 2번째 이후는 중복)
    const duplicates: string[] = []
    Object.entries(grouped).forEach(([num, invoices]) => {
      if (invoices.length > 1) {
        console.log(`${num}: ${invoices.length}개 발견`)
        // 가장 오래된 것 1개 제외, 나머지는 중복
        invoices.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        invoices.slice(1).forEach((inv) => {
          duplicates.push(inv.id)
          console.log(`  - 삭제 대상: ${inv.id}`)
        })
      }
    })

    if (duplicates.length === 0) {
      return NextResponse.json({
        success: true,
        message: '중복 견적서가 없습니다.',
        deletedCount: 0,
      })
    }

    console.log(`총 ${duplicates.length}개 중복 삭제 진행...`)

    // 각 중복 삭제
    const deletedIds: string[] = []
    const failedIds: Array<{ id: string; error: string }> = []

    for (const id of duplicates) {
      try {
        const deleteResponse = await fetch(`https://api.notion.com/v1/pages/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ archived: true }),
        })

        const result = (await deleteResponse.json()) as { archived?: boolean; message?: string }
        if (result.archived) {
          deletedIds.push(id)
          console.log(`✅ 삭제 완료: ${id}`)
        } else {
          failedIds.push({ id, error: result.message || '알 수 없는 오류' })
          console.log(`❌ 삭제 실패: ${id}`)
        }
      } catch (err) {
        failedIds.push({
          id,
          error: err instanceof Error ? err.message : '알 수 없는 오류',
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: '중복 제거 완료',
      deletedCount: deletedIds.length,
      failedCount: failedIds.length,
      deletedIds,
      failedIds,
    })
  } catch (error) {
    console.error('중복 제거 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}
