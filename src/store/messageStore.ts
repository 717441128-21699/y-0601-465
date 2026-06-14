import { create } from "zustand";

export type MessageType = "info" | "success" | "warning" | "error";
export type MessageCategory = "system" | "order" | "notification" | "alert";

export interface Message {
  id: string;
  type: MessageType;
  category: MessageCategory;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  senderName?: string;
}

interface MessageState {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchMessages: () => Promise<void>;
  addMessage: (
    message: Omit<Message, "id" | "createdAt" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteMessage: (id: string) => void;
  clearAll: () => void;
  getUnreadByCategory: (category: MessageCategory) => number;
  clearError: () => void;
}

const mockMessages: Message[] = [
  {
    id: "m1",
    type: "success",
    category: "order",
    title: "订单支付成功",
    content: "您的全天滑雪票订单已支付成功，祝您滑雪愉快！",
    read: false,
    createdAt: "2024-01-20 14:30:00",
    actionUrl: "/orders",
  },
  {
    id: "m2",
    type: "warning",
    category: "system",
    title: "天气预警",
    content: "明日有降雪，雪道将开放高级区域，请滑雪时注意安全。",
    read: false,
    createdAt: "2024-01-20 10:15:00",
  },
  {
    id: "m3",
    type: "info",
    category: "notification",
    title: "教练预约确认",
    content: "您预约的张伟教练已确认明日上午10:00的课程。",
    read: true,
    createdAt: "2024-01-19 16:45:00",
    actionUrl: "/coaches/bookings",
    senderName: "张伟教练",
  },
  {
    id: "m4",
    type: "error",
    category: "alert",
    title: "安全提醒",
    content: "检测到您的账号在新设备登录，如非本人操作请及时修改密码。",
    read: false,
    createdAt: "2024-01-19 09:00:00",
  },
  {
    id: "m5",
    type: "info",
    category: "system",
    title: "系统维护通知",
    content: "系统将于1月25日凌晨02:00-04:00进行维护升级，期间部分功能可能无法使用。",
    read: true,
    createdAt: "2024-01-18 18:00:00",
  },
];

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const sortedMessages = mockMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      set({
        messages: sortedMessages,
        unreadCount: sortedMessages.filter((m) => !m.read).length,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "获取消息失败",
        isLoading: false,
      });
    }
  },

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `m${Date.now()}`,
      createdAt: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(/\//g, "-"),
      read: false,
    };
    set((state) => ({
      messages: [newMessage, ...state.messages],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      messages: state.messages.map((m) => ({ ...m, read: true })),
      unreadCount: 0,
    }));
  },

  deleteMessage: (id) => {
    set((state) => {
      const target = state.messages.find((m) => m.id === id);
      return {
        messages: state.messages.filter((m) => m.id !== id),
        unreadCount: target && !target.read
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ messages: [], unreadCount: 0 });
  },

  getUnreadByCategory: (category) => {
    return get().messages.filter(
      (m) => m.category === category && !m.read
    ).length;
  },

  clearError: () => {
    set({ error: null });
  },
}));
