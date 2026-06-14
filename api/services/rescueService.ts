/**
 * 救援调度服务
 * 救援人员调度算法
 */

import {
  store,
  type RescueEvent,
  type RescueEventType,
  type RescueEventStatus,
  type Rescuer,
} from '../data/store.js'

/**
 * 创建呼救事件参数
 */
export interface RescueCreateParams {
  visitorId?: string
  visitorName: string
  slopeId: string
  location: { x: number; y: number }
  type: RescueEventType
}

/**
 * 调度结果
 */
export interface DispatchResult {
  rescuer: Rescuer
  distance: number
  estimatedArrivalTime: number
  matchScore: number
}

/**
 * 计算两点间欧氏距离
 */
const calculateDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

/**
 * 估算到达时间（分钟）
 * 假设救援人员平均移动速度
 */
const estimateArrivalTime = (distance: number): number => {
  const speedPerUnit = 2
  return Math.ceil(distance * speedPerUnit)
}

/**
 * 救援类型所需资质映射
 */
const REQUIRED_CERTIFICATIONS: Record<RescueEventType, string[]> = {
  injury: ['急救证', '滑雪救援证'],
  lost: ['滑雪救援证'],
  equipment: ['滑雪救援证'],
  other: ['滑雪救援证'],
}

/**
 * 根据事件类型和位置选择最优救援人员
 */
export const selectOptimalRescuer = (
  eventType: RescueEventType,
  location: { x: number; y: number },
): DispatchResult | null => {
  const requiredCerts = REQUIRED_CERTIFICATIONS[eventType]

  const candidates = store.rescuers
    .filter((r) => r.status === 'available')
    .filter((r) => requiredCerts.every((cert) => r.certifications.includes(cert)))

  if (candidates.length === 0) {
    const fallback = store.rescuers.find((r) => r.status === 'available')
    if (!fallback) return null

    const distance = calculateDistance(location, fallback.position)
    return {
      rescuer: fallback,
      distance,
      estimatedArrivalTime: estimateArrivalTime(distance),
      matchScore: 50,
    }
  }

  const scored = candidates.map((rescuer): DispatchResult => {
    const distance = calculateDistance(location, rescuer.position)
    const distanceScore = Math.max(0, 100 - distance * 2)
    const ratingScore = rescuer.rating * 10
    const certScore = rescuer.certifications.length * 5
    const matchScore = distanceScore * 0.5 + ratingScore * 0.3 + certScore * 0.2

    return {
      rescuer,
      distance,
      estimatedArrivalTime: estimateArrivalTime(distance),
      matchScore,
    }
  })

  scored.sort((a, b) => b.matchScore - a.matchScore)

  return scored[0] || null
}

/**
 * 创建呼救事件并自动调度
 */
export const createRescueEvent = (params: RescueCreateParams): {
  event: RescueEvent
  dispatch: DispatchResult | null
} => {
  const event: RescueEvent = {
    id: `rescue_${Date.now().toString()}`,
    visitorId: params.visitorId,
    visitorName: params.visitorName,
    slopeId: params.slopeId,
    location: params.location,
    type: params.type,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  store.rescueEvents.push(event)

  const dispatch = selectOptimalRescuer(params.type, params.location)
  if (dispatch) {
    event.status = 'dispatched'
    event.rescuerId = dispatch.rescuer.id
    dispatch.rescuer.status = 'on_mission'
  }

  return {
    event,
    dispatch,
  }
}

/**
 * 更新救援事件状态
 */
export const updateRescueStatus = (
  eventId: string,
  status: RescueEventStatus,
  report?: string,
  photos?: string[],
): RescueEvent | null => {
  const event = store.rescueEvents.find((e) => e.id === eventId)
  if (!event) return null

  event.status = status

  if (report) {
    event.report = report
  }
  if (photos) {
    event.photos = photos
  }

  if (status === 'completed') {
    event.completedAt = new Date().toISOString()
    if (event.rescuerId) {
      const rescuer = store.rescuers.find((r) => r.id === event.rescuerId)
      if (rescuer) {
        rescuer.status = 'available'
      }
    }
  }

  if (status === 'in_progress' && event.rescuerId) {
    const rescuer = store.rescuers.find((r) => r.id === event.rescuerId)
    if (rescuer) {
      rescuer.position = { ...event.location }
    }
  }

  return event
}

/**
 * 获取待处理救援事件
 */
export const getPendingRescueEvents = (): RescueEvent[] => {
  return store.rescueEvents
    .filter((e) => e.status === 'pending' || e.status === 'dispatched' || e.status === 'in_progress')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

/**
 * 获取救援事件列表
 */
export const getRescueEvents = (
  status?: RescueEventStatus,
  limit: number = 50,
): RescueEvent[] => {
  let events = [...store.rescueEvents]

  if (status) {
    events = events.filter((e) => e.status === status)
  }

  events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return events.slice(0, limit)
}

/**
 * 获取救援人员状态概览
 */
export const getRescuersOverview = () => {
  const total = store.rescuers.length
  const available = store.rescuers.filter((r) => r.status === 'available').length
  const onMission = store.rescuers.filter((r) => r.status === 'on_mission').length
  const offDuty = store.rescuers.filter((r) => r.status === 'off_duty').length

  return {
    total,
    available,
    onMission,
    offDuty,
    rescuers: store.rescuers,
  }
}

/**
 * 手动指定救援人员
 */
export const assignRescuer = (
  eventId: string,
  rescuerId: string,
): { event: RescueEvent; rescuer: Rescuer } | null => {
  const event = store.rescueEvents.find((e) => e.id === eventId)
  const rescuer = store.rescuers.find((r) => r.id === rescuerId)

  if (!event || !rescuer) return null
  if (rescuer.status !== 'available') return null

  event.rescuerId = rescuerId
  event.status = 'dispatched'
  rescuer.status = 'on_mission'

  return { event, rescuer }
}
