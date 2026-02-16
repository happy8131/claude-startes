# Next.js 모던 웹 스타터킷

Next.js 16, TypeScript, Tailwind CSS, shadcn/ui로 구축된 프로덕션 레디 모던 웹 애플리케이션 스타터킷입니다.

빠르게 웹 개발을 시작할 수 있도록 완성도 높은 UI 컴포넌트, 레이아웃, 그리고 다양한 예제를 제공합니다.

## 기술 스택

### 프레임워크 & 언어
- **Next.js 16** - App Router 기반 최신 Next.js 프레임워크
- **React 19** - 최신 React 라이브러리
- **TypeScript 5** - 타입 안전성이 뛰어난 개발 환경

### 스타일링 & UI
- **Tailwind CSS 4.0** - 유틸리티 우선 CSS 프레임워크
- **shadcn/ui** - 높은 품질의 재사용 가능한 React 컴포넌트
- **Radix UI** - 접근성 우선 UI 프리미티브
- **lucide-react** - 아름다운 아이콘 라이브러리

### 개발 도구
- **next-themes** - 다크 모드 지원
- **TypeScript** - 정적 타입 검사
- **ESLint** - 코드 품질 관리

## 주요 기능

✅ **다크 모드 완전 지원** - next-themes를 활용한 라이트/다크/시스템 모드
✅ **반응형 디자인** - 모바일 우선 설계, 모든 기기에 최적화
✅ **UI 컴포넌트 라이브러리** - 18개의 shadcn/ui 컴포넌트 포함
✅ **한국어 지원** - 모든 UI와 문서가 한국어로 제공됨
✅ **TypeScript** - 완전한 타입 안전성
✅ **API 라우트 예제** - REST API 구현 예제 포함
✅ **커스텀 Hooks** - 유용한 React Hooks 제공
✅ **프로덕션 레디** - 최적화된 성능과 SEO

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 브라우저에서 열면 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
claude-nextjs-starters/
├── app/                          # Next.js App Router
│   ├── api/                       # API 라우트
│   │   ├── users/route.ts        # 사용자 API
│   │   └── products/route.ts     # 제품 API
│   ├── dashboard/page.tsx         # 대시보드 페이지
│   ├── components/page.tsx        # 컴포넌트 쇼케이스
│   ├── forms/page.tsx             # 폼 예제 페이지
│   ├── tables/page.tsx            # 테이블 예제 페이지
│   ├── layout.tsx                 # 루트 레이아웃 (ThemeProvider)
│   └── page.tsx                   # 홈/랜딩 페이지
├── components/                    # React 컴포넌트
│   ├── ui/                        # shadcn/ui 컴포넌트
│   ├── layout/
│   │   ├── header.tsx            # 헤더/네비게이션
│   │   ├── footer.tsx            # 푸터
│   │   └── main-layout.tsx       # 메인 레이아웃 (Header + Content + Footer)
│   ├── theme-provider.tsx         # 테마 프로바이더 (클라이언트 래퍼)
│   └── theme-toggle.tsx           # 다크모드 토글 컴포넌트
├── hooks/                         # 커스텀 React Hooks
│   ├── use-media-query.ts        # 반응형 디자인을 위한 미디어 쿼리 hook
│   └── use-mounted.ts            # 클라이언트 마운트 확인 hook
├── lib/                           # 유틸리티 함수
│   ├── utils.ts                  # shadcn/ui 유틸리티 (cn 함수)
│   ├── format.ts                 # 날짜, 숫자, 금액 포맷팅 함수
│   └── types.ts                  # TypeScript 타입 정의
├── public/                        # 정적 파일
├── package.json                   # 프로젝트 의존성
├── tsconfig.json                  # TypeScript 설정
├── next.config.ts                 # Next.js 설정
└── README.md                      # 이 파일
```

## 포함된 페이지

### 1. 홈 페이지 (`/`)
- 프로젝트 소개 및 주요 특징
- 기술 스택 소개
- 시작 가이드

### 2. 대시보드 (`/dashboard`)
- 통계 카드 (수익, 사용자, 판매량, 활동량)
- 탭 네비게이션 (개요, 분석, 리포트)
- 최근 활동 목록

### 3. 컴포넌트 쇼케이스 (`/components`)
- 버튼 (모든 variant, 모든 size)
- 배지
- 입력 필드 및 스위치
- 카드 컴포넌트

### 4. 폼 예제 (`/forms`)
- 사용자 프로필 폼
- 문의하기 폼
- 다양한 입력 필드 (Input, Select, Textarea, Switch)

### 5. 테이블 (`/tables`)
- 사용자 목록 테이블
- 제품 목록 테이블
- 상태 표시 배지

## API 라우트

### GET /api/users
사용자 목록을 조회합니다.

```bash
curl http://localhost:3000/api/users
```

**쿼리 파라미터:**
- `role` - 역할로 필터링 (admin, user, guest)

### POST /api/users
새 사용자를 생성합니다.

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "이름",
    "email": "email@example.com",
    "role": "user",
    "status": "active"
  }'
```

### GET /api/products
제품 목록을 조회합니다.

```bash
curl http://localhost:3000/api/products
```

**쿼리 파라미터:**
- `category` - 카테고리로 필터링

### POST /api/products
새 제품을 생성합니다.

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "제품명",
    "category": "카테고리",
    "price": 50000,
    "stock": 100
  }'
```

## 커스텀 Hooks

### useMediaQuery
미디어 쿼리를 감지하는 hook입니다. 반응형 디자인을 위한 조건부 렌더링에 유용합니다.

```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
if (isMobile) {
  return <MobileLayout />
}
```

### useMounted
클라이언트에서 마운트되었는지 확인하는 hook입니다. SSR 환경에서 Hydration 불일치를 방지합니다.

```typescript
const mounted = useMounted()
if (!mounted) return null
return <ClientOnlyComponent />
```

## 유틸리티 함수

### 날짜 포맷팅
```typescript
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/format'

formatDate(new Date())              // "2024년 2월 16일"
formatDateTime(new Date())          // "2024년 2월 16일 오후 3:45"
formatRelativeTime(new Date())      // "방금 전"
```

### 숫자 포맷팅
```typescript
import { formatNumber, formatCurrency } from '@/lib/format'

formatNumber(1234567)               // "1,234,567"
formatCurrency(1500000)             // "₩1,500,000"
```

## shadcn/ui 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 프로젝트에 추가하는 것은 간단합니다:

```bash
npx shadcn@latest add [component-name]
```

예제:
```bash
npx shadcn@latest add alert
npx shadcn@latest add pagination
npx shadcn@latest add slider
```

더 많은 컴포넌트는 [shadcn/ui 공식 사이트](https://ui.shadcn.com)에서 확인할 수 있습니다.

## 다크 모드

다크 모드는 자동으로 설정되어 있습니다. Header의 테마 토글 버튼을 클릭하여 라이트/다크/시스템 모드를 전환할 수 있습니다.

### 코드에서 테마 접근하기

```typescript
import { useTheme } from 'next-themes'

export function MyComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme('dark')}>
      다크 모드 활성화
    </button>
  )
}
```

## 환경변수

프로젝트 루트에 `.env.local` 파일을 생성하여 환경변수를 설정할 수 있습니다:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Next.js 스타터킷
```

## 성능 최적화

이 스타터킷은 이미 다음과 같이 최적화되어 있습니다:

- **Image Optimization** - Next.js의 `<Image>` 컴포넌트 사용 준비
- **Font Optimization** - Geist 폰트 자동 최적화
- **Code Splitting** - App Router의 자동 코드 분할
- **CSS Optimization** - Tailwind CSS의 자동 최적화

## TypeScript

이 프로젝트는 완전한 TypeScript 지원을 제공합니다. 모든 컴포넌트와 함수는 타입 안전성을 위해 TypeScript로 작성되어 있습니다.

### 타입 체크

```bash
npx tsc --noEmit
```

## 배포

### Vercel에 배포하기

가장 쉬운 배포 방법은 [Vercel](https://vercel.com)을 사용하는 것입니다:

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com/new) 방문
3. 저장소 선택 및 배포

더 자세한 정보는 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.

## 라이선스

MIT

---

더 궁금한 점이 있으시면 [Next.js 문서](https://nextjs.org/docs)를 참고하세요.
