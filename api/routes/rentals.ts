/**
 * 租赁API路由
 * 处理器材查询、尺码推荐、租赁、归还、赔偿等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type EquipmentType, type DamageLevel, type DamageReport, type DamageItem } from '../data/store.js'
import {
  recommendEquipmentSize,
  calculateDamageFee,
  getAvailableEquipment,
  getEquipmentInventoryStats,
  getDamageDescription,
} from '../services/equipmentService.js'

const router = Router()

/**
 * 获取器材尺码推荐
 * GET /api/rentals/recommend-size?height=175&weight=70&equipmentType=ski
 */
router.get('/recommend-size', (req: Request, res: Response): void => {
  const { height, weight, footSize, equipmentType } = req.query

  if (!height || !weight || !equipmentType) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：height、weight、equipmentType',
    })
    return
  }

  try {
    const recommendation = recommendEquipmentSize({
      height: parseFloat(height as string),
      weight: parseFloat(weight as string),
      footSize: footSize ? parseFloat(footSize as string) : undefined,
      equipmentType: equipmentType as EquipmentType,
    })

    res.json({
      success: true,
      data: recommendation,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '尺码推荐失败',
    })
  }
})

/**
 * 获取库存统计
 * GET /api/rentals/inventory
 */
router.get('/inventory', (_req: Request, res: Response): void => {
  try {
    const stats = getEquipmentInventoryStats()

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取库存统计失败',
    })
  }
})

/**
 * 获取可用器材列表
 * GET /api/rentals/equipment?type=ski&size=M
 */
router.get('/equipment', (req: Request, res: Response): void => {
  const { type, size } = req.query

  try {
    const equipment = getAvailableEquipment(
      type as EquipmentType | undefined,
      size as string | undefined,
    )

    res.json({
      success: true,
      data: equipment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取器材列表失败',
    })
  }
})

/**
 * 获取器材详情
 * GET /api/rentals/equipment/:id
 */
router.get('/equipment/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const equipment = store.equipment.find((e) => e.id === id)

  if (!equipment) {
    res.status(404).json({
      success: false,
      error: '器材不存在',
    })
    return
  }

  res.json({
    success: true,
    data: equipment,
  })
})

/**
 * 创建租赁订单
 * POST /api/rentals/create
 */
router.post('/create', (req: Request, res: Response): void => {
  const { visitorId, items, visitorHeight, visitorWeight } = req.body

  if (!visitorId || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorId 和 items',
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

  let totalPrice = 0
  const validItems = []

  for (const item of items) {
    const equipment = store.equipment.find((e) => e.id === item.equipmentId)
    if (!equipment) continue
    if (equipment.status !== 'available') continue

    equipment.status = 'rented'
    totalPrice += equipment.dailyPrice
    validItems.push({
      equipmentId: item.equipmentId,
      size: item.size || equipment.size,
    })
  }

  if (validItems.length === 0) {
    res.status(400).json({
      success: false,
      error: '没有可用的器材',
    })
    return
  }

  const order = {
    id: generateId(),
    visitorId,
    items: validItems,
    visitorHeight: visitorHeight || 170,
    visitorWeight: visitorWeight || 65,
    status: 'reserved' as const,
    totalPrice,
    createdAt: new Date().toISOString(),
  }

  store.rentalOrders.push(order)

  store.messages.push({
    id: generateId(),
    userId: visitorId,
    type: 'rental',
    title: '租赁订单创建成功',
    content: `您的租赁订单已创建，共${validItems.length}件器材，总计${totalPrice}元。请到店扫码领取。`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: order.id,
  })

  res.json({
    success: true,
    data: order,
    message: '订单创建成功',
  })
})

/**
 * 领取器材
 * POST /api/rentals/:id/pickup
 */
router.post('/:id/pickup', (req: Request, res: Response): void => {
  const { id } = req.params

  const order = store.rentalOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '订单不存在',
    })
    return
  }

  if (order.status !== 'reserved') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持领取',
    })
    return
  }

  order.status = 'picked'

  res.json({
    success: true,
    data: order,
    message: '领取成功',
  })
})

/**
 * 归还器材并检查损坏
 * POST /api/rentals/:id/return
 * 请求体：{ items: [{ equipmentId, damageLevel, damageNotes }] }
 */
router.post('/:id/return', (req: Request, res: Response): void => {
  const { id } = req.params
  const { items } = req.body

  const order = store.rentalOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '订单不存在',
    })
    return
  }

  if (order.status !== 'picked') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持归还',
    })
    return
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      success: false,
      error: '请提供损坏检查明细',
    })
    return
  }

  const damageItems: DamageItem[] = []
  let totalDamageFee = 0
  let hasDamage = false

  for (const item of items) {
    const equipment = store.equipment.find((e) => e.id === item.equipmentId)
    if (!equipment) continue

    const damageLevel = item.damageLevel as DamageLevel
    const damageFee = calculateDamageFee(item.equipmentId, damageLevel)

    const damageItem: DamageItem = {
      equipmentId: item.equipmentId,
      equipmentName: `${equipment.brand} ${equipment.model}`,
      damageLevel,
      damageNotes: item.damageNotes || '',
      damageFee,
    }
    damageItems.push(damageItem)

    if (damageLevel !== 'none' && damageFee > 0) {
      hasDamage = true
      totalDamageFee += damageFee
    }

    equipment.status = damageLevel === 'severe' ? 'damaged' : damageLevel === 'moderate' ? 'maintenance' : 'available'
  }

  order.status = hasDamage ? 'damaged' : 'returned'
  order.returnedAt = new Date().toISOString()
  order.damageFee = totalDamageFee
  order.damageLevel = hasDamage
    ? damageItems.some((d) => d.damageLevel === 'severe')
      ? 'severe'
      : damageItems.some((d) => d.damageLevel === 'moderate')
        ? 'moderate'
        : 'minor'
    : 'none'

  let damageReport: DamageReport | null = null
  if (hasDamage) {
    damageReport = {
      id: `damage-${Date.now().toString(36)}`,
      rentalOrderId: order.id,
      visitorId: order.visitorId,
      items: damageItems.filter((d) => d.damageLevel !== 'none'),
      totalDamageFee,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    store.damageReports.push(damageReport)

    store.messages.push({
      id: generateId(),
      userId: order.visitorId,
      type: 'rental',
      title: '雪具损坏赔偿通知',
      content: `您的租赁订单${order.id}归还时发现${damageItems.filter((d) => d.damageLevel !== 'none').length}件器材损坏，需赔偿${totalDamageFee}元。请查看赔偿单详情。`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: damageReport.id,
    })
  } else {
    store.messages.push({
      id: generateId(),
      userId: order.visitorId,
      type: 'rental',
      title: '雪具归还成功',
      content: `您的租赁订单${order.id}已成功归还，器材完好无损。感谢您的使用！`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: order.id,
    })
  }

  const itemsWithDetail = order.items.map((item) => {
    const equipment = store.equipment.find((e) => e.id === item.equipmentId)
    const damageItem = damageItems.find((d) => d.equipmentId === item.equipmentId)
    return {
      ...item,
      equipment,
      damageLevel: damageItem?.damageLevel || 'none',
      damageNotes: damageItem?.damageNotes,
      damageFee: damageItem?.damageFee || 0,
    }
  })

  res.json({
    success: true,
    data: {
      order: {
        ...order,
        items: itemsWithDetail,
      },
      damageReport,
    },
    message: hasDamage ? '归还成功，已生成赔偿单' : '归还成功',
  })
})

/**
 * 计算损坏赔偿
 * GET /api/rentals/damage-calc?equipmentId=eq_0001&damageLevel=minor
 */
router.get('/damage-calc', (req: Request, res: Response): void => {
  const { equipmentId, damageLevel } = req.query

  if (!equipmentId || !damageLevel) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：equipmentId 和 damageLevel',
    })
    return
  }

  const equipment = store.equipment.find((e) => e.id === equipmentId)
  if (!equipment) {
    res.status(404).json({
      success: false,
      error: '器材不存在',
    })
    return
  }

  const damageFee = calculateDamageFee(equipmentId as string, damageLevel as DamageLevel)
  const description = getDamageDescription(damageLevel as DamageLevel)

  res.json({
    success: true,
    data: {
      equipmentId,
      damageLevel,
      description,
      damageFee,
      equipmentValue: equipment.dailyPrice * 30,
      dailyPrice: equipment.dailyPrice,
    },
  })
})

/**
 * 获取赔偿单详情
 * GET /api/rentals/damage-report/:id
 */
router.get('/damage-report/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const damageReport = store.damageReports.find((d) => d.id === id)

  if (!damageReport) {
    res.status(404).json({
      success: false,
      error: '赔偿单不存在',
    })
    return
  }

  const order = store.rentalOrders.find((o) => o.id === damageReport.rentalOrderId)

  res.json({
    success: true,
    data: {
      ...damageReport,
      order,
    },
  })
})

/**
 * 获取我的赔偿单
 * GET /api/rentals/damage-reports/mine?visitorId=u001
 */
router.get('/damage-reports/mine', (req: Request, res: Response): void => {
  const { visitorId } = req.query

  if (!visitorId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorId',
    })
    return
  }

  const reports = store.damageReports
    .filter((d) => d.visitorId === visitorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  res.json({
    success: true,
    data: reports,
  })
})

/**
 * 支付赔偿
 * POST /api/rentals/damage-report/:id/pay
 */
router.post('/damage-report/:id/pay', (req: Request, res: Response): void => {
  const { id } = req.params

  const damageReport = store.damageReports.find((d) => d.id === id)

  if (!damageReport) {
    res.status(404).json({
      success: false,
      error: '赔偿单不存在',
    })
    return
  }

  if (damageReport.status === 'paid') {
    res.status(400).json({
      success: false,
      error: '该赔偿单已支付',
    })
    return
  }

  damageReport.status = 'paid'
  damageReport.paidAt = new Date().toISOString()

  store.messages.push({
    id: generateId(),
    userId: damageReport.visitorId,
    type: 'rental',
    title: '赔偿支付成功',
    content: `您的赔偿单${damageReport.id}已支付成功，金额${damageReport.totalDamageFee}元。感谢您的配合！`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: damageReport.id,
  })

  res.json({
    success: true,
    data: damageReport,
    message: '支付成功',
  })
})

/**
 * 获取我的租赁订单
 * GET /api/rentals/mine?visitorId=u001
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

  const orders = store.rentalOrders
    .filter((o) => o.visitorId === visitorId)
    .map((o) => {
      const itemsWithDetail = o.items.map((item) => {
        const equipment = store.equipment.find((e) => e.id === item.equipmentId)
        return {
          ...item,
          equipment,
        }
      })
      const damageReport = store.damageReports.find((d) => d.rentalOrderId === o.id)
      return {
        ...o,
        items: itemsWithDetail,
        damageReport,
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  res.json({
    success: true,
    data: orders,
  })
})

/**
 * 获取租赁订单详情
 * GET /api/rentals/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const order = store.rentalOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '订单不存在',
    })
    return
  }

  const itemsWithDetail = order.items.map((item) => {
    const equipment = store.equipment.find((e) => e.id === item.equipmentId)
    return {
      ...item,
      equipment,
    }
  })

  const damageReport = store.damageReports.find((d) => d.rentalOrderId === order.id)

  res.json({
    success: true,
    data: {
      ...order,
      items: itemsWithDetail,
      damageReport,
    },
  })
})

export default router
