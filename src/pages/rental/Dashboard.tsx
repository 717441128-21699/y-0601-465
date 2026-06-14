import {
  Package,
  PackageCheck,
  AlertTriangle,
  Wrench,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statsCards = [
  {
    label: '在租数量',
    value: '86',
    unit: '件',
    icon: Package,
    color: 'from-primary-400 to-primary-600',
    trend: '+12',
    trendUp: true,
  },
  {
    label: '可用库存',
    value: '254',
    unit: '件',
    icon: PackageCheck,
    color: 'from-success-400 to-success-600',
    trend: '-8',
    trendUp: false,
  },
  {
    label: '待归还',
    value: '23',
    unit: '件',
    icon: Clock,
    color: 'from-warning-400 to-warning-600',
    trend: '+5',
    trendUp: true,
  },
  {
    label: '损坏待处理',
    value: '7',
    unit: '件',
    icon: AlertTriangle,
    color: 'from-danger-400 to-danger-600',
    trend: '+2',
    trendUp: true,
  },
];

const categoryData = [
  { name: '双板', count: 95, color: 'bg-primary-500' },
  { name: '单板', count: 68, color: 'bg-primary-400' },
  { name: '雪靴', count: 120, color: 'bg-success-500' },
  { name: '头盔', count: 85, color: 'bg-warning-500' },
  { name: '雪服', count: 52, color: 'bg-purple-500' },
  { name: '护目镜', count: 76, color: 'bg-primary-300' },
];

const todayActivities = [
  {
    id: 1,
    type: 'pickup',
    orderNo: 'RT20250615001',
    customer: '李明轩',
    avatar: '李',
    items: ['双板套装', '雪靴', '头盔'],
    time: '09:15',
    operator: '赵冰洁',
  },
  {
    id: 2,
    type: 'return',
    orderNo: 'RT20250614008',
    customer: '王小美',
    avatar: '王',
    items: ['单板', '固定器'],
    time: '10:30',
    operator: '赵冰洁',
  },
  {
    id: 3,
    type: 'pickup',
    orderNo: 'RT20250615002',
    customer: '张子涵',
    avatar: '张',
    items: ['儿童双板', '雪靴', '头盔', '护目镜'],
    time: '11:20',
    operator: '赵冰洁',
  },
  {
    id: 4,
    type: 'pickup',
    orderNo: 'RT20250615003',
    customer: '刘浩然',
    avatar: '刘',
    items: ['双板套装', '雪服套装'],
    time: '13:45',
    operator: '赵冰洁',
  },
  {
    id: 5,
    type: 'return',
    orderNo: 'RT20250614015',
    customer: '陈思雨',
    avatar: '陈',
    items: ['单板', '雪靴', '头盔'],
    time: '14:10',
    operator: '赵冰洁',
    damage: true,
  },
  {
    id: 6,
    type: 'pickup',
    orderNo: 'RT20250615004',
    customer: '孙伟强',
    avatar: '孙',
    items: ['双板', '雪靴'],
    time: '15:30',
    operator: '赵冰洁',
  },
];

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
  trendUp: boolean;
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
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                'text-xs font-medium flex items-center gap-0.5',
                trendUp ? 'text-danger' : 'text-success'
              )}
            >
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
              {trend}
            </span>
            <span className="text-xs text-secondary/40">较昨日</span>
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

export default function RentalDashboard() {
  const maxCount = Math.max(...categoryData.map((c) => c.count));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-secondary">器材分类库存</h3>
              <p className="text-sm text-secondary/50 mt-0.5">按类型统计可用数量</p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              详情
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-secondary">{category.name}</span>
                  <span className="text-sm font-semibold text-secondary">{category.count} 件</span>
                </div>
                <div className="h-3 rounded-full bg-secondary/10 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', category.color)}
                    style={{ width: `${(category.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-secondary/10">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-success/10 flex items-center justify-center mb-2">
                <PackageCheck className="w-5 h-5 text-success" />
              </div>
              <p className="text-lg font-bold text-secondary">340</p>
              <p className="text-xs text-secondary/50">总库存</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-warning/10 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <p className="text-lg font-bold text-secondary">86</p>
              <p className="text-xs text-secondary/50">租赁中</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-danger/10 flex items-center justify-center mb-2">
                <Wrench className="w-5 h-5 text-danger" />
              </div>
              <p className="text-lg font-bold text-secondary">12</p>
              <p className="text-xs text-secondary/50">维修中</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-secondary">今日动态</h3>
              <p className="text-sm text-secondary/50 mt-0.5">
                领取 {todayActivities.filter((a) => a.type === 'pickup').length} 笔 / 归还{' '}
                {todayActivities.filter((a) => a.type === 'return').length} 笔
              </p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              全部记录
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
            {todayActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-xl bg-secondary/5 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      activity.type === 'pickup'
                        ? 'bg-primary/10'
                        : 'bg-success/10'
                    )}
                  >
                    {activity.type === 'pickup' ? (
                      <ArrowUpRight
                        className={cn(
                          'w-5 h-5',
                          activity.type === 'pickup' ? 'text-primary' : 'text-success'
                        )}
                      />
                    ) : (
                      <ArrowDownLeft
                        className={cn(
                          'w-5 h-5',
                          activity.type === 'pickup' ? 'text-primary' : 'text-success'
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-secondary">
                            {activity.customer}
                          </span>
                          {activity.damage && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-danger/10 text-danger font-medium">
                              损坏
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondary/50 font-mono">
                          {activity.orderNo}
                        </p>
                      </div>
                      <span className="text-xs text-secondary/40 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {activity.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-white text-secondary/60 border border-secondary/10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-secondary/40">
                      <User className="w-3.5 h-3.5" />
                      操作人：{activity.operator}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
