/**
 * 动态定价服务
 * 根据日期、客流、天气计算票价系数
 */

import { store, type TicketType } from '../data/store.js'

/**
 * 基础票价表
 */
const BASE_PRICES: Record<TicketType, number> = {
  adult: 280,
  child: 180,
  senior: 180,
  halfday: 180,
}

/**
 * 根据日期计算日期系数
 * 周末和节假日价格更高
 */
const calculateDateFactor = (dateStr: string): number => {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay()
  const month = date.getMonth() + 1

  let factor = 1.0

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    factor *= 1.2
  }

  if (month === 1 || month === 2 || month === 12) {
    factor *= 1.15
  }

  const holidays = [
    '01-01', '01-28', '01-29', '01-30', '01-31',
    '02-01', '02-02', '02-03', '02-04',
    '04-04', '04-05', '04-06',
    '05-01', '05-02', '05-03',
    '10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07',
  ]
  const dateKey = `${(month).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  if (holidays.includes(dateKey)) {
    factor *= 1.3
  }

  return factor
}

/**
 * 根据历史客流数据计算客流系数
 */
const calculateFlowFactor = (dateStr: string): number => {
  const targetDate = new Date(dateStr)
  const targetDateStr = targetDate.toISOString().split('T')[0]

  const dayOfWeek = targetDate.getDay()
  const sameWeekdayFlows = store.historicalFlow.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate.getDay() === dayOfWeek
  })

  let avgFlow = 1000
  if (sameWeekdayFlows.length > 0) {
    avgFlow = sameWeekdayFlows.reduce((sum, item) => sum + item.visitorCount, 0) / sameWeekdayFlows.length
  }

  const todayRecord = store.historicalFlow.find((item) => item.date === targetDateStr)
  const currentFlow = todayRecord?.visitorCount ?? avgFlow

  if (currentFlow > avgFlow * 1.3) {
    return 1.2
  } else if (currentFlow > avgFlow * 1.1) {
    return 1.1
  } else if (currentFlow < avgFlow * 0.7) {
    return 0.85
  } else if (currentFlow < avgFlow * 0.9) {
    return 0.95
  }

  return 1.0
}

/**
 * 根据天气计算天气系数
 * 晴好天气价格更高，恶劣天气价格降低
 */
const calculateWeatherFactor = (weather: string): number => {
  const lowerWeather = weather.toLowerCase()

  if (lowerWeather.includes('晴') || lowerWeather.includes('sunny') || lowerWeather.includes('clear')) {
    return 1.1
  } else if (lowerWeather.includes('雪') || lowerWeather.includes('snow')) {
    return 1.05
  } else if (lowerWeather.includes('多云') || lowerWeather.includes('cloud')) {
    return 1.0
  } else if (lowerWeather.includes('阴') || lowerWeather.includes('overcast')) {
    return 0.95
  } else if (lowerWeather.includes('雨') || lowerWeather.includes('rain') || lowerWeather.includes('雾') || lowerWeather.includes('fog')) {
    return 0.8
  } else if (lowerWeather.includes('大风') || lowerWeather.includes('wind') || lowerWeather.includes('storm')) {
    return 0.7
  }

  return 1.0
}

/**
 * 计算动态票价
 */
export interface PricingResult {
  basePrice: number
  dateFactor: number
  flowFactor: number
  weatherFactor: number
  dynamicFactor: number
  finalPrice: number
  breakdown: {
    label: string
    value: number
  }[]
}

export const calculateDynamicPrice = (
  date: string,
  ticketType: TicketType,
  weather: string = '晴',
): PricingResult => {
  const basePrice = BASE_PRICES[ticketType]
  const dateFactor = calculateDateFactor(date)
  const flowFactor = calculateFlowFactor(date)
  const weatherFactor = calculateWeatherFactor(weather)

  const dynamicFactor = +(dateFactor * flowFactor * weatherFactor).toFixed(2)
  const clampedFactor = Math.max(0.7, Math.min(1.5, dynamicFactor))
  const finalPrice = Math.round(basePrice * clampedFactor)

  return {
    basePrice,
    dateFactor,
    flowFactor,
    weatherFactor,
    dynamicFactor: clampedFactor,
    finalPrice,
    breakdown: [
      { label: '基础票价', value: basePrice },
      { label: '日期调整', value: Math.round(basePrice * (dateFactor - 1)) },
      { label: '客流调整', value: Math.round(basePrice * (flowFactor - 1)) },
      { label: '天气调整', value: Math.round(basePrice * (weatherFactor - 1)) },
    ],
  }
}

/**
 * 获取近7天票价预测
 */
export const getWeeklyPriceForecast = (ticketType: TicketType, weather: string = '晴') => {
  const forecast = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const price = calculateDynamicPrice(dateStr, ticketType, weather)

    forecast.push({
      date: dateStr,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      finalPrice: price.finalPrice,
      dynamicFactor: price.dynamicFactor,
    })
  }

  return forecast
}
