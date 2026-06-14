import { useState } from 'react';
import {
  Snowflake,
  Calendar,
  Clock,
  QrCode,
  CheckCircle,
  XCircle,
  ChevronRight,
  Package,
  AlertCircle,
  CalendarCheck,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type RentalStatus = 'reserved' | 'picked' | 'returned' | 'damaged';

interface RentalItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  dailyPrice: number;
}

interface Rental {
  id: string;
  items: RentalItem[];
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalPrice: number;
  pickedAt?: string;
  returnedAt?: string;
  damageFee?: number;
  damageLevel?: 'none' | 'minor' | 'moderate' | 'severe';
  damageNotes?: string;
  qrCode: string;
}

const mockRentals: Rental[] = [
  {
    id: 'RENTAL-001',
    items: [
      { id: 'i1', name: '单板', brand: 'Burton', size: '155cm', dailyPrice: 120 },
      { id: 'i2', name: '头盔', brand: 'Giro', size: 'M', dailyPrice: 30 },
      { id: 'i3', name: '雪靴', brand: 'Burton', size: '42', dailyPrice: 60 },
    ],
    status: 'picked',
    startDate: '2024-06-15',
    endDate: '2024-06-15',
    totalPrice: 210,
    pickedAt: '2024-06-15 09:30',
    qrCode: 'RENTAL-20240615-0001',
  },
  {
    id: 'RENTAL-002',
    items: [
      { id: 'i4', name: '双板', brand: 'Atomic', size: '165cm', dailyPrice: 150 },
      { id: 'i5', name: '雪服', brand: 'The North Face', size: 'L', dailyPrice: 50 },
    ],
    status: 'reserved',
    startDate: '2024-06-16',
    endDate: '2024-06-16',
    totalPrice: 200,
    qrCode: 'RENTAL-20240616-0002',
  },
  {
    id: 'RENTAL-003',
    items: [
      { id: 'i6', name: '双板', brand: 'Head', size: '170cm', dailyPrice: 180 },
      { id: 'i7', name: '头盔', brand: 'Smith', size: 'L', dailyPrice: 40 },
    ],
    status: 'returned',
    startDate: '2024-06-10',
    endDate: '2024-06-10',
    totalPrice: 220,
    pickedAt: '2024-06-10 08:45',
    returnedAt: '2024-06-10 17:20',
    qrCode: 'RENTAL-20240610-0003',
  },
  {
    id: 'RENTAL-004',
    items: [
      { id: 'i8', name: '单板', brand: 'K2', size: '150cm', dailyPrice: 130 },
    ],
    status: 'damaged',
    startDate: '2024-06-08',
    endDate: '2024-06-08',
    totalPrice: 130,
    pickedAt: '2024-06-08 09:15',
    returnedAt: '2024-06-08 16:30',
    damageFee: 200,
    damageLevel: 'minor',
    damageNotes: '板边有轻微划痕',
    qrCode: 'RENTAL-20240608-0004',
  },
];

const statusConfig = {
  reserved: {
    label: '待领取',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: Calendar,
  },
  picked: {
    label: '使用中',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: Clock,
  },
  returned: {
    label: '已归还',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    icon: CheckCircle,
  },
  damaged: {
    label: '有损坏',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    icon: AlertCircle,
  },
};

export default function MyRentals() {
  const [activeTab, setActiveTab] = useState<'all' | RentalStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'reserved' as const, label: '待领取' },
    { key: 'picked' as const, label: '使用中' },
    { key: 'returned' as const, label: '已归还' },
    { key: 'damaged' as const, label: '有损坏' },
  ];

  const filteredRentals = mockRentals.filter((r) =>
    activeTab === 'all' ? true : r.status === activeTab
  );

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

      {filteredRentals.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-lg text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/5 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-secondary/30" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">暂无租赁订单</h3>
          <p className="text-sm text-secondary/50 mb-6">您还没有相关租赁记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const status = statusConfig[rental.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedId === rental.id;

            return (
              <div
                key={rental.id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rental.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0',
                          rental.status === 'reserved' && 'bg-gradient-to-br from-primary-400 to-primary-600',
                          rental.status === 'picked' && 'bg-gradient-to-br from-warning-400 to-warning-600',
                          rental.status === 'returned' && 'bg-gradient-to-br from-success-400 to-emerald-600',
                          rental.status === 'damaged' && 'bg-gradient-to-br from-danger-400 to-danger-600'
                        )}
                      >
                        <Snowflake className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-secondary">租赁订单 #{rental.id.slice(-4)}</h3>
                          <span
                            className={cn(
                              'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                              status.bg,
                              status.color,
                              status.border
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary/60">
                          <CalendarCheck className="w-4 h-4" />
                          {rental.startDate}
                          {rental.endDate !== rental.startDate && (
                            <>
                              <span className="text-secondary/30">至</span>
                              {rental.endDate}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                        ¥{rental.totalPrice}
                      </p>
                      {rental.damageFee && (
                        <p className="text-xs text-danger mt-1">+ 损坏费 ¥{rental.damageFee}</p>
                      )}
                      <ChevronRight
                        className={cn(
                          'w-5 h-5 text-secondary/40 ml-auto mt-1 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {rental.items.map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 rounded-xl bg-secondary/5 text-secondary/70 text-sm flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        {item.name} {item.size}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-xl bg-primary/5 text-primary/70 text-sm">
                      共 {rental.items.length} 件
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-secondary/10 space-y-4">
                    {rental.status === 'reserved' && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-sky-50 border border-primary/10">
                        <div className="flex-shrink-0">
                          <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
                            <QrCode className="w-20 h-20 text-secondary" />
                          </div>
                          <p className="text-center text-xs text-secondary/50 mt-2">领取码</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="font-mono font-bold text-lg text-secondary tracking-wider mb-2">
                            {rental.qrCode}
                          </p>
                          <p className="text-sm text-secondary/60 mb-3">
                            请在雪具大厅租赁处出示此二维码领取装备
                          </p>
                          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
                            查看详情
                          </button>
                        </div>
                      </div>
                    )}

                    {rental.status === 'picked' && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-warning/5 to-amber-50 border border-warning/20">
                        <div className="flex-shrink-0">
                          <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
                            <QrCode className="w-20 h-20 text-secondary" />
                          </div>
                          <p className="text-center text-xs text-secondary/50 mt-2">归还码</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-sm text-secondary/60 mb-1">已领取：{rental.pickedAt}</p>
                          <p className="text-sm text-secondary/60 mb-3">
                            归还时间：当日 17:30 前
                          </p>
                          <div className="flex gap-2 justify-center sm:justify-start">
                            <button className="px-4 py-2 rounded-xl border border-warning/30 text-warning text-sm font-medium hover:bg-warning/10 transition-colors">
                              申请延期
                            </button>
                            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-warning-400 to-amber-500 text-white text-sm font-medium shadow-lg shadow-warning/30 hover:shadow-xl transition-all">
                              立即归还
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {rental.status === 'returned' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-success/5 to-emerald-50 border border-success/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="font-medium text-secondary">装备已完好归还</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-secondary/50">领取时间</span>
                            <p className="text-secondary">{rental.pickedAt}</p>
                          </div>
                          <div>
                            <span className="text-secondary/50">归还时间</span>
                            <p className="text-secondary">{rental.returnedAt}</p>
                          </div>
                        </div>
                        <button className="mt-4 w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-success-400 to-emerald-500 text-white text-sm font-medium shadow-lg shadow-success/30 hover:shadow-xl transition-all flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          再次租赁同款
                        </button>
                      </div>
                    )}

                    {rental.status === 'damaged' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-danger/5 to-rose-50 border border-danger/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-danger" />
                          <span className="font-medium text-secondary">
                            装备损坏，需支付维修费 ¥{rental.damageFee}
                          </span>
                        </div>
                        <p className="text-sm text-secondary/60 mb-3">
                          损坏程度：
                          <span className={cn(
                            'font-medium ml-1',
                            rental.damageLevel === 'minor' && 'text-warning',
                            rental.damageLevel === 'moderate' && 'text-warning',
                            rental.damageLevel === 'severe' && 'text-danger'
                          )}>
                            {rental.damageLevel === 'minor' ? '轻微' : rental.damageLevel === 'moderate' ? '中等' : '严重'}
                          </span>
                        </p>
                        <p className="text-sm text-secondary/60">
                          备注：{rental.damageNotes}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {rental.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-sky-100 flex items-center justify-center">
                              <Snowflake className="w-5 h-5 text-primary/60" />
                            </div>
                            <div>
                              <p className="font-medium text-secondary">
                                {item.brand} {item.name}
                              </p>
                              <p className="text-xs text-secondary/50">{item.size}</p>
                            </div>
                          </div>
                          <span className="font-medium text-primary">¥{item.dailyPrice}/天</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
