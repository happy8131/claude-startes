'use client'

import { useEffect, useState } from 'react'

/**
 * 클라이언트 마운트 상태 확인 hook
 * SSR 환경에서 Hydration 불일치 방지
 *
 * @returns boolean - 컴포넌트가 클라이언트에서 마운트되었는지 여부
 *
 * @example
 * const mounted = useMounted()
 * if (!mounted) {
 *   return null
 * }
 * return <ClientOnlyComponent />
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
