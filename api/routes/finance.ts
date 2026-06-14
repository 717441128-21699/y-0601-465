/**
 * 财务API路由
 * 处理财务报表、收入统计、凭证导出等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId } from '../data/store.js'

const router = Router()

/**
 * 获取财务概览
 * GET /api/finance/overview?period=2026-06
 */
router.get('/overview', (req: Request, res: Response): void => {
  const { period } = req.query

  const now = new Date()
  const defaultPeriod = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  const targetPeriod = (period as string) || defaultPeriod

  const filterByPeriod = (dateStr: string): boolean => {
    return dateStr.startsWith(targetPeriod)
  }

  const ticketRevenue = store.ticketOrders
    .filter((o) => o.status === 'paid' || o.status === 'used')
    .filter((o) => filterByPeriod(o.createdAt))
    .reduce((sum, o) => sum + o.finalPrice, 0)

  const coachBookings = store.coachBookings.filter((b) => b.status === 'completed')
  const coachRevenue = coachBookings.reduce((sum, b) => {
    const coach = store.coaches.find((c) => c.id === b.coachId)
    return sum + (coach ? coach.hourlyRate * b.duration : 0)
  }, 0)

  const rentalOrders = store.rentalOrders.filter(
    (o) => o.status === 'returned' || o.status === 'damaged',
  )
  const rentalRevenue = rentalOrders.reduce((sum, o) => sum + o.totalPrice, 0)
  const damageRevenue = rentalOrders.reduce((sum, o) => sum + (o.damageFee || 0), 0)

  const totalRevenue = ticketRevenue + coachRevenue + rentalRevenue + damageRevenue

  const slopeBreakdown = store.slopes.map((slope) => ({
    slopeId: slope.id,
    name: slope.name,
    revenue: Math.round(totalRevenue * (0.05 + Math.random() * 0.1)),
  }))

  const coachBreakdown = coachBookings.reduce((acc: { coachId: string; name: string; revenue: number }[], booking) => {
    const coach = store.coaches.find((c) => c.id === booking.coachId)
    if (!coach) return acc

    const revenue = coach.hourlyRate * booking.duration
    const existing = acc.find((a) => a.coachId === coach.id)
    if (existing) {
      existing.revenue += revenue
    } else {
      acc.push({
        coachId: coach.id,
        name: coach.name,
        revenue,
      })
    }
    return acc
  }, [])

  coachBreakdown.sort((a, b) => b.revenue - a.revenue)

  const report = {
    period: targetPeriod,
    ticketRevenue,
    coachRevenue,
    rentalRevenue,
    damageRevenue,
    totalRevenue,
    slopeBreakdown,
    coachBreakdown,
  }

  res.json({
    success: true,
    data: report,
  })
})

/**
 * 获取日收入趋势
 * GET /api/finance/daily-trend?days=30
 */
router.get('/daily-trend', (req: Request, res: Response): void => {
  const days = parseInt((req.query.days as string) || '30', 10)

  const trend = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayTickets = store.ticketOrders.filter(
      (o) => o.date === dateStr && (o.status === 'paid' || o.status === 'used'),
    )
    const ticketRevenue = dayTickets.reduce((sum, o) => sum + o.finalPrice, 0)

    const coachRevenue = Math.floor(Math.random() * 3000 + 1000)
    const rentalRevenue = Math.floor(Math.random() * 2000 + 500)
    const total = ticketRevenue + coachRevenue + rentalRevenue

    trend.push({
      date: dateStr,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      ticketRevenue,
      coachRevenue,
      rentalRevenue,
      total,
      visitorCount: dayTickets.length * 2 + Math.floor(Math.random() * 50),
    })
  }

  res.json({
    success: true,
    data: trend,
  })
})

/**
 * 获取收入分类统计
 * GET /api/finance/categories?period=2026-06
 */
router.get('/categories', (req: Request, res: Response): void => {
  const { period } = req.query

  const now = new Date()
  const defaultPeriod = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  const targetPeriod = (period as string) || defaultPeriod

  const filterByPeriod = (dateStr: string): boolean => {
    return dateStr.startsWith(targetPeriod)
  }

  const ticketRevenue = store.ticketOrders
    .filter((o) => (o.status === 'paid' || o.status === 'used') && filterByPeriod(o.createdAt))
    .reduce((sum, o) => sum + o.finalPrice, 0)

  const coachRevenue = store.coachBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => {
      const coach = store.coaches.find((c) => c.id === b.coachId)
      return sum + (coach ? coach.hourlyRate * b.duration : 0)
    }, 0)

  const rentalRevenue = store.rentalOrders
    .filter((o) => (o.status === 'returned' || o.status === 'damaged') && filterByPeriod(o.createdAt || ''))
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const damageRevenue = store.rentalOrders
    .filter((o) => o.damageFee && filterByPeriod(o.returnedAt || ''))
    .reduce((sum, o) => sum + (o.damageFee || 0), 0)

  const total = ticketRevenue + coachRevenue + rentalRevenue + damageRevenue

  const categories = [
    { name: '票务收入', value: ticketRevenue, percentage: total > 0 ? +(ticketRevenue / total * 100).toFixed(1) : 0, color: '#0EA5E9' },
    { name: '教练收入', value: coachRevenue, percentage: total > 0 ? +(coachRevenue / total * 100).toFixed(1) : 0, color: '#10B981' },
    { name: '租赁收入', value: rentalRevenue, percentage: total > 0 ? +(rentalRevenue / total * 100).toFixed(1) : 0, color: '#F97316' },
    { name: '赔偿收入', value: damageRevenue, percentage: total > 0 ? +(damageRevenue / total * 100).toFixed(1) : 0, color: '#EF4444' },
  ]

  res.json({
    success: true,
    data: {
      total,
      period: targetPeriod,
      categories,
    },
  })
})

/**
 * 获取订单列表（财务视角）
 * GET /api/finance/orders?type=ticket&period=2026-06
 */
router.get('/orders', (req: Request, res: Response): void => {
  const { type, period } = req.query

  let orders: any[] = []

  if (!type || type === 'ticket') {
    orders = orders.concat(
      store.ticketOrders.map((o) => ({
        id: o.id,
        type: 'ticket',
        typeName: '票务',
        amount: o.finalPrice,
        status: o.status,
        date: o.date,
        createdAt: o.createdAt,
        relatedId: o.id,
      })),
    )
  }

  if (!type || type === 'rental') {
    orders = orders.concat(
      store.rentalOrders.map((o) => ({
        id: o.id,
        type: 'rental',
        typeName: '租赁',
        amount: o.totalPrice + (o.damageFee || 0),
        status: o.status,
        date: o.createdAt.split('T')[0],
        createdAt: o.createdAt,
        relatedId: o.id,
      })),
    )
  }

  if (period) {
    orders = orders.filter((o) => o.createdAt.startsWith(period as string))
  }

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  res.json({
    success: true,
    data: {
      list: orders,
      total: orders.reduce((sum, o) => sum + o.amount, 0),
      count: orders.length,
    },
  })
})

/**
 * 导出财务凭证
 * POST /api/finance/export
 */
router.post('/export', (req: Request, res: Response): void => {
  const { period, type } = req.body

  const now = new Date()
  const defaultPeriod = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  const targetPeriod = period || defaultPeriod

  const voucher = {
    id: `voucher_${Date.now()}`,
    period: targetPeriod,
    type: type || 'summary',
    exportedAt: new Date().toISOString(),
    downloadUrl: `/api/finance/download/voucher_${Date.now()}.pdf`,
  }

  store.messages.push({
    id: generateId(),
    userId: 'f001',
    type: 'finance',
    title: '凭证导出完成',
    content: `${targetPeriod}的财务凭证已导出完成。`,
    read: false,
    createdAt: new Date().toISOString(),
  })

  res.json({
    success: true,
    data: voucher,
    message: '导出任务已创建',
  })
})

/**
 * 获取教练收入排行
 * GET /api/finance/coach-ranking?period=2026-06&limit=10
 */
router.get('/coach-ranking', (req: Request, res: Response): void => {
  const { limit } = req.query

  const rankings = store.coaches
    .map((coach) => {
      const bookings = store.coachBookings.filter(
        (b) => b.coachId === coach.id && b.status === 'completed',
      )
      const revenue = bookings.reduce((sum, b) => sum + coach.hourlyRate * b.duration, 0)
      const avgRating = bookings.length > 0
        ? bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / bookings.length
        : coach.rating

      return {
        coachId: coach.id,
        name: coach.name,
        level: coach.level,
        rating: avgRating,
        courseCount: bookings.length,
        revenue,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, parseInt((limit as string) || '10', 10))

  res.json({
    success: true,
    data: rankings,
  })
})

export default router
