'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function FormsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">폼 예제</h1>
          <p className="text-muted-foreground">
            다양한 폼 컴포넌트 사용 예제
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 사용자 프로필 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 프로필</CardTitle>
              <CardDescription>
                기본 정보를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="홍길동" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="hong@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">관리자</SelectItem>
                    <SelectItem value="user">사용자</SelectItem>
                    <SelectItem value="guest">게스트</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">소개</Label>
                <Textarea
                  id="bio"
                  placeholder="자기소개를 입력하세요"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="newsletter" />
                <Label htmlFor="newsletter">뉴스레터 구독</Label>
              </div>

              <Button className="w-full">저장</Button>
            </CardContent>
          </Card>

          {/* 연락처 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>문의하기</CardTitle>
              <CardDescription>
                궁금한 점을 문의해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">제목</Label>
                <Input id="subject" placeholder="문의 제목" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">일반 문의</SelectItem>
                    <SelectItem value="technical">기술 지원</SelectItem>
                    <SelectItem value="billing">결제 문의</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">메시지</Label>
                <Textarea
                  id="message"
                  placeholder="문의 내용을 입력하세요"
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">전송</Button>
                <Button variant="outline" className="flex-1">취소</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
