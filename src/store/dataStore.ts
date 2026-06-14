import { create } from "zustand";

export type TicketType = "day" | "half-day" | "weekend" | "season";
export type TicketStatus = "available" | "sold" | "used" | "expired";
export type CoachLevel = "初级" | "中级" | "高级" | "国家级";
export type CoachStatus = "available" | "busy" | "offline";
export type EquipmentType = "skis" | "snowboard" | "boots" | "helmet" | "gloves" | "goggles";
export type EquipmentStatus = "available" | "rented" | "maintenance";

export interface Ticket {
  id: string;
  type: TicketType;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  validDays: number;
  stock: number;
  sold: number;
  status: TicketStatus;
  imageUrl?: string;
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  level: CoachLevel;
  specialty: string[];
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  status: CoachStatus;
  avatar?: string;
  bio: string;
  certifications: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  brand: string;
  size?: string;
  pricePerDay: number;
  deposit: number;
  status: EquipmentStatus;
  imageUrl?: string;
  description: string;
  stock: number;
}

export interface Booking {
  id: string;
  userId: string;
  type: "ticket" | "coach" | "equipment";
  itemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface DataState {
  tickets: Ticket[];
  coaches: Coach[];
  equipment: Equipment[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchTickets: () => Promise<void>;
  fetchCoaches: () => Promise<void>;
  fetchEquipment: () => Promise<void>;
  fetchBookings: () => Promise<void>;

  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "sold">) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;

  addCoach: (coach: Omit<Coach, "id">) => void;
  updateCoach: (id: string, data: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;

  addEquipment: (item: Omit<Equipment, "id">) => void;
  updateEquipment: (id: string, data: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;

  createBooking: (booking: Omit<Booking, "id" | "createdAt">) => void;
  cancelBooking: (id: string) => void;

  clearError: () => void;
}

const mockTickets: Ticket[] = [
  {
    id: "t1",
    type: "day",
    name: "全天滑雪票",
    price: 299,
    originalPrice: 399,
    description: "包含全天雪道使用权限及基础装备租赁",
    validDays: 1,
    stock: 200,
    sold: 156,
    status: "available",
    createdAt: "2024-01-15",
  },
  {
    id: "t2",
    type: "half-day",
    name: "半日滑雪票",
    price: 199,
    description: "上午或下午四小时雪道使用",
    validDays: 1,
    stock: 300,
    sold: 89,
    status: "available",
    createdAt: "2024-01-15",
  },
  {
    id: "t3",
    type: "weekend",
    name: "周末双人套票",
    price: 499,
    originalPrice: 699,
    description: "周末双人全天滑雪含雪具",
    validDays: 2,
    stock: 100,
    sold: 67,
    status: "available",
    createdAt: "2024-01-15",
  },
  {
    id: "t4",
    type: "season",
    name: "全季畅滑卡",
    price: 2999,
    originalPrice: 3999,
    description: "整个雪季不限次滑雪",
    validDays: 120,
    stock: 50,
    sold: 23,
    status: "available",
    createdAt: "2024-01-15",
  },
];

const mockCoaches: Coach[] = [
  {
    id: "c1",
    name: "张伟",
    level: "国家级",
    specialty: ["高山滑雪", "竞技技巧"],
    yearsOfExperience: 12,
    rating: 4.9,
    reviewCount: 128,
    pricePerHour: 600,
    status: "available",
    bio: "前国家队成员，多次获得全国冠军",
    certifications: ["CSIA 四级", "中国滑雪协会高级教练"],
  },
  {
    id: "c2",
    name: "李娜",
    level: "高级",
    specialty: ["单板滑雪", "公园技巧"],
    yearsOfExperience: 8,
    rating: 4.8,
    reviewCount: 96,
    pricePerHour: 450,
    status: "busy",
    bio: "擅长单板教学，耐心细致",
    certifications: ["CASI 三级", "儿童滑雪教学认证"],
  },
  {
    id: "c3",
    name: "王磊",
    level: "中级",
    specialty: ["初级教学", "儿童滑雪"],
    yearsOfExperience: 5,
    rating: 4.7,
    reviewCount: 64,
    pricePerHour: 300,
    status: "available",
    bio: "亲和力强，擅长零基础教学",
    certifications: ["CSIA 二级"],
  },
  {
    id: "c4",
    name: "陈静",
    level: "初级",
    specialty: ["初级教学"],
    yearsOfExperience: 3,
    rating: 4.6,
    reviewCount: 32,
    pricePerHour: 200,
    status: "offline",
    bio: "认真负责，注重基础动作",
    certifications: ["CSIA 一级"],
  },
];

const mockEquipment: Equipment[] = [
  {
    id: "e1",
    name: "专业双板套装",
    type: "skis",
    brand: "Atomic",
    size: "160cm",
    pricePerDay: 80,
    deposit: 500,
    status: "available",
    description: "适合进阶滑雪者，稳定高性能",
    stock: 30,
  },
  {
    id: "e2",
    name: "单板滑雪板",
    type: "snowboard",
    brand: "Burton",
    size: "155cm",
    pricePerDay: 100,
    deposit: 800,
    status: "available",
    description: "全能型单板，适合各种雪道",
    stock: 20,
  },
  {
    id: "e3",
    name: "专业滑雪靴",
    type: "boots",
    brand: "Dalbello",
    pricePerDay: 40,
    deposit: 300,
    status: "available",
    description: "舒适包裹，热定型内胆",
    stock: 50,
  },
  {
    id: "e4",
    name: "专业滑雪头盔",
    type: "helmet",
    brand: "Giro",
    pricePerDay: 20,
    deposit: 200,
    status: "available",
    description: "MIPS保护系统，轻量化设计",
    stock: 60,
  },
  {
    id: "e5",
    name: "专业滑雪手套",
    type: "gloves",
    brand: "Hestra",
    pricePerDay: 15,
    deposit: 100,
    status: "maintenance",
    description: "防水保暖，触屏设计",
    stock: 80,
  },
  {
    id: "e6",
    name: "专业滑雪镜",
    type: "goggles",
    brand: "Oakley",
    pricePerDay: 25,
    deposit: 300,
    status: "available",
    description: "防雾镜片，UV400防护",
    stock: 40,
  },
];

export const useDataStore = create<DataState>((set) => ({
  tickets: [],
  coaches: [],
  equipment: [],
  bookings: [],
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ tickets: mockTickets, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "获取票务数据失败",
        isLoading: false,
      });
    }
  },

  fetchCoaches: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ coaches: mockCoaches, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "获取教练数据失败",
        isLoading: false,
      });
    }
  },

  fetchEquipment: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ equipment: mockEquipment, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "获取装备数据失败",
        isLoading: false,
      });
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ bookings: [], isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "获取订单数据失败",
        isLoading: false,
      });
    }
  },

  addTicket: (ticket) => {
    set((state) => ({
      tickets: [
        ...state.tickets,
        {
          ...ticket,
          id: `t${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
          sold: 0,
        },
      ],
    }));
  },

  updateTicket: (id, data) => {
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTicket: (id) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== id),
    }));
  },

  addCoach: (coach) => {
    set((state) => ({
      coaches: [...state.coaches, { ...coach, id: `c${Date.now()}` }],
    }));
  },

  updateCoach: (id, data) => {
    set((state) => ({
      coaches: state.coaches.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },

  deleteCoach: (id) => {
    set((state) => ({
      coaches: state.coaches.filter((c) => c.id !== id),
    }));
  },

  addEquipment: (item) => {
    set((state) => ({
      equipment: [...state.equipment, { ...item, id: `e${Date.now()}` }],
    }));
  },

  updateEquipment: (id, data) => {
    set((state) => ({
      equipment: state.equipment.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
  },

  deleteEquipment: (id) => {
    set((state) => ({
      equipment: state.equipment.filter((e) => e.id !== id),
    }));
  },

  createBooking: (booking) => {
    set((state) => ({
      bookings: [
        ...state.bookings,
        {
          ...booking,
          id: `b${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  cancelBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" } : b
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
