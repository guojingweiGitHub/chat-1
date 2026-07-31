import { request } from '@/utils/request'
import type { User, Role, PaginatedResponse } from '@/types'

export const userApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    roleId?: number
    campusId?: number
    status?: string
  }): Promise<PaginatedResponse<User>> {
    return request.get('/users', { params })
  },

  getById(id: number): Promise<User> {
    return request.get(`/users/${id}`)
  },

  create(data: Partial<User> & { password: string }): Promise<User> {
    return request.post('/users', data)
  },

  update(id: number, data: Partial<User>): Promise<User> {
    return request.put(`/users/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/users/${id}`)
  },

  resetPassword(id: number, password: string): Promise<void> {
    return request.put(`/users/${id}/reset-password`, { password })
  },

  updateStatus(id: number, status: string): Promise<void> {
    return request.put(`/users/${id}/status`, { status })
  },
}

export const roleApi = {
  getList(params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<Role>> {
    return request.get('/roles', { params })
  },

  getAll(): Promise<Role[]> {
    return request.get('/roles/all')
  },

  getById(id: number): Promise<Role> {
    return request.get(`/roles/${id}`)
  },

  create(data: Partial<Role>): Promise<Role> {
    return request.post('/roles', data)
  },

  update(id: number, data: Partial<Role>): Promise<Role> {
    return request.put(`/roles/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/roles/${id}`)
  },

  getPermissions(): Promise<any[]> {
    return request.get('/permissions/tree')
  },
}
