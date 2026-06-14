/**
 * 教练API路由
 * 处理教练查询、推荐、预约、评价等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type CoachLevel } from '../data/store.js'
import {
  getRecommendedCoaches,
  getTop3Coaches,
  checkCoachAvailability,
  getCoachAvailableSlots,
  type CoachMatchParams,
} from '../services/coachMatchService.js'

const router = Router()

/**
 * 获取教练推荐列表
 * GET /api/coaches/recommend
 */
router.get('/recommend', (req: Request, res: Response): void => {
  try {
    const params: CoachMatchParams = {
      visitorLevel: req.query.visitorLevel as CoachMatchParams['visitorLevel'],
      date: req.query.date as string,
      startTime: req.query.startTime as string,
      duration: req.query.duration ? parseInt(req.query.duration as string, 10) : undefined,
      specialty: req.query.specialty as string,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string, 10) : undefined,
      preferredLevel: req.query.preferredLevel ? (parseInt(req.query.preferredLevel as string, 10) as CoachLevel) : undefined,
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
    const coaches = getRecommendedCoaches(params, limit)

    res.json({
      success: true,
      data: coaches,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取推荐教练失败',
    })
  }
})

/**
 * 获取Top3推荐教练
 * GET /api/coaches/top3
 */
router.get('/top3', (req: Request, res: Response): void => {
  try {
    const params: CoachMatchParams = {
      visitorLevel: req.query.visitorLevel as CoachMatchParams['visitorLevel'],
      date: req.query.date as string,
      startTime: req.query.startTime as string,
      specialty: req.query.specialty as string,
    }

    const coaches = getTop3Coaches(params)

    res.json({
      success: true,
      data: coaches,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取Top3教练失败',
    })
  }
})

/**
 * 获取所有教练列表
 * GET /api/coaches
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { level, keyword } = req.query
    let coaches = [...store.coaches]

    if (level) {
      coaches = coaches.filter((c) => c.level === parseInt(level as string, 10))
    }

    if (keyword) {
      const kw = (keyword as string).toLowerCase()
      coaches = coaches.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.specialties.some((s) => s.toLowerCase().includes(kw)),
      )
    }

    coaches.sort((a, b) => b.rating - a.rating)

    res.json({
      success: true,
      data: coaches,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取教练列表失败',
    })
  }
})

/**
 * 获取教练详情
 * GET /api/coaches/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const coach = store.coaches.find((c) => c.id === id)

  if (!coach) {
    res.status(404).json({
      success: false,
      error: '教练不存在',
    })
    return
  }

  const bookings = store.coachBookings.filter((b) => b.coachId === id && b.status === 'completed')
  const avgRating = bookings.length > 0
    ? bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / bookings.length
    : coach.rating

  res.json({
    success: true,
    data: {
      ...coach,
      completedCourses: bookings.length,
      avgRating,
    },
  })
})

/**
 * 检查教练时段可用性
 * GET /api/coaches/:id/availability?date=2026-06-15&startTime=10:00&duration=2
 */
router.get('/:id/availability', (req: Request, res: Response): void => {
  const { id } = req.params
  const { date, startTime, duration } = req.query

  if (!date || !startTime) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：date 和 startTime',
    })
    return
  }

  const result = checkCoachAvailability(
    id,
    date as string,
    startTime as string,
    duration ? parseInt(duration as string, 10) : 2,
  )

  res.json({
    success: true,
    data: result,
  })
})

/**
 * 获取教练指定日期可用时段
 * GET /api/coaches/:id/slots?date=2026-06-15
 */
router.get('/:id/slots', (req: Request, res: Response): void => {
  const { id } = req.params
  const { date } = req.query

  if (!date) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：date',
    })
    return
  }

  const slots = getCoachAvailableSlots(id, date as string)

  res.json({
    success: true,
    data: slots,
  })
})

/**
 * 预约教练
 * POST /api/coaches/book
 */
router.post('/book', (req: Request, res: Response): void => {
  const { visitorId, coachId, date, startTime, duration } = req.body

  if (!visitorId || !coachId || !date || !startTime) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数',
    })
    return
  }

  const coach = store.coaches.find((c) => c.id === coachId)
  if (!coach) {
    res.status(404).json({
      success: false,
      error: '教练不存在',
    })
    return
  }

  const availability = checkCoachAvailability(
    coachId,
    date,
    startTime,
    duration || 2,
  )

  if (!availability.available) {
    res.status(400).json({
      success: false,
      error: '该时段已被预约',
    })
    return
  }

  const booking = {
    id: generateId(),
    visitorId,
    coachId,
    date,
    startTime,
    duration: duration || 2,
    status: 'booked' as const,
  }

  store.coachBookings.push(booking)

  store.messages.push({
    id: generateId(),
    userId: visitorId,
    type: 'booking',
    title: '教练预约成功',
    content: `您已成功预约${coach.name}教练${date} ${startTime}的课程，时长${booking.duration}小时。`,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: booking.id,
  })

  res.json({
    success: true,
    data: booking,
    message: '预约成功',
  })
})

/**
 * 获取我的预约（游客）
 * GET /api/coaches/bookings/mine?visitorId=u001
 */
router.get('/bookings/mine', (req: Request, res: Response): void => {
  const { visitorId } = req.query

  if (!visitorId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：visitorId',
    })
    return
  }

  const bookings = store.coachBookings
    .filter((b) => b.visitorId === visitorId)
    .map((b) => {
      const coach = store.coaches.find((c) => c.id === b.coachId)
      return {
        ...b,
        coachName: coach?.name,
        coachLevel: coach?.level,
        coachAvatar: coach?.avatar,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  res.json({
    success: true,
    data: bookings,
  })
})

/**
 * 获取教练课表
 * GET /api/coaches/:id/schedule?date=2026-06-15
 */
router.get('/:id/schedule', (req: Request, res: Response): void => {
  const { id } = req.params
  const { date } = req.query

  let bookings = store.coachBookings.filter((b) => b.coachId === id)

  if (date) {
    bookings = bookings.filter((b) => b.date === date)
  }

  bookings.sort((a, b) => a.startTime.localeCompare(b.startTime))

  const result = bookings.map((b) => {
    const visitor = store.users.find((u) => u.id === b.visitorId)
    return {
      ...b,
      visitorName: visitor?.name,
      visitorPhone: visitor?.phone,
    }
  })

  res.json({
    success: true,
    data: result,
  })
})

/**
 * 教练签到
 * POST /api/coaches/bookings/:id/checkin
 */
router.post('/bookings/:id/checkin', (req: Request, res: Response): void => {
  const { id } = req.params

  const booking = store.coachBookings.find((b) => b.id === id)

  if (!booking) {
    res.status(404).json({
      success: false,
      error: '预约不存在',
    })
    return
  }

  if (booking.status !== 'booked') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持签到',
    })
    return
  }

  res.json({
    success: true,
    data: booking,
    message: '签到成功',
  })
})

/**
 * 完成课程并评价
 * POST /api/coaches/bookings/:id/complete
 */
router.post('/bookings/:id/complete', (req: Request, res: Response): void => {
  const { id } = req.params
  const { rating, feedback } = req.body

  const booking = store.coachBookings.find((b) => b.id === id)

  if (!booking) {
    res.status(404).json({
      success: false,
      error: '预约不存在',
    })
    return
  }

  booking.status = 'completed'
  if (rating) booking.rating = rating
  if (feedback) booking.feedback = feedback

  const coach = store.coaches.find((c) => c.id === booking.coachId)
  if (coach && rating) {
    const totalRating = coach.rating * coach.ratingCount + rating
    coach.ratingCount += 1
    coach.rating = +(totalRating / coach.ratingCount).toFixed(2)
  }

  res.json({
    success: true,
    data: booking,
    message: '课程已完成',
  })
})

/**
 * 取消预约
 * POST /api/coaches/bookings/:id/cancel
 */
router.post('/bookings/:id/cancel', (req: Request, res: Response): void => {
  const { id } = req.params

  const booking = store.coachBookings.find((b) => b.id === id)

  if (!booking) {
    res.status(404).json({
      success: false,
      error: '预约不存在',
    })
    return
  }

  if (booking.status !== 'booked') {
    res.status(400).json({
      success: false,
      error: '当前状态不支持取消',
    })
    return
  }

  booking.status = 'cancelled'

  res.json({
    success: true,
    data: booking,
    message: '取消成功',
  })
})

export default router
