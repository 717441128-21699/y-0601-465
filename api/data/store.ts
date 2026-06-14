import type {
  User,
  Coach,
  CoachLevel,
  CoachSpecialty,
  Slope,
  SlopeDifficulty,
  SlopeStatus,
  Equipment,
  EquipmentType,
  EquipmentStatus,
  DailyFlowData,
  TicketOrder,
  TicketType,
  TicketStatus,
  RentalOrder,
  RentalStatus,
  DamageLevel,
  RescueEvent,
  RescueType,
  RescueStatus,
  Message,
  MessageType,
  Rescuer,
  InspectionRecord,
  CoachBooking,
  BookingStatus,
  UserRole,
  FinanceReport,
} from '../../shared/types'

export type {
  User,
  UserRole,
  Coach,
  CoachLevel,
  CoachSpecialty,
  Slope,
  SlopeDifficulty,
  SlopeStatus,
  Equipment,
  EquipmentType,
  EquipmentStatus,
  DailyFlowData,
  TicketOrder,
  TicketType,
  TicketStatus,
  RentalOrder,
  RentalStatus,
  DamageLevel,
  RescueEvent,
  Message,
  MessageType,
  Rescuer,
  InspectionRecord,
  CoachBooking,
  BookingStatus,
  FinanceReport,
}

export type RescueEventType = RescueType
export type RescueEventStatus = RescueStatus

export const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const generateQRCode = (): string => {
  return `QR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

const today = new Date()
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const formatDateTime = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19)

export const users: User[] = [
  {
    id: 'user-001',
    role: 'visitor',
    name: '李明辉',
    phone: '13800138001',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=visitor1',
  },
  {
    id: 'user-002',
    role: 'coach',
    name: '张伟强',
    phone: '13800138002',
    employeeId: 'COACH001',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1',
  },
  {
    id: 'user-003',
    role: 'rental_admin',
    name: '王雪梅',
    phone: '13800138003',
    employeeId: 'RENTAL001',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rental1',
  },
  {
    id: 'user-004',
    role: 'manager',
    name: '陈建国',
    phone: '13800138004',
    employeeId: 'MGR001',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager1',
  },
  {
    id: 'user-005',
    role: 'finance',
    name: '赵晓燕',
    phone: '13800138005',
    employeeId: 'FIN001',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=finance1',
  },
]

const coachNames = [
  '刘雪峰', '王晓冰', '赵玉龙', '孙红梅',
  '周鹏飞', '吴雅婷', '郑浩然', '冯雪琴',
  '许金刚', '何静怡', '蒋文龙', '韩冰雪',
  '吕志远', '田思琪', '董豪杰', '潘晓琳',
  '崔宏宇', '康美玲', '毛俊杰', '邱雅芳',
]

const specialtiesByLevel: Record<CoachLevel, CoachSpecialty[]> = {
  1: ['初级教学', '双板'],
  2: ['初级教学', '中级进阶', '双板'],
  3: ['中级进阶', '高级技巧', '单板', '双板'],
  4: ['高级技巧', '自由式', '单板', '双板', '儿童教学'],
  5: ['高级技巧', '自由式', '单板', '双板', '儿童教学', '竞赛训练'],
}

const hourlyRateByLevel: Record<CoachLevel, number> = {
  1: 200,
  2: 300,
  3: 450,
  4: 600,
  5: 800,
}

const ratingByLevel: Record<CoachLevel, number> = {
  1: 4.2,
  2: 4.5,
  3: 4.7,
  4: 4.8,
  5: 4.9,
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 9; h <= 16; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  return slots
}

export const coaches: Coach[] = coachNames.map((name, index) => {
  const level = (Math.floor(index / 4) + 1) as CoachLevel
  return {
    id: `coach-${(index + 1).toString().padStart(3, '0')}`,
    userId: index === 0 ? 'user-002' : undefined,
    name,
    level,
    rating: ratingByLevel[level] + (Math.random() * 0.2 - 0.1),
    ratingCount: Math.floor(Math.random() * 200) + 50,
    specialties: specialtiesByLevel[level],
    hourlyRate: hourlyRateByLevel[level],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=coach${index + 1}`,
    availableSlots: generateTimeSlots(),
    description: level >= 4
      ? `国家${level === 5 ? '一' : level === 4 ? '二' : '三'}级滑雪教练，从业${5 + level * 2}年，拥有丰富的教学经验。`
      : `专业滑雪教练，持有${level}级教练资格证书，热爱滑雪运动，耐心细致。`,
  }
})

const slopeData: Array<{ name: string; difficulty: SlopeDifficulty; length: number; elevation: number; capacity: number }> = [
  { name: '玉兰道', difficulty: 'beginner', length: 300, elevation: 50, capacity: 200 },
  { name: '梅花园', difficulty: 'beginner', length: 350, elevation: 55, capacity: 220 },
  { name: '松涛道', difficulty: 'beginner', length: 400, elevation: 60, capacity: 250 },
  { name: '翠竹道', difficulty: 'intermediate', length: 600, elevation: 120, capacity: 180 },
  { name: '幽兰谷', difficulty: 'intermediate', length: 700, elevation: 140, capacity: 200 },
  { name: '金桂坡', difficulty: 'intermediate', length: 800, elevation: 160, capacity: 220 },
  { name: '雪莲峰', difficulty: 'advanced', length: 1000, elevation: 250, capacity: 120 },
  { name: '冰瀑崖', difficulty: 'advanced', length: 1200, elevation: 300, capacity: 100 },
  { name: '风云岭', difficulty: 'advanced', length: 1100, elevation: 280, capacity: 110 },
  { name: '龙腾道', difficulty: 'expert', length: 1500, elevation: 400, capacity: 60 },
  { name: '虎跳峡', difficulty: 'expert', length: 1800, elevation: 450, capacity: 50 },
  { name: '鹰喙峰', difficulty: 'expert', length: 2000, elevation: 500, capacity: 40 },
]

export const slopes: Slope[] = slopeData.map((s, index) => ({
  id: `slope-${(index + 1).toString().padStart(3, '0')}`,
  name: s.name,
  difficulty: s.difficulty,
  length: s.length,
  elevation: s.elevation,
  status: index === 11 ? 'closed' : index === 7 ? 'caution' : 'open',
  capacity: s.capacity,
  currentCount: Math.floor(s.capacity * (0.3 + Math.random() * 0.5)),
  lastInspection: formatDateTime(new Date(today.getTime() - Math.random() * 4 * 3600 * 1000)),
  description: `${s.difficulty === 'beginner' ? '初级' : s.difficulty === 'intermediate' ? '中级' : s.difficulty === 'advanced' ? '高级' : '专家级'}雪道，全长${s.length}米，落差${s.elevation}米。`,
}))

const equipmentBrands: Record<EquipmentType, string[]> = {
  snowboard: ['Burton', 'K2', 'Nitro', 'Capita', 'GNU'],
  ski: ['Atomic', 'Head', 'Salomon', 'Fischer', 'Rossignol'],
  helmet: ['Giro', 'Smith', 'POC', 'Anon', 'Bell'],
  boots: ['Burton', 'ThirtyTwo', 'DC', 'Salomon', 'Dalbello'],
  jacket: ['The North Face', 'Columbia', 'Patagonia', 'Arc\'teryx', 'Volcom'],
  pants: ['The North Face', 'Columbia', 'Patagonia', 'Arc\'teryx', 'Volcom'],
}

const equipmentModels: Record<EquipmentType, string[]> = {
  snowboard: ['全能板', '自由式板', '高山板', '粉雪板', '公园板'],
  ski: ['全能双板', '竞技双板', '自由式双板', '野雪双板', '儿童双板'],
  helmet: ['经典款', '竞速款', '自由式款', '儿童款', '带耳机款'],
  boots: ['单板靴', '双板靴', '儿童靴', '竞速靴', '公园靴'],
  jacket: ['冲锋衣', '滑雪服', '羽绒服', '软壳衣', '抓绒衣'],
  pants: ['滑雪裤', '冲锋裤', '软壳裤', '背带裤', '儿童裤'],
}

const sizesByType: Record<EquipmentType, string[]> = {
  snowboard: ['140cm', '145cm', '150cm', '155cm', '160cm', '165cm'],
  ski: ['150cm', '155cm', '160cm', '165cm', '170cm', '175cm', '180cm'],
  helmet: ['S', 'M', 'L', 'XL'],
  boots: ['38', '39', '40', '41', '42', '43', '44', '45'],
  jacket: ['S', 'M', 'L', 'XL', 'XXL'],
  pants: ['S', 'M', 'L', 'XL', 'XXL'],
}

const pricesByType: Record<EquipmentType, number> = {
  snowboard: 120,
  ski: 150,
  helmet: 30,
  boots: 60,
  jacket: 50,
  pants: 40,
}

function generateEquipment(): Equipment[] {
  const equipment: Equipment[] = []
  let id = 1
  const types: EquipmentType[] = ['snowboard', 'ski', 'helmet', 'boots', 'jacket', 'pants']
  const counts = { snowboard: 40, ski: 50, helmet: 60, boots: 60, jacket: 45, pants: 45 }

  types.forEach((type) => {
    const brands = equipmentBrands[type]
    const models = equipmentModels[type]
    const sizes = sizesByType[type]
    const basePrice = pricesByType[type]

    for (let i = 0; i < counts[type]; i++) {
      const brand = brands[i % brands.length]
      const model = models[Math.floor(i / brands.length) % models.length]
      const size = sizes[i % sizes.length]
      const rand = Math.random()
      const status = rand < 0.7 ? 'available' : rand < 0.9 ? 'rented' : rand < 0.97 ? 'maintenance' : 'damaged'

      equipment.push({
        id: `eq-${(id++).toString().padStart(5, '0')}`,
        type,
        brand,
        model,
        size,
        gender: type === 'jacket' || type === 'pants' ? (i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'unisex') : 'unisex',
        status,
        dailyPrice: basePrice + Math.floor(Math.random() * 30) - 15,
        purchaseDate: formatDate(new Date(today.getTime() - Math.random() * 365 * 24 * 3600 * 1000)),
        condition: Math.floor(Math.random() * 40) + 60,
      })
    }
  })
  return equipment
}

export const equipment: Equipment[] = generateEquipment()

export const dailyFlowData: DailyFlowData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(today)
  date.setDate(date.getDate() - (29 - i))
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const baseCount = isWeekend ? 1800 : 1000
  const weatherRand = Math.random()
  const weather: DailyFlowData['weather'] = weatherRand < 0.4 ? 'sunny' : weatherRand < 0.7 ? 'cloudy' : weatherRand < 0.9 ? 'snowy' : 'rainy'
  const weatherMultiplier = weather === 'sunny' ? 1.2 : weather === 'cloudy' ? 1.0 : weather === 'snowy' ? 1.1 : 0.6
  const visitorCount = Math.floor(baseCount * weatherMultiplier * (0.8 + Math.random() * 0.4))
  return {
    date: formatDate(date),
    visitorCount,
    ticketRevenue: visitorCount * (180 + Math.random() * 60),
    weather,
    temperature: Math.floor(Math.random() * 15) - 20,
  }
})

export const ticketOrders: TicketOrder[] = [
  {
    id: 'ticket-00001',
    visitorId: 'user-001',
    date: formatDate(today),
    ticketType: 'adult',
    basePrice: 280,
    dynamicFactor: 1.1,
    finalPrice: 308,
    qrCode: 'TICKET-20240615-00001',
    status: 'paid',
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
  },
  {
    id: 'ticket-00002',
    visitorId: 'user-001',
    date: formatDate(new Date(today.getTime() + 1 * 24 * 3600 * 1000)),
    ticketType: 'halfday',
    basePrice: 180,
    dynamicFactor: 1.0,
    finalPrice: 180,
    qrCode: 'TICKET-20240616-00002',
    status: 'paid',
    createdAt: formatDateTime(new Date(today.getTime() - 1 * 24 * 3600 * 1000)),
  },
  {
    id: 'ticket-00003',
    visitorId: 'user-001',
    date: formatDate(new Date(today.getTime() - 3 * 24 * 3600 * 1000)),
    ticketType: 'adult',
    basePrice: 280,
    dynamicFactor: 0.9,
    finalPrice: 252,
    qrCode: 'TICKET-20240612-00003',
    status: 'used',
    createdAt: formatDateTime(new Date(today.getTime() - 5 * 24 * 3600 * 1000)),
  },
]

export const coachBookings: CoachBooking[] = [
  {
    id: 'booking-00001',
    visitorId: 'user-001',
    coachId: 'coach-009',
    date: formatDate(today),
    startTime: '10:00',
    duration: 2,
    status: 'booked',
    totalPrice: 900,
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
  },
  {
    id: 'booking-00002',
    visitorId: 'user-001',
    coachId: 'coach-005',
    date: formatDate(new Date(today.getTime() - 5 * 24 * 3600 * 1000)),
    startTime: '14:00',
    duration: 3,
    status: 'completed',
    rating: 5,
    feedback: '周教练非常专业，教学耐心细致，进步很大！',
    totalPrice: 900,
    createdAt: formatDateTime(new Date(today.getTime() - 7 * 24 * 3600 * 1000)),
  },
]

export const rentalOrders: RentalOrder[] = [
  {
    id: 'rental-00001',
    visitorId: 'user-001',
    items: [
      { equipmentId: 'eq-00001', size: '155cm', dailyPrice: 120 },
      { equipmentId: 'eq-00091', size: 'M', dailyPrice: 30 },
      { equipmentId: 'eq-00151', size: '42', dailyPrice: 60 },
    ],
    visitorHeight: 175,
    visitorWeight: 70,
    status: 'picked',
    startDate: formatDate(today),
    endDate: formatDate(today),
    totalPrice: 210,
    createdAt: formatDateTime(new Date(today.getTime() - 1 * 3600 * 1000)),
    pickedAt: formatDateTime(new Date(today.getTime() - 30 * 60 * 1000)),
  },
  {
    id: 'rental-00002',
    visitorId: 'user-001',
    items: [
      { equipmentId: 'eq-00045', size: '160cm', dailyPrice: 145 },
      { equipmentId: 'eq-00095', size: 'L', dailyPrice: 35 },
    ],
    visitorHeight: 175,
    visitorWeight: 70,
    status: 'returned',
    startDate: formatDate(new Date(today.getTime() - 7 * 24 * 3600 * 1000)),
    endDate: formatDate(new Date(today.getTime() - 7 * 24 * 3600 * 1000)),
    totalPrice: 180,
    damageLevel: 'none',
    createdAt: formatDateTime(new Date(today.getTime() - 8 * 24 * 3600 * 1000)),
    pickedAt: formatDateTime(new Date(today.getTime() - 7.5 * 24 * 3600 * 1000)),
    returnedAt: formatDateTime(new Date(today.getTime() - 6.8 * 24 * 3600 * 1000)),
  },
]

export const rescuers: Rescuer[] = [
  {
    id: 'rescuer-001',
    name: '李救援',
    phone: '13900139001',
    status: 'available',
    certifications: ['急救证', '滑雪救援证'],
    position: { x: 50, y: 30 },
    rating: 4.8,
  },
  {
    id: 'rescuer-002',
    name: '王安全',
    phone: '13900139002',
    status: 'available',
    certifications: ['急救证', '滑雪救援证'],
    position: { x: 70, y: 60 },
    rating: 4.6,
  },
  {
    id: 'rescuer-003',
    name: '张应急',
    phone: '13900139003',
    status: 'on_mission',
    certifications: ['急救证', '滑雪救援证'],
    position: { x: 30, y: 80 },
    rating: 4.9,
  },
]

export const rescueEvents: RescueEvent[] = [
  {
    id: 'rescue-00001',
    visitorId: 'user-001',
    visitorName: '李明辉',
    visitorPhone: '13800138001',
    slopeId: 'slope-005',
    location: { x: 45, y: 55 },
    type: 'injury',
    status: 'in_progress',
    rescuerId: 'rescuer-003',
    description: '游客在滑行时摔倒，疑似脚踝扭伤',
    createdAt: formatDateTime(new Date(today.getTime() - 20 * 60 * 1000)),
    dispatchedAt: formatDateTime(new Date(today.getTime() - 18 * 60 * 1000)),
  },
  {
    id: 'rescue-00002',
    visitorName: '匿名游客',
    slopeId: 'slope-008',
    location: { x: 60, y: 70 },
    type: 'equipment',
    status: 'pending',
    description: '雪板固定器脱落，需要帮助',
    createdAt: formatDateTime(new Date(today.getTime() - 5 * 60 * 1000)),
  },
  {
    id: 'rescue-00003',
    visitorName: '王先生',
    visitorPhone: '13800138099',
    slopeId: 'slope-002',
    location: { x: 20, y: 25 },
    type: 'other',
    status: 'completed',
    rescuerId: 'rescuer-001',
    report: '游客迷路，已安全送回服务中心',
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 3600 * 1000)),
    dispatchedAt: formatDateTime(new Date(today.getTime() - 1.9 * 3600 * 1000)),
    completedAt: formatDateTime(new Date(today.getTime() - 1 * 3600 * 1000)),
  },
]

export const inspectionRecords: InspectionRecord[] = [
  {
    id: 'inspect-00001',
    slopeId: 'slope-001',
    managerId: 'user-004',
    snowQuality: 9,
    temperature: -8,
    visibility: 10,
    windSpeed: 5,
    safetyHazards: [],
    notes: '雪质优良，状态良好',
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 3600 * 1000)),
  },
  {
    id: 'inspect-00002',
    slopeId: 'slope-007',
    managerId: 'user-004',
    snowQuality: 7,
    temperature: -10,
    visibility: 7,
    windSpeed: 12,
    safetyHazards: ['部分区域结冰'],
    notes: '风较大，部分区域有结冰，已设置警示标志',
    createdAt: formatDateTime(new Date(today.getTime() - 1 * 3600 * 1000)),
  },
]

export const messages: Message[] = [
  {
    id: 'msg-00001',
    userId: 'user-001',
    type: 'ticket',
    title: '购票成功',
    content: '您已成功购买今日全天雪票，票价308元。请在入口处出示电子票二维码。',
    read: true,
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
    relatedId: 'ticket-00001',
  },
  {
    id: 'msg-00002',
    userId: 'user-001',
    type: 'booking',
    title: '教练预约确认',
    content: '您已成功预约许金刚教练今日10:00-12:00的课程，费用900元。请准时到达雪具大厅集合。',
    read: true,
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
    relatedId: 'booking-00001',
  },
  {
    id: 'msg-00003',
    userId: 'user-001',
    type: 'rental',
    title: '雪具领取提醒',
    content: '您租赁的雪具已准备就绪，请凭订单号 rental-00001 到雪具租赁处领取。',
    read: false,
    createdAt: formatDateTime(new Date(today.getTime() - 1 * 3600 * 1000)),
    relatedId: 'rental-00001',
  },
  {
    id: 'msg-00004',
    userId: 'user-001',
    type: 'slope',
    title: '雪道状态变更通知',
    content: '雪莲峰（高级道）因风力较大，状态已变更为【谨慎开放】，请滑行时注意安全。',
    read: false,
    createdAt: formatDateTime(new Date(today.getTime() - 30 * 60 * 1000)),
    relatedId: 'slope-007',
  },
  {
    id: 'msg-00005',
    userId: 'user-001',
    type: 'system',
    title: '欢迎来到雪山滑雪场',
    content: '尊敬的游客，欢迎光临雪山滑雪场！今日天气晴朗，气温-8℃，适合滑雪。祝您滑雪愉快！',
    read: true,
    createdAt: formatDateTime(new Date(today.getTime() - 3 * 24 * 3600 * 1000)),
  },
  {
    id: 'msg-00006',
    userId: 'user-002',
    type: 'booking',
    title: '新课程预约',
    content: '您有新的课程预约：今日10:00-12:00，学员李明辉，请提前做好准备。',
    read: false,
    createdAt: formatDateTime(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
    relatedId: 'booking-00001',
  },
  {
    id: 'msg-00007',
    userId: 'user-004',
    type: 'rescue',
    title: '新的救援请求',
    content: '收到新的救援请求：幽兰谷雪道有游客雪板故障需要协助，请及时调度。',
    read: false,
    createdAt: formatDateTime(new Date(today.getTime() - 5 * 60 * 1000)),
    relatedId: 'rescue-00002',
  },
]

export const historicalFlow: DailyFlowData[] = dailyFlowData

export interface DataStore {
  users: User[]
  coaches: Coach[]
  slopes: Slope[]
  equipment: Equipment[]
  dailyFlowData: DailyFlowData[]
  historicalFlow: DailyFlowData[]
  ticketOrders: TicketOrder[]
  coachBookings: CoachBooking[]
  rentalOrders: RentalOrder[]
  rescuers: Rescuer[]
  rescueEvents: RescueEvent[]
  inspectionRecords: InspectionRecord[]
  messages: Message[]
}

export const dataStore: DataStore = {
  users,
  coaches,
  slopes,
  equipment,
  dailyFlowData,
  historicalFlow,
  ticketOrders,
  coachBookings,
  rentalOrders,
  rescuers,
  rescueEvents,
  inspectionRecords,
  messages,
}

export const store: DataStore = dataStore

export default dataStore
