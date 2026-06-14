/**
 * 雪道API路由
 * 处理雪道查询、巡检、状态更新等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type SlopeDifficulty } from '../data/store.js'
import {
  recordInspection,
  getSlopesOverview,
  getSlopesByDifficulty,
  getSlopeInspectionHistory,
  checkSlopeCapacity,
  type InspectionData,
} from '../services/slopeService.js'

const router = Router()

/**
 * 获取所有雪道状态概览
 * GET /api/slopes/overview
 */
router.get('/overview', (_req: Request, res: Response): void => {
  try {
    const overview = getSlopesOverview()

    res.json({
      success: true,
      data: overview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取雪道概览失败',
    })
  }
})

/**
 * 获取所有雪道列表
 * GET /api/slopes?difficulty=beginner&status=open
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { difficulty, status } = req.query
    let slopes = [...store.slopes]

    if (difficulty) {
      slopes = getSlopesByDifficulty(difficulty as SlopeDifficulty)
    }

    if (status) {
      slopes = slopes.filter((s) => s.status === status)
    }

    res.json({
      success: true,
      data: slopes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取雪道列表失败',
    })
  }
})

/**
 * 获取雪道详情
 * GET /api/slopes/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const slope = store.slopes.find((s) => s.id === id)

  if (!slope) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  const history = getSlopeInspectionHistory(id)

  res.json({
    success: true,
    data: {
      ...slope,
      inspectionHistory: history,
    },
  })
})

/**
 * 获取雪道容量状态
 * GET /api/slopes/:id/capacity
 */
router.get('/:id/capacity', (req: Request, res: Response): void => {
  const { id } = req.params

  const capacity = checkSlopeCapacity(id)

  if (!capacity) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  res.json({
    success: true,
    data: capacity,
  })
})

/**
 * 获取雪道巡检历史
 * GET /api/slopes/:id/inspections
 */
router.get('/:id/inspections', (req: Request, res: Response): void => {
  const { id } = req.params

  const slope = store.slopes.find((s) => s.id === id)
  if (!slope) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  const history = getSlopeInspectionHistory(id)

  res.json({
    success: true,
    data: history,
  })
})

/**
 * 提交巡检记录
 * POST /api/slopes/inspect
 */
router.post('/inspect', (req: Request, res: Response): void => {
  const {
    slopeId,
    managerId,
    snowQuality,
    temperature,
    visibility,
    safetyHazards,
    notes,
  } = req.body

  if (!slopeId || !managerId || snowQuality === undefined || temperature === undefined || visibility === undefined) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数',
    })
    return
  }

  const data: InspectionData = {
    slopeId,
    managerId,
    snowQuality: Number(snowQuality),
    temperature: Number(temperature),
    visibility: Number(visibility),
    safetyHazards: safetyHazards || [],
    notes: notes || '',
  }

  const result = recordInspection(data)

  if (!result) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  if (result.statusResult.newStatus !== result.statusResult.previousStatus) {
    store.users
      .filter((u) => u.role === 'visitor')
      .forEach((user) => {
        store.messages.push({
          id: generateId(),
          userId: user.id,
          type: 'slope',
          title: '雪道状态更新',
          content: `${result.slope?.name || '雪道'}状态已更新为${result.statusResult.newStatus === 'open' ? '开放' : result.statusResult.newStatus === 'caution' ? '注意' : '关闭'}。`,
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: slopeId,
        })
      })
  }

  res.json({
    success: true,
    data: result,
    message: '巡检记录已提交',
  })
})

/**
 * 手动更新雪道状态
 * PUT /api/slopes/:id/status
 */
router.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params
  const { status } = req.body

  const slope = store.slopes.find((s) => s.id === id)

  if (!slope) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  const prevStatus = slope.status
  slope.status = status

  if (prevStatus !== status) {
    store.users
      .filter((u) => u.role === 'visitor')
      .forEach((user) => {
        store.messages.push({
          id: generateId(),
          userId: user.id,
          type: 'slope',
          title: '雪道状态更新',
          content: `${slope.name}状态已由${prevStatus === 'open' ? '开放' : prevStatus === 'caution' ? '注意' : '关闭'}变更为${status === 'open' ? '开放' : status === 'caution' ? '注意' : '关闭'}。`,
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: id,
        })
      })
  }

  res.json({
    success: true,
    data: slope,
    message: '状态已更新',
  })
})

/**
 * 更新雪道当前人数
 * PUT /api/slopes/:id/count
 */
router.put('/:id/count', (req: Request, res: Response): void => {
  const { id } = req.params
  const { count, action } = req.body

  const slope = store.slopes.find((s) => s.id === id)

  if (!slope) {
    res.status(404).json({
      success: false,
      error: '雪道不存在',
    })
    return
  }

  if (action === 'increment') {
    slope.currentCount = Math.min(slope.capacity, slope.currentCount + 1)
  } else if (action === 'decrement') {
    slope.currentCount = Math.max(0, slope.currentCount - 1)
  } else if (count !== undefined) {
    slope.currentCount = Math.max(0, Math.min(slope.capacity, Number(count)))
  }

  res.json({
    success: true,
    data: {
      currentCount: slope.currentCount,
      capacity: slope.capacity,
      remaining: slope.capacity - slope.currentCount,
    },
  })
})

export default router
