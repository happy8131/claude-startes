/**
 * 날짜 포맷팅
 * 한국어 로케일로 날짜를 형식화합니다
 *
 * @param date - 날짜 객체 또는 문자열
 * @returns string - 포맷된 날짜 문자열 (예: "2024년 2월 16일")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * 시간 포맷팅
 * 한국어 로케일로 날짜와 시간을 함께 표시합니다
 *
 * @param date - 날짜 객체 또는 문자열
 * @returns string - 포맷된 날짜/시간 문자열 (예: "2024년 2월 16일 오후 3:45")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * 숫자 포맷팅
 * 천단위 구분 기호를 추가합니다
 *
 * @param num - 숫자
 * @returns string - 포맷된 숫자 문자열 (예: "1,234,567")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

/**
 * 금액 포맷팅
 * 원화(KRW) 통화로 형식화합니다
 *
 * @param amount - 금액 (숫자)
 * @returns string - 포맷된 금액 문자열 (예: "₩1,234,567")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/**
 * 상대 시간 포맷팅
 * 현재 시간으로부터의 상대적 시간을 표시합니다
 *
 * @param date - 날짜 객체 또는 문자열
 * @returns string - 상대 시간 문자열 (예: "2시간 전", "3일 전")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)

  if (diffSecs < 60) {
    return '방금 전'
  }

  const diffMins = Math.floor(diffSecs / 60)
  if (diffMins < 60) {
    return `${diffMins}분 전`
  }

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) {
    return `${diffHours}시간 전`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) {
    return `${diffDays}일 전`
  }

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) {
    return `${diffWeeks}주 전`
  }

  return formatDate(d)
}
