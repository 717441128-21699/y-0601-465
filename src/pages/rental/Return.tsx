import { useState, useEffect } from 'react';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  User,
  Phone,
  Package,
  Camera,
  FileText,
  X,
  ArrowRight,
  Check,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRentalStore, calculateDamageFee, getDamageLevelLabel, getDamageLevelColor } from '@/store/rentalStore';
import type { DamageLevel, DamageReport, RentalOrderWithDetail } from '@/store/rentalStore';
import { useAuthStore } from '@/store/authStore';

type Step = 'scan' | 'input' | 'check' | 'result';

interface ReturnCheckItem {
  equipmentId: string;
  equipmentName: string;
  size: string;
  dailyPrice: number;
  damageLevel: DamageLevel;
  damageNotes: string;
  photos: string[];
}

export default function RentalReturn() {
  const [step, setStep] = useState<Step>('scan');
  const [bookingCode, setBookingCode] = useState('');
  const [order, setOrder] = useState<RentalOrderWithDetail | null>(null);
  const [checkItems, setCheckItems] = useState<ReturnCheckItem[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showDamageReport, setShowDamageReport] = useState(false);
  const [damageReport, setDamageReport] = useState<DamageReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRentalDetail, returnEquipment, isLoading, error, clearError } = useRentalStore();

  const totalDamageFee = checkItems.reduce((sum, item) => sum + calculateDamageFee(item.dailyPrice, item.damageLevel), 0);
  const hasDamage = checkItems.some((item) => item.damageLevel !== 'none');

  const handleScanSuccess = () => {
    setBookingCode('rental-00001');
    fetchOrderDetail('rental-00001');
  };

  const handleManualSubmit = () => {
    if (bookingCode.length >= 6) {
      fetchOrderDetail(bookingCode);
    }
  };

  const fetchOrderDetail = async (orderId: string) => {
    clearError();
    await getRentalDetail(orderId);
    const currentRental = useRentalStore.getState().currentRental;
    if (currentRental) {
      setOrder(currentRental);
      const items: ReturnCheckItem[] = currentRental.items.map((item) => ({
        equipmentId: item.equipmentId,
        equipmentName: item.equipment ? `${item.equipment.brand} ${item.equipment.model}` : '器材',
        size: item.size,
        dailyPrice: item.dailyPrice,
        damageLevel: 'none',
        damageNotes: '',
        photos: [],
      }));
      setCheckItems(items);
      setStep('check');
    }
  };

  const handleDamageLevelChange = (equipmentId: string, level: DamageLevel) => {
    setCheckItems(
      checkItems.map((item) =>
        item.equipmentId === equipmentId ? { ...item, damageLevel: level } : item
      )
    );
  };

  const handleDamageNotesChange = (equipmentId: string, notes: string) => {
    setCheckItems(
      checkItems.map((item) =>
        item.equipmentId === equipmentId ? { ...item, damageNotes: notes } : item
      )
    );
  };

  const handleReset = () => {
    setStep('scan');
    setBookingCode('');
    setOrder(null);
    setCheckItems([]);
    setExpandedItem(null);
    setDamageReport(null);
    setShowDamageReport(false);
    clearError();
  };

  const handleConfirmReturn = async () => {
    if (!order) return;

    setIsSubmitting(true);
    const damageItems = checkItems.map((item) => ({
      equipmentId: item.equipmentId,
      damageLevel: item.damageLevel,
      damageNotes: item.damageNotes,
    }));

    const result = await returnEquipment(order.id, damageItems);
    setIsSubmitting(false);

    if (result) {
      setOrder(result.order);
      setDamageReport(result.damageReport);
      setStep('result');
      if (result.damageReport) {
        setShowDamageReport(true);
      }
    }
  };

  const handleViewDetail = () => {
    setShowDamageReport(false);
  };

  const handleDownload = () => {
    if (!damageReport) return;
    const content = `
雪具损坏赔偿单
====================
赔偿单号：${damageReport.id}
订单号：${damageReport.rentalOrderId}
生成时间：${new Date(damageReport.createdAt).toLocaleString('zh-CN')}
状态：${damageReport.status === 'paid' ? '已支付' : '待支付'}

损坏明细：
${damageReport.items.map((item, index) => `
${index + 1}. ${item.equipmentName || item.equipmentId}
   损坏等级：${getDamageLevelLabel(item.damageLevel)}
   赔偿金额：¥${item.damageFee}
   备注：${item.damageNotes || '无'}
`).join('')}

总赔偿金额：¥${damageReport.totalDamageFee}
====================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `赔偿单_${damageReport.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const damageLevels: DamageLevel[] = ['none', 'minor', 'moderate', 'severe'];

  return (
    <div className="animate-fade-in-up">
      {(step === 'scan' || step === 'input') && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center shadow-lg shadow-success/30 mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">归还检查</h2>
              <p className="text-secondary/50">请扫描租赁订单二维码或输入订单号</p>
            </div>

            {step === 'scan' && (
              <>
                <div className="relative mx-auto w-full max-w-sm aspect-square mb-8">
                  <div className="absolute inset-0 rounded-3xl border-4 border-success/20" />
                  <div className="absolute inset-4 rounded-2xl border-2 border-success/40">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-success rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-success rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-success rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-success rounded-br-xl" />
                    <div
                      className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-success to-transparent rounded-full shadow-lg shadow-success/50"
                      style={{ animation: 'scanMove 2s ease-in-out infinite' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine className="w-16 h-16 text-success/30" />
                    </div>
                  </div>
                </div>

                <style>{`
                  @keyframes scanMove {
                    0%, 100% { top: 10%; }
                    50% { top: 85%; }
                  }
                `}</style>

                <div className="text-center space-y-4">
                  <button
                    onClick={handleScanSuccess}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold shadow-lg shadow-success/30 hover:shadow-xl transition-all"
                  >
                    模拟扫码成功
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-secondary/10" />
                    <span className="text-sm text-secondary/40">或</span>
                    <div className="flex-1 h-px bg-secondary/10" />
                  </div>

                  <button
                    onClick={() => setStep('input')}
                    className="w-full py-3.5 rounded-xl border-2 border-success/20 text-success font-semibold hover:bg-success/5 transition-all"
                  >
                    手动输入订单号
                  </button>
                </div>
              </>
            )}

            {step === 'input' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary">输入订单号</h2>
                  <button
                    onClick={handleReset}
                    className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center text-secondary/60 hover:text-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-secondary/50 mb-6">请输入租赁订单号进行归还检查</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary mb-2">订单号</label>
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    placeholder="例如：rental-00001"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-success/20 focus:border-success focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors text-lg font-mono tracking-wider"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleManualSubmit}
                    disabled={bookingCode.length < 6 || isLoading}
                    className={cn(
                      'w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                      bookingCode.length >= 6 && !isLoading
                        ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success/30 hover:shadow-xl'
                        : 'bg-secondary/10 text-secondary/40 cursor-not-allowed'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        查询中...
                      </>
                    ) : (
                      <>
                        查询订单
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl border-2 border-success/20 text-success font-semibold hover:bg-success/5 transition-all"
                  >
                    返回扫码
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'check' && order && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-secondary">租赁人信息</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono">
                {order.id}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {order.visitorId.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-secondary mb-1">订单 {order.id}</h4>
                <div className="flex items-center gap-4 text-sm text-secondary/50">
                  <span>租期：{order.startDate}</span>
                  <span>共 {order.items.length} 件器材</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-secondary">器材检查清单</h3>
              </div>
              <span className="text-sm text-secondary/50">共 {checkItems.length} 件</span>
            </div>

            <div className="space-y-3">
              {checkItems.map((item) => {
                const damageFee = calculateDamageFee(item.dailyPrice, item.damageLevel);
                const isExpanded = expandedItem === item.equipmentId;

                return (
                  <div
                    key={item.equipmentId}
                    className={cn(
                      'rounded-xl border transition-all overflow-hidden',
                      item.damageLevel === 'none'
                        ? 'border-secondary/10'
                        : 'border-warning/20 bg-warning/5'
                    )}
                  >
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer"
                      onClick={() => setExpandedItem(isExpanded ? null : item.equipmentId)}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0',
                          item.damageLevel === 'none'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        )}
                      >
                        {item.damageLevel === 'none' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-secondary">{item.equipmentName}</p>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full border font-medium',
                              getDamageLevelColor(item.damageLevel)
                            )}
                          >
                            {getDamageLevelLabel(item.damageLevel)}
                          </span>
                        </div>
                        <p className="text-xs text-secondary/50 font-mono mt-0.5">
                          {item.equipmentId} · {item.size} · 日租金¥{item.dailyPrice}
                        </p>
                      </div>
                      {damageFee > 0 && (
                        <div className="text-right mr-2">
                          <p className="text-sm font-semibold text-danger">
                            +¥{damageFee}
                          </p>
                          <p className="text-xs text-secondary/40">赔偿费</p>
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-secondary/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary/40" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-secondary/10">
                        <p className="text-sm font-medium text-secondary mb-3">选择损坏程度：</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {damageLevels.map((level) => {
                            const fee = calculateDamageFee(item.dailyPrice, level);
                            return (
                              <button
                                key={level}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDamageLevelChange(item.equipmentId, level);
                                }}
                                className={cn(
                                  'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                                  item.damageLevel === level
                                    ? getDamageLevelColor(level) + ' border-current'
                                    : 'border-secondary/10 text-secondary/50 hover:border-secondary/30'
                                )}
                              >
                                {getDamageLevelLabel(level)}
                                {fee > 0 && (
                                  <span className="ml-1">(¥{fee})</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {item.damageLevel !== 'none' && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-secondary mb-2">
                                损坏部位描述
                              </label>
                              <textarea
                                value={item.damageNotes}
                                onChange={(e) => handleDamageNotesChange(item.equipmentId, e.target.value)}
                                placeholder="请详细描述损坏的具体部位和情况..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-primary focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors resize-none"
                                rows={3}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary mb-2">
                                上传照片
                              </label>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-20 h-20 rounded-xl border-2 border-dashed border-secondary/20 flex flex-col items-center justify-center text-secondary/40 hover:border-primary hover:text-primary transition-colors"
                                >
                                  <Camera className="w-6 h-6 mb-1" />
                                  <span className="text-xs">上传</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-danger" />
              </div>
              <h3 className="text-lg font-bold text-secondary">费用结算</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-secondary/70">
                <span>租赁费用</span>
                <span>¥{order.totalPrice}.00</span>
              </div>
              {hasDamage && (
                <>
                  <div className="flex justify-between text-danger">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      损坏赔偿（{checkItems.filter((i) => i.damageLevel !== 'none').length}件）
                    </span>
                    <span className="font-semibold">¥{totalDamageFee}.00</span>
                  </div>
                  {checkItems
                    .filter((i) => i.damageLevel !== 'none')
                    .map((item) => (
                      <div key={item.equipmentId} className="flex justify-between text-sm text-secondary/50 pl-5">
                        <span>· {item.equipmentName}（{getDamageLevelLabel(item.damageLevel)}）</span>
                        <span>¥{calculateDamageFee(item.dailyPrice, item.damageLevel)}.00</span>
                      </div>
                    ))}
                </>
              )}
              <div className="h-px bg-secondary/10" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary">赔偿合计</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    totalDamageFee > 0 ? 'text-danger' : 'text-success'
                  )}
                >
                  ¥{totalDamageFee}.00
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
            >
              返回
            </button>
            <button
              onClick={handleConfirmReturn}
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold shadow-lg shadow-success/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  确认归还并生成单据
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'result' && order && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-success-400 to-success-600 p-8 text-center text-white">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-1">归还完成</h2>
              <p className="text-white/80">
                {damageReport ? '电子赔偿单已生成' : '器材完好，感谢使用'}
              </p>
            </div>

            <div className="p-8">
              {damageReport && (
                <div className="p-4 rounded-xl bg-secondary/5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-secondary">赔偿单据号</span>
                  </div>
                  <p className="text-2xl font-bold text-primary font-mono">{damageReport.id}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">订单号</p>
                  <p className="font-semibold text-secondary font-mono text-sm">{order.id}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">归还时间</p>
                  <p className="font-semibold text-secondary">{new Date().toLocaleString('zh-CN')}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">器材数量</p>
                  <p className="font-semibold text-secondary">{order.items.length} 件</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">赔偿金额</p>
                  <p className={cn(
                    'font-semibold',
                    totalDamageFee > 0 ? 'text-danger' : 'text-success'
                  )}>
                    ¥{totalDamageFee}.00
                  </p>
                </div>
              </div>

              {hasDamage && damageReport && (
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                  <p className="text-sm font-medium text-warning mb-3">损坏明细：</p>
                  <div className="space-y-2">
                    {damageReport.items.map((item, index) => (
                      <div key={index} className="text-sm text-warning/80 flex justify-between">
                        <span>
                          · {item.equipmentName || item.equipmentId}：{getDamageLevelLabel(item.damageLevel)}
                          {item.damageNotes && `（${item.damageNotes}）`}
                        </span>
                        <span className="font-medium">¥{item.damageFee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
                >
                  继续归还
                </button>
                {damageReport && (
                  <button
                    onClick={() => setShowDamageReport(true)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    查看赔偿单
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDamageReport && damageReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-secondary/10 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-secondary">电子赔偿单</h3>
                <p className="text-sm text-secondary/50 mt-1">{damageReport.id}</p>
              </div>
              <button
                onClick={() => setShowDamageReport(false)}
                className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center text-secondary/60 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-secondary/5">
                  <p className="text-xs text-secondary/50 mb-1">订单号</p>
                  <p className="text-sm font-medium text-secondary font-mono">{damageReport.rentalOrderId}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/5">
                  <p className="text-xs text-secondary/50 mb-1">状态</p>
                  <p className={cn(
                    'text-sm font-medium',
                    damageReport.status === 'paid' ? 'text-success' : 'text-warning'
                  )}>
                    {damageReport.status === 'paid' ? '已支付' : '待支付'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/5">
                  <p className="text-xs text-secondary/50 mb-1">生成时间</p>
                  <p className="text-sm font-medium text-secondary">
                    {new Date(damageReport.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-danger/10">
                  <p className="text-xs text-secondary/50 mb-1">赔偿金额</p>
                  <p className="text-lg font-bold text-danger">¥{damageReport.totalDamageFee}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-secondary mb-3">损坏明细</h4>
                <div className="space-y-2">
                  {damageReport.items.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-secondary">{item.equipmentName || item.equipmentId}</p>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full border',
                            getDamageLevelColor(item.damageLevel)
                          )}>
                            {getDamageLevelLabel(item.damageLevel)}
                          </span>
                        </div>
                        <p className="font-semibold text-danger">¥{item.damageFee}</p>
                      </div>
                      {item.damageNotes && (
                        <p className="text-sm text-secondary/60">备注：{item.damageNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-secondary/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-secondary">合计赔偿</span>
                  <span className="text-2xl font-bold text-danger">¥{damageReport.totalDamageFee}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 rounded-xl border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载凭证
                  </button>
                  <button
                    onClick={handleViewDetail}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
