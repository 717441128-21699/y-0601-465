import { useState } from 'react';
import {
  Mountain,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Users,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Snowflake,
  Sun,
  Cloud,
  CloudSnow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/MainLayout';

interface SlopeMapData {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'open' | 'closed' | 'caution';
  path: string;
  position: { x: number; y: number };
}

const slopeMapData: SlopeMapData[] = [
  { id: 'slope-001', name: '玉兰道', difficulty: 'beginner', status: 'open', path: 'M 80 60 L 120 200', position: { x: 80, y: 60 } },
  { id: 'slope-002', name: '梅花园', difficulty: 'beginner', status: 'open', path: 'M 180 50 L 200 200', position: { x: 180, y: 50 } },
  { id: 'slope-003', name: '松涛道', difficulty: 'beginner', status: 'open', path: 'M 280 55 L 300 200', position: { x: 280, y: 55 } },
  { id: 'slope-004', name: '翠竹道', difficulty: 'intermediate', status: 'open', path: 'M 100 40 L 60 220', position: { x: 100, y: 40 } },
  { id: 'slope-005', name: '幽兰谷', difficulty: 'intermediate', status: 'open', path: 'M 220 35 L 180 230', position: { x: 220, y: 35 } },
  { id: 'slope-006', name: '金桂坡', difficulty: 'intermediate', status: 'open', path: 'M 340 45 L 360 220', position: { x: 340, y: 45 } },
  { id: 'slope-007', name: '雪莲峰', difficulty: 'advanced', status: 'caution', path: 'M 60 30 L 40 240', position: { x: 60, y: 30 } },
  { id: 'slope-008', name: '冰瀑崖', difficulty: 'advanced', status: 'caution', path: 'M 400 30 L 420 240', position: { x: 400, y: 30 } },
  { id: 'slope-009', name: '风云岭', difficulty: 'advanced', status: 'open', path: 'M 280 25 L 320 240', position: { x: 280, y: 25 } },
  { id: 'slope-010', name: '龙腾道', difficulty: 'expert', status: 'open', path: 'M 30 20 L 10 260', position: { x: 30, y: 20 } },
  { id: 'slope-011', name: '虎跳峡', difficulty: 'expert', status: 'open', path: 'M 450 20 L 470 260', position: { x: 450, y: 20 } },
  { id: 'slope-012', name: '鹰喙峰', difficulty: 'expert', status: 'closed', path: 'M 240 15 L 250 270', position: { x: 240, y: 15 } },
];

const facilities = [
  { id: 'f1', name: 'A索缆车', type: 'lift', position: { x: 150, y: 130 } },
  { id: 'f2', name: 'B索缆车', type: 'lift', position: { x: 350, y: 130 } },
  { id: 'f3', name: '山顶餐厅', type: 'restaurant', position: { x: 250, y: 30 } },
  { id: 'f4', name: '急救站', type: 'first_aid', position: { x: 250, y: 250 } },
  { id: 'f5', name: '雪具大厅', type: 'rental', position: { x: 250, y: 280 } },
];

const slopeListData = [
  { id: 'slope-001', name: '玉兰道', difficulty: 'beginner', length: 300, elevation: 50, status: 'open', capacity: 200, currentCount: 85, description: '初级道，适合新手练习基础动作。雪道宽阔平坦，配有魔毯传输。' },
  { id: 'slope-002', name: '梅花园', difficulty: 'beginner', length: 350, elevation: 55, status: 'open', capacity: 220, currentCount: 98, description: '初级道，坡度平缓，周围种植梅花，风景优美。' },
  { id: 'slope-003', name: '松涛道', difficulty: 'beginner', length: 400, elevation: 60, status: 'open', capacity: 250, currentCount: 120, description: '初级道，两侧松林环绕，听松涛声滑雪，别有风味。' },
  { id: 'slope-004', name: '翠竹道', difficulty: 'intermediate', length: 600, elevation: 120, status: 'open', capacity: 180, currentCount: 110, description: '中级道，有一定坡度和弯道，适合进阶练习。' },
  { id: 'slope-005', name: '幽兰谷', difficulty: 'intermediate', length: 700, elevation: 140, status: 'open', capacity: 200, currentCount: 135, description: '中级道，谷中幽兰盛开时香气四溢，雪道蜿蜒曲折。' },
  { id: 'slope-006', name: '金桂坡', difficulty: 'intermediate', length: 800, elevation: 160, status: 'open', capacity: 220, currentCount: 150, description: '中级道，秋季金桂飘香，坡度适中，长度足够。' },
  { id: 'slope-007', name: '雪莲峰', difficulty: 'advanced', length: 1000, elevation: 250, status: 'caution', capacity: 120, currentCount: 45, description: '高级道，坡度较陡，山顶常年积雪如盛开雪莲。今日风力较大，请谨慎滑行。' },
  { id: 'slope-008', name: '冰瀑崖', difficulty: 'advanced', length: 1200, elevation: 300, status: 'caution', capacity: 100, currentCount: 38, description: '高级道，道旁冰瀑奇观，部分区域有结冰，滑行需注意安全。' },
  { id: 'slope-009', name: '风云岭', difficulty: 'advanced', length: 1100, elevation: 280, status: 'open', capacity: 110, currentCount: 55, description: '高级道，风云变幻，岭上视野开阔，可俯瞰整个雪场。' },
  { id: 'slope-010', name: '龙腾道', difficulty: 'expert', length: 1500, elevation: 400, status: 'open', capacity: 60, currentCount: 22, description: '专家道，如蛟龙盘旋，极具挑战性，仅限专业滑雪者。' },
  { id: 'slope-011', name: '虎跳峡', difficulty: 'expert', length: 1800, elevation: 450, status: 'open', capacity: 50, currentCount: 18, description: '专家道，险峻如虎跳峡，坡度极大，需要高超技巧。' },
  { id: 'slope-012', name: '鹰喙峰', difficulty: 'expert', length: 2000, elevation: 500, status: 'closed', capacity: 40, currentCount: 0, description: '专家道，因设备维护暂停开放，预计明日恢复。' },
];

const difficultyConfig = {
  beginner: { label: '初级', color: 'bg-emerald-500', textColor: 'text-emerald-600', lightBg: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  intermediate: { label: '中级', color: 'bg-sky-500', textColor: 'text-sky-600', lightBg: 'bg-sky-50', borderColor: 'border-sky-200' },
  advanced: { label: '高级', color: 'bg-orange-500', textColor: 'text-orange-600', lightBg: 'bg-orange-50', borderColor: 'border-orange-200' },
  expert: { label: '专家', color: 'bg-rose-600', textColor: 'text-rose-600', lightBg: 'bg-rose-50', borderColor: 'border-rose-200' },
};

const statusConfig = {
  open: { label: '正常开放', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  caution: { label: '谨慎开放', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  closed: { label: '已关闭', icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
};

function Slopes() {
  const [selectedSlope, setSelectedSlope] = useState<string | null>(null);
  const [weatherFilter, setWeatherFilter] = useState<string>('all');

  const weatherInfo = {
    temperature: -8,
    windSpeed: 12,
    humidity: 65,
    visibility: 8,
    snowQuality: 8.5,
    condition: '多云',
    conditionIcon: Cloud,
  };

  const selectedSlopeData = slopeListData.find(s => s.id === selectedSlope);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mountain className="w-7 h-7 text-primary" />
              雪道状态地图
            </h1>
            <p className="text-gray-500 mt-1">实时了解雪场雪道开放情况和天气信息</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-sm">气温</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weatherInfo.temperature}°C</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-sm">风速</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weatherInfo.windSpeed} km/h</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-sm">湿度</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weatherInfo.humidity}%</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-sm">能见度</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weatherInfo.visibility} km</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-sm">雪质评分</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weatherInfo.snowQuality}/10</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">雪场全景图</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">初级</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <span className="text-gray-600">中级</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">高级</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                  <span className="text-gray-600">专家</span>
                </div>
              </div>
            </div>
            <div className="relative bg-gradient-to-b from-sky-50 via-blue-50 to-emerald-50 rounded-xl overflow-hidden">
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <defs>
                  <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#f0fdf4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <path d="M 0 320 L 0 120 Q 80 60 150 100 Q 220 40 300 80 Q 380 50 450 90 L 500 110 L 500 320 Z" fill="url(#mountainGrad)" />
                <path d="M 0 320 L 0 150 Q 100 100 200 130 Q 300 90 400 120 L 500 140 L 500 320 Z" fill="#f0f9ff" opacity="0.6" />

                {slopeMapData.map((slope) => {
                  const config = difficultyConfig[slope.difficulty];
                  const isSelected = selectedSlope === slope.id;
                  const strokeDasharray = slope.status === 'closed' ? '8 6' : slope.status === 'caution' ? '4 3' : 'none';
                  const opacity = slope.status === 'closed' ? 0.35 : 1;

                  return (
                    <g key={slope.id} className="cursor-pointer" onClick={() => setSelectedSlope(slope.id)}>
                      <path
                        d={slope.path}
                        stroke={isSelected ? '#0ea5e9' : ''}
                        strokeWidth={isSelected ? 14 : 12}
                        fill="none"
                        opacity="0.3"
                        className="transition-all duration-300"
                        style={{ filter: isSelected ? 'url(#glow)' : 'none' }}
                      />
                      <path
                        d={slope.path}
                        className={`${config.color} transition-all duration-300`}
                        strokeWidth={isSelected ? 8 : 6}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        opacity={opacity}
                      />
                      <circle
                        cx={slope.position.x}
                        cy={slope.position.y}
                        r={isSelected ? 9 : 7}
                        fill="white"
                        stroke={isSelected ? '#0ea5e9' : '#94a3b8'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <text
                        x={slope.position.x}
                        y={slope.position.y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={isSelected ? '#0ea5e9' : '#475569'}
                      >
                        {slope.name.charAt(0)}
                      </text>
                    </g>
                  );
                })}

                {facilities.map((f) => (
                  <g key={f.id}>
                    <circle cx={f.position.x} cy={f.position.y} r="10" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
                    <text
                      x={f.position.x}
                      y={f.position.y + 22}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                    >
                      {f.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">雪道详情</h2>
            {selectedSlopeData ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', difficultyConfig[selectedSlopeData.difficulty].color)}>
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedSlopeData.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', difficultyConfig[selectedSlopeData.difficulty].lightBg, difficultyConfig[selectedSlopeData.difficulty].textColor)}>
                        {difficultyConfig[selectedSlopeData.difficulty].label}
                      </span>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1', statusConfig[selectedSlopeData.status as keyof typeof statusConfig].bg, statusConfig[selectedSlopeData.status as keyof typeof statusConfig].color)}>
                        {(() => {
                          const StatusIcon = statusConfig[selectedSlopeData.status as keyof typeof statusConfig].icon;
                          return <StatusIcon className="w-3 h-3" />;
                        })()}
                        {statusConfig[selectedSlopeData.status as keyof typeof statusConfig].label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">长度</p>
                    <p className="text-lg font-bold text-gray-900">{selectedSlopeData.length} m</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">落差</p>
                    <p className="text-lg font-bold text-gray-900">{selectedSlopeData.elevation} m</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      人流量
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedSlopeData.currentCount}/{selectedSlopeData.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        selectedSlopeData.currentCount / selectedSlopeData.capacity > 0.8
                          ? 'bg-danger'
                          : selectedSlopeData.currentCount / selectedSlopeData.capacity > 0.5
                          ? 'bg-warning'
                          : 'bg-success'
                      )}
                      style={{ width: `${(selectedSlopeData.currentCount / selectedSlopeData.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    容量使用率 {Math.round((selectedSlopeData.currentCount / selectedSlopeData.capacity) * 100)}%
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{selectedSlopeData.description}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Mountain className="w-16 h-16 text-gray-200 mb-3" />
                <p className="text-gray-400">点击地图或列表中的雪道</p>
                <p className="text-gray-400 text-sm">查看详细信息</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">全部雪道</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {slopeListData.map((slope) => {
              const diffConfig = difficultyConfig[slope.difficulty];
              const statConfig = statusConfig[slope.status as keyof typeof statusConfig];
              const StatusIcon = statConfig.icon;
              const usageRate = slope.currentCount / slope.capacity;

              return (
                <div
                  key={slope.id}
                  className={cn(
                    'p-5 hover:bg-sky-50/50 cursor-pointer transition-all duration-300',
                    selectedSlope === slope.id && 'bg-sky-50'
                  )}
                  onClick={() => setSelectedSlope(slope.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', diffConfig.color)}>
                      <Mountain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{slope.name}</h3>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', diffConfig.lightBg, diffConfig.textColor)}>
                          {diffConfig.label}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1', statConfig.bg, statConfig.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {statConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>长度 {slope.length}m</span>
                        <span>落差 {slope.elevation}m</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {slope.currentCount}/{slope.capacity}人
                        </span>
                      </div>
                    </div>
                    <div className="w-40 shrink-0 hidden sm:block">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            usageRate > 0.8 ? 'bg-danger' : usageRate > 0.5 ? 'bg-warning' : 'bg-success'
                          )}
                          style={{ width: `${usageRate * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-right">{Math.round(usageRate * 100)}% 使用率</p>
                    </div>
                    <ChevronRight className={cn('w-5 h-5 text-gray-300 shrink-0 transition-transform duration-300', selectedSlope === slope.id && 'text-primary rotate-90')} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Slopes;
