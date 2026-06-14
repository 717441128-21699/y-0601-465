import { useState, useEffect } from 'react';
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
  FileText,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRentalStore, getDamageLevelLabel, getDamageLevelColor } from '@/store/rentalStore';
import { useAuthStore } from '@/store/authStore';
import type { RentalOrderWithDetail, DamageReport } from '@/store/rentalStore';
import type { RentalStatus, DamageLevel } from '@shared/types';

const statusConfig: Record<RentalStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: typeof Calendar;
}> = {
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
  const { user } = useAuthStore();
  const { rentals, fetchMyRentals, isLoading, error } = useRentalStore();

  useEffect(() => {
    if (user?.id) {
      fetchMyRentals(user.id);
    }
  }, [user?.id]);

  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'reserved' as const, label: '待领取' },
    { key: 'picked' as const, label: '使用中' },
    { key: 'returned' as const, label: '已归还' },
    { key: 'damaged' as const, label: '有损坏' },
  ];

  const filteredRentals = rentals.filter((r) =>
    activeTab === 'all' ? true : r.status === activeTab
  );

  const getEquipmentName = (item: RentalOrderWithDetail['items'][0]) => {
    if (item.equipment) {
      return `${item.equipment.brand} ${item.equipment.model}`;
    }
    return item.equipmentId;
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

      {isLoading && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-lg text-center">
          <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-secondary/60">加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-danger/10 rounded-3xl p-6 border border-danger/20 text-center">
          <AlertCircle className="w-10 h-10 text-danger mx-auto mb-3" />
          <p className="text-danger">{error}</p>
          <button
            onClick={() => user?.id && fetchMyRentals(user.id)}
            className="mt-4 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {!isLoading && !error && filteredRentals.length === 0 ? (
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
            const hasDamage = rental.status === 'damaged' || rental.damageFee;
            const damageReport = rental.damageReport;

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
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                          {hasDamage && (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/20">
                              <DollarSign className="w-3 h-3" />
                              损坏赔偿 ¥{rental.damageFee}
                            </span>
                          )}
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
                    {rental.items.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-xl bg-secondary/5 text-secondary/70 text-sm flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        {getEquipmentName(item)} {item.size}
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
                            {rental.id}
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

                    {rental.status === 'damaged' && damageReport && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-danger/5 to-rose-50 border border-danger/20">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-danger" />
                          <span className="font-medium text-secondary">
                            装备损坏，需支付赔偿费 ¥{damageReport.totalDamageFee}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {damageReport.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/50"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'text-xs px-2 py-0.5 rounded-full border',
                                    getDamageLevelColor(item.damageLevel)
                                  )}
                                >
                                  {getDamageLevelLabel(item.damageLevel)}
                                </span>
                                <span className="text-sm text-secondary">
                                  {item.equipmentName || item.equipmentId}
                                </span>
                              </div>
                              <span className="font-medium text-danger">¥{item.damageFee}</span>
                            </div>
                          ))}
                        </div>

                        {rental.damageNotes && (
                          <p className="text-sm text-secondary/60 mb-3">
                            备注：{rental.damageNotes}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-danger/10">
                          <div>
                            <p className="text-xs text-secondary/50">赔偿单状态</p>
                            <p className={cn(
                              'text-sm font-medium',
                              damageReport.status === 'paid' ? 'text-success' : 'text-warning'
                            )}>
                              {damageReport.status === 'paid' ? '已支付' : '待支付'}
                            </p>
                          </div>
                          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            查看赔偿单
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {rental.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-sky-100 flex items-center justify-center">
                              <Snowflake className="w-5 h-5 text-primary/60" />
                            </div>
                            <div>
                              <p className="font-medium text-secondary">
                                {getEquipmentName(item)}
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
