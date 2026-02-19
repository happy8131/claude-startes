'use client'

import { useEffect, useState } from 'react'

/**
 * 미디어 쿼리 hook
 * 반응형 디자인을 위한 화면 크기 변화 감지
 *
 * @param query - CSS 미디어 쿼리 문자열
 * @returns boolean - 미디어 쿼리 매칭 여부
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * if (isMobile) {
 *   return <MobileLayout />
 * }
 */
export function useMediaQuery(query: string): boolean {
  // 초기값을 서버와 클라이언트에서 일치하도록 false로 설정
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    // 클라이언트 마운트 후 실제 미디어 쿼리 값으로 업데이트
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    // 미디어 쿼리 변경 감지
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}
