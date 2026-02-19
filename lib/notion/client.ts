import { Client } from '@notionhq/client'

/**
 * Notion API 클라이언트 싱글톤
 * 환경변수에서 API 키를 읽어 클라이언트 초기화
 *
 * 주의: API 키가 없으면 런타임에 오류가 발생합니다.
 * .env.local에 NOTION_API_KEY와 NOTION_DATABASE_ID를 설정하세요.
 */

// 빌드 시간에는 빈 문자열을 사용하고, 런타임에 검증합니다
const apiKey = process.env.NOTION_API_KEY || ''

export const notion = new Client({
  auth: apiKey || 'placeholder_key',
})

/**
 * API 키 검증 함수 (런타임에만 호출)
 */
export function validateNotionConfig(): void {
  if (!process.env.NOTION_API_KEY) {
    throw new Error(
      'NOTION_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    )
  }
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error(
      'NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    )
  }
}
