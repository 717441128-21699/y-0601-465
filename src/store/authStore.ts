import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole, User } from '@shared/types'

export type { UserRole, User }

export const roleLabels: Record<UserRole, string> = {
  visitor: '游客',
  coach: '滑雪教练',
  rental_admin: '雪具管理员',
  manager: '运营经理',
  finance: '财务',
}

export const roleDescriptions: Record<UserRole, string> = {
  visitor: '购票、预约教练、租赁雪具',
  coach: '课程管理、学员预约',
  rental_admin: '雪具出入库、库存管理',
  manager: '雪道巡检、运营调度、救援管理',
  finance: '收入统计、财务报表',
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  clearError: () => void
}

const API_BASE = '/api/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })

          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.message || '登录失败')
          }

          const data = await response.json()
          const { user, token } = data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '登录失败',
            isLoading: false,
          })
          throw err
        }
      },

      logout: async () => {
        const { token } = get()
        try {
          await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
        } catch {
          // noop
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      getCurrentUser: async () => {
        const { token } = get()
        if (!token) {
          return
        }

        set({ isLoading: true })
        try {
          const response = await fetch(`${API_BASE}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error('获取用户信息失败')
          }

          const data = await response.json()
          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'ski-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const getRoleDashboardPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    visitor: '/visitor/dashboard',
    coach: '/coach/dashboard',
    rental_admin: '/rental/dashboard',
    manager: '/manager/dashboard',
    finance: '/finance/dashboard',
  }
  return paths[role]
}

export const getRoleName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    visitor: '游客',
    coach: '教练',
    rental_admin: '雪具管理员',
    manager: '运营经理',
    finance: '财务',
  }
  return names[role]
}
