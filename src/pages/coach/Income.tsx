import { Wallet, TrendingUp, Calendar, Star, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const incomeCards = [
  { label: '今日收入', value: '1,280', change: '+15%', icon: Wallet, color: 'from-primary-400 to-primary-600' },
  { label: '本周收入', value: '6,890', change: '+8%', icon: Calendar, color: 'from-success-400 to-success-600' },
  { label: '本月收入', value: '12,580', change: '+12%', icon: TrendingUp, color: 'from-warning-400 to-warning-600' },
  { label: '累计收入', value: '86,420', change: '+25%', icon: Wallet, color: 'from-purple-400 to-purple-600' },
];

const monthlyIncome = [
  { month: '1月', value: 8200 },
  { month: '2月', value: 9500 },
  { month: '3月', value: 7800 },
  { month: '4月', value: 6200 },
  { month: '5月', value: 10800 },
  { month: '6月', value: 12580 },
];

const ratingStats = [
  { stars: 5, count: 128, percent: 72 },
  { stars: 4, count: 36, percent: 20 },
  { stars: 3, count: 10, percent: 6 },
  { stars: 2, count: 3, percent: 2 },
  { stars: 1, count: 0, percent: 0 },
];

const wordCloudData = [
  { word: '专业', size: 'text-3xl', color: 'text-primary' },
  { word: '耐心', size: 'text-2xl', color: 'text-success' },
  { word: '细致', size: 'text-xl', color: 'text-warning' },
  { word: '讲解清楚', size: 'text-2xl', color: 'text-primary' },
  { word: '进步快', size: 'text-xl', color: 'text-purple-600' },
  { word: '推荐', size: 'text-lg', color: 'text-success' },
  { word: '友好', size: 'text-xl', color: 'text-primary' },
  { word: '技术好', size: 'text-lg', color: 'text-warning' },
  { word: '负责', size: 'text-2xl', color: 'text-primary' },
  { word: '有趣', size: 'text-lg', color: 'text-purple-600' },
  { word: '安全', size: 'text-xl', color: 'text-success' },
  { word: '高效', size: 'text-lg', color: 'text-primary' },
  { word: '经验丰富', size: 'text-xl', color: 'text-warning' },
  { word: '循序渐进', size: 'text-lg', color: 'text-primary' },
  { word: '有亲和力', size: 'text-lg', color: 'text-success' },
];

const reviews = [
  {
    id: 1,
    name: '李明轩',
    avatar: '李',
    rating: 5,
    content: '王教练非常专业，讲解细致，两节课就学会了基础换刃！强烈推荐给想要学单板的朋友。',
    time: '2025-06-14 18:30',
    courseType: '单板初级',
    tags: ['专业', '耐心', '细致'],
  },
  {
    id: 2,
    name: '赵雅婷',
    avatar: '赵',
    rating: 5,
    content: '教练很有耐心，针对我的问题给出了很多实用建议，几节课下来进步很大，下次还会约！',
    time: '2025-06-13 20:15',
    courseType: '双板进阶',
    tags: ['耐心', '进步快', '负责'],
  },
  {
    id: 3,
    name: '孙伟强',
    avatar: '孙',
    rating: 4,
    content: '教学质量很高，教练技术也很好，就是时间有点紧，希望下次能多安排一些练习时间。',
    time: '2025-06-12 15:45',
    courseType: '自由式技巧',
    tags: ['专业', '技术好'],
  },
  {
    id: 4,
    name: '周小雪',
    avatar: '周',
    rating: 5,
    content: '非常感谢王教练！作为一个完全的小白，本来很害怕滑雪，但是教练特别有耐心，一步一步教，现在已经能独立滑初级道了！',
    time: '2025-06-11 17:20',
    courseType: '单板初级',
    tags: ['耐心', '友好', '有亲和力'],
  },
  {
    id: 5,
    name: '吴大龙',
    avatar: '吴',
    rating: 5,
    content: '教孩子特别有一套，我家小孩平时坐不住，跟着王教练居然能专心学两小时，还嚷着下次还要来！',
    time: '2025-06-10 19:00',
    courseType: '儿童教学',
    tags: ['负责', '有趣', '推荐'],
  },
];

function StatCard({ label, value, change, icon: Icon, color }: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary/60 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-secondary">¥{value}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            <span className="text-xs text-success font-medium">{change}</span>
            <span className="text-xs text-secondary/40">较上期</span>
          </div>
        </div>
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'text-warning fill-warning' : 'text-secondary/20'
          )}
        />
      ))}
    </div>
  );
}

export default function CoachIncome() {
  const maxMonthlyValue = Math.max(...monthlyIncome.map((d) => d.value));
  const totalReviews = ratingStats.reduce((sum, r) => sum + r.count, 0);
  const avgRating = ratingStats.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary">收入与评价</h2>
          <p className="text-sm text-secondary/50 mt-1">查看您的教学收入和学员评价</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md shadow-primary/30 hover:shadow-lg transition-all">
          <Download className="w-4 h-4" />
          导出报表
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {incomeCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-secondary">月度收入</h3>
              <p className="text-sm text-secondary/50 mt-0.5">2025年度收入趋势</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">月度</button>
              <button className="px-3 py-1.5 rounded-lg text-secondary/50 text-sm font-medium hover:bg-secondary/5">季度</button>
              <button className="px-3 py-1.5 rounded-lg text-secondary/50 text-sm font-medium hover:bg-secondary/5">年度</button>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 h-64 px-2">
            {monthlyIncome.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-secondary">¥{item.value.toLocaleString()}</span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary-500 to-primary-300 hover:from-primary-600 hover:to-primary-400 transition-all duration-300 relative group"
                    style={{ height: `${(item.value / maxMonthlyValue) * 100}%`, minHeight: '20px' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-secondary text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ¥{item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-secondary/60">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-secondary">评分统计</h3>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              详情 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mb-5 pb-5 border-b border-secondary/10">
            <div className="text-5xl font-bold text-secondary mb-1">{avgRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">
              <StarRating rating={Math.round(avgRating)} size="md" />
            </div>
            <p className="text-sm text-secondary/50">共 {totalReviews} 条评价</p>
          </div>
          <div className="space-y-3">
            {ratingStats.map((stat) => (
              <div key={stat.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-secondary">{stat.stars}</span>
                  <Star className="w-4 h-4 text-warning fill-warning" />
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-secondary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-warning-400 to-warning-500"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
                <span className="text-sm text-secondary/50 w-16 text-right">{stat.count} ({stat.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-secondary">学员评价关键词</h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 py-6">
          {wordCloudData.map((item, index) => (
            <span
              key={index}
              className={cn(
                'font-semibold cursor-pointer hover:scale-110 transition-transform',
                item.size,
                item.color
              )}
              style={{ opacity: 0.7 + Math.random() * 0.3 }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-secondary">评价列表</h3>
            <p className="text-sm text-secondary/50 mt-0.5">共 {reviews.length} 条评价</p>
          </div>
          <div className="flex gap-2">
            {['全部', '好评', '中评', '差评'].map((filter, i) => (
              <button
                key={filter}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  i === 0 ? 'bg-primary text-white' : 'text-secondary/60 hover:bg-secondary/5'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-5 rounded-xl border border-secondary/10 hover:border-primary/20 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-secondary">{review.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {review.courseType}
                        </span>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="text-xs text-secondary/40">{review.time}</span>
                  </div>
                  <p className="text-sm text-secondary/70 leading-relaxed mb-3">{review.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary/5 text-secondary/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
