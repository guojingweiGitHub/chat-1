import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, LoginResponse } from '@/types'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const refreshToken = ref<string>(localStorage.getItem('refreshToken') || '')
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const permissions = ref<string[]>(JSON.parse(localStorage.getItem('permissions') || '[]'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roleName === '管理员' || permissions.value.includes('*'))
  const username = computed(() => user.value?.realName || user.value?.username || '')

  async function login(credentials: LoginRequest) {
    const data = await authApi.login(credentials)
    setAuth(data)
    return data
  }

  function setAuth(data: LoginResponse) {
    token.value = data.token
    refreshToken.value = data.refreshToken
    user.value = data.user
    permissions.value = data.permissions

    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('permissions', JSON.stringify(data.permissions))
  }

  function logout() {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    permissions.value = []

    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
  }

  function hasPermission(permission: string): boolean {
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(permission)
  }

  return {
    token,
    refreshToken,
    user,
    permissions,
    isLoggedIn,
    isAdmin,
    username,
    login,
    setAuth,
    logout,
    hasPermission,
  }
})
