/**
 * 租赁API路由
 * 处理器材查询、尺码推荐、租赁、归还、赔偿等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type EquipmentType, type DamageLevel } from '../data/store.js'
import {
  recommendEquipmentSize,
  calculateDamageFee,
  getAvailableEquipment,
  getEquipmentInventoryStats,
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
 * 归还器材
 * POST /api/rentals/:id/return
 */
router.post('/:id/return', (req: Request, res: Response): void => {
  const { id } = req.params
  const { damageLevel } = req.body

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

  order.status = damageLevel && damageLevel !== 'none' ? 'damaged' : 'returned'
  order.returnedAt = new Date().toISOString()

  if (damageLevel) {
    order.damageLevel = damageLevel as DamageLevel
  }

  for (const item of order.items) {
    const equipment = store.equipment.find((e) => e.id === item.equipmentId)
    if (equipment) {
      equipment.status = damageLevel && damageLevel !== 'none' ? 'damaged' : 'available'
    }
  }

  res.json({
    success: true,
    data: order,
    message: '归还成功',
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

  const result = calculateDamageFee(equipmentId as string, damageLevel as DamageLevel)

  if (!result) {
    res.status(404).json({
      success: false,
      error: '器材不存在',
    })
    return
  }

  res.json({
    success: true,
    data: result,
  })
})

/**
 * 支付赔偿
 * POST /api/rentals/:id/pay-damage
 */
router.post('/:id/pay-damage', (req: Request, res: Response): void => {
  const { id } = req.params
  const { equipmentId, damageLevel } = req.body

  const order = store.rentalOrders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '订单不存在',
    })
    return
  }

  const damageCalc = calculateDamageFee(equipmentId, damageLevel as DamageLevel)
  if (!damageCalc) {
    res.status(400).json({
      success: false,
      error: '赔偿计算失败',
    })
    return
  }

  order.damageFee = damageCalc.finalFee
  order.damageLevel = damageLevel as DamageLevel

  store.messages.push({
    id: generateId(),
    userId: order.visitorId,
    type: 'rental',
    title: '损坏赔偿通知',
    content: `您的租赁订单${id}产生损坏赔偿费${damageCalc.finalFee}元（${damageCalc.description}）。`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: id,
  })

  res.json({
    success: true,
    data: {
      order,
      damage: damageCalc,
    },
    message: '赔偿费用已生成',
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
      return {
        ...o,
        items: itemsWithDetail,
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

  res.json({
    success: true,
    data: {
      ...order,
      items: itemsWithDetail,
    },
  })
})

export default router
