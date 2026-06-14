import { useState } from 'react';
import {
  AlertTriangle,
  Heart,
  MapPin,
  HelpCircle,
  Wrench,
  CheckCircle,
  Clock,
  Shield,
  Phone,
  User,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/MainLayout';

type RescueType = 'injury' | 'lost' | 'equipment' | 'other';

interface RescueOption {
  id: RescueType;
  label: string;
  icon: typeof Heart;
  description: string;
  color: string;
  gradient: string;
}

const rescueOptions: RescueOption[] = [
  {
    id: 'injury',
    label: '受伤求助',
    icon: Heart,
    description: '滑雪摔倒、扭伤、碰撞等身体伤害',
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'lost',
    label: '迷路求助',
    icon: MapPin,
    description: '找不到方向、脱离雪道、与同伴失散',
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'equipment',
    label: '设备故障',
    icon: Wrench,
    description: '雪板脱落、雪杖断裂、缆车故障等',
    color: 'text-sky-600',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    id: 'other',
    label: '其他紧急',
    icon: HelpCircle,
    description: '其他需要紧急救助的情况',
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600',
  },
];

const slopeOptions = [
  { id: 'slope-001', name: '玉兰道（初级）' },
  { id: 'slope-002', name: '梅花园（初级）' },
  { id: 'slope-003', name: '松涛道（初级）' },
  { id: 'slope-004', name: '翠竹道（中级）' },
  { id: 'slope-005', name: '幽兰谷（中级）' },
  { id: 'slope-006', name: '金桂坡（中级）' },
  { id: 'slope-007', name: '雪莲峰（高级）' },
  { id: 'slope-008', name: '冰瀑崖（高级）' },
  { id: 'slope-009', name: '风云岭（高级）' },
  { id: 'slope-010', name: '龙腾道（专家）' },
  { id: 'slope-011', name: '虎跳峡（专家）' },
];

function SOS() {
  const [selectedType, setSelectedType] = useState<RescueType | null>(null);
  const [selectedSlope, setSelectedSlope] = useState<string>('');
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(5);

  const canSubmit = selectedType && selectedSlope && visitorName && visitorPhone;

  const handlePressStart = () => {
    if (!canSubmit) return;
    setIsPressed(true);
    setPressProgress(0);

    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPressProgress(progress);

      if (progress < 100 && isPressed) {
        requestAnimationFrame(animate);
      } else if (progress >= 100) {
        handleSubmit();
      }
    };

    requestAnimationFrame(animate);
  };

  const handlePressEnd = () => {
    if (pressProgress < 100) {
      setIsPressed(false);
      setPressProgress(0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setEstimatedTime(3 + Math.floor(Math.random() * 5));
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedType(null);
    setSelectedSlope('');
    setVisitorName('');
    setVisitorPhone('');
    setDescription('');
    setIsPressed(false);
    setPressProgress(0);
  };

  if (isSubmitted) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center animate-fade-in-up">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-success/30">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">救援人员已派遣</h2>
              <p className="text-gray-500 mb-6">请保持在原地不要移动，我们会尽快到达</p>

              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <span className="text-4xl font-bold text-primary">{estimatedTime}</span>
                  <span className="text-lg text-gray-600">分钟</span>
                </div>
                <p className="text-sm text-gray-500">预计到达时间</p>
              </div>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">救援人员</p>
                    <p className="font-semibold text-gray-900">李救援 · 139****9001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">您的位置</p>
                    <p className="font-semibold text-gray-900">{slopeOptions.find(s => s.id === selectedSlope)?.name}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 active:scale-[0.98]"
              >
                返回一键呼救
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-danger" />
            一键呼救
          </h1>
          <p className="text-gray-500 mt-1">如遇紧急情况，请立即呼叫救援</p>
        </div>

        <div className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/80 text-sm">紧急联系电话</p>
              <p className="text-2xl font-bold">400-888-0999</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择呼救类型</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rescueOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedType(option.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-300',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br transition-all duration-300',
                        option.gradient,
                        isSelected ? 'shadow-lg scale-105' : 'opacity-80'
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-semibold mb-0.5', isSelected ? 'text-primary' : 'text-gray-900')}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 shrink-0 transition-all duration-300',
                        isSelected ? 'text-primary translate-x-0' : 'text-gray-300 -translate-x-1 opacity-0'
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">您的信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                当前位置（所在雪道）
              </label>
              <select
                value={selectedSlope}
                onChange={(e) => setSelectedSlope(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-gray-900"
              >
                <option value="">请选择您所在的雪道...</option>
                {slopeOptions.map((slope) => (
                  <option key={slope.id} value={slope.id}>
                    {slope.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <User className="w-4 h-4 text-primary" />
                  您的姓名
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-primary" />
                  联系电话
                </label>
                <input
                  type="tel"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="请输入手机号码"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">情况描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请简要描述您遇到的问题..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="relative">
            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              disabled={!canSubmit}
              className={cn(
                'w-full relative overflow-hidden rounded-2xl font-bold text-white transition-all duration-300 select-none',
                canSubmit
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 shadow-xl shadow-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/50 active:scale-[0.99]'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
              style={{ height: '140px' }}
            >
              {canSubmit && (
                <div
                  className="absolute inset-0 bg-white/30 transition-all duration-75"
                  style={{ width: `${pressProgress}%` }}
                />
              )}

              {canSubmit && pressProgress > 0 && pressProgress < 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePressEnd();
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {!canSubmit ? (
                  <>
                    <AlertTriangle className="w-10 h-10 mb-2 opacity-70" />
                    <p className="text-lg">请先填写完整信息</p>
                  </>
                ) : pressProgress === 0 ? (
                  <>
                    <AlertTriangle className="w-12 h-12 mb-2 animate-pulse" />
                    <p className="text-xl">长按 1.5 秒发送求救信号</p>
                    <p className="text-sm text-white/70 mt-1">SOS 紧急救援</p>
                  </>
                ) : pressProgress < 100 ? (
                  <>
                    <AlertTriangle className="w-12 h-12 mb-2 animate-bounce" />
                    <p className="text-xl">正在发送求救信号... {Math.round(pressProgress)}%</p>
                    <p className="text-sm text-white/80 mt-1">松开可取消</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 mb-2" />
                    <p className="text-xl">求救信号已发送！</p>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-0.5">使用提示</p>
              <p className="text-amber-700 leading-relaxed">
                长按红色按钮1.5秒即可发送求救信号，救援人员将在3-8分钟内到达。请保持冷静，在原地等待救援，不要随意移动以免二次伤害。
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SOS;
