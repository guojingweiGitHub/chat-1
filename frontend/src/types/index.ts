// 用户相关类型
export interface User {
  id: number
  username: string
  realName: string
  phone: string
  email?: string
  avatar?: string
  roleId: number
  roleName?: string
  campusId?: number
  campusName?: string
  status: 'active' | 'disabled'
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: Permission[]
  createdAt: string
}

export interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button' | 'data'
  parentId?: number
  children?: Permission[]
}

// 校区相关类型
export interface Campus {
  id: number
  name: string
  address: string
  phone: string
  managerId?: number
  managerName?: string
  status: 'active' | 'disabled'
  createdAt: string
  updatedAt: string
}

// 学生相关类型
export interface Student {
  id: number
  name: string
  gender: 'male' | 'female'
  birthDate?: string
  phone: string
  parentName?: string
  parentPhone?: string
  campusId: number
  campusName?: string
  classId?: number
  className?: string
  enrollmentDate: string
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn'
  remark?: string
  createdAt: string
  updatedAt: string
}

// 班级相关类型
export interface ClassInfo {
  id: number
  name: string
  campusId: number
  campusName?: string
  subject?: string
  teacherId?: number
  teacherName?: string
  capacity: number
  currentCount?: number
  startDate: string
  endDate?: string
  status: 'active' | 'finished' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// 教师相关类型
export interface Teacher {
  id: number
  name: string
  phone: string
  campusId: number
  campusName?: string
  subjects?: string
  hireDate: string
  status: 'active' | 'resigned'
  createdAt: string
  updatedAt: string
}

// 收费相关类型
export type FeeCycleType = 'semester' | 'year' | 'month' | 'summer' | 'winter' | 'custom'

export interface FeeCycle {
  id: number
  name: string
  type: FeeCycleType
  startDate: string
  endDate: string
  standardFee: number
  campusId: number
  campusName?: string
  classIds?: number[]
  createdAt: string
}

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'refunded'
export type PaymentMethod = 'cash' | 'transfer' | 'pos' | 'online'

export interface Payment {
  id: number
  studentId: number
  studentName?: string
  cycleId: number
  cycleName?: string
  campusId: number
  campusName?: string
  amountDue: number
  amountPaid: number
  discountRate?: number
  discountReason?: string
  paymentDate?: string
  paymentMethod?: PaymentMethod
  operatorId?: number
  operatorName?: string
  status: PaymentStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

// 提醒相关类型
export type ReminderStatus = 'pending' | 'contacted' | 'renewed' | 'lost'

export interface Reminder {
  id: number
  paymentId: number
  studentName: string
  campusName: string
  dueDate: string
  amount: number
  daysRemaining: number
  status: ReminderStatus
  createdAt: string
}

// 统计相关类型
export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalRevenue: number
  pendingAmount: number
  expiringCount: number
  renewalRate: number
}

export interface TrendData {
  period: string
  value: number
}

export interface DistributionData {
  name: string
  value: number
}

// 导入相关类型
export interface ImportResult {
  total: number
  success: number
  failed: number
  skipped: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
  value?: string
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  required: boolean
}

// 通用类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  permissions: string[]
}
