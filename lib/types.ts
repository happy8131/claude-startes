// 사용자 타입 정의
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
}

// 제품 타입 정의
export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
}
