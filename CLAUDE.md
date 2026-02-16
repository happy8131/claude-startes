# CLAUDE.md

이 파일은 이 저장소에서 Claude Code(claude.ai/code)가 작업할 때 필요한 가이드를 제공합니다.

## 프로젝트 개요

**Next.js 모던 웹 스타터킷** - Next.js 16, React 19, TypeScript 5, Tailwind CSS 4로 구축된 프로덕션 레디 모던 웹 애플리케이션 스타터킷입니다.

한국어로 로컬라이징된 스타터킷으로, 예제 페이지, API 라우트, shadcn/ui 컴포넌트를 포함하고 있어 빠른 웹 개발을 지원합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **런타임**: React 19
- **언어**: TypeScript 5 (strict 모드)
- **스타일링**: Tailwind CSS 4.0
- **UI 컴포넌트**: shadcn/ui (18개 이상의 컴포넌트, new-york 스타일)
- **아이콘**: lucide-react
- **테마 관리**: next-themes (라이트/다크/시스템 모드)
- **폼 처리**: react-hook-form + zod 유효성 검사
- **테스트/E2E**: Playwright MCP 서버 설정 (.mcp.json)
- **린팅**: ESLint 9

## 주요 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린터 실행
npm run lint

# 새로운 shadcn/ui 컴포넌트 추가
npx shadcn@latest add [component-name]
```

## 프로젝트 아키텍처

### 디렉토리 구조

```
app/                    # Next.js App Router
├── api/               # API 라우트 (REST 엔드포인트)
│   ├── users/         # 사용자 관리 API
│   └── products/      # 제품 관리 API
├── dashboard/         # 대시보드 페이지 (통계 & 탭)
├── components/        # 컴포넌트 쇼케이스 페이지
├── forms/            # 폼 예제 페이지
├── tables/           # 테이블 예제 페이지
├── layout.tsx        # 루트 레이아웃 (ThemeProvider 포함)
└── page.tsx          # 홈/랜딩 페이지

components/           # React 컴포넌트
├── ui/               # shadcn/ui 컴포넌트 (CLI로 추가됨)
├── layout/           # 레이아웃 컴포넌트
│   ├── header.tsx    # 네비게이션 헤더
│   ├── footer.tsx    # 푸터
│   └── main-layout.tsx  # 통합 레이아웃 (Header + Content + Footer)
├── theme-provider.tsx  # 클라이언트 사이드 테마 프로바이더 래퍼
└── theme-toggle.tsx    # 다크모드 토글 버튼

hooks/                # 커스텀 React Hooks
├── use-media-query.ts  # 반응형 디자인용 미디어 쿼리 감지
└── use-mounted.ts      # SSR Hydration 안전성 Hook

lib/                  # 유틸리티 함수
├── utils.ts          # className 병합용 cn() 헬퍼
├── format.ts         # 날짜, 숫자, 금액 포맷팅 (한국어 로케일)
└── types.ts          # TypeScript 타입 정의
```

### 주요 아키텍처 결정 사항

1. **App Router**: Pages Router가 아닌 Next.js App Router 사용으로 더 나은 조직화와 서버 컴포넌트 활용
2. **RSC (React Server Components)**: shadcn/ui 설정에서 기본 활성화
3. **테마 프로바이더**: 루트 레이아웃 레벨에 next-themes로 감싸여 있어 모든 페이지에서 일관된 다크모드 지원
4. **컴포넌트 별칭**: shadcn/ui 컴포넌트는 @/components/ui 별칭 사용으로 깔끔한 import
5. **국제화**: 모든 콘텐츠, 주석, 예제에서 한국어 로케일(ko-KR) 포맷팅 사용

## 중요 패턴 & 관례

### 컴포넌트 조직화

- **UI 컴포넌트** (shadcn/ui)는 `/components/ui/`에 위치 - `npx shadcn@latest add`로 추가
- **레이아웃 컴포넌트**는 `/components/layout/`에 위치 - 헤더, 푸터, 메인 레이아웃 래퍼
- **페이지 컴포넌트**는 `/app/[route]/page.tsx`에 직접 정의

### TypeScript

- tsconfig.json에서 strict 모드 활성화
- 모든 컴포넌트는 적절한 TypeScript 타입을 가져야 함
- 페이지 라우트와 API 라우트 모두에 TypeScript 사용

### 스타일링

- Tailwind CSS 유틸리티 클래스 사용
- `@/lib/utils`의 `cn()` 유틸리티로 클래스명을 안전하게 병합:
  ```typescript
  import { cn } from '@/lib/utils'
  className={cn('base-class', condition && 'conditional-class')}
  ```
- 테마 변수는 `app/globals.css`의 CSS 커스텀 프로퍼티 (Tailwind v4 형식)

### 다크 모드

- next-themes + theme-provider로 자동 관리
- `useTheme()` Hook으로 현재 테마 접근:
  ```typescript
  import { useTheme } from 'next-themes'
  const { theme, setTheme } = useTheme()
  ```

### 포맷팅 유틸리티

`/lib/format.ts`의 함수들을 사용하여 일관된 한국어 로케일 포맷팅:

```typescript
import { formatDate, formatDateTime, formatNumber, formatCurrency, formatRelativeTime } from '@/lib/format'

formatDate(new Date())                  // "2024년 2월 16일"
formatDateTime(new Date())              // "2024년 2월 16일 오후 3:45"
formatNumber(1234567)                   // "1,234,567"
formatCurrency(1500000)                 // "₩1,500,000"
formatRelativeTime(new Date())          // "방금 전" 또는 "2시간 전"
```

### 커스텀 Hooks

- `useMediaQuery(query: string)` - 미디어 쿼리 변화 감지해서 반응형 UI 구현
- `useMounted()` - 컴포넌트 마운트 여부 확인 (Hydration 불일치 방지)

### API 라우트

API 라우트는 `/app/api/[resource]/route.ts`에 위치:
- GET, POST, PUT, DELETE 메서드 지원
- 예제: `/api/users`와 `/api/products` (샘플 데이터 포함)
- 적절한 상태 코드와 함께 JSON 응답 반환

## 개발 워크플로우

### 새로운 shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

컴포넌트는 `/components/ui/`에 일관된 스타일링과 함께 설치됩니다.

### 새로운 페이지 생성

1. `/app`에 디렉토리 생성: `/app/new-page/`
2. `page.tsx` 파일 추가
3. 일관된 헤더/푸터를 위해 `MainLayout` 래퍼 사용
4. SEO를 위해 페이지 메타데이터 정의

### 새로운 API 라우트 생성

1. 디렉토리 구조 생성: `/app/api/resource/`
2. `route.ts` 파일 추가 (핸들러: `export { GET, POST }`)
3. 적절한 상태 코드와 함께 JSON 응답

## 설정 파일

- **tsconfig.json**: 경로 별칭 `@/*`는 루트 디렉토리에 매핑
- **components.json**: shadcn/ui 설정 (스타일: new-york, RSC 활성화)
- **.mcp.json**: 브라우저 자동화 테스트를 위한 Playwright MCP 서버
- **next.config.ts**: 현재 최소 구성, 필요시 확장 가능

## 코드 스타일 & 네이밍

전역 CLAUDE.md 지시사항에 따름:
- 변수명/함수명: 영어 (코드 표준)
- 주석: 한국어
- 커밋 메시지: 한국어
- 문서화: 한국어
- 들여쓰기: 2칸

## 테스트

`.mcp.json`에 Playwright MCP 서버가 설정되어 있어 E2E 테스트 및 브라우저 자동화를 지원합니다. 컴포넌트 및 페이지 테스트에 Playwright를 사용하세요.

## 배포

- Vercel 배포에 최적화
- 모든 Node.js 환경에 배포 가능
- 빌드 명령어: `npm run build`
- 시작 명령어: `npm start`

## 유용한 참고사항

- 모든 폰트(Geist Sans/Mono)는 next/font를 통해 자동 최적화됨
- Image 최적화는 next/image로 사용할 준비가 됨
- 코드 분할은 App Router에서 자동으로 발생
- `/public`의 정적 자산은 루트 경로에 제공됨
- 환경변수는 `.env.local`에서 설정 가능
