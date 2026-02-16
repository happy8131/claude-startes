import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/lib/types'

// 샘플 사용자 데이터
const users: User[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '김영희',
    email: 'kim@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-03',
  },
  {
    id: 3,
    name: '이순신',
    email: 'lee@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-20',
  },
  {
    id: 4,
    name: '박지성',
    email: 'park@example.com',
    role: 'guest',
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    name: '최민준',
    email: 'choi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-08',
  },
]

// GET: 사용자 목록 반환
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터에서 역할 필터링 옵션 확인
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    // 역할로 필터링
    let filteredUsers = users
    if (role) {
      filteredUsers = users.filter((user) => user.role === role)
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredUsers,
        total: filteredUsers.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('사용자 조회 중 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '사용자를 조회할 수 없습니다.',
      },
      { status: 500 }
    )
  }
}

// POST: 새 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 요청 본문 검증
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: '이름과 이메일은 필수입니다.',
        },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: '올바른 이메일 형식이 아닙니다.',
        },
        { status: 400 }
      )
    }

    // 새 사용자 객체 생성
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: body.name,
      email: body.email,
      role: body.role || 'user',
      status: body.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }

    users.push(newUser)

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: '사용자가 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('사용자 생성 중 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '사용자를 생성할 수 없습니다.',
      },
      { status: 500 }
    )
  }
}
