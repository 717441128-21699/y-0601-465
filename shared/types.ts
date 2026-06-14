export type UserRole = 'visitor' | 'coach' | 'rental_admin' | 'manager' | 'finance'

export interface User {
  id: string
  role: UserRole
  name: string
  phone?: string
  employeeId?: string
  password?: string
  avatar?: string
}

export type TicketType = 'adult' | 'child' | 'senior' | 'halfday'
export type TicketStatus = 'paid' | 'used' | 'refunded'

export interface TicketOrder {
  id: string
  visitorId: string
  date: string
  ticketType: TicketType
  basePrice: number
  dynamicFactor: number
  finalPrice: number
  qrCode: string
  verifyCode: string
  quantity: number
  status: TicketStatus
  createdAt: string
}

export interface DynamicPriceParams {
  date: string
  ticketType: TicketType
  weather: string
  historicalFlow: number
}

export type CoachLevel = 1 | 2 | 3 | 4 | 5
export type CoachSpecialty = '初级教学' | '中级进阶' | '高级技巧' | '自由式' | '单板' | '双板' | '儿童教学' | '竞赛训练'

export interface Coach {
  id: string
  userId?: string
  name: string
  level: CoachLevel
  rating: number
  ratingCount: number
  specialties: CoachSpecialty[]
  hourlyRate: number
  avatar: string
  availableSlots: string[]
  description?: string
}

export type BookingStatus = 'booked' | 'completed' | 'cancelled'

export interface CoachBooking {
  id: string
  visitorId: string
  coachId: string
  date: string
  startTime: string
  duration: number
  status: BookingStatus
  rating?: number
  feedback?: string
  totalPrice?: number
  createdAt?: string
}

export type EquipmentType = 'snowboard' | 'ski' | 'helmet' | 'boots' | 'jacket' | 'pants'
export type EquipmentStatus = 'available' | 'rented' | 'damaged' | 'maintenance'

export interface Equipment {
  id: string
  type: EquipmentType
  brand: string
  model: string
  size: string
  gender?: 'male' | 'female' | 'unisex'
  status: EquipmentStatus
  dailyPrice: number
  purchaseDate?: string
  condition?: number
}

export type RentalStatus = 'reserved' | 'picked' | 'returned' | 'damaged'
export type DamageLevel = 'none' | 'minor' | 'moderate' | 'severe'
export type DamageReportStatus = 'pending' | 'paid' | 'cancelled'

export interface RentalItem {
  equipmentId: string
  size: string
  dailyPrice: number
}

export interface DamageItem {
  equipmentId: string
  equipmentName?: string
  damageLevel: DamageLevel
  damageNotes?: string
  damageFee: number
}

export interface DamageReport {
  id: string
  rentalOrderId: string
  visitorId: string
  items: DamageItem[]
  totalDamageFee: number
  status: DamageReportStatus
  createdAt: string
  paidAt?: string
}

export interface RentalOrder {
  id: string
  visitorId: string
  items: RentalItem[]
  visitorHeight: number
  visitorWeight: number
  status: RentalStatus
  startDate?: string
  endDate?: string
  totalPrice: number
  damageFee?: number
  damageLevel?: DamageLevel
  damageNotes?: string
  createdAt: string
  pickedAt?: string
  returnedAt?: string
}

export type SlopeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SlopeStatus = 'open' | 'closed' | 'caution'

export interface Slope {
  id: string
  name: string
  difficulty: SlopeDifficulty
  length: number
  elevation: number
  status: SlopeStatus
  capacity: number
  currentCount: number
  lastInspection: string
  description?: string
  position?: { x: number; y: number; width: number; height: number }
}

export interface InspectionRecord {
  id: string
  slopeId: string
  managerId: string
  snowQuality: number
  temperature: number
  visibility: number
  windSpeed?: number
  safetyHazards: string[]
  notes: string
  createdAt: string
}

export type RescueType = 'injury' | 'lost' | 'equipment' | 'other'
export type RescueStatus = 'pending' | 'dispatched' | 'in_progress' | 'completed'

export interface RescueEvent {
  id: string
  visitorId?: string
  visitorName: string
  visitorPhone?: string
  slopeId: string
  location: { x: number; y: number }
  type: RescueType
  status: RescueStatus
  rescuerId?: string
  description?: string
  report?: string
  photos?: string[]
  createdAt: string
  dispatchedAt?: string
  completedAt?: string
}

export interface Rescuer {
  id: string
  name: string
  phone: string
  status: 'available' | 'on_mission' | 'off_duty' | 'on_duty' | 'busy'
  certifications: string[]
  position?: { x: number; y: number }
  currentLocation?: { x: number; y: number }
  rating?: number
}

export interface DailyFlowData {
  date: string
  visitorCount: number
  ticketRevenue: number
  weather: 'sunny' | 'cloudy' | 'snowy' | 'rainy'
  temperature: number
}

export interface FinanceReport {
  period: string
  startDate: string
  endDate: string
  ticketRevenue: number
  coachRevenue: number
  rentalRevenue: number
  damageRevenue: number
  totalRevenue: number
  totalCost: number
  netProfit: number
  slopeBreakdown: { slopeId: string; name: string; revenue: number; visitorCount: number }[]
  coachBreakdown: { coachId: string; name: string; revenue: number; bookingCount: number }[]
  dailyBreakdown: { date: string; revenue: number; visitorCount: number }[]
}

export type MessageType = 'ticket' | 'booking' | 'rental' | 'slope' | 'rescue' | 'finance' | 'system'

export interface Message {
  id: string
  userId: string
  type: MessageType
  title: string
  content: string
  read: boolean
  createdAt: string
  relatedId?: string
}

export interface SlopeMapData {
  width: number
  height: number
  slopes: (Slope & { path: string })[]
  facilities: { id: string; name: string; type: 'lift' | 'restaurant' | 'first_aid' | 'rental'; position: { x: number; y: number } }[]
}
