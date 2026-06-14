import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'scan' | 'input' | 'check' | 'result';
type DamageLevel = 'none' | 'minor' | 'moderate' | 'severe';

interface ReturnItem {
  id: string;
  name: string;
  code: string;
  size: string;
  originalPrice: number;
  damageLevel: DamageLevel;
  damageNotes: string;
  photos: string[];
}

const damageLevelConfig: Record<DamageLevel, { label: string; className: string; fee: number }> = {
  none: { label: '完好', className: 'bg-success/10 text-success border-success/30', fee: 0 },
  minor: { label: '轻微损坏', className: 'bg-warning/10 text-warning border-warning/30', fee: 50 },
  moderate: { label: '中度损坏', className: 'bg-orange-500/10 text-orange-600 border-orange-500/30', fee: 200 },
  severe: { label: '严重损坏', className: 'bg-danger/10 text-danger border-danger/30', fee: 500 },
};

const mockCustomer = {
  name: '陈思雨',
  avatar: '陈',
  phone: '139****2345',
  orderNo: 'RT20250614015',
  rentalDays: 1,
  startDate: '2025-06-14',
  deposit: 1500,
};

const initialItems: ReturnItem[] = [
  { id: '1', name: '单板滑雪板', code: 'BOARD-S-023', size: '155cm', originalPrice: 2800, damageLevel: 'none', damageNotes: '', photos: [] },
  { id: '2', name: '专业滑雪靴', code: 'BOOT-W-037', size: '38码', originalPrice: 1200, damageLevel: 'minor', damageNotes: '靴面轻微划痕', photos: [] },
  { id: '3', name: '专业滑雪头盔', code: 'HELM-M-018', size: 'M码', originalPrice: 800, damageLevel: 'none', damageNotes: '', photos: [] },
];

export default function RentalReturn() {
  const [step, setStep] = useState<Step>('scan');
  const [bookingCode, setBookingCode] = useState('');
  const [items, setItems] = useState<ReturnItem[]>(initialItems);
  const [expandedItem, setExpandedItem] = useState<string | null>('2');
  const [showDamageForm, setShowDamageForm] = useState<string | null>(null);

  const totalDamageFee = items.reduce((sum, item) => sum + damageLevelConfig[item.damageLevel].fee, 0);
  const refundAmount = mockCustomer.deposit - totalDamageFee;
  const hasDamage = items.some((item) => item.damageLevel !== 'none');

  const handleScanSuccess = () => {
    setStep('check');
  };

  const handleManualSubmit = () => {
    if (bookingCode.length >= 6) {
      setStep('check');
    }
  };

  const handleDamageLevelChange = (itemId: string, level: DamageLevel) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, damageLevel: level } : item
      )
    );
  };

  const handleDamageNotesChange = (itemId: string, notes: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, damageNotes: notes } : item
      )
    );
  };

  const handleReset = () => {
    setStep('scan');
    setBookingCode('');
    setItems(initialItems.map((i) => ({ ...i, damageLevel: 'none', damageNotes: '', photos: [] })));
    setExpandedItem(null);
    setShowDamageForm(null);
  };

  const handleConfirmReturn = () => {
    setStep('result');
  };

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
                    placeholder="例如：RT20250614015"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-success/20 focus:border-success focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors text-lg font-mono tracking-wider"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleManualSubmit}
                    disabled={bookingCode.length < 6}
                    className={cn(
                      'w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                      bookingCode.length >= 6
                        ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success/30 hover:shadow-xl'
                        : 'bg-secondary/10 text-secondary/40 cursor-not-allowed'
                    )}
                  >
                    查询订单
                    <ArrowRight className="w-5 h-5" />
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

      {step === 'check' && (
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
                {mockCustomer.orderNo}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {mockCustomer.avatar}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-secondary mb-1">{mockCustomer.name}</h4>
                <div className="flex items-center gap-4 text-sm text-secondary/50">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {mockCustomer.phone}
                  </span>
                  <span>租期：{mockCustomer.rentalDays}天 ({mockCustomer.startDate})</span>
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
              <span className="text-sm text-secondary/50">共 {items.length} 件</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-xl border transition-all overflow-hidden',
                    item.damageLevel === 'none'
                      ? 'border-secondary/10'
                      : 'border-warning/20 bg-warning/5'
                  )}
                >
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
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
                        <p className="font-semibold text-secondary">{item.name}</p>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full border font-medium',
                            damageLevelConfig[item.damageLevel].className
                          )}
                        >
                          {damageLevelConfig[item.damageLevel].label}
                        </span>
                      </div>
                      <p className="text-xs text-secondary/50 font-mono mt-0.5">
                        {item.code} · {item.size}
                      </p>
                    </div>
                    {damageLevelConfig[item.damageLevel].fee > 0 && (
                      <div className="text-right mr-2">
                        <p className="text-sm font-semibold text-danger">
                          +¥{damageLevelConfig[item.damageLevel].fee}
                        </p>
                        <p className="text-xs text-secondary/40">赔偿费</p>
                      </div>
                    )}
                    {expandedItem === item.id ? (
                      <ChevronUp className="w-5 h-5 text-secondary/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary/40" />
                    )}
                  </div>

                  {expandedItem === item.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-secondary/10">
                      <p className="text-sm font-medium text-secondary mb-3">选择损坏程度：</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Object.keys(damageLevelConfig) as DamageLevel[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => handleDamageLevelChange(item.id, level)}
                            className={cn(
                              'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                              item.damageLevel === level
                                ? damageLevelConfig[level].className + ' border-current'
                                : 'border-secondary/10 text-secondary/50 hover:border-secondary/30'
                            )}
                          >
                            {damageLevelConfig[level].label}
                            {damageLevelConfig[level].fee > 0 && (
                              <span className="ml-1">(¥{damageLevelConfig[level].fee})</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {item.damageLevel !== 'none' && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary mb-2">
                              损坏部位描述
                            </label>
                            <textarea
                              value={item.damageNotes}
                              onChange={(e) => handleDamageNotesChange(item.id, e.target.value)}
                              placeholder="请详细描述损坏的具体部位和情况..."
                              className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-primary focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors resize-none"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                              上传照片
                            </label>
                            <div className="flex gap-2">
                              <button className="w-20 h-20 rounded-xl border-2 border-dashed border-secondary/20 flex flex-col items-center justify-center text-secondary/40 hover:border-primary hover:text-primary transition-colors">
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
              ))}
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
                <span>押金金额</span>
                <span>¥{mockCustomer.deposit}.00</span>
              </div>
              {hasDamage && (
                <>
                  <div className="flex justify-between text-danger">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      损坏赔偿（{items.filter((i) => i.damageLevel !== 'none').length}件）
                    </span>
                    <span className="font-semibold">-¥{totalDamageFee}.00</span>
                  </div>
                  {items
                    .filter((i) => i.damageLevel !== 'none')
                    .map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-secondary/50 pl-5">
                        <span>· {item.name}（{damageLevelConfig[item.damageLevel].label}）</span>
                        <span>¥{damageLevelConfig[item.damageLevel].fee}.00</span>
                      </div>
                    ))}
                </>
              )}
              <div className="h-px bg-secondary/10" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary">应退金额</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    refundAmount >= 0 ? 'text-success' : 'text-danger'
                  )}
                >
                  ¥{refundAmount}.00
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
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold shadow-lg shadow-success/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              确认归还并生成单据
            </button>
          </div>
        </div>
      )}

      {step === 'result' && (
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
              <p className="text-white/80">电子赔偿单已生成</p>
            </div>

            <div className="p-8">
              <div className="p-4 rounded-xl bg-secondary/5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-secondary">赔偿单据号</span>
                </div>
                <p className="text-2xl font-bold text-primary font-mono">DM{Date.now().toString().slice(-10)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">归还人</p>
                  <p className="font-semibold text-secondary">{mockCustomer.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">归还时间</p>
                  <p className="font-semibold text-secondary">{new Date().toLocaleString('zh-CN')}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">损坏赔偿</p>
                  <p className="font-semibold text-danger">¥{totalDamageFee}.00</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">实退押金</p>
                  <p className="font-semibold text-success">¥{refundAmount}.00</p>
                </div>
              </div>

              {hasDamage && (
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                  <p className="text-sm font-medium text-warning mb-2">损坏明细：</p>
                  <div className="space-y-1">
                    {items
                      .filter((i) => i.damageLevel !== 'none')
                      .map((item) => (
                        <div key={item.id} className="text-sm text-warning/80">
                          · {item.name}：{damageLevelConfig[item.damageLevel].label}
                          {item.damageNotes && `（${item.damageNotes}）`}
                          {' '}- ¥{damageLevelConfig[item.damageLevel].fee}
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
                <button className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  查看单据
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
