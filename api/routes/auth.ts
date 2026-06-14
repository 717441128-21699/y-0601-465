import { Router, type Request, type Response } from 'express'
import { store, generateId, type User } from '../data/store.js'

const router = Router()

interface TokenInfo {
  userId: string
  createdAt: number
}

const tokenStore = new Map<string, TokenInfo>()

const generateToken = (): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payload = Buffer.from(JSON.stringify({ jti: generateId(), iat: Date.now() })).toString('base64')
  const signature = Math.random().toString(36).slice(2, 34)
  return `${header}.${payload}.${signature}`
}

const getTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1]
  }
  return authHeader
}

const demoAccountMap: Record<string, string> = {
  visitor: 'visitor',
  coach: 'coach',
  rental_admin: 'rental_admin',
  rental: 'rental_admin',
  manager: 'manager',
  finance: 'finance',
}

const findUserByDemoAccount = (roleKey: string): User | undefined => {
  const targetRole = demoAccountMap[roleKey]
  if (!targetRole) return undefined
  return store.users.find((u) => u.role === targetRole)
}

const findUserByUsername = (username: string): User | undefined => {
  return store.users.find(
    (u) => u.name === username || u.phone === username || u.employeeId === username,
  )
}

const sanitizeUser = (user: User): Omit<User, 'password'> => {
  const { password, ...safeUser } = user
  return safeUser
}

router.post('/login', (req: Request, res: Response): void => {
  const { username, password, role } = req.body

  if (!username || !password) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数：username 和 password',
    })
    return
  }

  let user: User | undefined

  if (demoAccountMap[username]) {
    user = findUserByDemoAccount(username)
  } else {
    user = findUserByUsername(username)
  }

  if (!user || user.password !== password) {
    res.status(401).json({
      success: false,
      error: '用户名或密码错误',
    })
    return
  }

  const token = generateToken()
  tokenStore.set(token, {
    userId: user.id,
    createdAt: Date.now(),
  })

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token,
    },
  })
})

router.post('/logout', (req: Request, res: Response): void => {
  const token = getTokenFromHeader(req)
  if (token && tokenStore.has(token)) {
    tokenStore.delete(token)
  }

  res.json({
    success: true,
    message: '退出登录成功',
  })
})

router.get('/me', (req: Request, res: Response): void => {
  const token = getTokenFromHeader(req)

  if (!token) {
    res.status(401).json({
      success: false,
      error: '未提供认证令牌',
    })
    return
  }

  const tokenInfo = tokenStore.get(token)
  if (!tokenInfo) {
    res.status(401).json({
      success: false,
      error: '令牌无效或已过期',
    })
    return
  }

  const user = store.users.find((u) => u.id === tokenInfo.userId)
  if (!user) {
    res.status(401).json({
      success: false,
      error: '用户不存在',
    })
    return
  }

  res.json({
    success: true,
    data: sanitizeUser(user),
  })
})

export default router
