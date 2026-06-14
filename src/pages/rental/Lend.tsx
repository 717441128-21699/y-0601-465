import { useState } from 'react';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  User,
  Phone,
  Package,
  Wallet,
  X,
  ArrowRight,
  Check,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'scan' | 'input' | 'confirm' | 'scanning-items' | 'success';

interface RentalItem {
  id: string;
  name: string;
  code: string;
  size: string;
  dailyPrice: number;
  deposit: number;
  scanned: boolean;
}

const mockCustomer = {
  name: '李明轩',
  avatar: '李',
  phone: '138****6789',
  orderNo: 'RT20250615001',
  rentalDays: 1,
  startDate: '2025-06-15',
  endDate: '2025-06-15',
  deposit: 1500,
};

const initialItems: RentalItem[] = [
  { id: '1', name: '专业双板套装', code: 'SKI-A-001', size: '160cm', dailyPrice: 80, deposit: 500, scanned: false },
  { id: '2', name: '专业滑雪靴', code: 'BOOT-M-042', size: '42码', dailyPrice: 40, deposit: 300, scanned: false },
  { id: '3', name: '专业滑雪头盔', code: 'HELM-L-015', size: 'L码', dailyPrice: 20, deposit: 200, scanned: false },
  { id: '4', name: '专业滑雪镜', code: 'GOGGLE-028', size: '均码', dailyPrice: 25, deposit: 300, scanned: false },
  { id: '5', name: '专业滑雪杖', code: 'POLE-120', size: '120cm', dailyPrice: 15, deposit: 200, scanned: false },
];

export default function RentalLend() {
  const [step, setStep] = useState<Step>('scan');
  const [bookingCode, setBookingCode] = useState('');
  const [items, setItems] = useState<RentalItem[]>(initialItems);
  const [currentScanningIndex, setCurrentScanningIndex] = useState(0);

  const allScanned = items.every((item) => item.scanned);
  const totalDaily = items.reduce((sum, item) => sum + item.dailyPrice, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit, 0);

  const handleScanSuccess = () => {
    setStep('confirm');
  };

  const handleManualSubmit = () => {
    if (bookingCode.length >= 6) {
      setStep('confirm');
    }
  };

  const handleStartScanning = () => {
    setStep('scanning-items');
    setCurrentScanningIndex(0);
  };

  const handleScanItem = () => {
    if (currentScanningIndex < items.length) {
      const newItems = [...items];
      newItems[currentScanningIndex].scanned = true;
      setItems(newItems);
      if (currentScanningIndex < items.length - 1) {
        setCurrentScanningIndex(currentScanningIndex + 1);
      } else {
        setTimeout(() => setStep('success'), 500);
      }
    }
  };

  const handleReset = () => {
    setStep('scan');
    setBookingCode('');
    setItems(initialItems.map((i) => ({ ...i, scanned: false })));
    setCurrentScanningIndex(0);
  };

  const handleConfirm = () => {
    setTimeout(() => setStep('success'), 500);
  };

  return (
    <div className="animate-fade-in-up">
      {(step === 'scan' || step === 'input') && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">扫码领取器材</h2>
              <p className="text-secondary/50">请扫描预约二维码或输入预约码</p>
            </div>

            {step === 'scan' && (
              <>
                <div className="relative mx-auto w-full max-w-sm aspect-square mb-8">
                  <div className="absolute inset-0 rounded-3xl border-4 border-primary/20" />
                  <div className="absolute inset-4 rounded-2xl border-2 border-primary/40">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    <div
                      className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/50"
                      style={{ animation: 'scanMove 2s ease-in-out infinite' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine className="w-16 h-16 text-primary/30" />
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
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
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
                    className="w-full py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
                  >
                    手动输入预约码
                  </button>
                </div>
              </>
            )}

            {step === 'input' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary">输入预约码</h2>
                  <button
                    onClick={handleReset}
                    className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center text-secondary/60 hover:text-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-secondary/50 mb-6">请输入顾客的预约码进行领取</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary mb-2">预约码</label>
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    placeholder="例如：RT20250615001"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors text-lg font-mono tracking-wider"
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
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30 hover:shadow-xl'
                        : 'bg-secondary/10 text-secondary/40 cursor-not-allowed'
                    )}
                  >
                    查询订单
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
                  >
                    返回扫码
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-secondary">预约人信息</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {mockCustomer.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold text-secondary">{mockCustomer.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                    {mockCustomer.orderNo}
                  </span>
                </div>
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
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-success" />
                </div>
                <h3 className="text-lg font-bold text-secondary">租赁器材清单</h3>
              </div>
              <span className="text-sm text-secondary/50">共 {items.length} 件</span>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-secondary">{item.name}</p>
                    <p className="text-xs text-secondary/50 font-mono mt-0.5">
                      {item.code} · {item.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary">¥{item.dailyPrice}/天</p>
                    <p className="text-xs text-secondary/50">押金 ¥{item.deposit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-warning/20 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-secondary">费用明细</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-secondary/70">
                <span>日租金合计</span>
                <span>¥{totalDaily}.00</span>
              </div>
              <div className="flex justify-between text-secondary/70">
                <span>押金（已预交）</span>
                <span className="text-success">¥{totalDeposit}.00</span>
              </div>
              <div className="h-px bg-secondary/10" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary">已交押金</span>
                <span className="text-2xl font-bold text-success">¥{mockCustomer.deposit}.00</span>
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
              onClick={handleStartScanning}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              开始扫码领取
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 'scanning-items' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-secondary">器材扫码确认</h3>
              </div>
              <span className="text-sm text-primary font-medium">
                {items.filter((i) => i.scanned).length} / {items.length} 已扫描
              </span>
            </div>

            {!allScanned && (
              <div className="relative mx-auto w-full max-w-sm aspect-square mb-6">
                <div className="absolute inset-0 rounded-3xl border-4 border-primary/20" />
                <div className="absolute inset-4 rounded-2xl border-2 border-primary/40">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  <div
                    className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/50"
                    style={{ animation: 'scanMove 1.5s ease-in-out infinite' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ScanLine className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                      <p className="text-sm text-secondary/60">
                        正在扫描：{items[currentScanningIndex]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl transition-all',
                    item.scanned
                      ? 'bg-success/5 border border-success/20'
                      : idx === currentScanningIndex
                      ? 'bg-primary/5 border-2 border-primary/30'
                      : 'bg-secondary/5'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0',
                      item.scanned
                        ? 'bg-success-500 text-white'
                        : 'bg-secondary/10 text-secondary/40'
                    )}
                  >
                    {item.scanned ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-semibold', item.scanned ? 'text-secondary' : 'text-secondary/60')}>
                      {item.name}
                    </p>
                    <p className="text-xs text-secondary/50 font-mono mt-0.5">
                      {item.code} · {item.size}
                    </p>
                  </div>
                  {item.scanned ? (
                    <span className="text-sm text-success font-medium">已确认</span>
                  ) : idx === currentScanningIndex ? (
                    <span className="text-sm text-primary font-medium animate-pulse">扫描中...</span>
                  ) : (
                    <span className="text-sm text-secondary/40">等待扫描</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!allScanned && (
            <div className="flex gap-4">
              <button
                onClick={() => setStep('confirm')}
                className="flex-1 py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
              >
                返回确认
              </button>
              <button
                onClick={handleScanItem}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                模拟扫描下一件
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-success-400 to-success-600 p-8 text-center text-white">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-1">领取成功</h2>
              <p className="text-white/80">订单号：{mockCustomer.orderNo}</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">领取人</p>
                  <p className="font-semibold text-secondary">{mockCustomer.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">领取时间</p>
                  <p className="font-semibold text-secondary">{new Date().toLocaleString('zh-CN')}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">器材数量</p>
                  <p className="font-semibold text-secondary">{items.length} 件</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-secondary/50 mb-1">预收押金</p>
                  <p className="font-semibold text-success">¥{mockCustomer.deposit}.00</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                <p className="text-sm font-medium text-warning mb-1">温馨提示</p>
                <p className="text-sm text-warning/80">请提醒顾客妥善保管器材，归还时如有损坏将按规定收取赔偿费用。</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
                >
                  继续领取
                </button>
                <button className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
                  查看订单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
