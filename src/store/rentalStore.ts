import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RentalOrder, DamageReport, DamageLevel, DamageItem, RentalItem } from '@shared/types'

export type { RentalOrder, DamageReport, DamageLevel, DamageItem, RentalItem }

export interface RentalItemWithEquipment extends RentalItem {
  equipment?: {
    id: string
    type: string
    brand: string
    model: string
    size: string
    dailyPrice: number
  }
}

export interface RentalOrderWithDetail extends Omit<RentalOrder, 'items'> {
  items: RentalItemWithEquipment[]
  damageReport?: DamageReport
}

interface ReturnDamageItem {
  equipmentId: string
  damageLevel: DamageLevel
  damageNotes?: string
}

interface RentalState {
  rentals: RentalOrderWithDetail[]
  currentRental: RentalOrderWithDetail | null
  damageReports: DamageReport[]
  isLoading: boolean
  error: string | null

  fetchMyRentals: (visitorId: string) => Promise<void>
  getRentalDetail: (id: string) => Promise<void>
  returnEquipment: (orderId: string, damageItems: ReturnDamageItem[]) => Promise<{
    order: RentalOrderWithDetail
    damageReport: DamageReport | null
  } | null>
  fetchDamageReports: (visitorId: string) => Promise<void>
  getDamageReport: (id: string) => Promise<DamageReport | null>
  payDamageReport: (reportId: string) => Promise<boolean>
  clearError: () => void
  clearCurrentRental: () => void
}

const API_BASE = '/api/rentals'

export const useRentalStore = create<RentalState>()(
  persist(
    (set, get) => ({
      rentals: [],
      currentRental: null,
      damageReports: [],
      isLoading: false,
      error: null,

      fetchMyRentals: async (visitorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/mine?visitorId=${visitorId}`)
          const result = await response.json()
          if (result.success) {
            set({ rentals: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取租赁订单失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取租赁订单失败',
            isLoading: false,
          })
        }
      },

      getRentalDetail: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/${id}`)
          const result = await response.json()
          if (result.success) {
            set({ currentRental: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取订单详情失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取订单详情失败',
            isLoading: false,
          })
        }
      },

      returnEquipment: async (orderId: string, damageItems: ReturnDamageItem[]) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/${orderId}/return`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: damageItems }),
          })
          const result = await response.json()
          if (result.success) {
            const { order, damageReport } = result.data
            set((state) => ({
              rentals: state.rentals.map((r) => (r.id === order.id ? order : r)),
              currentRental: order,
              isLoading: false,
            }))
            if (damageReport) {
              set((state) => ({
                damageReports: [damageReport, ...state.damageReports],
              }))
            }
            return result.data
          } else {
            set({ error: result.error || '归还失败', isLoading: false })
            return null
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '归还失败',
            isLoading: false,
          })
          return null
        }
      },

      fetchDamageReports: async (visitorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/damage-reports/mine?visitorId=${visitorId}`)
          const result = await response.json()
          if (result.success) {
            set({ damageReports: result.data, isLoading: false })
          } else {
            set({ error: result.error || '获取赔偿单失败', isLoading: false })
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取赔偿单失败',
            isLoading: false,
          })
        }
      },

      getDamageReport: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/damage-report/${id}`)
          const result = await response.json()
          if (result.success) {
            set({ isLoading: false })
            return result.data
          } else {
            set({ error: result.error || '获取赔偿单详情失败', isLoading: false })
            return null
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '获取赔偿单详情失败',
            isLoading: false,
          })
          return null
        }
      },

      payDamageReport: async (reportId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/damage-report/${reportId}/pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const result = await response.json()
          if (result.success) {
            set((state) => ({
              damageReports: state.damageReports.map((d) =>
                d.id === reportId ? result.data : d
              ),
              isLoading: false,
            }))
            return true
          } else {
            set({ error: result.error || '支付失败', isLoading: false })
            return false
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '支付失败',
            isLoading: false,
          })
          return false
        }
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentRental: () => {
        set({ currentRental: null })
      },
    }),
    {
      name: 'ski-rental-storage',
      partialize: (state) => ({
        rentals: state.rentals,
        damageReports: state.damageReports,
      }),
    }
  )
)

export const calculateDamageFee = (dailyPrice: number, damageLevel: DamageLevel): number => {
  const equipmentValue = dailyPrice * 30
  switch (damageLevel) {
    case 'none':
      return 0
    case 'minor':
      return Math.round(dailyPrice * 3)
    case 'moderate':
      return Math.round(equipmentValue * 0.2)
    case 'severe':
      return Math.round(equipmentValue * 0.7)
    default:
      return 0
  }
}

export const getDamageLevelLabel = (level: DamageLevel): string => {
  const labels: Record<DamageLevel, string> = {
    none: '完好',
    minor: '轻微损坏',
    moderate: '中度损坏',
    severe: '严重损坏',
  }
  return labels[level]
}

export const getDamageLevelColor = (level: DamageLevel): string => {
  const colors: Record<DamageLevel, string> = {
    none: 'text-success bg-success/10 border-success/30',
    minor: 'text-warning bg-warning/10 border-warning/30',
    moderate: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    severe: 'text-danger bg-danger/10 border-danger/30',
  }
  return colors[level]
}
