/**
 * 雪道服务
 * 雪道状态判断逻辑
 */

import {
  store,
  type Slope,
  type SlopeStatus,
  type InspectionRecord,
  type SlopeDifficulty,
} from '../data/store.js'

/**
 * 巡检数据输入
 */
export interface InspectionData {
  slopeId: string
  managerId: string
  snowQuality: number
  temperature: number
  visibility: number
  safetyHazards: string[]
  notes: string
}

/**
 * 状态判断结果
 */
export interface SlopeStatusResult {
  slopeId: string
  previousStatus: SlopeStatus
  newStatus: SlopeStatus
  reasons: string[]
  warnings: string[]
}

/**
 * 雪道状态判断核心算法
 */
export const evaluateSlopeStatus = (
  inspection: InspectionData,
  currentStatus: SlopeStatus,
): SlopeStatusResult => {
  const reasons: string[] = []
  const warnings: string[] = []
  let newStatus: SlopeStatus = 'open'
  let cautionCount = 0
  let closeCount = 0

  if (inspection.snowQuality < 3) {
    closeCount++
    reasons.push(`雪质评分过低（${inspection.snowQuality}/10）`)
  } else if (inspection.snowQuality < 5) {
    cautionCount++
    warnings.push(`雪质一般（${inspection.snowQuality}/10）`)
  } else {
    reasons.push(`雪质良好（${inspection.snowQuality}/10）`)
  }

  if (inspection.temperature > 5) {
    closeCount++
    reasons.push(`温度过高（${inspection.temperature}°C），雪质不稳定`)
  } else if (inspection.temperature > 0) {
    cautionCount++
    warnings.push(`温度偏高（${inspection.temperature}°C），可能出现化雪`)
  } else if (inspection.temperature < -20) {
    cautionCount++
    warnings.push(`温度过低（${inspection.temperature}°C），需注意防寒`)
  } else {
    reasons.push(`温度适宜（${inspection.temperature}°C）`)
  }

  if (inspection.visibility < 30) {
    closeCount++
    reasons.push(`能见度过低（${inspection.visibility}m）`)
  } else if (inspection.visibility < 100) {
    cautionCount++
    warnings.push(`能见度一般（${inspection.visibility}m），需减速滑行`)
  } else {
    reasons.push(`能见度良好（${inspection.visibility}m）`)
  }

  if (inspection.safetyHazards.length > 0) {
    const severeHazards = inspection.safetyHazards.filter((h) =>
      h.includes('冰面') || h.includes('裸露') || h.includes('裂缝') || h.includes('障碍物'),
    )
    if (severeHazards.length >= 2) {
      closeCount++
      reasons.push(`存在严重安全隐患：${severeHazards.join('、')}`)
    } else if (inspection.safetyHazards.length >= 2) {
      cautionCount++
      warnings.push(`存在安全隐患：${inspection.safetyHazards.join('、')}`)
    } else if (severeHazards.length === 1) {
      cautionCount++
      warnings.push(`需注意：${severeHazards[0]}`)
    }
  } else {
    reasons.push('无安全隐患')
  }

  if (closeCount > 0) {
    newStatus = 'closed'
  } else if (cautionCount >= 2) {
    newStatus = 'caution'
  } else if (cautionCount === 1) {
    newStatus = 'caution'
  }

  return {
    slopeId: inspection.slopeId,
    previousStatus: currentStatus,
    newStatus,
    reasons,
    warnings,
  }
}

/**
 * 记录巡检并更新雪道状态
 */
export const recordInspection = (data: InspectionData): {
  inspection: InspectionRecord
  statusResult: SlopeStatusResult
  slope: Slope | undefined
} | null => {
  const slope = store.slopes.find((s) => s.id === data.slopeId)
  if (!slope) return null

  const statusResult = evaluateSlopeStatus(data, slope.status)

  const inspection: InspectionRecord = {
    id: `inspect_${Date.now().toString()}`,
    slopeId: data.slopeId,
    managerId: data.managerId,
    snowQuality: data.snowQuality,
    temperature: data.temperature,
    visibility: data.visibility,
    safetyHazards: data.safetyHazards,
    notes: data.notes,
    createdAt: new Date().toISOString(),
  }

  store.inspectionRecords.push(inspection)

  slope.status = statusResult.newStatus
  slope.lastInspection = inspection.createdAt

  return {
    inspection,
    statusResult,
    slope,
  }
}

/**
 * 获取所有雪道状态概览
 */
export const getSlopesOverview = () => {
  const total = store.slopes.length
  const open = store.slopes.filter((s) => s.status === 'open').length
  const caution = store.slopes.filter((s) => s.status === 'caution').length
  const closed = store.slopes.filter((s) => s.status === 'closed').length
  const totalCapacity = store.slopes.reduce((sum, s) => sum + s.capacity, 0)
  const currentCount = store.slopes.reduce((sum, s) => sum + s.currentCount, 0)

  return {
    total,
    open,
    caution,
    closed,
    totalCapacity,
    currentCount,
    occupancyRate: totalCapacity > 0 ? +(currentCount / totalCapacity).toFixed(2) : 0,
    slopes: store.slopes,
  }
}

/**
 * 按难度筛选雪道
 */
export const getSlopesByDifficulty = (difficulty: SlopeDifficulty): Slope[] => {
  return store.slopes.filter((s) => s.difficulty === difficulty)
}

/**
 * 获取雪道巡检历史
 */
export const getSlopeInspectionHistory = (slopeId: string): InspectionRecord[] => {
  return store.inspectionRecords
    .filter((r) => r.slopeId === slopeId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * 检查雪道容量是否已满
 */
export const checkSlopeCapacity = (slopeId: string): {
  available: boolean
  currentCount: number
  capacity: number
  remaining: number
} | null => {
  const slope = store.slopes.find((s) => s.id === slopeId)
  if (!slope) return null

  return {
    available: slope.currentCount < slope.capacity && slope.status === 'open',
    currentCount: slope.currentCount,
    capacity: slope.capacity,
    remaining: Math.max(0, slope.capacity - slope.currentCount),
  }
}
