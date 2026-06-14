import { useState, useEffect } from 'react';
import {
  Ticket,
  Calendar,
  Users,
  Info,
  ShoppingCart,
  Check,
  QrCode,
  ArrowLeft,
  Sparkles,
  TrendingDown,
  Clock,
  Sun,
  Cloud,
  CloudSnow,
  CloudRain,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTicketStore, getTicketTypeName } from '@/store/ticketStore';
import { useAuthStore } from '@/store/authStore';
import type { TicketType } from '@shared/types';

interface TicketInfo {
  id: TicketType;
  name: string;
  description: string;
  basePrice: number;
  icon: typeof Ticket;
  color: string;
}

const ticketTypes: TicketInfo[] = [
  {
    id: 'adult',
    name: '成人票',
    description: '18-59岁成人使用，全天滑雪',
    basePrice: 380,
    icon: Ticket,
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'child',
    name: '儿童票',
    description: '4-17岁儿童使用，需成人陪同',
    basePrice: 280,
    icon: Users,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'senior',
    name: '老人票',
    description: '60岁以上老人使用，需出示证件',
    basePrice: 280,
    icon: Ticket,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'halfday',
    name: '半日票',
    description: '上午或下午4小时滑雪',
    basePrice: 260,
    icon: Clock,
    color: 'from-violet-400 to-purple-500',
  },
];

export default function Tickets() {
  const { user } = useAuthStore();
  const {
    remainingCapacity,
    isLoading,
    error,
    fetchCapacity,
    purchaseTicket,
    fetchMyTickets,
    clearError,
  } = useTicketStore();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTicket, setSelectedTicket] = useState<TicketType>('adult');
  const [quantities, setQuantities] = useState<Record<TicketType, number>>({
    adult: 1,
    child: 0,
    senior: 0,
    halfday: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState<any>(null);

  const weatherForecast = [
    { date: 0, day: '今天', weather: 'sunny', temp: -8 },
    { date: 1, day: '明天', weather: 'cloudy', temp: -6 },
    { date: 2, day: '后天', weather: 'snowy', temp: -10 },
    { date: 3, day: '周四', weather: 'sunny', temp: -7 },
    { date: 4, day: '周五', weather: 'cloudy', temp: -5 },
    { date: 5, day: '周六', weather: 'snowy', temp: -12 },
    { date: 6, day: '周日', weather: 'rainy', temp: -3 },
  ];

  useEffect(() => {
    fetchCapacity(selectedDate);
  }, [selectedDate, fetchCapacity]);

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'snowy': return CloudSnow;
      case 'rainy': return CloudRain;
      default: return Sun;
    }
  };

  const getWeatherText = (weather: string) => {
    switch (weather) {
      case 'sunny': return '晴';
      case 'cloudy': return '多云';
      case 'snowy': return '小雪';
      case 'rainy': return '雨夹雪';
      default: return '晴';
    }
  };

  const getDynamicFactor = () => {
    const dayOfWeek = new Date(selectedDate).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return isWeekend ? 1.15 : 1.0;
  };

  const dynamicFactor = getDynamicFactor();

  const calculatePrice = (ticket: TicketInfo) => {
    return Math.round(ticket.basePrice * dynamicFactor);
  };

  const totalPrice = ticketTypes.reduce(
    (sum, ticket) => sum + calculatePrice(ticket) * quantities[ticket.id],
    0
  );

  const totalOriginalPrice = ticketTypes.reduce(
    (sum, ticket) => sum + ticket.basePrice * quantities[ticket.id],
    0
  );

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);

  const isSoldOut = remainingCapacity ? remainingCapacity.remaining <= 0 : false;
  const isCapacityWarning = remainingCapacity ? remainingCapacity.percentage >= 95 : false;
  const isCapacityCaution = remainingCapacity ? remainingCapacity.percentage >= 80 && remainingCapacity.percentage < 95 : false;

  const getCapacityColor = () => {
    if (isCapacityWarning) return 'bg-danger';
    if (isCapacityCaution) return 'bg-warning';
    return 'bg-success';
  };

  const getCapacityTextColor = () => {
    if (isCapacityWarning) return 'text-danger';
    if (isCapacityCaution) return 'text-warning';
    return 'text-success';
  };

  const handleQuantityChange = (type: TicketType, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(10, prev[type] + delta)),
    }));
    if (quantities[type] + delta > 0) {
      setSelectedTicket(type);
    }
  };

  const handlePurchase = async () => {
    if (totalTickets === 0 || !user || isSoldOut) return;

    const primaryType = (Object.entries(quantities) as [TicketType, number][])
      .find(([, qty]) => qty > 0)?.[0] || 'adult';

    const result = await purchaseTicket({
      visitorId: user.id,
      date: selectedDate,
      ticketType: primaryType,
      quantity: totalTickets,
    });

    if (result) {
      setSuccessTicket(result);
      setShowSuccess(true);
      if (user) {
        fetchMyTickets(user.id);
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessTicket(null);
    setQuantities({
      adult: 1,
      child: 0,
      senior: 0,
      halfday: 0,
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
          <p className="text-danger text-sm">{error}</p>
          <button
            onClick={clearError}
            className="ml-auto text-danger/70 hover:text-danger text-sm"
          >
            关闭
          </button>
        </div>
      )}

      {showSuccess && successTicket ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-success-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-success/30">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">购买成功！</h2>
          <p className="text-secondary/60 mb-8">您的电子雪票已生成，请在入场时出示二维码</p>

          <div className="max-w-xs mx-auto bg-white rounded-3xl p-6 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-secondary/50">雪域智慧滑雪场</p>
                <p className="font-bold text-secondary text-lg">
                  {getTicketTypeName(successTicket.ticketType)}
                </p>
              </div>
              <Ticket className="w-10 h-10 text-primary" />
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-secondary" />
            </div>

            <div className="text-center">
              <p className="text-xs text-secondary/50 mb-1">核销码</p>
              <p className="font-mono font-bold text-lg text-secondary tracking-wider">
                {successTicket.verifyCode}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-secondary/20 flex justify-between text-sm">
              <span className="text-secondary/50">使用日期</span>
              <span className="font-medium text-secondary">{successTicket.date}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-secondary/50">数量</span>
              <span className="font-medium text-secondary">{successTicket.quantity} 张</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-secondary/50">订单号</span>
              <span className="font-mono text-secondary">{successTicket.qrCode}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCloseSuccess}
              className="px-6 py-3 rounded-xl border border-secondary/20 text-secondary hover:bg-secondary/5 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              继续购票
            </button>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
              查看我的雪票
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                选择日期
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm">
                <Sparkles className="w-4 h-4" />
                <span>动态票价</span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {weatherForecast.map((item) => {
                const WeatherIcon = getWeatherIcon(item.weather);
                const date = new Date();
                date.setDate(date.getDate() + item.date);
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      'flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[80px] transition-all',
                      isSelected
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30'
                        : 'bg-secondary/5 hover:bg-primary/10 text-secondary'
                    )}
                  >
                    <span className={cn('text-xs', isSelected ? 'text-white/70' : 'text-secondary/50')}>
                      {item.day}
                    </span>
                    <WeatherIcon className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-warning')} />
                    <span className="font-bold">{item.temp}°</span>
                    <span className={cn('text-xs', isSelected ? 'text-white/70' : 'text-secondary/50')}>
                      {getWeatherText(item.weather)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-sky-50 border border-primary/10">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="text-secondary/70 mb-1">
                    <span className="font-medium text-primary">票价说明：</span>
                    票价根据日期、天气、客流等因素动态计算
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-secondary/60">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-success" />
                      工作日优惠 0%
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-warning" />
                      周末加价 {Math.round((dynamicFactor - 1) * 100)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-sky-500" />
                      今日雪质指数 9/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                今日容量
              </h2>
              {isSoldOut ? (
                <span className="px-3 py-1 rounded-full bg-danger/10 text-danger text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  已售罄
                </span>
              ) : isCapacityWarning ? (
                <span className="px-3 py-1 rounded-full bg-danger/10 text-danger text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  即将售罄
                </span>
              ) : isCapacityCaution ? (
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  紧张
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  充足
                </span>
              )}
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary/60">已售</span>
                <span className={cn('font-medium', getCapacityTextColor())}>
                  {remainingCapacity?.used || 0} / {remainingCapacity?.max || 2000}
                </span>
              </div>
              <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', getCapacityColor())}
                  style={{ width: `${remainingCapacity?.percentage || 0}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-secondary/50">
              {isSoldOut
                ? '今日雪票已全部售罄，请选择其他日期'
                : isCapacityWarning
                ? `仅剩 ${remainingCapacity?.remaining || 0} 张，欲购从速！`
                : `剩余 ${remainingCapacity?.remaining || 0} 张可供购买`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticketTypes.map((ticket) => {
              const Icon = ticket.icon;
              const finalPrice = calculatePrice(ticket);
              const savings = ticket.basePrice - finalPrice;
              const isSelected = selectedTicket === ticket.id;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={cn(
                    'relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-5 border-2 cursor-pointer transition-all duration-300',
                    isSelected
                      ? 'border-primary shadow-xl shadow-primary/10'
                      : 'border-white/60 hover:border-primary/30 hover:shadow-lg'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg flex-shrink-0',
                        ticket.color
                      )}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-secondary mb-1">{ticket.name}</h3>
                      <p className="text-sm text-secondary/50 mb-3">{ticket.description}</p>

                      <div className="flex items-end gap-3 mb-3">
                        <div>
                          <span className="text-xs text-secondary/40 line-through">
                            ¥{ticket.basePrice}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-secondary">¥{finalPrice}</span>
                            <span className="text-xs text-secondary/50">/张</span>
                          </div>
                        </div>
                        {savings > 0 && (
                          <span className="px-2 py-1 rounded-lg bg-danger/10 text-danger text-xs font-medium">
                            省 ¥{savings}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(ticket.id, -1);
                          }}
                          disabled={quantities[ticket.id] === 0 || isSoldOut}
                          className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="text-lg font-bold leading-none">−</span>
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-secondary">
                          {quantities[ticket.id]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(ticket.id, 1);
                          }}
                          disabled={quantities[ticket.id] === 10 || isSoldOut}
                          className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="text-lg font-bold leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-6 bg-white/90 backdrop-blur-2xl rounded-3xl p-5 border border-white/80 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-secondary/50">合计：</span>
                  {totalOriginalPrice > totalPrice && (
                    <span className="text-sm text-secondary/40 line-through">¥{totalOriginalPrice}</span>
                  )}
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                    ¥{totalPrice}
                  </span>
                </div>
                <p className="text-xs text-secondary/50 mt-1">
                  共 {totalTickets} 张票
                  {totalOriginalPrice > totalPrice && (
                    <span className="text-success ml-2">已优惠 ¥{totalOriginalPrice - totalPrice}</span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePurchase}
                disabled={totalTickets === 0 || isSoldOut || isLoading}
                className={cn(
                  'px-8 py-3.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                  isSoldOut
                    ? 'bg-secondary/20 text-secondary/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 text-white shadow-primary/30 hover:shadow-primary/40'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {isSoldOut ? '今日已售罄' : isLoading ? '购买中...' : '立即购买'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
