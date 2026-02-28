import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 캐시 무효화 API 엔드포인트
 *
 * Notion 웹훅이나 외부 트리거에서 호출하여 캐시를 무효화할 수 있습니다.
 *
 * 사용 예:
 * - GET /api/revalidate?tag=invoices
 * - POST /api/revalidate { "tag": "invoices" }
 *
 * 보안: 환경변수 REVALIDATE_SECRET으로 인증 (권장사항)
 */
export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json(
      { success: false, error: '캐시 태그를 지정해주세요. (?tag=invoices)' },
      { status: 400 }
    )
  }

  try {
    // 선택사항: 시크릿 검증 (보안 강화)
    const secret = request.nextUrl.searchParams.get('secret')
    const revalidateSecret = process.env.REVALIDATE_SECRET

    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { success: false, error: '인증 실패' },
        { status: 401 }
      )
    }

    // 캐시 무효화
    revalidateTag(tag)

    return NextResponse.json(
      { success: true, message: `캐시 무효화 완료: ${tag}` },
      { status: 200 }
    )
  } catch (error) {
    console.error('캐시 무효화 오류:', error)
    return NextResponse.json(
      { success: false, error: '캐시 무효화 중 오류 발생' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { tag?: string; secret?: string }
    const { tag, secret } = body

    if (!tag) {
      return NextResponse.json(
        { success: false, error: '캐시 태그를 지정해주세요.' },
        { status: 400 }
      )
    }

    // 선택사항: 시크릿 검증
    const revalidateSecret = process.env.REVALIDATE_SECRET

    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { success: false, error: '인증 실패' },
        { status: 401 }
      )
    }

    // 캐시 무효화
    revalidateTag(tag)

    return NextResponse.json(
      { success: true, message: `캐시 무효화 완료: ${tag}` },
      { status: 200 }
    )
  } catch (error) {
    console.error('캐시 무효화 오류:', error)
    return NextResponse.json(
      { success: false, error: '캐시 무효화 중 오류 발생' },
      { status: 500 }
    )
  }
}
