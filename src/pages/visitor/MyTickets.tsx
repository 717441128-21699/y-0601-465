import { useState, useEffect } from 'react';
import {
  Ticket,
  QrCode,
  Calendar,
  CheckCircle,
  RefreshCw,
  Clock,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTicketStore, getTicketTypeName, getTicketStatusName } from '@/store/ticketStore';
import { useAuthStore } from '@/store/authStore';
import type { TicketStatus } from '@shared/types';

type TabType = 'unused' | 'used' | 'refunded';

const statusConfig = {
  paid: {
    label: '未使用',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    icon: Clock,
  },
  used: {
    label: '已使用',
    color: 'text-secondary/50',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    icon: CheckCircle,
  },
  refunded: {
    label: '已退款',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: RefreshCw,
  },
};

export default function MyTickets() {
  const { user } = useAuthStore();
  const { tickets, isLoading, error, fetchMyTickets, refundTicket, clearError } = useTicketStore();

  const [activeTab, setActiveTab] = useState<TabType>('unused');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refundLoading, setRefundLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMyTickets(user.id);
    }
  }, [user, fetchMyTickets]);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'unused', label: '未使用', count: tickets.filter((t) => t.status === 'paid').length },
    { key: 'used', label: '已使用', count: tickets.filter((t) => t.status === 'used').length },
    { key: 'refunded', label: '已退款', count: tickets.filter((t) => t.status === 'refunded').length },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'unused') return t.status === 'paid';
    if (activeTab === 'used') return t.status === 'used';
    return t.status === 'refunded';
  });

  const handleRefund = async (id: string) => {
    if (!confirm('确定要申请退票吗？退款将在1-3个工作日内到账。')) {
      return;
    }

    setRefundLoading(id);
    const success = await refundTicket(id);
    setRefundLoading(null);

    if (success) {
      alert('退票成功！');
    }
  };

  const getStatusConfig = (status: TicketStatus) => {
    return statusConfig[status] || statusConfig.paid;
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

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-2 border border-white/60 shadow-lg">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30'
                  : 'text-secondary/60 hover:bg-primary/10 hover:text-primary'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  activeTab === tab.key ? 'bg-white/20' : 'bg-secondary/10'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-lg text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-secondary/60">加载中...</p>
        </div>
      )}

      {!isLoading && filteredTickets.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-lg text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/5 flex items-center justify-center mb-4">
            <Ticket className="w-10 h-10 text-secondary/30" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">暂无雪票</h3>
          <p className="text-sm text-secondary/50 mb-6">
            您还没有{tabs.find((t) => t.key === activeTab)?.label}的雪票
          </p>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center gap-2 mx-auto">
            <Ticket className="w-4 h-4" />
            去购票
          </button>
        </div>
      ) : (
        !isLoading && (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const status = getStatusConfig(ticket.status);
              const StatusIcon = status.icon;
              const isExpanded = expandedId === ticket.id;
              const isRefunding = refundLoading === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className={cn(
                    'relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl border-2 transition-all duration-300',
                    ticket.status === 'paid'
                      ? 'border-primary/30 shadow-lg shadow-primary/10'
                      : 'border-white/60'
                  )}
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                    className="p-5 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0',
                          ticket.status === 'paid'
                            ? 'from-primary-400 to-primary-600'
                            : ticket.status === 'used'
                            ? 'from-secondary-300 to-secondary-400'
                            : 'from-warning-400 to-warning-500'
                        )}
                      >
                        <Ticket className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-secondary">
                            {getTicketTypeName(ticket.ticketType)}
                          </h3>
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
                              status.bg,
                              status.color,
                              status.border,
                              'border'
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {getTicketStatusName(ticket.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-secondary/60 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {ticket.date}
                          </span>
                          <span>×{ticket.quantity} 张</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-secondary">
                            ¥{ticket.finalPrice}
                          </span>
                          <ChevronRight
                            className={cn(
                              'w-5 h-5 text-secondary/40 transition-transform',
                              isExpanded && 'rotate-90'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-secondary/10 pt-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                          <div className="w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
                            <QrCode className="w-28 h-28 text-secondary" />
                          </div>
                          <p className="text-center text-xs text-secondary/50 mt-2">扫码入场</p>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5">
                            <span className="text-sm text-secondary/50">核销码</span>
                            <span className="font-mono font-bold text-secondary tracking-wider">
                              {ticket.verifyCode}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5">
                            <span className="text-sm text-secondary/50">订单号</span>
                            <span className="font-mono text-sm text-secondary">{ticket.qrCode}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5">
                            <span className="text-sm text-secondary/50">数量</span>
                            <span className="font-medium text-secondary">{ticket.quantity} 张</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5">
                            <span className="text-sm text-secondary/50">有效期</span>
                            <span className="font-medium text-secondary">{ticket.date} 当日有效</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5">
                            <span className="text-sm text-secondary/50">购买时间</span>
                            <span className="font-medium text-secondary">
                              {new Date(ticket.createdAt).toLocaleString('zh-CN')}
                            </span>
                          </div>

                          {ticket.status === 'paid' && (
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => handleRefund(ticket.id)}
                                disabled={isRefunding}
                                className="flex-1 py-2.5 rounded-xl border border-warning/30 text-warning font-medium hover:bg-warning/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {isRefunding ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    退票中...
                                  </>
                                ) : (
                                  '申请退款'
                                )}
                              </button>
                              <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                <QrCode className="w-4 h-4" />
                                出示二维码
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-r from-transparent via-sky-100 to-transparent rounded-r-full">
                    <div className="absolute -top-1.5 left-1.5 w-3 h-3 rounded-full bg-sky-100" />
                    <div className="absolute -bottom-1.5 left-1.5 w-3 h-3 rounded-full bg-sky-100" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-l from-transparent via-sky-100 to-transparent rounded-l-full">
                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 rounded-full bg-sky-100" />
                    <div className="absolute -bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-sky-100" />
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
