/**
 * 器材服务
 * 包含尺码推荐和损坏赔偿计算
 */

import { store, type Equipment, type EquipmentType, type DamageLevel } from '../data/store.js'

/**
 * 尺码推荐参数
 */
export interface SizeRecommendationParams {
  height: number
  weight: number
  footSize?: number
  equipmentType: EquipmentType
}

/**
 * 尺码推荐结果
 */
export interface SizeRecommendation {
  recommendedSize: string
  sizeRange: string[]
  confidence: number
  reason: string
}

/**
 * 雪板长度推荐
 */
const recommendSnowboardSize = (height: number, weight: number): SizeRecommendation => {
  const baseLength = height - 20
  let adjustment = 0

  if (weight > 80) adjustment += 5
  else if (weight < 55) adjustment -= 5

  const recommended = Math.round(baseLength + adjustment)
  const range: string[] = []
  for (let len = recommended - 5; len <= recommended + 5; len += 5) {
    range.push(len.toString())
  }

  return {
    recommendedSize: recommended.toString(),
    sizeRange: range,
    confidence: 0.85,
    reason: `根据身高${height}cm和体重${weight}kg，推荐雪板长度约${recommended}cm`,
  }
}

/**
 * 双板长度推荐
 */
const recommendSkiSize = (height: number, weight: number): SizeRecommendation => {
  const baseLength = height - 10
  let adjustment = 0

  if (weight > 80) adjustment += 5
  else if (weight < 55) adjustment -= 5

  const recommended = Math.round(baseLength + adjustment)
  const range: string[] = []
  for (let len = recommended - 5; len <= recommended + 5; len += 5) {
    if (len >= 150 && len <= 180) {
      range.push(len.toString())
    }
  }

  return {
    recommendedSize: recommended.toString(),
    sizeRange: range.length > 0 ? range : ['160', '165', '170'],
    confidence: 0.8,
    reason: `根据身高${height}cm和体重${weight}kg，推荐双板长度约${recommended}cm`,
  }
}

/**
 * 头盔尺码推荐
 */
const recommendHelmetSize = (height: number, weight: number): SizeRecommendation => {
  const bmi = weight / ((height / 100) ** 2)
  let size: string
  let confidence: number

  if (bmi < 18.5) {
    size = 'S'
    confidence = 0.7
  } else if (bmi < 24) {
    size = 'M'
    confidence = 0.85
  } else if (bmi < 28) {
    size = 'L'
    confidence = 0.8
  } else {
    size = 'XL'
    confidence = 0.75
  }

  return {
    recommendedSize: size,
    sizeRange: size === 'S' ? ['S', 'M'] : size === 'XL' ? ['L', 'XL'] : ['S', 'M', 'L'],
    confidence,
    reason: `根据BMI指数${bmi.toFixed(1)}，推荐头盔尺码${size}`,
  }
}

/**
 * 雪鞋尺码推荐
 */
const recommendBootsSize = (height: number, weight: number, footSize?: number): SizeRecommendation => {
  if (footSize) {
    return {
      recommendedSize: footSize.toString(),
      sizeRange: [(footSize - 1).toString(), footSize.toString(), (footSize + 1).toString()],
      confidence: 0.95,
      reason: `根据您提供的脚码${footSize}，推荐雪鞋尺码${footSize}`,
    }
  }

  let estimatedSize: number
  if (height < 160) estimatedSize = 39
  else if (height < 170) estimatedSize = 41
  else if (height < 180) estimatedSize = 42
  else estimatedSize = 44

  return {
    recommendedSize: estimatedSize.toString(),
    sizeRange: [(estimatedSize - 1).toString(), estimatedSize.toString(), (estimatedSize + 1).toString()],
    confidence: 0.7,
    reason: `根据身高${height}cm估算，推荐雪鞋尺码约${estimatedSize}，建议到店试穿`,
  }
}

/**
 * 服装尺码推荐（雪服/雪裤）
 */
const recommendClothingSize = (height: number, weight: number): SizeRecommendation => {
  const bmi = weight / ((height / 100) ** 2)
  let size: string
  let confidence: number

  if (height < 165 && weight < 60) {
    size = 'S'
    confidence = 0.8
  } else if (height < 175 && weight < 75) {
    size = 'M'
    confidence = 0.85
  } else if (height < 185 && weight < 90) {
    size = 'L'
    confidence = 0.85
  } else if (height < 190 && weight < 100) {
    size = 'XL'
    confidence = 0.8
  } else {
    size = 'XXL'
    confidence = 0.75
  }

  return {
    recommendedSize: size,
    sizeRange: size === 'S' ? ['S', 'M'] : size === 'XXL' ? ['XL', 'XXL'] : ['S', 'M', 'L', 'XL'],
    confidence,
    reason: `根据身高${height}cm和体重${weight}kg（BMI: ${bmi.toFixed(1)}），推荐尺码${size}`,
  }
}

/**
 * 主推荐函数
 */
export const recommendEquipmentSize = (params: SizeRecommendationParams): SizeRecommendation => {
  const { height, weight, footSize, equipmentType } = params

  switch (equipmentType) {
    case 'snowboard':
      return recommendSnowboardSize(height, weight)
    case 'ski':
      return recommendSkiSize(height, weight)
    case 'helmet':
      return recommendHelmetSize(height, weight)
    case 'boots':
      return recommendBootsSize(height, weight, footSize)
    case 'jacket':
    case 'pants':
      return recommendClothingSize(height, weight)
    default:
      return {
        recommendedSize: 'M',
        sizeRange: ['S', 'M', 'L'],
        confidence: 0.5,
        reason: '暂无推荐数据，建议到店试穿',
      }
  }
}

/**
 * 损坏等级描述
 */
const DAMAGE_DESCRIPTIONS: Record<DamageLevel, string> = {
  none: '无损坏',
  minor: '轻微划痕、磨损，不影响使用',
  moderate: '明显损坏，需要维修但可修复',
  severe: '严重损坏，无法修复或需要更换',
}

/**
 * 计算设备原价（日租金 × 30）
 */
export const calculateEquipmentValue = (dailyPrice: number): number => {
  return dailyPrice * 30
}

/**
 * 计算损坏赔偿金额
 * 赔偿规则：
 * - 轻微损坏(minor): 设备日租金 × 3
 * - 中度损坏(moderate): 设备原价的 20%（原价=日租金×30）
 * - 严重损坏(severe): 设备原价的 70%
 */
export const calculateDamageFee = (
  equipmentId: string,
  damageLevel: DamageLevel,
): number => {
  const equipment = store.equipment.find((e) => e.id === equipmentId)
  if (!equipment) return 0

  const equipmentValue = calculateEquipmentValue(equipment.dailyPrice)

  switch (damageLevel) {
    case 'none':
      return 0
    case 'minor':
      return Math.round(equipment.dailyPrice * 3)
    case 'moderate':
      return Math.round(equipmentValue * 0.2)
    case 'severe':
      return Math.round(equipmentValue * 0.7)
    default:
      return 0
  }
}

/**
 * 获取损坏等级描述
 */
export const getDamageDescription = (damageLevel: DamageLevel): string => {
  return DAMAGE_DESCRIPTIONS[damageLevel]
}

/**
 * 获取可用器材列表
 */
export const getAvailableEquipment = (
  type?: EquipmentType,
  size?: string,
): Equipment[] => {
  return store.equipment.filter((eq) => {
    if (eq.status !== 'available') return false
    if (type && eq.type !== type) return false
    if (size && eq.size !== size) return false
    return true
  })
}

/**
 * 获取器材分类库存统计
 */
export const getEquipmentInventoryStats = () => {
  const stats: Record<string, { total: number; available: number; rented: number; damaged: number }> = {}

  store.equipment.forEach((eq) => {
    if (!stats[eq.type]) {
      stats[eq.type] = { total: 0, available: 0, rented: 0, damaged: 0 }
    }
    stats[eq.type].total++
    if (eq.status === 'available') stats[eq.type].available++
    else if (eq.status === 'rented') stats[eq.type].rented++
    else if (eq.status === 'damaged') stats[eq.type].damaged++
  })

  return stats
}
