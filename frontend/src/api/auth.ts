import { request } from '@/utils/request'
import type { LoginRequest, LoginResponse, User } from '@/types'

export const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return request.post('/auth/login', data)
  },

  logout(): Promise<void> {
    return request.post('/auth/logout')
  },

  getProfile(): Promise<User> {
    return request.get('/auth/profile')
  },

  refreshToken(refreshToken: string): Promise<LoginResponse> {
    return request.post('/auth/refresh', { refreshToken })
  },

  changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
    return request.put('/auth/password', data)
  },
}
