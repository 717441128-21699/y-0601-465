/**
 * 票务API路由
 * 处理票务查询、动态定价、购票、退票等操作
 */

import { Router, type Request, type Response } from 'express'
import {
  store,
  generateId,
  generateQRCode,
  generateVerifyCode,
  type TicketType,
  getCapacityInfo,
  getRemainingCapacity,
  addTicketOrder,
  refundTicketCapacity,
} from '../data/store.js'
import { calculateDynamicPrice, getWeeklyPriceForecast } from '../services/pricingService.js'

const router = Router()

/**
 * 获取动态票价
 * GET /api/tickets/price?date=2026-06-15&ticketType=adult&weather=晴
 */
router.get('/price', (req: Request, res: Response): void => {
  const { date, ticketType, weather } = req.query

  if (!date || !ticketType) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：date 和 ticketType',
    })
    return
  }

  try {
    const price = calculateDynamicPrice(
      date as string,
      ticketType as TicketType,
      (weather as string) || '晴',
    )

    res.json({
      success: true,
      data: price,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '计算票价失败',
    })
  }
})

/**
 * 获取指定日期剩余容量
 * GET /api/tickets/capacity?date=2026-06-15
 */
router.get('/capacity', (req: Request, res: Response): void => {
  const { date } = req.query

  if (!date) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：date',
    })
    return
  }

  try {
    const capacityInfo = getCapacityInfo(date as string)

    res.json({
      success: true,
      data: capacityInfo,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取容量信息失败',
    })
  }
})

/**
 * 获取近7天票价预测
 * GET /api/tickets/forecast?ticketType=adult&weather=晴
 */
router.get('/forecast', (req: Request, res: Response): void => {
  const { ticketType, weather } = req.query

  if (!ticketType) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：ticketType',
    })
    return
  }

  try {
    const forecast = getWeeklyPriceForecast(
      ticketType as TicketType,
      (weather as string) || '晴',
    )

    res.json({
      success: true,
      data: forecast,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取票价预测失败',
    })
  }
})

/**
 * 购买雪票
 * POST /api/tickets/purchase
 * 请求体：{ visitorId, date, ticketType, quantity, weather }
 */
router.post('/purchase', (req: Request, res: Response): void => {
  const { visitorId, date, ticketType, quantity, weather } = req.body

  if (!visitorId || !date || !ticketType) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorId、date、ticketType',
    })
    return
  }

  const ticketQuantity = quantity || 1
  if (ticketQuantity < 1 || ticketQuantity > 10) {
    res.status(400).json({
      success: false,
      error: '购票数量必须在1-10张之间',
    })
    return
  }

  const visitor = store.users.find((u) => u.id === visitorId)
  if (!visitor) {
    res.status(404).json({
      success: false,
      error: '用户不存在',
    })
    return
  }

  const remaining = getRemainingCapacity(date)
  if (remaining < ticketQuantity) {
    res.status(400).json({
      success: false,
      error: '当日雪场容量已满',
    })
    return
  }

  try {
    const priceInfo = calculateDynamicPrice(date, ticketType as TicketType, weather || '晴')

    const order = {
      id: generateId(),
      visitorId,
      date,
      ticketType: ticketType as TicketType,
      basePrice: priceInfo.basePrice,
      dynamicFactor: priceInfo.dynamicFactor,
      finalPrice: priceInfo.finalPrice * ticketQuantity,
      qrCode: generateQRCode(),
      verifyCode: generateVerifyCode(),
      quantity: ticketQuantity,
      status: 'paid' as const,
      createdAt: new Date().toISOString(),
    }

    const success = addTicketOrder(order, ticketQuantity)

    if (!success) {
      res.status(400).json({
        success: false,
        error: '当日雪场容量已满',
      })
      return
    }

    store.messages.push({
      id: generateId(),
      userId: visitorId,
      type: 'ticket',
      title: '购票成功',
      content: `您已成功购买${date}的${ticketType === 'adult' ? '成人票' : ticketType === 'child' ? '儿童票' : ticketType === 'senior' ? '老年票' : '半天票'}${ticketQuantity}张，票价${priceInfo.finalPrice * ticketQuantity}元。`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: order.id,
    })

    res.json({
      success: true,
      data: order,
      message: '购票成功',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '购票失败',
    })
  }
})

/**
 * 获取用户雪票列表
 * GET /api/tickets/mine?visitorId=u001
 */
router.get('/mine', (req: Request, res: Response): void => {
  const { visitorId } = req.query

  if (!visitorId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorId',
    })
    return
  }

  const orders = store.ticketOrders
    .filter((o) => o.visitorId === visitorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  res.json({
    success: true,
    data: orders,
  })
})

/**
 * 获取雪票详情
 * GET /api/tickets/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const order = store.ticketOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '雪票不存在',
    })
    return
  }

  res.json({
    success: true,
    data: order,
  })
})

/**
 * 退票
 * POST /api/tickets/:id/refund
 */
router.post('/:id/refund', (req: Request, res: Response): void => {
  const { id } = req.params

  const order = store.ticketOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '雪票不存在',
    })
    return
  }

  if (order.status !== 'paid') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持退票',
    })
    return
  }

  order.status = 'refunded'
  refundTicketCapacity(order.date, order.quantity || 1)

  store.messages.push({
    id: generateId(),
    userId: order.visitorId,
    type: 'ticket',
    title: '退票成功',
    content: `您的雪票（订单号：${id}）已成功退票，退款将在1-3个工作日内到账。`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: id,
  })

  res.json({
    success: true,
    data: order,
    message: '退票成功',
  })
})

/**
 * 使用雪票（核销）
 * POST /api/tickets/:id/use
 */
router.post('/:id/use', (req: Request, res: Response): void => {
  const { id } = req.params

  const order = store.ticketOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '雪票不存在',
    })
    return
  }

  if (order.status !== 'paid') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持核销',
    })
    return
  }

  order.status = 'used'

  res.json({
    success: true,
    data: order,
    message: '核销成功',
  })
})

export default router
