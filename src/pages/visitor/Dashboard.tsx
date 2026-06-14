import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  User,
  Snowflake,
  Mountain,
  Sun,
  Thermometer,
  Wind,
  Droplets,
  Star,
  Clock,
  MessageCircle,
  ChevronRight,
  Zap,
  TrendingUp,
  Users as UsersIcon,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const quickActions = [
  {
    label: '购票',
    icon: Ticket,
    path: '/visitor/tickets',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    label: '预约教练',
    icon: User,
    path: '/visitor/coaches',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    label: '租赁雪具',
    icon: Snowflake,
    path: '/visitor/rentals',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    label: '查看雪道',
    icon: Mountain,
    path: '/visitor/slopes',
    gradient: 'from-amber-400 to-orange-500',
  },
];

const recommendedCoaches = [
  {
    id: '1',
    name: '刘雪峰',
    level: '国家级教练',
    rating: 4.9,
    reviewCount: 128,
    hourlyRate: 800,
    specialties: ['高级技巧', '竞赛训练'],
    reason: '好评率最高，教学经验丰富',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1',
  },
  {
    id: '2',
    name: '王晓冰',
    level: '高级教练',
    rating: 4.8,
    reviewCount: 96,
    hourlyRate: 600,
    specialties: ['单板', '自由式'],
    reason: '单板教学专家，耐心细致',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach2',
  },
  {
    id: '3',
    name: '赵玉龙',
    level: '中级教练',
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 450,
    specialties: ['初级教学', '儿童教学'],
    reason: '性价比高，适合初学者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach3',
  },
];

const messages: Message[] = [
  {
    id: '1',
    type: 'ticket',
    title: '购票成功',
    content: '您已成功购买今日全天雪票，请在入口处出示电子票二维码。',
    time: '2小时前',
    read: true,
  },
  {
    id: '2',
    type: 'booking',
    title: '教练预约确认',
    content: '您已成功预约许金刚教练今日10:00-12:00的课程。',
    time: '昨天',
    read: true,
  },
  {
    id: '3',
    type: 'rental',
    title: '雪具领取提醒',
    content: '您租赁的雪具已准备就绪，请凭订单号 rental-00001 到雪具租赁处领取。',
    time: '30分钟前',
    read: false,
  },
  {
    id: '4',
    type: 'slope',
    title: '雪道状态变更',
    content: '雪莲峰（高级道）因风力较大，状态已变更为【谨慎开放】。',
    time: '1小时前',
    read: false,
  },
];

const slopeMap = [
  { id: 's1', name: '玉兰道', difficulty: 'beginner', status: 'open', x: 10, y: 60, width: 25, height: 35 },
  { id: 's2', name: '梅花园', difficulty: 'beginner', status: 'open', x: 40, y: 55, width: 20, height: 40 },
  { id: 's3', name: '翠竹道', difficulty: 'intermediate', status: 'open', x: 65, y: 40, width: 18, height: 55 },
  { id: 's4', name: '幽兰谷', difficulty: 'intermediate', status: 'caution', x: 25, y: 25, width: 22, height: 40 },
  { id: 's5', name: '雪莲峰', difficulty: 'advanced', status: 'caution', x: 55, y: 10, width: 20, height: 35 },
  { id: 's6', name: '龙腾道', difficulty: 'expert', status: 'closed', x: 80, y: 5, width: 15, height: 50 },
];

const difficultyColors: Record<string, string> = {
  beginner: '#10B981',
  intermediate: '#F97316',
  advanced: '#EF4444',
  expert: '#7C3AED',
};

const statusColors: Record<string, string> = {
  open: '#10B981',
  caution: '#F97316',
  closed: '#94A3B8',
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [selectedSlope, setSelectedSlope] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 p-6 md:p-8 text-white shadow-xl shadow-primary/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-8 opacity-20">
          <Snowflake className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                你好，{user?.name || '游客'} 👋
              </h1>
              <p className="text-white/80">欢迎来到雪域智慧滑雪场，今天滑雪愉快！</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs text-white/70">天气</span>
                </div>
                <p className="font-bold">晴</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs text-white/70">温度</span>
                </div>
                <p className="font-bold">-8°C</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Wind className="w-4 h-4" />
                  <span className="text-xs text-white/70">风速</span>
                </div>
                <p className="font-bold">5km/h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <Ticket className="w-4 h-4" />
              <span className="text-sm">今日票价：¥308 起</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <UsersIcon className="w-4 h-4" />
              <span className="text-sm">当前客流：1,234 人</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <Droplets className="w-4 h-4" />
              <span className="text-sm">雪质指数：9/10 优</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity',
                  action.gradient
                )}
              />
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300',
                  action.gradient
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-secondary mb-1">{action.label}</h3>
              <p className="text-xs text-secondary/50 flex items-center gap-1">
                立即前往
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Mountain className="w-5 h-5 text-primary" />
                雪道状态地图
              </h2>
              <p className="text-sm text-secondary/50 mt-1">点击雪道查看详情</p>
            </div>
            <Link
              to="/visitor/slopes"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative h-64 md:h-80 bg-gradient-to-b from-sky-100 to-blue-50 rounded-2xl overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="snow-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" fill="url(#snow-bg)" />

              <path
                d="M0,100 L0,70 Q25,30 50,50 T100,20 L100,100 Z"
                fill="#f0f9ff"
                opacity="0.6"
              />
              <path
                d="M0,100 L0,80 Q30,50 60,60 T100,40 L100,100 Z"
                fill="#e0f2fe"
                opacity="0.5"
              />
            </svg>

            {slopeMap.map((slope) => (
              <div
                key={slope.id}
                onClick={() => setSelectedSlope(selectedSlope === slope.id ? null : slope.id)}
                className={cn(
                  'absolute cursor-pointer transition-all duration-300 rounded-xl border-2 overflow-hidden',
                  selectedSlope === slope.id
                    ? 'ring-4 ring-primary/40 scale-105 z-10'
                    : 'hover:scale-102'
                )}
                style={{
                  left: `${slope.x}%`,
                  top: `${slope.y}%`,
                  width: `${slope.width}%`,
                  height: `${slope.height}%`,
                  borderColor: statusColors[slope.status],
                  backgroundColor: `${difficultyColors[slope.difficulty]}20`,
                }}
              >
                <div
                  className="absolute top-1 left-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColors[slope.status] }}
                />
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-[10px] font-bold text-secondary truncate">{slope.name}</p>
                </div>
              </div>
            ))}

            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl p-2.5">
              {['beginner', 'intermediate', 'advanced', 'expert'].map((d) => (
                <div key={d} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: difficultyColors[d] }}
                  />
                  <span className="text-[10px] text-secondary/70">
                    {d === 'beginner' ? '初级' : d === 'intermediate' ? '中级' : d === 'advanced' ? '高级' : '专家'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                今日推荐教练
              </h2>
              <Link
                to="/visitor/coaches"
                className="text-sm text-primary hover:text-primary/80"
              >
                更多
              </Link>
            </div>
            <div className="space-y-3">
              {recommendedCoaches.slice(0, 2).map((coach) => (
                <Link
                  key={coach.id}
                  to="/visitor/coaches"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/5 hover:bg-primary/5 transition-colors group"
                >
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-200 to-primary-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-secondary truncate">{coach.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {coach.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-secondary/70">{coach.rating}</span>
                      </div>
                      <span className="text-xs text-secondary/40">|</span>
                      <span className="text-xs text-secondary/50">¥{coach.hourlyRate}/时</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                快捷数据
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-success/10 to-emerald-50 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-xs text-secondary/60">本周滑雪</span>
                </div>
                <p className="text-2xl font-bold text-success">3<span className="text-sm font-normal text-secondary/60 ml-1">天</span></p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-sky-50 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-secondary/60">累计时长</span>
                </div>
                <p className="text-2xl font-bold text-primary">12.5<span className="text-sm font-normal text-secondary/60 ml-1">时</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            最近消息
          </h2>
          <button className="text-sm text-primary hover:text-primary/80">查看全部</button>
        </div>
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-2xl transition-colors cursor-pointer',
                msg.read ? 'bg-secondary/5 hover:bg-secondary/10' : 'bg-primary/5 hover:bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  msg.type === 'ticket' && 'bg-sky-100 text-sky-600',
                  msg.type === 'booking' && 'bg-emerald-100 text-emerald-600',
                  msg.type === 'rental' && 'bg-violet-100 text-violet-600',
                  msg.type === 'slope' && 'bg-amber-100 text-amber-600'
                )}
              >
                {msg.type === 'ticket' && <Ticket className="w-5 h-5" />}
                {msg.type === 'booking' && <User className="w-5 h-5" />}
                {msg.type === 'rental' && <Snowflake className="w-5 h-5" />}
                {msg.type === 'slope' && <Mountain className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-secondary">{msg.title}</p>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-danger" />
                  )}
                  <span className="ml-auto text-xs text-secondary/40">{msg.time}</span>
                </div>
                <p className="text-sm text-secondary/60 line-clamp-1">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
