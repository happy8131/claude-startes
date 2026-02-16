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
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
