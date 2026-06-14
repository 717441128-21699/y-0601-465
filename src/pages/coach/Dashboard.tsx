import {
  CalendarDays,
  Wallet,
  Users,
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statsCards = [
  {
    label: '今日课程',
    value: '6',
    unit: '节',
    icon: CalendarDays,
    color: 'from-primary-400 to-primary-600',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  {
    label: '本月收入',
    value: '12,580',
    unit: '元',
    icon: Wallet,
    color: 'from-success-400 to-success-600',
    bg: 'bg-success/10',
    text: 'text-success',
  },
  {
    label: '累计学员',
    value: '186',
    unit: '人',
    icon: Users,
    color: 'from-warning-400 to-warning-600',
    bg: 'bg-warning/10',
    text: 'text-warning',
  },
  {
    label: '综合评分',
    value: '4.9',
    unit: '分',
    icon: Star,
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
];

const todaySchedule = [
  {
    id: 1,
    time: '09:00 - 11:00',
    student: '李明轩',
    avatar: '李',
    courseType: '单板初级',
    status: '已完成',
    statusColor: 'bg-success/10 text-success',
  },
  {
    id: 2,
    time: '11:30 - 13:30',
    student: '王小美',
    avatar: '王',
    courseType: '双板进阶',
    status: '进行中',
    statusColor: 'bg-primary/10 text-primary',
  },
  {
    id: 3,
    time: '14:00 - 16:00',
    student: '张子涵',
    avatar: '张',
    courseType: '儿童教学',
    status: '待上课',
    statusColor: 'bg-warning/10 text-warning',
  },
  {
    id: 4,
    time: '16:30 - 18:30',
    student: '刘浩然',
    avatar: '刘',
    courseType: '自由式技巧',
    status: '待上课',
    statusColor: 'bg-warning/10 text-warning',
  },
  {
    id: 5,
    time: '19:00 - 21:00',
    student: '陈思雨',
    avatar: '陈',
    courseType: '单板高级',
    status: '待上课',
    statusColor: 'bg-warning/10 text-warning',
  },
];

const latestReviews = [
  {
    id: 1,
    name: '李明轩',
    avatar: '李',
    rating: 5,
    content: '王教练非常专业，讲解细致，两节课就学会了基础换刃！强烈推荐！',
    time: '2小时前',
  },
  {
    id: 2,
    name: '赵雅婷',
    avatar: '赵',
    rating: 5,
    content: '耐心细致，针对我的问题给出了很多实用建议，进步很大。',
    time: '昨天',
  },
  {
    id: 3,
    name: '孙伟强',
    avatar: '孙',
    rating: 4,
    content: '教学质量很高，就是时间有点紧，希望下次能多练一会儿。',
    time: '3天前',
  },
];

const incomeTrend = [
  { day: '周一', value: 1200 },
  { day: '周二', value: 1800 },
  { day: '周三', value: 900 },
  { day: '周四', value: 2400 },
  { day: '周五', value: 1600 },
  { day: '周六', value: 3200 },
  { day: '周日', value: 2800 },
];

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
  bg,
  text,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  text: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary/60 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-secondary">{value}</span>
            <span className="text-sm text-secondary/50">{unit}</span>
          </div>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md',
            color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= rating
              ? 'text-warning fill-warning'
              : 'text-secondary/20'
          )}
        />
      ))}
    </div>
  );
}

export default function CoachDashboard() {
  const maxValue = Math.max(...incomeTrend.map((d) => d.value));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-secondary">今日课表</h3>
              <p className="text-sm text-secondary/50 mt-0.5">
                共 {todaySchedule.length} 节课程
              </p>
            </div>
            <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10" />
            <div className="space-y-4">
              {todaySchedule.map((item) => (
                <div key={item.id} className="flex items-start gap-4 relative">
                  <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div className="flex-1 bg-secondary/5 rounded-xl p-4 hover:bg-primary/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-secondary">
                          {item.student}
                        </p>
                        <p className="text-sm text-secondary/60">
                          {item.courseType}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'text-xs px-2.5 py-1 rounded-full font-medium',
                          item.statusColor
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-secondary/50">
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary">收入趋势</h3>
              <div className="flex items-center gap-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {incomeTrend.map((item) => (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-300 hover:from-primary-600 hover:to-primary-400 transition-all duration-300"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      minHeight: '8px',
                    }}
                  />
                  <span className="text-xs text-secondary/50">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-secondary">最新评价</h3>
              </div>
              <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
                全部
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {latestReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-3 pb-4 border-b border-secondary/10 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-secondary text-sm">
                        {review.name}
                      </span>
                      <span className="text-xs text-secondary/40">
                        {review.time}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-secondary/60 mt-1.5 line-clamp-2">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
