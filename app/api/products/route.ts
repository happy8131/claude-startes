import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/types'

// 샘플 제품 데이터
const products: Product[] = [
  {
    id: 1,
    name: '노트북',
    category: '전자제품',
    price: 1500000,
    stock: 25,
  },
  {
    id: 2,
    name: '마우스',
    category: '액세서리',
    price: 35000,
    stock: 150,
  },
  {
    id: 3,
    name: '키보드',
    category: '액세서리',
    price: 120000,
    stock: 85,
  },
  {
    id: 4,
    name: '모니터',
    category: '전자제품',
    price: 450000,
    stock: 12,
  },
  {
    id: 5,
    name: '웹캠',
    category: '액세서리',
    price: 80000,
    stock: 45,
  },
]

// GET: 제품 목록 반환
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터에서 카테고리 필터링 옵션 확인
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // 카테고리로 필터링
    let filteredProducts = products
    if (category) {
      filteredProducts = products.filter(
        (product) => product.category === category
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredProducts,
        total: filteredProducts.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('제품 조회 중 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '제품을 조회할 수 없습니다.',
      },
      { status: 500 }
    )
  }
}

// POST: 새 제품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 요청 본문 검증
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        {
          success: false,
          error: '제품명, 카테고리, 가격은 필수입니다.',
        },
        { status: 400 }
      )
    }

    // 가격 검증
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: '가격은 0 이상의 숫자여야 합니다.',
        },
        { status: 400 }
      )
    }

    // 새 제품 객체 생성
    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock || 0,
    }

    products.push(newProduct)

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: '제품이 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('제품 생성 중 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '제품을 생성할 수 없습니다.',
      },
      { status: 500 }
    )
  }
}
