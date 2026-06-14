import { useState } from 'react';
import {
  Calendar,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronRight,
  User,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BookingStatus = 'booked' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  coachName: string;
  coachAvatar: string;
  coachLevel: string;
  date: string;
  startTime: string;
  duration: number;
  status: BookingStatus;
  totalPrice: number;
  rating?: number;
  feedback?: string;
}

const mockBookings: Booking[] = [
  {
    id: 'B001',
    coachName: '许金刚',
    coachAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach9',
    coachLevel: '中级教练',
    date: '2024-06-15',
    startTime: '10:00',
    duration: 2,
    status: 'booked',
    totalPrice: 900,
  },
  {
    id: 'B002',
    coachName: '周鹏飞',
    coachAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach5',
    coachLevel: '高级教练',
    date: '2024-06-10',
    startTime: '14:00',
    duration: 3,
    status: 'completed',
    totalPrice: 1650,
  },
  {
    id: 'B003',
    coachName: '王晓冰',
    coachAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach2',
    coachLevel: '高级教练',
    date: '2024-06-05',
    startTime: '09:30',
    duration: 2,
    status: 'cancelled',
    totalPrice: 1200,
  },
  {
    id: 'B004',
    coachName: '刘雪峰',
    coachAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1',
    coachLevel: '国家级教练',
    date: '2024-06-08',
    startTime: '13:00',
    duration: 2,
    status: 'completed',
    totalPrice: 1600,
    rating: 5,
    feedback: '刘教练非常专业，教学耐心细致，我的滑雪技术有了很大提升！强烈推荐给想要进阶的朋友。',
  },
];

const statusConfig = {
  booked: { label: '待上课', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Calendar },
  completed: { label: '已完成', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-secondary/50', bg: 'bg-secondary/10', border: 'border-secondary/20', icon: XCircle },
};

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<'all' | BookingStatus>('all');
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'booked' as const, label: '待上课' },
    { key: 'completed' as const, label: '已完成' },
    { key: 'cancelled' as const, label: '已取消' },
  ];

  const filteredBookings = mockBookings.filter((b) =>
    activeTab === 'all' ? true : b.status === activeTab
  );

  const handleSubmitRating = () => {
    setRatingBooking(null);
    setRating(5);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-2 border border-white/60 shadow-lg">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 min-w-[80px] py-3 px-4 rounded-2xl font-medium transition-all duration-200 whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30'
                  : 'text-secondary/60 hover:bg-primary/10 hover:text-primary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-lg text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/5 flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-secondary/30" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">暂无预约</h3>
          <p className="text-sm text-secondary/50 mb-6">您还没有相关预约记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            const endTime = `${parseInt(booking.startTime.split(':')[0]) + booking.duration}:${booking.startTime.split(':')[1] || '00'}`;

            return (
              <div
                key={booking.id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={booking.coachAvatar}
                    alt={booking.coachName}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 shadow-md flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-secondary">{booking.coachName}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {booking.coachLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-secondary/60">
                          <Calendar className="w-4 h-4" />
                          {booking.date}
                          <span className="text-secondary/30">|</span>
                          <Clock className="w-4 h-4" />
                          {booking.startTime} - {endTime}
                          <span className="text-secondary/30">|</span>
                          {booking.duration}小时
                        </div>
                      </div>
                      <span
                        className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {booking.rating && (
                      <div className="mt-3 p-3 rounded-2xl bg-secondary/5">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-4 h-4',
                                star <= booking.rating!
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-secondary/20'
                              )}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-secondary">{booking.rating}.0</span>
                        </div>
                        <p className="text-sm text-secondary/60">{booking.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                        ¥{booking.totalPrice}
                      </span>

                      <div className="flex gap-2">
                        {booking.status === 'booked' && (
                          <>
                            <button className="px-4 py-2 rounded-xl border border-secondary/20 text-secondary/70 text-sm font-medium hover:bg-secondary/5 transition-colors">
                              取消预约
                            </button>
                            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center gap-1">
                              <User className="w-4 h-4" />
                              教练详情
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {booking.status === 'completed' && !booking.rating && (
                          <button
                            onClick={() => setRatingBooking(booking)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all flex items-center gap-1"
                          >
                            <Star className="w-4 h-4" />
                            去评价
                          </button>
                        )}
                        {booking.status === 'completed' && booking.rating && (
                          <span className="text-sm text-success flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            已评价
                          </span>
                        )}
                        {booking.status === 'cancelled' && (
                          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
                            再次预约
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {ratingBooking && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-secondary/40 backdrop-blur-sm"
          onClick={() => setRatingBooking(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl w-full md:max-w-md animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-secondary/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-secondary">评价课程</h3>
              <button
                onClick={() => setRatingBooking(null)}
                className="p-2 rounded-xl hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5">
                <img
                  src={ratingBooking.coachAvatar}
                  alt={ratingBooking.coachName}
                  className="w-14 h-14 rounded-xl bg-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-secondary">{ratingBooking.coachName}</h4>
                  <p className="text-sm text-secondary/50">{ratingBooking.coachLevel} · {ratingBooking.date}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-secondary/60 mb-3">给教练打分</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={cn(
                          'w-10 h-10 transition-colors',
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-secondary/20'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-2xl font-bold text-secondary mt-2">{hoverRating || rating}.0 分</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  写点反馈（选填）
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="分享您的学习体验，帮助其他游客选择合适的教练..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-secondary/5 border border-secondary/10 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-secondary/10 flex gap-3">
              <button
                onClick={() => setRatingBooking(null)}
                className="flex-1 py-3 rounded-xl border border-secondary/20 text-secondary font-medium hover:bg-secondary/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                提交评价
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
