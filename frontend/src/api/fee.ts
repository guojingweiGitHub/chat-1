import { request } from '@/utils/request'
import type { FeeCycle, Payment, Reminder, PaginatedResponse } from '@/types'

// 收费周期 API
export const feeCycleApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    campusId?: number
    type?: string
  }): Promise<PaginatedResponse<FeeCycle>> {
    return request.get('/fee-cycles', { params })
  },

  getAll(campusId?: number): Promise<FeeCycle[]> {
    return request.get('/fee-cycles/all', { params: { campusId } })
  },

  getById(id: number): Promise<FeeCycle> {
    return request.get(`/fee-cycles/${id}`)
  },

  create(data: Partial<FeeCycle>): Promise<FeeCycle> {
    return request.post('/fee-cycles', data)
  },

  update(id: number, data: Partial<FeeCycle>): Promise<FeeCycle> {
    return request.put(`/fee-cycles/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/fee-cycles/${id}`)
  },
}

// 缴费记录 API
export const paymentApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    campusId?: number
    cycleId?: number
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<Payment>> {
    return request.get('/payments', { params })
  },

  getById(id: number): Promise<Payment> {
    return request.get(`/payments/${id}`)
  },

  create(data: Partial<Payment>): Promise<Payment> {
    return request.post('/payments', data)
  },

  update(id: number, data: Partial<Payment>): Promise<Payment> {
    return request.put(`/payments/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/payments/${id}`)
  },

  refund(id: number, reason: string): Promise<void> {
    return request.post(`/payments/${id}/refund`, { reason })
  },

  // 获取欠费列表
  getOverdueList(params?: {
    page?: number
    pageSize?: number
    campusId?: number
  }): Promise<PaginatedResponse<Payment>> {
    return request.get('/payments/overdue', { params })
  },

  // 批量催缴
  batchRemind(paymentIds: number[]): Promise<void> {
    return request.post('/payments/batch-remind', { paymentIds })
  },
}

// 折扣规则 API (仅管理员)
export const discountApi = {
  getRules(): Promise<any[]> {
    return request.get('/discounts/rules')
  },

  createRule(data: { name: string; rate: number; condition: string; description?: string }): Promise<any> {
    return request.post('/discounts/rules', data)
  },

  updateRule(id: number, data: any): Promise<any> {
    return request.put(`/discounts/rules/${id}`, data)
  },

  deleteRule(id: number): Promise<void> {
    return request.delete(`/discounts/rules/${id}`)
  },
}

// 提醒 API
export const reminderApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    status?: string
    campusId?: number
  }): Promise<PaginatedResponse<Reminder>> {
    return request.get('/reminders', { params })
  },

  updateStatus(id: number, status: string): Promise<void> {
    return request.put(`/reminders/${id}/status`, { status })
  },

  getExpiringList(days: number): Promise<Reminder[]> {
    return request.get('/reminders/expiring', { params: { days } })
  },

  // 配置提醒规则
  getConfig(): Promise<{ days: number[]; enabled: boolean }> {
    return request.get('/reminders/config')
  },

  updateConfig(data: { days: number[]; enabled: boolean }): Promise<void> {
    return request.put('/reminders/config', data)
  },
}
