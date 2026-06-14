import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TicketOrder, TicketType } from '@shared/types'

export type { TicketOrder, TicketType }

export interface CapacityInfo {
  used: number
  remaining: number
  max: number
  percentage: number
}

export interface PriceInfo {
  basePrice: number
  dynamicFactor: number
  finalPrice: number
}

interface PurchaseData {
  visitorId: string
  date: string
  ticketType: TicketType
  quantity: number
  weather?: string
}

interface TicketState {
  tickets: TicketOrder[]
  currentPrice: PriceInfo | null
  remainingCapacity: CapacityInfo | null
  isLoading: boolean
  error: string | null

  fetchPrice: (date: string, type: TicketType, weather?: string) => Promise<void>
  fetchCapacity: (date: string) => Promise<void>
  purchaseTicket: (data: PurchaseData) => Promise<TicketOrder | null>
  fetchMyTickets: (visitorId: string) => Promise<void>
  refundTicket: (id: string) => Promise<boolean>
  clearError: () => void
}

const API_BASE = '/api/tickets'

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: [],
      currentPrice: null,
      remainingCapacity: null,
      isLoading: false,
      error: null,

      fetchPrice: async (date: string, type: TicketType, weather?: string) => {
        set({ isLoading: true, error: null })
        try {
          const params = new URLSearchParams({
            date,
            ticketType: type,
            ...(weather && { weather }),
          })
          const response = await fetch(`${API_BASE}/price?${params}`)
          const result = await response.json()

          if (result.success) {
            set({ currentPrice: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取票价失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取票价失败',
            isLoading: false,
          })
        }
      },

      fetchCapacity: async (date: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/capacity?date=${date}`)
          const result = await response.json()

          if (result.success) {
            set({ remainingCapacity: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取容量信息失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取容量信息失败',
            isLoading: false,
          })
        }
      },

      purchaseTicket: async (data: PurchaseData): Promise<TicketOrder | null> => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          const result = await response.json()

          if (result.success) {
            const newTicket = result.data
            set((state) => ({
              tickets: [newTicket, ...state.tickets],
              isLoading: false,
            }))

            get().fetchCapacity(data.date)

            return newTicket
          } else {
            set({ error: result.error || '购票失败', isLoading: false })
            return null
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '购票失败',
            isLoading: false,
          })
          return null
        }
      },

      fetchMyTickets: async (visitorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/mine?visitorId=${visitorId}`)
          const result = await response.json()

          if (result.success) {
            set({ tickets: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取我的雪票失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取我的雪票失败',
            isLoading: false,
          })
        }
      },

      refundTicket: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/${id}/refund`, {
            method: 'POST',
          })
          const result = await response.json()

          if (result.success) {
            set((state) => ({
              tickets: state.tickets.map((t) =>
                t.id === id ? { ...t, status: 'refunded' as const } : t
              ),
              isLoading: false,
            }))
            return true
          } else {
            set({ error: result.error || '退票失败', isLoading: false })
            return false
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '退票失败',
            isLoading: false,
          })
          return false
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'ski-ticket-storage',
      partialize: (state) => ({
        tickets: state.tickets,
      }),
    }
  )
)

export const getTicketTypeName = (type: TicketType): string => {
  const names: Record<TicketType, string> = {
    adult: '成人票',
    child: '儿童票',
    senior: '老人票',
    halfday: '半日票',
  }
  return names[type]
}

export const getTicketStatusName = (status: string): string => {
  const names: Record<string, string> = {
    paid: '未使用',
    used: '已使用',
    refunded: '已退款',
  }
  return names[status] || status
}
