import { useNavigate } from 'react-router-dom'
import { X, MessageSquare, Ticket, Calendar, Package, Mountain, LifeBuoy, FileBarChart, Settings, ChevronRight, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MessageType } from '@shared/types'

interface Message {
  id: string
  type: MessageType
  title: string
  content: string
  read: boolean
  createdAt: string
}

interface MessageCenterProps {
  open: boolean
  onClose: () => void
}

const messageIconMap: Record<MessageType, LucideIcon> = {
  ticket: Ticket,
  booking: Calendar,
  rental: Package,
  slope: Mountain,
  rescue: LifeBuoy,
  finance: FileBarChart,
  system: Settings,
}

const messageColorMap: Record<MessageType, string> = {
  ticket: 'bg-primary-100 text-primary-600',
  booking: 'bg-success-100 text-success-600',
  rental: 'bg-warning-100 text-warning-600',
  slope: 'bg-primary-100 text-primary-600',
  rescue: 'bg-danger-100 text-danger-600',
  finance: 'bg-secondary-100 text-secondary-600',
  system: 'bg-secondary-100 text-secondary-600',
}

const demoMessages: Message[] = [
  {
    id: '1',
    type: 'ticket',
    title: '雪票购买成功',
    content: '您已成功购买2024-01-15的全天雪票，请按时入场。',
    read: false,
    createdAt: '2024-01-14 10:30',
  },
  {
    id: '2',
    type: 'booking',
    title: '教练预约确认',
    content: '您预约的王雪峰教练已确认，明日上午9:00在服务大厅集合。',
    read: false,
    createdAt: '2024-01-14 09:15',
  },
  {
    id: '3',
    type: 'rental',
    title: '雪具归还提醒',
    content: '您租赁的雪具请于今日17:00前归还至雪具大厅。',
    read: true,
    createdAt: '2024-01-13 16:45',
  },
  {
    id: '4',
    type: 'system',
    title: '系统公告',
    content: '明日雪场开放时间调整为8:00-17:30，请注意安排行程。',
    read: true,
    createdAt: '2024-01-13 14:00',
  },
]

export default function MessageCenter({ open, onClose }: MessageCenterProps) {
  const navigate = useNavigate()

  if (!open) return null

  const unreadCount = demoMessages.filter((m) => !m.read).length

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in-up"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary-800">消息中心</h2>
              <p className="text-xs text-secondary-500">
                {unreadCount > 0 ? `您有 ${unreadCount} 条未读消息` : '暂无未读消息'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {demoMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-primary-300" />
              </div>
              <p className="text-secondary-400 text-sm">暂无消息</p>
            </div>
          ) : (
            <div className="divide-y divide-primary/5">
              {demoMessages.map((msg) => {
                const Icon = messageIconMap[msg.type]
                return (
                  <div
                    key={msg.id}
                    className={`px-6 py-4 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer group ${
                      !msg.read ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${messageColorMap[msg.type]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-sm font-semibold truncate ${
                            !msg.read ? 'text-secondary-900' : 'text-secondary-600'
                          }`}>
                            {msg.title}
                          </h3>
                          {!msg.read && (
                            <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-secondary-500 mt-1 line-clamp-2">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-secondary-400">{msg.createdAt}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!msg.read && (
                              <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                                <Check className="w-3.5 h-3.5" />
                                标为已读
                              </button>
                            )}
                            <ChevronRight className="w-4 h-4 text-secondary-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-primary/10">
          <button
            onClick={() => {
              onClose()
              navigate('/messages')
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary/30 transition-all duration-200"
          >
            查看全部消息
          </button>
        </div>
      </div>
    </>
  )
}
