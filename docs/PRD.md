# Notion 견적서 웹 뷰어 MVP PRD

## 프롬프트: prd-generator 에이전트용 메타 프롬프트

```
다음 요구사항을 바탕으로 1인 개발자용 MVP PRD를 생성하세요:

## 📋 프로젝트 요구사항

### 핵심 목표
- **문제 정의**: 견적서를 Notion에 입력하면, 클라이언트가 웹 링크를 통해 견적서를 확인하고 PDF로 다운받을 수 있어야 합니다.
- **사용자층**: 2가지
  1. **관리자(사업자)**: Notion에서 견적서 작성/관리
  2. **클라이언트(고객)**: 웹링크로 받은 견적서를 확인하고 PDF 다운로드

### 기술 제약조건
- **현재 기술 스택**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **CMS**: Notion API 데이터베이스 연동
- **추가 라이브러리**: PDF 생성 (react-pdf 또는 html2pdf)
- **인증**: 단순 링크 공유 방식 (회원가입/로그인 불필요)

### MVP 필수 기능
1. **Notion 견적서 데이터 조회**: Notion 데이터베이스에서 견적서 정보 자동 조회
2. **웹 페이지로 렌더링**: 클라이언트 링크로 접속하면 깔끔한 웹 페이지에서 견적서 표시
3. **PDF 다운로드**: 보기 페이지에서 "PDF 다운로드" 버튼으로 PDF 저장

### MVP 이후 기능 (제외)
- 견적서 수락/거절 기능
- 전자서명
- 결제 연동
- 견적서 이력 추적
- 메일 발송
- 다국어 지원
- 사용자 계정 관리

### Notion 데이터 구조 (예시)
Notion 데이터베이스 스키마:
- **Database Name**: Quotations (견적서)
- **Fields**:
  - `ID` (고유 ID) - Text
  - `Client Name` (고객명) - Text
  - `Quote Number` (견적서 번호) - Text
  - `Quote Date` (견적 날짜) - Date
  - `Due Date` (만료일) - Date
  - `Items` (항목) - Multi-select or Rich Text
  - `Amount` (금액) - Number
  - `Currency` (통화) - Select (KRW/USD/etc)
  - `Description` (설명) - Rich Text
  - `Status` (상태) - Select (Draft/Sent/Accepted/Expired)
  - `Share Token` (공유 토큰) - Text (URL 생성용)

### 페이지 구조 (대략)
1. **관리자 대시보드** (선택사항 - MVP에서는 제외 가능, Notion에서 직접 관리)
2. **클라이언트 견적서 뷰** (필수)
   - 공유 링크: `/quotes/[shareToken]`
   - 견적서 정보 표시
   - PDF 다운로드 버튼

### 주요 파일 구조 (참고)
```
app/
├── api/
│   └── notion/            # Notion 데이터 연동 API
│       └── quotes/        # 견적서 데이터 조회
├── quotes/
│   └── [shareToken]/      # 동적 경로로 공유 링크 생성
│       └── page.tsx       # 견적서 뷰 페이지
├── components/
│   ├── quote-viewer.tsx   # 견적서 표시 컴포넌트
│   ├── pdf-export.tsx     # PDF 내보내기 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
└── lib/
    ├── notion/
    │   ├── client.ts
    │   ├── database.ts
    │   └── helpers.ts
    └── format.ts         # 금액, 날짜 포맷팅

```

### 개발 고려사항
- **SEO**: 각 견적서 페이지에 메타데이터 설정 (클라이언트명, 견적서 번호 포함)
- **접근 제어**: shareToken으로만 접근 가능 (Notion에서 자동 생성 또는 UUID)
- **반응형 디자인**: 모바일/태블릿/데스크톱에서 모두 잘 보여야 함
- **PDF 생성**: 브라우저에서 다운로드 직접 생성 (외부 API 없음)
- **한국어 포맷팅**: 금액(₩), 날짜(yyyy년 mm월 dd일) 형식 사용

---

## 📌 생성 지침

**이 프롬프트를 받은 prd-generator 에이전트는:**

1. 관리자 + 클라이언트 2가지 사용자 관점으로 사용자 여정 설계
2. MVP에 정말 필요한 기능만 (PDF 다운로드, 웹 뷰 표시) 포함
3. Notion API 데이터 조회를 핵심 기능으로 명시
4. PDF 생성 라이브러리 선택 (react-pdf 또는 html2pdf)
5. 각 기능에 기능 ID 부여 (F001~F005)
6. 페이지별로 구현될 기능 명시 (예: `/quotes/[shareToken]` 페이지에서 F001, F002 구현)
7. 메뉴 구조는 최소화 (클라이언트는 공유 링크만 필요)
8. 기술 스택: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 + Notion API + PDF 라이브러리
9. MVP 범위를 명확히: 단순 조회 + PDF 다운로드만 (복잡한 관리 기능 제외)

---

## 🎯 최종 PRD 완성 기준

생성되는 PRD는 다음을 포함해야 합니다:

- ✅ 핵심 정보: 목적(Notion 견적서를 웹으로 공유) + 사용자(관리자, 클라이언트)
- ✅ 사용자 여정: 관리자가 Notion에 입력 → 공유 링크 생성 → 클라이언트가 웹에서 확인 → PDF 다운로드
- ✅ 기능 명세: F001~F005 (Notion 연동, 웹 렌더링, PDF 내보내기 등)
- ✅ 메뉴 구조: 최소화 (클라이언트 관점에서 견적서 뷰만)
- ✅ 페이지별 상세: `/quotes/[shareToken]` 페이지 상세 명세
- ✅ 데이터 모델: Notion 스키마 매핑
- ✅ 기술 스택: Next.js 16, React 19, TypeScript, Tailwind CSS 4, @notionhq/client, PDF 라이브러리

---

## 🚀 실행 방법

이 프롬프트를 @prd-generator 에이전트에 전달하여 MVP PRD를 생성하세요.

\`\`\`bash
# Claude Code에서 prd-generator 에이전트 호출
/task @prd-generator "위 프롬프트 내용 전달"
\`\`\`
```

---

## 📝 참고사항

- **Notion API 설정**: `.env.local`에 `NOTION_API_KEY`와 `NOTION_DATABASE_ID` 필수
- **PDF 라이브러리 선택**:
  - `react-pdf`: React 컴포넌트로 PDF 생성 (복잡하지만 정확함)
  - `html2pdf`: HTML을 PDF로 변환 (간단함)
  - 추천: `html2pdf` (MVP 신속 구현)
- **공유 토큰 생성**: UUID 또는 Notion에서 자동 생성 필드 사용
- **보안**: shareToken을 충분히 복잡하게 생성 (무차별 대입 공격 방지)

