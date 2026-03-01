# Notion 견적서 웹 뷰어 MVP 개발 로드맵

## 개요

**프로젝트 목표**
- Notion 데이터베이스에서 견적서를 조회하여 웹 링크로 공유할 수 있는 플랫폼 구축
- 클라이언트가 공유 링크를 통해 견적서를 확인하고 PDF로 다운로드하는 기능 제공
- 1인 개발자 기준 MVP 범위로 신속한 구현 (약 2-3주 예상)

**주요 성공 지표**
- Notion API를 통한 견적서 데이터 자동 조회 기능 동작
- 반응형 웹 페이지에서 견적서 정보가 정확하게 렌더링됨
- PDF 다운로드 시 한국어 포맷팅이 올바르게 적용됨
- shareToken을 통한 접근 제어가 안전하게 작동함
- 모바일/태블릿/데스크톱에서 일관된 사용자 경험 제공

**전체 예상 일정**: 2-3주 (단계별 1주 ~ 5일)

---

## 기술 스택 & 아키텍처

### 사용 기술
- **프레임워크**: Next.js 16 (App Router)
- **런타임**: React 19
- **언어**: TypeScript 5 (strict 모드)
- **스타일링**: Tailwind CSS 4.0
- **UI 컴포넌트**: shadcn/ui (카드, 버튼, 로딩 등)
- **아이콘**: lucide-react
- **데이터 연동**: Notion API (@notionhq/client)
- **PDF 생성**: html2pdf.js (간단한 구현) 또는 react-pdf (고급 기능)
- **테마 관리**: next-themes

### 주요 아키텍처 결정
1. **동적 라우팅**: `/quotes/[shareToken]`을 통한 공유 링크 구현
2. **API 라우트**: `/api/notion/quotes`를 통한 Notion 데이터 조회
3. **서버 컴포넌트**: Next.js RSC를 활용한 Notion API 호출 (클라이언트 보안)
4. **토큰 기반 접근**: shareToken으로만 견적서 접근 가능 (무차별 대입 공격 방지)
5. **클라이언트 측 PDF 생성**: 외부 API 없이 브라우저에서 직접 PDF 다운로드

### 제약사항 및 고려사항
- **보안**: Notion API 키는 .env.local에만 저장 (클라이언트 사이드에 노출 금지)
- **성능**: Notion API 요청 최소화 (캐싱 또는 배치 처리 고려)
- **한국어 포맷팅**: 금액(₩), 날짜(yyyy년 mm월 dd일) 일관성 유지
- **반응형 디자인**: 모바일 우선 접근법으로 모든 화면 크기 지원
- **접근성**: 시맨틱 HTML과 ARIA 속성으로 접근성 보장

---

## 단계별 계획

### Phase 1: 프로젝트 초기화 및 Notion API 설정 (3-4일)
**목표**: Notion API 연동의 기초 구축 및 데이터 조회 테스트

**주요 기능/작업**:
- [ ] Notion API 키 설정 및 환경변수 구성 (.env.local)
- [ ] @notionhq/client 라이브러리 설치 및 타입 정의
- [ ] Notion 데이터베이스 스키마 분석 및 TypeScript 타입 정의 (Quote, QuoteItem 등)
- [ ] `/lib/notion/client.ts` - Notion 클라이언트 초기화
- [ ] `/lib/notion/database.ts` - 견적서 데이터 조회 함수 구현
  - `getQuoteByToken(shareToken)` - 공유 토큰으로 견적서 조회
  - `getQuoteById(id)` - ID로 견적서 조회
  - Notion 데이터베이스 응답을 TypeScript 타입으로 변환
- [ ] `/lib/notion/helpers.ts` - Notion 응답 파싱 유틸리티
- [ ] API 라우트 `/api/notion/quotes/[id]` 구현 (백엔드 라우트)

**마일스톤**: Notion API를 통해 실제 데이터를 성공적으로 조회 및 파싱

**의존성**: Notion 데이터베이스 설정 및 API 키 발급 완료 필수

**위험요소**:
- Notion API 속도 제한(rate limiting)으로 요청 실패 가능 → 재시도 로직 + exponential backoff 구현
- 토큰 유효성 검증 로직 부재 → 공유 토큰 유효성 검사 함수 추가

---

### Phase 2: 동적 라우트 및 견적서 뷰 페이지 구현 (4-5일)
**목표**: 클라이언트가 공유 링크를 통해 견적서를 확인할 수 있는 페이지 완성

**주요 기능/작업**:
- [ ] `/app/quotes/[shareToken]/page.tsx` - 동적 라우트 페이지 생성
- [ ] `/components/quote-viewer.tsx` - 견적서 표시 컴포넌트 개발
  - 견적서 헤더 (클라이언트명, 견적서 번호, 날짜)
  - 항목 리스트 (Product/Service, 수량, 단가, 소계)
  - 합계 및 통화 표시
  - 설명 및 주의사항
- [ ] 메타데이터 설정 (SEO)
  - 견적서 번호와 클라이언트명을 페이지 title/description에 동적으로 포함
  - Open Graph 태그 설정
- [ ] 로딩 상태 및 에러 처리
  - 데이터 로딩 중 스켈레톤 UI (shadcn/ui Skeleton)
  - 견적서 없음/만료된 경우 사용자 친화적 에러 메시지
- [ ] 반응형 레이아웃 (모바일 우선)
  - 태블릿/데스크톱에서의 레이아웃 최적화
  - 인쇄 스타일 고려 (프린트할 때 보기 좋은 레이아웃)

**마일스톤**: 공유 링크 접속 시 견적서가 정확하게 표시됨

**의존성**: Phase 1 완료 필수

**위험요소**:
- 토큰 조작으로 다른 견적서에 접근 가능 → 토큰 복잡도 확보 및 검증 강화
- 네트워크 지연 시 사용자 경험 저하 → Suspense + skeleton 로딩 상태 구현

---

### Phase 3: PDF 다운로드 기능 구현 (3-4일)
**목표**: 견적서를 PDF 파일로 다운로드할 수 있는 기능 완성

**주요 기능/작업**:
- [ ] PDF 라이브러리 선택 및 설치
  - `html2pdf.js` 추천 (간단한 구현, 소형 용량)
  - 또는 `react-pdf` (더 고급 기능, 복잡함)
- [ ] `/components/pdf-export.tsx` - PDF 생성 및 다운로드 컴포넌트
  - 견적서 데이터를 HTML 템플릿으로 변환
  - 한국어 폰트 임베딩 (NotoSans KR 또는 유사)
  - PDF 옵션 설정 (페이지 사이즈 A4, 마진 등)
  - "PDF 다운로드" 버튼 구현 및 로딩 상태 처리
- [ ] 포맷팅 최적화
  - 한국어 금액 포맷: ₩ 기호 + 천 단위 구분
  - 한국어 날짜 포맷: yyyy년 mm월 dd일
  - 테이블 레이아웃 최적화 (줄바꿈, 정렬)
- [ ] 인쇄 스타일 추가
  - @media print CSS 규칙으로 PDF 생성 시 외형 최적화

**마일스톤**: PDF 다운로드 시 한국어 포맷팅이 올바르게 적용되고 레이아웃이 깔끔함

**의존성**: Phase 2 완료 필수

**위험요소**:
- 한국어 폰트 미지원으로 문자 깨짐 → 웹 폰트 또는 시스템 폰트 명시적 로드
- 큰 이미지 포함 시 PDF 파일 크기 증가 → 이미지 압축 또는 최적화
- 복잡한 레이아웃 렌더링 불일치 → HTML 템플릿을 간단하게 유지

---

### Phase 4: 관리자 대시보드 (선택사항, MVP 범위 외) - 완료 ✅
**상태**: 완료 (2025-03-01)

**주요 기능/작업**:
- [x] `/app/(admin)/layout.tsx` - 관리자 섹션 레이아웃 구현
- [x] `/components/admin/admin-sidebar.tsx` - 사이드바 네비게이션 (활성 상태 표시)
- [x] `/app/(admin)/admin/page.tsx` - /admin → /admin/dashboard 자동 리디렉트
- [x] `/components/admin/stat-card.tsx` - 통계 카드 컴포넌트 (아이콘, 색상 변형 지원)
- [x] `/app/(admin)/admin/dashboard/page.tsx` - 통계 대시보드
  - 전체/대기/승인/거절 견적서 통계
  - 전체 금액 + 대기 금액 표시
  - 최근 5건 견적서 미리보기
- [x] `/components/admin/invoice-table.tsx` - 견적서 관리 테이블 (클라이언트 컴포넌트)
  - 상태별 필터 탭 (전체/대기/승인/거절)
  - 정렬 기능 (최신순)
  - 견적서 번호, 클라이언트, 발행일, 마감일, 상태, 금액, 항목 수 표시
- [x] `/app/(admin)/admin/invoices/page.tsx` - 견적서 관리 목록 페이지

**마일스톤**: 관리자 전용 대시보드 및 견적서 관리 시스템 완성

**기술 상세**:
- Notion API 캐싱 활용 (기존 `getInvoices()` 재활용)
- 한국어 포맷팅 (날짜, 금액)
- 다크모드 지원
- 반응형 레이아웃 (모바일/태블릿/데스크톱)
- TypeScript strict 모드
- shadcn/ui 컴포넌트 통합

---

### Phase 5: 테스트 및 배포 (3-4일)
**목표**: 모든 기능이 안정적으로 작동하는지 확인하고 프로덕션 배포

**주요 기능/작업**:
- [ ] 유닛 테스트 (선택사항)
  - Notion 데이터 파싱 함수 테스트
  - 포맷팅 유틸리티 테스트 (금액, 날짜)
- [ ] E2E 테스트 (Playwright)
  - 공유 링크 접속 → 견적서 표시 확인
  - PDF 다운로드 기능 확인
  - 반응형 레이아웃 테스트 (모바일, 태블릿, 데스크톱)
  - 에러 케이스 테스트 (유효하지 않은 토큰)
- [ ] 성능 최적화
  - Notion API 요청 속도 측정 및 캐싱 전략 수립
  - 번들 크기 최적화
  - 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 보안 검토
  - Notion API 키 노출 확인
  - XSS, CSRF 등 보안 취약점 검사
  - shareToken 유효성 검사 강화
- [ ] Vercel 또는 다른 플랫폼 배포
  - 환경변수 설정 (NOTION_API_KEY, NOTION_DATABASE_ID)
  - 빌드 및 배포 테스트
  - 배포 후 전체 흐름 확인

**마일스톤**: 프로덕션 배포 완료, 모든 기능 정상 작동 확인

**의존성**: Phase 1-4 완료 필수

**위험요소**:
- 프로덕션 환경과 개발 환경의 동작 차이 → 배포 전 철저한 테스트
- Notion API 속도 제한으로 인한 시간 초과 → 캐싱 및 재시도 로직 구현

---

## 마일스톤 타임라인

| 날짜 | 마일스톤 | 설명 | 상태 |
|------|---------|------|------|
| **Week 1 - Day 1-3** | Notion API 통합 완료 | Notion 데이터 조회 성공, 타입 정의 완료 | ✅ |
| **Week 1 - Day 4-5** | 동적 라우트 구현 완료 | `/quotes/[shareToken]` 페이지 동작 | ✅ |
| **Week 2 - Day 1-3** | 견적서 뷰 페이지 완성 | 반응형 레이아웃, 한국어 포맷팅 적용 | ✅ |
| **Week 2 - Day 4-5** | PDF 다운로드 기능 완성 | 한국어 폰트 포함, 인쇄 스타일 최적화 | ✅ |
| **2025-03-01** | 관리자 대시보드 완성 | 통계 카드, 견적서 관리 테이블 구현 | ✅ |
| **Week 3 - Day 1-2** | E2E 테스트 및 버그 수정 | 모든 기능 검증 | 🔄 |
| **Week 3 - Day 3-5** | 배포 및 성능 최적화 | 프로덕션 배포, 모니터링 설정 | ⏳ |

---

## 리스크 관리

| 리스크 | 영향 | 확률 | 완화 전략 |
|--------|------|------|---------|
| Notion API 속도 제한(rate limiting) | 데이터 조회 실패 | 중 | exponential backoff 재시도 로직 + 캐싱 전략 구현 |
| 한국어 폰트 PDF 렌더링 실패 | PDF 파일 품질 저하 | 중 | 웹 폰트 명시적 로드, 테스트 환경에서 사전 검증 |
| 토큰 조작으로 인한 보안 취약점 | 다른 견적서 정보 노출 | 중 | 강력한 토큰(UUID v4) + 검증 로직 강화, rate limiting |
| 외부 의존성(Notion) 장애 | 서비스 불가능 | 낮음 | 에러 처리 및 사용자 친화적 메시지, 상태 페이지 모니터링 |
| 큰 파일 크기(이미지) 포함 시 성능 저하 | 로딩 속도 증가, PDF 생성 지연 | 중 | 이미지 최적화, 파일 크기 제한, 지연 로딩 |
| 모바일에서 레이아웃 깨짐 | 사용자 경험 저하 | 낮음 | Tailwind CSS 반응형 클래스, 모든 화면 크기 테스트 |

---

## 성공 지표

### 기능 지표
- ✅ Notion API를 통한 견적서 조회 성공률 99% 이상
- ✅ 공유 링크 접속 후 견적서 렌더링 시간 2초 이내
- ✅ PDF 다운로드 성공률 100% (모든 글자 정상 표시)

### 사용자 경험 지표
- ✅ 모바일(375px), 태블릿(768px), 데스크톱(1024px)에서 모두 정상 렌더링
- ✅ 인쇄 시 레이아웃 일관성 (페이지 1장 내)
- ✅ 한국어 포맷팅 정확도 100% (금액, 날짜)

### 품질 기준
- ✅ E2E 테스트 커버리지 80% 이상
- ✅ 보안 검수: 권한 없는 접근 불가능, Notion API 키 미노출
- ✅ 접근성: WCAG 2.1 Level AA 준수 (선택사항)

---

## 개발 고려사항

### 기술적 결정 사항
1. **PDF 라이브러리 선택**: `html2pdf.js` 추천 (간단하고 가벼움)
   - 대안: `react-pdf` (복잡하지만 고급 기능)
2. **Notion 토큰 저장소**: Notion의 Text 필드 사용 (UUID v4)
   - 토큰 충돌 가능성 극히 낮음
3. **캐싱 전략**: Vercel KV 또는 메모리 캐시 (선택사항)
   - MVP에서는 필수 아님, 성능 향상 후 고려

### 파일 구조
```
app/
├── api/
│   └── notion/
│       └── quotes/
│           └── [id]/
│               └── route.ts          # 견적서 데이터 조회 API
├── quotes/
│   └── [shareToken]/
│       └── page.tsx                 # 견적서 뷰 페이지
├── layout.tsx
└── page.tsx

components/
├── quote-viewer.tsx                  # 견적서 표시 컴포넌트
├── pdf-export.tsx                    # PDF 다운로드 컴포넌트
└── ui/                              # shadcn/ui 컴포넌트들

lib/
├── notion/
│   ├── client.ts                    # Notion 클라이언트 초기화
│   ├── database.ts                  # 견적서 데이터 조회 함수
│   └── helpers.ts                   # Notion 응답 파싱 유틸리티
├── types/
│   └── quote.ts                     # Quote, QuoteItem 타입 정의
├── format.ts                        # 포맷팅 유틸리티 (기존 파일 활용)
└── utils.ts                         # 일반 유틸리티 (cn 등)
```

### 의존성 설치
```bash
# Notion API
npm install @notionhq/client

# PDF 생성 (html2pdf 선택 시)
npm install html2pdf.js
# 또는 (react-pdf 선택 시)
npm install react-pdf

# 타입 정의 (필요한 경우)
npm install --save-dev @types/html2pdf.js
```

### 환경변수 설정 (.env.local)
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

---

## 추가 노트

- **MVP 범위**: 견적서 조회 + 웹 표시 + PDF 다운로드만 포함
- **제외 사항**: 관리자 대시보드, 회원가입/로그인, 결제 연동, 메일 발송, 국제화
- **1인 개발자 기준**: 프로젝트 관리 도구(Jira 등) 미사용, 간단한 Task 체크리스트 사용
- **배포**: Vercel 추천 (Next.js 최적화, 환경변수 관리 편리)
- **모니터링**: 배포 후 Vercel Analytics 또는 Google Analytics로 사용자 행동 추적 (선택사항)
