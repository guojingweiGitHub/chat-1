import { request } from '@/utils/request'
import type { DashboardStats, TrendData, DistributionData } from '@/types'

export const statisticsApi = {
  // 获取仪表盘统计数据
  getDashboard(campusId?: number): Promise<DashboardStats> {
    return request.get('/statistics/dashboard', { params: { campusId } })
  },

  // 学生数量趋势
  getStudentTrend(params?: {
    campusId?: number
    period?: 'month' | 'quarter' | 'year'
    startDate?: string
    endDate?: string
  }): Promise<TrendData[]> {
    return request.get('/statistics/students/trend', { params })
  },

  // 学生分布（按校区/班级/状态）
  getStudentDistribution(params?: {
    campusId?: number
    groupBy?: 'campus' | 'class' | 'status'
  }): Promise<DistributionData[]> {
    return request.get('/statistics/students/distribution', { params })
  },

  // 收费统计
  getRevenueTrend(params?: {
    campusId?: number
    period?: 'month' | 'quarter' | 'year'
    startDate?: string
    endDate?: string
  }): Promise<TrendData[]> {
    return request.get('/statistics/revenue/trend', { params })
  },

  // 收费状态分布
  getRevenueDistribution(params?: {
    campusId?: number
  }): Promise<DistributionData[]> {
    return request.get('/statistics/revenue/distribution', { params })
  },

  // 欠费统计
  getOverdueStats(params?: {
    campusId?: number
  }): Promise<{ totalAmount: number; totalCount: number; list: any[] }> {
    return request.get('/statistics/overdue', { params })
  },

  // 到期统计
  getExpiringStats(params?: {
    campusId?: number
    days?: number
  }): Promise<{ count: number; amount: number; list: any[] }> {
    return request.get('/statistics/expiring', { params })
  },

  // 续报率统计
  getRenewalStats(params?: {
    campusId?: number
    period?: 'month' | 'quarter' | 'year'
  }): Promise<{ rate: number; trend: TrendData[] }> {
    return request.get('/statistics/renewal', { params })
  },

  // 周期对比
  getCycleComparison(params?: {
    campusId?: number
    year?: number
  }): Promise<any[]> {
    return request.get('/statistics/cycle-comparison', { params })
  },

  // 校区对比
  getCampusComparison(): Promise<any[]> {
    return request.get('/statistics/campus-comparison')
  },

  // 导出报表
  exportReport(params?: {
    type: string
    campusId?: number
    startDate?: string
    endDate?: string
  }): Promise<Blob> {
    return request.get('/statistics/export', { params, responseType: 'blob' })
  },
}
