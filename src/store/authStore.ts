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

  login: (username: string, password: string, role?: UserRole) => Promise<void>
  logout: () => void
  clearError: () => void
}

const demoUsers: Record<string, { user: User; token: string }> = {
  visitor: {
    user: {
      id: 'v1001',
      role: 'visitor',
      name: '李雪晴',
      phone: '138****1234',
      avatar: undefined,
    },
    token: 'visitor-token-demo-v1001',
  },
  coach: {
    user: {
      id: 'c2001',
      role: 'coach',
      name: '王雪峰',
      phone: '139****5678',
      employeeId: 'COACH-2024-001',
      avatar: undefined,
    },
    token: 'coach-token-demo-c2001',
  },
  rental_admin: {
    user: {
      id: 'r3001',
      role: 'rental_admin',
      name: '赵冰洁',
      phone: '137****9012',
      employeeId: 'RENTAL-2024-001',
      avatar: undefined,
    },
    token: 'rental-token-demo-r3001',
  },
  manager: {
    user: {
      id: 'm4001',
      role: 'manager',
      name: '陈远山',
      phone: '136****3456',
      employeeId: 'MGR-2024-001',
      avatar: undefined,
    },
    token: 'manager-token-demo-m4001',
  },
  finance: {
    user: {
      id: 'f5001',
      role: 'finance',
      name: '孙玉华',
      phone: '135****7890',
      employeeId: 'FIN-2024-001',
      avatar: undefined,
    },
    token: 'finance-token-demo-f5001',
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string, _role?: UserRole) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          const found = demoUsers[username]
          if (found && password === '123456') {
            set({
              user: found.user,
              token: found.token,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              error: '用户名或密码错误',
              isLoading: false,
            })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '登录失败',
            isLoading: false,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
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
