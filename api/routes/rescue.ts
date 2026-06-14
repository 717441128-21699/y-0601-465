/**
 * 救援API路由
 * 处理呼救、救援调度、事件管理等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type RescueEventType, type RescueEventStatus } from '../data/store.js'
import {
  createRescueEvent,
  updateRescueStatus,
  getPendingRescueEvents,
  getRescueEvents,
  getRescuersOverview,
  assignRescuer,
  selectOptimalRescuer,
  type RescueCreateParams,
} from '../services/rescueService.js'

const router = Router()

/**
 * 发起一键呼救
 * POST /api/rescue/sos
 */
router.post('/sos', (req: Request, res: Response): void => {
  const { visitorId, visitorName, slopeId, location, type } = req.body

  if (!visitorName || !slopeId || !location || !type) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorName、slopeId、location、type',
    })
    return
  }

  const params: RescueCreateParams = {
    visitorId,
    visitorName,
    slopeId,
    location,
    type: type as RescueEventType,
  }

  const result = createRescueEvent(params)

  if (result.dispatch) {
    store.messages.push({
      id: generateId(),
      userId: 'm001',
      type: 'rescue',
      title: '新的救援请求',
      content: `${visitorName}在${slopeId}发起${type === 'injury' ? '受伤' : type === 'lost' ? '迷路' : type === 'equipment' ? '器材故障' : '其他'}呼救，已自动调度${result.dispatch.rescuer.name}前往处理。`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: result.event.id,
    })
  }

  res.json({
    success: true,
    data: result,
    message: '呼救已发送，救援人员正在赶来',
  })
})

/**
 * 获取待处理救援事件列表
 * GET /api/rescue/pending
 */
router.get('/pending', (_req: Request, res: Response): void => {
  try {
    const events = getPendingRescueEvents()

    const enriched = events.map((e) => {
      const slope = store.slopes.find((s) => s.id === e.slopeId)
      const rescuer = e.rescuerId ? store.rescuers.find((r) => r.id === e.rescuerId) : undefined
      return {
        ...e,
        slopeName: slope?.name,
        rescuerName: rescuer?.name,
        rescuerStatus: rescuer?.status,
      }
    })

    res.json({
      success: true,
      data: enriched,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取待处理事件失败',
    })
  }
})

/**
 * 获取所有救援事件
 * GET /api/rescue?status=pending&limit=50
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { status, limit } = req.query

    const events = getRescueEvents(
      status as RescueEventStatus | undefined,
      limit ? parseInt(limit as string, 10) : 50,
    )

    const enriched = events.map((e) => {
      const slope = store.slopes.find((s) => s.id === e.slopeId)
      const rescuer = e.rescuerId ? store.rescuers.find((r) => r.id === e.rescuerId) : undefined
      const visitor = e.visitorId ? store.users.find((u) => u.id === e.visitorId) : undefined
      return {
        ...e,
        slopeName: slope?.name,
        rescuerName: rescuer?.name,
        visitorPhone: visitor?.phone,
      }
    })

    res.json({
      success: true,
      data: enriched,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取救援事件失败',
    })
  }
})

/**
 * 获取救援事件详情
 * GET /api/rescue/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const event = store.rescueEvents.find((e) => e.id === id)

  if (!event) {
    res.status(404).json({
      success: false,
      error: '救援事件不存在',
    })
    return
  }

  const slope = store.slopes.find((s) => s.id === event.slopeId)
  const rescuer = event.rescuerId ? store.rescuers.find((r) => r.id === event.rescuerId) : undefined
  const visitor = event.visitorId ? store.users.find((u) => u.id === event.visitorId) : undefined

  res.json({
    success: true,
    data: {
      ...event,
      slopeName: slope?.name,
      rescuer,
      visitorPhone: visitor?.phone,
    },
  })
})

/**
 * 更新救援事件状态
 * PUT /api/rescue/:id/status
 */
router.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params
  const { status, report, photos } = req.body

  if (!status) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：status',
    })
    return
  }

  const event = updateRescueStatus(
    id,
    status as RescueEventStatus,
    report,
    photos,
  )

  if (!event) {
    res.status(404).json({
      success: false,
      error: '救援事件不存在',
    })
    return
  }

  if (event.visitorId) {
    const statusText = status === 'dispatched'
      ? '救援人员已出发'
      : status === 'in_progress'
        ? '救援进行中'
        : status === 'completed'
          ? '救援已完成'
          : '等待处理'

    store.messages.push({
      id: generateId(),
      userId: event.visitorId,
      type: 'rescue',
      title: '救援状态更新',
      content: `您的救援请求状态已更新：${statusText}`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: id,
    })
  }

  res.json({
    success: true,
    data: event,
    message: '状态已更新',
  })
})

/**
 * 手动指定救援人员
 * POST /api/rescue/:id/assign
 */
router.post('/:id/assign', (req: Request, res: Response): void => {
  const { id } = req.params
  const { rescuerId } = req.body

  if (!rescuerId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：rescuerId',
    })
    return
  }

  const result = assignRescuer(id, rescuerId)

  if (!result) {
    res.status(400).json({
      success: false,
      error: '指定失败，事件或救援人员不存在，或救援人员不可用',
    })
    return
  }

  res.json({
    success: true,
    data: result,
    message: '已成功指定救援人员',
  })
})

/**
 * 推荐最优救援人员
 * GET /api/rescue/recommend-rescuer?type=injury&x=30&y=45
 */
router.get('/recommend/rescuer', (req: Request, res: Response): void => {
  const { type, x, y } = req.query

  if (!type || !x || !y) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：type、x、y',
    })
    return
  }

  const result = selectOptimalRescuer(
    type as RescueEventType,
    {
      x: parseFloat(x as string),
      y: parseFloat(y as string),
    },
  )

  if (!result) {
    res.status(404).json({
      success: false,
      error: '暂无可用救援人员',
    })
    return
  }

  res.json({
    success: true,
    data: result,
  })
})

/**
 * 获取救援人员状态概览
 * GET /api/rescue/rescuers/overview
 */
router.get('/rescuers/overview', (_req: Request, res: Response): void => {
  try {
    const overview = getRescuersOverview()

    res.json({
      success: true,
      data: overview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取救援人员状态失败',
    })
  }
})

/**
 * 获取所有救援人员
 * GET /api/rescue/rescuers
 */
router.get('/rescuers', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: store.rescuers,
  })
})

export default router
