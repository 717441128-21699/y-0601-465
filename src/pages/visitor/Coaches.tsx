import { useState } from 'react';
import {
  Star,
  Clock,
  Award,
  Filter,
  X,
  Check,
  Calendar,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  User as UserIcon,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Coach {
  id: string;
  name: string;
  level: string;
  levelNum: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  status: 'available' | 'busy' | 'offline';
  avatar: string;
  description: string;
  recommendReason?: string;
  availableSlots: string[];
}

const coaches: Coach[] = [
  {
    id: '1',
    name: '刘雪峰',
    level: '国家级',
    levelNum: 5,
    rating: 4.9,
    reviewCount: 128,
    hourlyRate: 800,
    specialties: ['高级技巧', '竞赛训练', '双板'],
    status: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1',
    description: '前国家队成员，多次获得全国冠军，拥有15年教学经验。',
    recommendReason: '好评率最高，教学经验丰富，适合进阶学员',
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  },
  {
    id: '2',
    name: '王晓冰',
    level: '高级',
    levelNum: 4,
    rating: 4.8,
    reviewCount: 96,
    hourlyRate: 600,
    specialties: ['单板', '自由式', '公园技巧'],
    status: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach2',
    description: '单板教学专家，擅长公园技巧和自由式动作，耐心细致。',
    recommendReason: '单板教学专家，学员满意度98%',
    availableSlots: ['09:30', '10:30', '13:00', '14:30', '16:00'],
  },
  {
    id: '3',
    name: '赵玉龙',
    level: '中级',
    levelNum: 3,
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 450,
    specialties: ['初级教学', '儿童教学', '双板'],
    status: 'busy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach3',
    description: '亲和力强，擅长零基础教学和儿童滑雪培训。',
    recommendReason: '性价比最高，适合初学者和儿童',
    availableSlots: ['10:00', '11:00', '15:00'],
  },
  {
    id: '4',
    name: '孙红梅',
    level: '中级',
    levelNum: 3,
    rating: 4.6,
    reviewCount: 45,
    hourlyRate: 400,
    specialties: ['初级教学', '单板', '儿童教学'],
    status: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach4',
    description: '女教练，温柔耐心，特别适合女性学员和儿童。',
    availableSlots: ['09:00', '10:00', '14:00', '15:00'],
  },
  {
    id: '5',
    name: '周鹏飞',
    level: '高级',
    levelNum: 4,
    rating: 4.8,
    reviewCount: 82,
    hourlyRate: 550,
    specialties: ['中级进阶', '高级技巧', '双板'],
    status: 'offline',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach5',
    description: '擅长帮助学员突破瓶颈，快速提升滑雪水平。',
    availableSlots: [],
  },
  {
    id: '6',
    name: '吴雅婷',
    level: '初级',
    levelNum: 2,
    rating: 4.5,
    reviewCount: 28,
    hourlyRate: 300,
    specialties: ['初级教学', '双板'],
    status: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach6',
    description: '认真负责，注重基础动作教学，适合零基础学员。',
    availableSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
  },
];

const statusConfig = {
  available: { label: '可预约', color: 'text-success', bg: 'bg-success/10' },
  busy: { label: '课程中', color: 'text-warning', bg: 'bg-warning/10' },
  offline: { label: '离线', color: 'text-secondary/50', bg: 'bg-secondary/10' },
};

export default function Coaches() {
  const [showFilter, setShowFilter] = useState(false);
  const [bookingCoach, setBookingCoach] = useState<Coach | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const [filters, setFilters] = useState({
    level: [] as number[],
    specialties: [] as string[],
    priceRange: [0, 1000] as [number, number],
    timeSlot: null as string | null,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const allSpecialties = Array.from(new Set(coaches.flatMap((c) => c.specialties)));

  const filteredCoaches = coaches.filter((coach) => {
    if (searchQuery && !coach.name.includes(searchQuery)) return false;
    if (filters.level.length > 0 && !filters.level.includes(coach.levelNum)) return false;
    if (filters.specialties.length > 0 && !filters.specialties.some((s) => coach.specialties.includes(s))) return false;
    if (coach.hourlyRate < filters.priceRange[0] || coach.hourlyRate > filters.priceRange[1]) return false;
    return true;
  });

  const recommendedCoaches = coaches.filter((c) => c.recommendReason).slice(0, 3);

  const handleBooking = () => {
    if (!bookingCoach || !selectedSlot) return;
    setShowBookingSuccess(true);
    setTimeout(() => {
      setShowBookingSuccess(false);
      setBookingCoach(null);
      setSelectedSlot(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-primary/30">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">选择你的专属教练</h2>
            <p className="text-white/80">专业教练团队，助力你的滑雪之旅</p>
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索教练姓名..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          智能推荐
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCoaches.map((coach, index) => (
            <div
              key={coach.id}
              onClick={() => setBookingCoach(coach)}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100 cursor-pointer hover:shadow-lg hover:shadow-amber-200/50 transition-all hover:-translate-y-1"
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Top {index + 1}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <img src={coach.avatar} alt={coach.name} className="w-14 h-14 rounded-xl bg-white shadow-md" />
                <div>
                  <h4 className="font-bold text-secondary">{coach.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {coach.level}教练
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-secondary">{coach.rating}</span>
                </div>
                <span className="text-xs text-secondary/40">|</span>
                <span className="text-xs text-secondary/50">{coach.reviewCount}条评价</span>
              </div>
              <p className="text-xs text-secondary/60 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-amber-500" />
                {coach.recommendReason}
              </p>
              <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between">
                <span className="text-lg font-bold text-secondary">
                  ¥{coach.hourlyRate}
                  <span className="text-xs font-normal text-secondary/50">/时</span>
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all">
                  立即预约
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoaches.map((coach) => {
          const status = statusConfig[coach.status];
          return (
            <div
              key={coach.id}
              onClick={() => coach.status !== 'offline' && setBookingCoach(coach)}
              className={cn(
                'group bg-white/70 backdrop-blur-xl rounded-3xl p-5 border-2 transition-all duration-300',
                coach.status === 'offline'
                  ? 'border-white/60 opacity-60 cursor-not-allowed'
                  : 'border-white/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer'
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 shadow-md"
                  />
                  <div
                    className={cn(
                      'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center',
                      coach.status === 'available' ? 'bg-success' : coach.status === 'busy' ? 'bg-warning' : 'bg-secondary/40'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-secondary">{coach.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {coach.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-secondary">{coach.rating}</span>
                    </div>
                    <span className="text-xs text-secondary/40">|</span>
                    <span className="text-xs text-secondary/50">{coach.reviewCount}评价</span>
                    <span className="text-xs text-secondary/40">|</span>
                    <span className={cn('text-xs', status.color)}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-xs text-secondary/50">¥{coach.hourlyRate}/时</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {coach.specialties.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg bg-secondary/5 text-secondary/60 text-xs">
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-sm text-secondary/60 line-clamp-2 mb-4">{coach.description}</p>

              <div className="flex items-center gap-2">
                <div className="flex-1 flex -space-x-1">
                  {coach.availableSlots.slice(0, 4).map((slot) => (
                    <span
                      key={slot}
                      className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                    >
                      {slot}
                    </span>
                  ))}
                  {coach.availableSlots.length > 4 && (
                    <span className="px-2 py-1 rounded-md bg-secondary/10 text-secondary/50 text-xs">
                      +{coach.availableSlots.length - 4}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-secondary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {showFilter && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-secondary/40 backdrop-blur-sm"
          onClick={() => setShowFilter(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[85vh] overflow-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl p-5 border-b border-secondary/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                筛选条件
              </h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 rounded-xl hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h4 className="font-medium text-secondary mb-3">教练级别</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const labels = ['', '初级', '中级', '高级', '国家级', '国家级以上'];
                    const selected = filters.level.includes(level);
                    return (
                      <button
                        key={level}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            level: selected ? f.level.filter((l) => l !== level) : [...f.level, level],
                          }))
                        }
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          selected
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                            : 'bg-secondary/5 text-secondary/70 hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        {labels[level]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary mb-3">专长领域</h4>
                <div className="flex flex-wrap gap-2">
                  {allSpecialties.map((specialty) => {
                    const selected = filters.specialties.includes(specialty);
                    return (
                      <button
                        key={specialty}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            specialties: selected
                              ? f.specialties.filter((s) => s !== specialty)
                              : [...f.specialties, specialty],
                          }))
                        }
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          selected
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                            : 'bg-secondary/5 text-secondary/70 hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary mb-3">
                  价格范围：¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}
                </h4>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], parseInt(e.target.value)] }))
                  }
                  className="w-full h-2 bg-secondary/10 rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl p-5 border-t border-secondary/10 flex gap-3">
              <button
                onClick={() => setFilters({ level: [], specialties: [], priceRange: [0, 1000], timeSlot: null })}
                className="flex-1 py-3 rounded-xl border border-secondary/20 text-secondary font-medium hover:bg-secondary/5 transition-colors"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                应用筛选
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingCoach && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-secondary/40 backdrop-blur-sm"
          onClick={() => !showBookingSuccess && setBookingCoach(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] overflow-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {showBookingSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-success-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-success/30">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">预约成功！</h3>
                <p className="text-secondary/60">教练已确认您的预约，请准时到达</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 bg-white/95 backdrop-blur-xl p-5 border-b border-secondary/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-secondary">预约教练</h3>
                  <button
                    onClick={() => setBookingCoach(null)}
                    className="p-2 rounded-xl hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5">
                    <img
                      src={bookingCoach.avatar}
                      alt={bookingCoach.name}
                      className="w-16 h-16 rounded-2xl bg-white shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-lg text-secondary">{bookingCoach.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {bookingCoach.level}教练
                        </span>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-secondary">{bookingCoach.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      选择日期
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                      {['今天', '明天', '后天', '周四', '周五', '周六', '周日'].map((day, i) => (
                        <button
                          key={i}
                          className="flex-shrink-0 px-4 py-3 rounded-xl bg-secondary/5 hover:bg-primary/10 hover:text-primary text-secondary/70 font-medium transition-all"
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      选择时段
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {bookingCoach.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'py-2.5 rounded-xl text-sm font-medium transition-all',
                            selectedSlot === slot
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                              : 'bg-secondary/5 text-secondary/70 hover:bg-primary/10 hover:text-primary'
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary mb-3">课程时长</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setSelectedDuration(hours)}
                          className={cn(
                            'flex-1 py-3 rounded-xl font-medium transition-all',
                            selectedDuration === hours
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                              : 'bg-secondary/5 text-secondary/70 hover:bg-primary/10 hover:text-primary'
                          )}
                        >
                          {hours}小时
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-sky-50 border border-primary/10">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary/60">时薪</span>
                      <span className="text-secondary">¥{bookingCoach.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary/60">时长</span>
                      <span className="text-secondary">{selectedDuration}小时</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary/60">时段</span>
                      <span className="text-secondary">{selectedSlot || '请选择'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dashed border-primary/20 flex justify-between">
                      <span className="font-medium text-secondary">合计</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                        ¥{bookingCoach.hourlyRate * selectedDuration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl p-5 border-t border-secondary/10">
                  <button
                    onClick={handleBooking}
                    disabled={!selectedSlot}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    确认预约
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
