# Development Guidelines for Claude Nextjs Starters

## Project Overview

**Notion 연동 견적서 뷰어 애플리케이션**

- Next.js 16 App Router 기반 풀스택 웹 애플리케이션
- Notion API를 통해 견적서 데이터 관리
- 공유 토큰 기반 공개 견적서 뷰어
- PDF 내보내기 기능
- TypeScript 5 strict 모드, Tailwind CSS 4, shadcn/ui 컴포넌트

## Project Architecture

### 디렉토리 구조 및 역할

| 경로 | 목적 | 관리 담당 |
|------|------|---------|
| `app/layout.tsx` | 루트 레이아웃 (테마 프로바이더) | 동적 변경 가능 |
| `app/page.tsx` | 홈 페이지 | 동적 변경 가능 |
| `app/quotes/[shareToken]/page.tsx` | 견적서 공개 뷰 페이지 (Server Component) | 고정 구조, 내용만 수정 |
| `app/api/notion/quotes/route.ts` | 견적서 API 엔드포인트 | 고정 구조, 로직만 수정 |
| `components/quote-viewer.tsx` | 견적서 렌더링 컴포넌트 (Client Component) | 고정 구조, 스타일/레이아웃만 수정 |
| `components/pdf-export.tsx` | PDF 내보내기 컴포넌트 | 고정 구조, 로직만 수정 |
| `components/layout/` | 레이아웃 컴포넌트 (Header, Footer, MainLayout) | 동적 변경 가능 |
| `lib/notion/client.ts` | Notion API 클라이언트 싱글톤 | 고정 패턴, 검증 로직만 수정 |
| `lib/notion/database.ts` | Notion 데이터 접근 함수 | 고정 패턴, 쿼리만 수정 |
| `lib/notion/helpers.ts` | Notion Property 변환 헬퍼 | 고정 패턴, 새로운 property 추가 가능 |
| `lib/types/quote.ts` | Quote 관련 TypeScript 타입 | 수정 필요시 API 라우트도 함께 수정 |
| `lib/format.ts` | 날짜, 금액 포맷팅 유틸리티 | 기존 함수 수정 금지, 새 함수만 추가 |

### 아키텍처 패턴

#### Server Component + Client Component 분리

```
app/quotes/[shareToken]/page.tsx (Server)
  ├─ 환경변수 접근 ✓
  ├─ Notion API 호출 ✓
  ├─ 동적 메타데이터 생성 ✓
  └─ <QuoteViewer /> (Client Component) 전달
       └─ 클라이언트 상태 관리
       └─ 인터랙션 처리
       └─ <PdfExport /> 호출
```

**핵심 규칙:**
- Notion API 호출은 **반드시** Server Component에서만 수행
- 클라이언트 컴포넌트에서는 props로 받은 데이터만 처리
- API 키는 절대 클라이언트로 노출되면 안 됨

---

## Notion 통합 표준

### 환경 변수 설정

`.env.local`에 **반드시** 설정해야 하는 변수:

```
NOTION_API_KEY=<your-notion-api-key>
NOTION_DATABASE_ID=<your-notion-database-id>
```

**주의:** 빌드 시간에 undefined 처리하기 위해 `lib/notion/client.ts`는 placeholder 사용 → 런타임에 `validateNotionConfig()` 호출하여 검증

### Notion 클라이언트 사용

**항상 싱글톤 사용:**
```typescript
import { notion, validateNotionConfig } from '@/lib/notion/client'

// Server Component에서
export default async function Page() {
  validateNotionConfig() // 런타임 검증
  const page = await notion.pages.retrieve({ page_id: 'xxx' })
}
```

**금지 사항:**
- 클라이언트에서 `new Client()` 호출 금지
- props 없이 직접 Notion 호출 금지

### Notion Property 추출 패턴

**모든 Property 추출은 `lib/notion/helpers.ts`의 함수 사용:**

```typescript
import {
  getTextProperty,
  getDateProperty,
  getNumberProperty,
  getSelectProperty,
  getRichTextContent,
} from '@/lib/notion/helpers'

const clientName = getTextProperty(props, 'Client Name')
const quoteDate = getDateProperty(props, 'Quote Date')
const amount = getNumberProperty(props, 'Amount')
const status = getSelectProperty(props, 'Status')
```

**새로운 Property 타입 추가 시:**
1. `lib/notion/helpers.ts`에 `get{PropertyType}Property()` 함수 추가
2. `lib/notion/database.ts`의 `transformNotionPageToQuote()` 함수 수정
3. `lib/types/quote.ts`에 새로운 필드 추가

---

## 코드 표준

### 기본 준수사항

전역 `CLAUDE.md` 규칙 준수:
- 변수명/함수명: **영어**
- 주석/문서: **한국어**
- 커밋 메시지: **한국어**
- 들여쓰기: **2칸**

### TypeScript 규칙

**Quote 타입 사용:**
```typescript
import { Quote, QuoteItem, QuoteStatus, Currency } from '@/lib/types/quote'

// 항상 명시적 타입 사용
const quote: Quote = { ... }
const status: QuoteStatus = 'sent'
```

**Never 타입 사용 금지:**
- `any` 대신 정확한 타입 명시
- `void`를 제외한 모든 반환값에 타입 명시

### 컴포넌트 규칙

**Server Component (기본값):**
```typescript
// app/quotes/[shareToken]/page.tsx
export default async function QuotePage({ params }: Props) {
  const quote = await getQuoteByShareToken(params.shareToken)
  return <QuoteViewer quote={quote} />
}
```

**Client Component (필요할 때만):**
```typescript
'use client'

// 클라이언트 상태, 이벤트 핸들링, 인터랙티브 UI
import { useState, useRef } from 'react'

export function QuoteViewer({ quote }: Props) { ... }
```

### 스타일링 규칙

```typescript
import { cn } from '@/lib/utils'

// 조건부 클래스 적용
className={cn(
  'base-class',
  condition && 'conditional-class',
  variant === 'large' && 'size-large'
)}

// Tailwind 유틸리티만 사용, 인라인 스타일 금지
// 색상: Tailwind 기본 팔레트 (gray, blue, red 등)
// 다크모드: dark: 프리픽스 사용
```

### 포맷팅 표준

**모든 날짜/금액 포맷팅은 `lib/format.ts` 사용:**

```typescript
import { formatDate, formatCurrency } from '@/lib/format'

formatDate(new Date(quote.quoteDate))      // "2026년 2월 19일"
formatCurrency(quote.total)                 // "₩1,500,000"
```

**새로운 포맷 함수 추가 시:**
1. `lib/format.ts`에 함수 추가 (한국어 로케일)
2. TypeScript 타입 명시
3. 한글 반환값만 사용

---

## API 응답 표준

### 성공 응답 (2xx)

```typescript
// 성공 (200)
NextResponse.json(
  {
    success: true,
    data: quote,
  },
  { status: 200 }
)
```

### 에러 응답

```typescript
// 파라미터 오류 (400)
NextResponse.json(
  {
    success: false,
    error: '파라미터 설명',
  },
  { status: 400 }
)

// 찾을 수 없음 (404)
NextResponse.json(
  {
    success: false,
    error: '리소스를 찾을 수 없습니다.',
  },
  { status: 404 }
)

// 서버 오류 (500)
NextResponse.json(
  {
    success: false,
    error: '서버 오류 메시지',
  },
  { status: 500 }
)
```

### 에러 처리

```typescript
try {
  // 로직
} catch (error) {
  console.error('동작명 오류:', error)

  // 404 감지
  if (error instanceof Error && error.message.includes('404')) {
    return null // 또는 404 응답
  }

  // 다른 에러는 재던지기
  throw error
}
```

---

## 파일 상호작용 표준

### Quote 관련 기능 추가 시 필수 수정 파일

| 파일 | 수정 사항 |
|------|---------|
| `lib/types/quote.ts` | Quote 인터페이스에 새 필드 추가 |
| `lib/notion/helpers.ts` | 새로운 Property 추출 로직 추가 |
| `lib/notion/database.ts` | 변환 함수에 새 필드 매핑 추가 |
| `components/quote-viewer.tsx` | 새 필드를 UI에 렌더링 |
| `app/api/notion/quotes/route.ts` | 필요시 응답 포맷 업데이트 |

**예시: `discount` 필드 추가**
```
1. lib/types/quote.ts: discount?: number 추가
2. lib/notion/helpers.ts: getNumberProperty() 사용
3. lib/notion/database.ts: transformNotionPageToQuote()에서 discount 추출
4. components/quote-viewer.tsx: 할인 정보 표시 UI 추가
5. app/api/notion/quotes/route.ts: 필요시 응답에 포함
```

---

## 기능 구현 표준

### 새로운 견적서 필드 추가

```typescript
// 1단계: 타입 정의 (lib/types/quote.ts)
export interface Quote {
  // 기존 필드...
  discount?: number  // 새 필드
}

// 2단계: Notion Property 매핑 (lib/notion/helpers.ts)
export function getNumberProperty(...): number { ... }

// 3단계: 변환 함수 수정 (lib/notion/database.ts)
const discount = getNumberProperty(props, 'Discount') || 0

// 4단계: UI 렌더링 (components/quote-viewer.tsx)
{quote.discount && (
  <div className="flex justify-between">
    <span>할인</span>
    <span>{formatCurrency(quote.discount)}</span>
  </div>
)}

// 5단계: 테스트
// Notion 데이터베이스에 필드 추가 후 테스트
```

### PDF 내보내기 기능 유지

- `components/pdf-export.tsx` 수정 금지 (안정성 중요)
- 새로운 필드는 자동으로 quote 객체에 포함됨
- QuoteViewer가 모든 필드를 포함하면 PDF도 자동 포함

---

## 금지 사항

| 항목 | 금지 | 이유 |
|------|------|------|
| 클라이언트에서 Notion API 호출 | ❌ | API 키 노출 위험 |
| Client Component에서 API 키 접근 | ❌ | 보안 위험 |
| API 응답 형식 변경 | ❌ | 클라이언트 호환성 |
| `lib/format.ts` 기존 함수 수정 | ❌ | 기존 코드 호환성 깨짐 |
| 예제 페이지 추가 (dashboard, forms 등) | ❌ | 프로젝트 초점 흐리기 |
| hardcoded Notion Database ID | ❌ | 환경변수 사용 필수 |
| Error throwing 없이 실패 처리 | ❌ | 디버깅 어려움 |

---

## Workflow 표준

### 견적서 데이터 플로우

```
User Request
  ↓
app/quotes/[shareToken]/page.tsx (Server)
  ├─ validateNotionConfig()
  ├─ getQuoteByShareToken(token)
  │  └─ notion.pages.retrieve()
  │  └─ transformNotionPageToQuote()
  └─ <QuoteViewer quote={quote} /> (Client)
       ├─ 렌더링
       └─ <PdfExport /> 인터랙션
```

### API 데이터 플로우

```
GET /api/notion/quotes?shareToken=xxx
  ↓
route.ts: GET()
  ├─ 파라미터 검증
  ├─ getQuoteByShareToken(shareToken)
  └─ JSON 응답 (success, data 또는 error)
```

---

## AI 의사결정 기준

### 모호한 상황에서의 판단

| 상황 | 우선순위 |
|------|---------|
| 새로운 데이터 필드 추가 | 1. 타입 정의 → 2. 헬퍼 → 3. 변환 → 4. UI → 5. API |
| Quote 렌더링 방식 변경 | `components/quote-viewer.tsx`만 수정 |
| Notion 조회 로직 변경 | `lib/notion/database.ts`만 수정 |
| 스타일 변경 | `components/quote-viewer.tsx` Tailwind 클래스 수정 |
| 새 API 엔드포인트 추가 | `/app/api/notion/[resource]/route.ts` 패턴 준수 |

### 파일 선택 기준

- **모든 페이지에 영향**: `app/layout.tsx` 수정
- **견적서 타입 영향**: `lib/types/quote.ts` 수정 (필수: 다른 5개 파일도 함께)
- **Notion 조회만**: `lib/notion/database.ts` 수정
- **UI 렌더링만**: `components/quote-viewer.tsx` 수정
- **API 응답 형식**: `app/api/notion/quotes/route.ts` 수정

---

## 설정 파일 주의사항

### 수정 금지 파일

- `tsconfig.json` (경로 별칭 변경 금지)
- `next.config.ts` (기본값 유지)
- `components.json` (shadcn/ui 설정)
- `.mcp.json` (MCP 서버 설정)

### 수정 가능 파일

- `package.json` (새 라이브러리 추가만, 기존 라이브러리 버전 변경 금지)
- `.env.local` (개발 환경변수만)

---

## 요약: AI가 알아야 할 것

1. **Notion API는 Server Component에서만** - 절대 클라이언트에서 호출 금지
2. **타입 정의가 변경되면 5개 파일 함께 수정** - database.ts, helpers.ts, quote.ts, quote-viewer.tsx, api route
3. **API 응답은 `{ success, data/error }` 형식** - 다른 형식 금지
4. **포맷팅은 lib/format.ts 사용** - 하드코딩 금지
5. **환경변수는 .env.local에** - 하드코딩 금지
6. **에러는 console.error 후 throw 또는 API 응답** - 조용히 실패 금지
7. **Server ↔ Client 경계 명확** - 'use client'는 필요할 때만
8. **예제 페이지/기능 추가 금지** - 프로젝트 초점 유지
