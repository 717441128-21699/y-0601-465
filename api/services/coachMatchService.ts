/**
 * 教练智能匹配推荐服务
 * 根据游客水平、时间段、教练评分等多维度推荐最优教练
 */

import { store, type Coach, type CoachLevel } from '../data/store.js'

/**
 * 推荐参数
 */
export interface CoachMatchParams {
  visitorLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  date?: string
  startTime?: string
  duration?: number
  specialty?: string
  maxPrice?: number
  preferredLevel?: CoachLevel
}

/**
 * 带匹配分数的教练
 */
export interface ScoredCoach extends Coach {
  matchScore: number
  matchReasons: string[]
  isAvailable: boolean
}

/**
 * 根据游客水平映射推荐教练等级
 */
const levelMap: Record<string, CoachLevel[]> = {
  beginner: [1, 2],
  intermediate: [2, 3],
  advanced: [3, 4],
  expert: [4, 5],
}

/**
 * 计算教练匹配分数
 */
const calculateMatchScore = (
  coach: Coach,
  params: CoachMatchParams,
): { score: number; reasons: string[]; available: boolean } => {
  let score = 0
  const reasons: string[] = []
  let available = true

  if (params.preferredLevel) {
    if (coach.level === params.preferredLevel) {
      score += 30
      reasons.push('等级完全匹配')
    } else if (Math.abs(coach.level - params.preferredLevel) <= 1) {
      score += 15
      reasons.push('等级接近')
    }
  } else if (params.visitorLevel) {
    const recommendedLevels = levelMap[params.visitorLevel] || [1, 2, 3, 4, 5]
    if (recommendedLevels.includes(coach.level)) {
      score += 25
      reasons.push(`适合${params.visitorLevel === 'beginner' ? '初级' : params.visitorLevel === 'intermediate' ? '中级' : params.visitorLevel === 'advanced' ? '高级' : '专家级'}学员`)
    }
  }

  score += coach.rating * 10
  if (coach.rating >= 4.8) {
    reasons.push('高评分教练')
  }

  score += Math.min(coach.ratingCount / 10, 10)
  if (coach.ratingCount >= 50) {
    reasons.push('教学经验丰富')
  }

  if (params.specialty) {
    const hasSpecialty = coach.specialties.some(
      (s) => s.includes(params.specialty!) || params.specialty!.includes(s),
    )
    if (hasSpecialty) {
      score += 25
      reasons.push(`擅长${params.specialty}`)
    }
  }

  if (params.date && params.startTime) {
    const bookedSlots = store.coachBookings
      .filter((b) => b.coachId === coach.id && b.date === params.date && b.status === 'booked')
      .map((b) => b.startTime)

    if (bookedSlots.includes(params.startTime)) {
      available = false
      score -= 50
    } else if (coach.availableSlots.includes(params.startTime)) {
      score += 15
      reasons.push('时段可用')
    }
  }

  if (params.maxPrice && coach.hourlyRate > params.maxPrice) {
    available = false
    score -= 30
  } else if (params.maxPrice) {
    const priceScore = ((params.maxPrice - coach.hourlyRate) / params.maxPrice) * 10
    score += Math.max(0, priceScore)
  }

  score -= Math.abs(coach.level - 3) * 2

  return {
    score: Math.max(0, score),
    reasons,
    available,
  }
}

/**
 * 获取推荐教练列表
 */
export const getRecommendedCoaches = (
  params: CoachMatchParams = {},
  limit: number = 10,
): ScoredCoach[] => {
  const scoredCoaches: ScoredCoach[] = store.coaches.map((coach) => {
    const { score, reasons, available } = calculateMatchScore(coach, params)
    return {
      ...coach,
      matchScore: score,
      matchReasons: reasons,
      isAvailable: available,
    }
  })

  scoredCoaches.sort((a, b) => {
    if (a.isAvailable !== b.isAvailable) {
      return a.isAvailable ? -1 : 1
    }
    return b.matchScore - a.matchScore
  })

  return scoredCoaches.slice(0, limit)
}

/**
 * 获取Top3最优推荐教练
 */
export const getTop3Coaches = (params: CoachMatchParams = {}): ScoredCoach[] => {
  return getRecommendedCoaches(params, 3)
}

/**
 * 检查教练在指定时段是否可用
 */
export const checkCoachAvailability = (
  coachId: string,
  date: string,
  startTime: string,
  duration: number = 2,
): { available: boolean; conflictBookingId?: string } => {
  const coach = store.coaches.find((c) => c.id === coachId)
  if (!coach) {
    return { available: false }
  }

  const startHour = parseInt(startTime.split(':')[0], 10)
  const startMinute = parseInt(startTime.split(':')[1], 10)
  const endMinutes = startHour * 60 + startMinute + duration * 60

  for (const booking of store.coachBookings) {
    if (booking.coachId !== coachId || booking.date !== date || booking.status !== 'booked') {
      continue
    }

    const bStartHour = parseInt(booking.startTime.split(':')[0], 10)
    const bStartMinute = parseInt(booking.startTime.split(':')[1], 10)
    const bStartTotal = bStartHour * 60 + bStartMinute
    const bEndTotal = bStartTotal + booking.duration * 60

    const bookingStart = startHour * 60 + startMinute
    if (bookingStart < bEndTotal && endMinutes > bStartTotal) {
      return { available: false, conflictBookingId: booking.id }
    }
  }

  return { available: true }
}

/**
 * 获取教练在指定日期的可用时段
 */
export const getCoachAvailableSlots = (coachId: string, date: string): string[] => {
  const coach = store.coaches.find((c) => c.id === coachId)
  if (!coach) return []

  const bookedSlots = store.coachBookings
    .filter((b) => b.coachId === coachId && b.date === date && b.status === 'booked')
    .map((b) => b.startTime)

  return coach.availableSlots.filter((slot) => !bookedSlots.includes(slot))
}
