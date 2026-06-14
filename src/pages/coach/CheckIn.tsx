import { useState } from 'react';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'scan' | 'input' | 'success';

const mockStudentInfo = {
  name: '张子涵',
  avatar: '张',
  phone: '138****6789',
  courseType: '儿童教学',
  time: '14:00 - 16:00',
  location: '儿童教学区',
  duration: '2小时',
  bookingCode: 'BK20250615001',
  level: '零基础入门',
  note: '家长陪同，需要特别关注安全',
};

export default function CoachCheckIn() {
  const [step, setStep] = useState<Step>('scan');
  const [bookingCode, setBookingCode] = useState('');

  const handleScanSuccess = () => {
    setStep('success');
  };

  const handleManualSubmit = () => {
    if (bookingCode.length >= 6) {
      setStep('success');
    }
  };

  const handleReset = () => {
    setStep('scan');
    setBookingCode('');
  };

  return (
    <div className="animate-fade-in-up">
      {step === 'scan' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">课程签到</h2>
              <p className="text-secondary/50">请将学员预约码对准扫描框</p>
            </div>

            <div className="relative mx-auto w-full max-w-sm aspect-square mb-8">
              <div className="absolute inset-0 rounded-3xl border-4 border-primary/20" />
              <div className="absolute inset-4 rounded-2xl border-2 border-primary/40">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse shadow-lg shadow-primary/50" style={{ animation: 'scanMove 2s ease-in-out infinite' }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-16 h-16 text-primary/30" />
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
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
          </div>
        </div>
      )}

      {step === 'input' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary">输入预约码</h2>
              <button
                onClick={handleReset}
                className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center text-secondary/60 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-secondary/50 mb-6">
              请输入学员的预约码进行签到
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                预约码
              </label>
              <input
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                placeholder="例如：BK20250615001"
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
                确认签到
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
              <h2 className="text-2xl font-bold mb-1">签到成功</h2>
              <p className="text-white/80">{new Date().toLocaleTimeString('zh-CN')}</p>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-secondary/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {mockStudentInfo.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary">
                    {mockStudentInfo.name}
                  </h3>
                  <p className="text-sm text-secondary/50">
                    {mockStudentInfo.phone}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {mockStudentInfo.bookingCode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/5">
                  <div className="flex items-center gap-2 text-secondary/50 text-sm mb-1">
                    <User className="w-4 h-4" />
                    课程类型
                  </div>
                  <p className="font-semibold text-secondary">
                    {mockStudentInfo.courseType}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <div className="flex items-center gap-2 text-secondary/50 text-sm mb-1">
                    <User className="w-4 h-4" />
                    等级
                  </div>
                  <p className="font-semibold text-secondary">
                    {mockStudentInfo.level}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <div className="flex items-center gap-2 text-secondary/50 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    上课时间
                  </div>
                  <p className="font-semibold text-secondary">
                    {mockStudentInfo.time}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5">
                  <div className="flex items-center gap-2 text-secondary/50 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    上课地点
                  </div>
                  <p className="font-semibold text-secondary">
                    {mockStudentInfo.location}
                  </p>
                </div>
              </div>

              {mockStudentInfo.note && (
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                  <p className="text-sm font-medium text-warning mb-1">备注信息</p>
                  <p className="text-sm text-warning/80">{mockStudentInfo.note}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3.5 rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all"
                >
                  继续签到
                </button>
                <button className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
                  查看课表
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
