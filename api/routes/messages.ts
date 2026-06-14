/**
 * 消息API路由
 * 处理消息查询、已读标记、推送等操作
 */

import { Router, type Request, type Response } from 'express'
import { store, generateId, type MessageType } from '../data/store.js'

const router = Router()

/**
 * 获取用户消息列表
 * GET /api/messages?userId=u001&type=ticket&unreadOnly=true
 */
router.get('/', (req: Request, res: Response): void => {
  const { userId, type, unreadOnly } = req.query

  if (!userId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：userId',
    })
    return
  }

  let messages = store.messages.filter((m) => m.userId === userId)

  if (type) {
    messages = messages.filter((m) => m.type === type)
  }

  if (unreadOnly === 'true') {
    messages = messages.filter((m) => !m.read)
  }

  messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const unreadCount = store.messages.filter((m) => m.userId === userId && !m.read).length

  res.json({
    success: true,
    data: {
      list: messages,
      unreadCount,
      total: messages.length,
    },
  })
})

/**
 * 获取未读消息数量
 * GET /api/messages/unread-count?userId=u001
 */
router.get('/unread-count', (req: Request, res: Response): void => {
  const { userId } = req.query

  if (!userId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：userId',
    })
    return
  }

  const unreadMessages = store.messages.filter((m) => m.userId === userId && !m.read)

  const countByType: Record<string, number> = {}
  unreadMessages.forEach((m) => {
    countByType[m.type] = (countByType[m.type] || 0) + 1
  })

  res.json({
    success: true,
    data: {
      total: unreadMessages.length,
      byType: countByType,
    },
  })
})

/**
 * 获取消息详情
 * GET /api/messages/:id
 */
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const message = store.messages.find((m) => m.id === id)

  if (!message) {
    res.status(404).json({
      success: false,
      error: '消息不存在',
    })
    return
  }

  if (!message.read) {
    message.read = true
  }

  res.json({
    success: true,
    data: message,
  })
})

/**
 * 标记单条消息已读
 * PUT /api/messages/:id/read
 */
router.put('/:id/read', (req: Request, res: Response): void => {
  const { id } = req.params

  const message = store.messages.find((m) => m.id === id)

  if (!message) {
    res.status(404).json({
      success: false,
      error: '消息不存在',
    })
    return
  }

  message.read = true

  res.json({
    success: true,
    data: message,
    message: '已标记为已读',
  })
})

/**
 * 批量标记已读
 * PUT /api/messages/read-all
 */
router.put('/read-all', (req: Request, res: Response): void => {
  const { userId } = req.body

  if (!userId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：userId',
    })
    return
  }

  let count = 0
  store.messages.forEach((m) => {
    if (m.userId === userId && !m.read) {
      m.read = true
      count++
    }
  })

  res.json({
    success: true,
    data: { updatedCount: count },
    message: `已将${count}条消息标记为已读`,
  })
})

/**
 * 删除单条消息
 * DELETE /api/messages/:id
 */
router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params

  const index = store.messages.findIndex((m) => m.id === id)

  if (index === -1) {
    res.status(404).json({
      success: false,
      error: '消息不存在',
    })
    return
  }

  store.messages.splice(index, 1)

  res.json({
    success: true,
    message: '删除成功',
  })
})

/**
 * 批量删除消息
 * DELETE /api/messages
 */
router.delete('/', (req: Request, res: Response): void => {
  const { userId, ids } = req.body

  if (!userId) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：userId',
    })
    return
  }

  let count = 0
  if (ids && Array.isArray(ids)) {
    store.messages = store.messages.filter((m) => {
      if (ids.includes(m.id) && m.userId === userId) {
        count++
        return false
      }
      return true
    })
  } else {
    const originalLength = store.messages.length
    store.messages = store.messages.filter((m) => m.userId !== userId)
    count = originalLength - store.messages.length
  }

  res.json({
    success: true,
    data: { deletedCount: count },
    message: `已删除${count}条消息`,
  })
})

/**
 * 发送系统消息
 * POST /api/messages/send
 */
router.post('/send', (req: Request, res: Response): void => {
  const { userId, type, title, content, relatedId } = req.body

  if (!userId || !type || !title || !content) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数',
    })
    return
  }

  const message = {
    id: generateId(),
    userId,
    type: type as MessageType,
    title,
    content,
    read: false,
    createdAt: new Date().toISOString(),
    relatedId,
  }

  store.messages.push(message)

  res.json({
    success: true,
    data: message,
    message: '消息已发送',
  })
})

export default router
