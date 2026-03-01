import { redirect } from 'next/navigation'

// /admin 접속 시 /admin/dashboard로 자동 리디렉트
export default function AdminPage() {
  redirect('/admin/dashboard')
}
