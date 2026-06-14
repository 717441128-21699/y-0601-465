import { useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Wrench,
  Trash2,
  CheckCircle,
  ChevronDown,
  Plus,
  MoreHorizontal,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type EquipmentStatus = 'available' | 'rented' | 'maintenance' | 'scrapped';
type EquipmentCategory = 'all' | 'ski' | 'snowboard' | 'boots' | 'helmet' | 'goggles' | 'clothing' | 'poles';

interface Equipment {
  id: string;
  code: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  size: string;
  status: EquipmentStatus;
  dailyPrice: number;
  purchaseDate: string;
  condition: number;
}

const categoryConfig: Record<EquipmentCategory, { label: string; color: string }> = {
  all: { label: '全部', color: 'bg-primary text-white' },
  ski: { label: '双板', color: 'bg-primary/10 text-primary' },
  snowboard: { label: '单板', color: 'bg-purple-100 text-purple-600' },
  boots: { label: '雪靴', color: 'bg-success/10 text-success' },
  helmet: { label: '头盔', color: 'bg-warning/10 text-warning' },
  goggles: { label: '护目镜', color: 'bg-cyan-100 text-cyan-600' },
  clothing: { label: '雪服', color: 'bg-pink-100 text-pink-600' },
  poles: { label: '雪杖', color: 'bg-orange-100 text-orange-600' },
};

const statusConfig: Record<EquipmentStatus, { label: string; className: string; icon: typeof Package }> = {
  available: { label: '可用', className: 'bg-success/10 text-success', icon: CheckCircle },
  rented: { label: '在租', className: 'bg-primary/10 text-primary', icon: Package },
  maintenance: { label: '维修中', className: 'bg-warning/10 text-warning', icon: Wrench },
  scrapped: { label: '报废', className: 'bg-danger/10 text-danger', icon: Trash2 },
};

const allEquipments: Equipment[] = [
  { id: '1', code: 'SKI-A-001', name: '专业双板套装', category: 'ski', brand: 'Atomic', model: 'Redster X9', size: '160cm', status: 'available', dailyPrice: 80, purchaseDate: '2024-11-15', condition: 95 },
  { id: '2', code: 'SKI-A-002', name: '专业双板套装', category: 'ski', brand: 'Atomic', model: 'Redster X9', size: '165cm', status: 'rented', dailyPrice: 80, purchaseDate: '2024-11-15', condition: 90 },
  { id: '3', code: 'SKI-A-003', name: '专业双板套装', category: 'ski', brand: 'Atomic', model: 'Redster X9', size: '170cm', status: 'available', dailyPrice: 80, purchaseDate: '2024-11-15', condition: 92 },
  { id: '4', code: 'SKI-B-004', name: '入门双板套装', category: 'ski', brand: 'Rossignol', model: 'Experience 74', size: '155cm', status: 'maintenance', dailyPrice: 60, purchaseDate: '2023-12-01', condition: 65 },
  { id: '5', code: 'BOARD-S-001', name: '单板滑雪板', category: 'snowboard', brand: 'Burton', model: 'Custom Flying V', size: '155cm', status: 'available', dailyPrice: 100, purchaseDate: '2024-10-20', condition: 93 },
  { id: '6', code: 'BOARD-S-002', name: '单板滑雪板', category: 'snowboard', brand: 'Burton', model: 'Process Flying V', size: '152cm', status: 'rented', dailyPrice: 100, purchaseDate: '2024-10-20', condition: 88 },
  { id: '7', code: 'BOARD-W-003', name: '女款单板滑雪板', category: 'snowboard', brand: 'Roxy', model: 'Torah Bright', size: '148cm', status: 'available', dailyPrice: 100, purchaseDate: '2024-10-25', condition: 95 },
  { id: '8', code: 'BOOT-M-001', name: '专业滑雪靴', category: 'boots', brand: 'Dalbello', model: 'Panterra 120', size: '42码', status: 'available', dailyPrice: 40, purchaseDate: '2024-11-01', condition: 90 },
  { id: '9', code: 'BOOT-M-002', name: '专业滑雪靴', category: 'boots', brand: 'Dalbello', model: 'Panterra 120', size: '43码', status: 'rented', dailyPrice: 40, purchaseDate: '2024-11-01', condition: 87 },
  { id: '10', code: 'BOOT-W-003', name: '女款滑雪靴', category: 'boots', brand: 'Lange', model: 'RX 110 W', size: '38码', status: 'available', dailyPrice: 40, purchaseDate: '2024-11-05', condition: 92 },
  { id: '11', code: 'BOOT-M-004', name: '入门滑雪靴', category: 'boots', brand: 'Nordica', model: 'Cruise 70', size: '41码', status: 'available', dailyPrice: 30, purchaseDate: '2023-12-10', condition: 75 },
  { id: '12', code: 'HELM-L-001', name: '专业滑雪头盔', category: 'helmet', brand: 'Giro', model: 'Union MIPS', size: 'L码', status: 'available', dailyPrice: 20, purchaseDate: '2024-12-01', condition: 95 },
  { id: '13', code: 'HELM-M-002', name: '专业滑雪头盔', category: 'helmet', brand: 'Giro', model: 'Union MIPS', size: 'M码', status: 'rented', dailyPrice: 20, purchaseDate: '2024-12-01', condition: 90 },
  { id: '14', code: 'HELM-S-003', name: '儿童滑雪头盔', category: 'helmet', brand: 'Bern', model: 'Bandito', size: 'S码', status: 'available', dailyPrice: 15, purchaseDate: '2024-12-10', condition: 94 },
  { id: '15', code: 'GOGGLE-001', name: '专业滑雪镜', category: 'goggles', brand: 'Oakley', model: 'Flight Deck XM', size: '均码', status: 'available', dailyPrice: 25, purchaseDate: '2024-11-20', condition: 92 },
  { id: '16', code: 'GOGGLE-002', name: '变色滑雪镜', category: 'goggles', brand: 'Smith', model: 'I/O MAG', size: '均码', status: 'maintenance', dailyPrice: 30, purchaseDate: '2024-11-15', condition: 60 },
  { id: '17', code: 'JACKET-M-001', name: '专业滑雪服', category: 'clothing', brand: 'The North Face', model: 'Freethinker', size: 'L码', status: 'available', dailyPrice: 50, purchaseDate: '2024-10-10', condition: 88 },
  { id: '18', code: 'POLE-001', name: '专业滑雪杖', category: 'poles', brand: 'Black Crows', model: 'Oxus', size: '120cm', status: 'available', dailyPrice: 15, purchaseDate: '2024-12-01', condition: 95 },
  { id: '19', code: 'POLE-002', name: '入门滑雪杖', category: 'poles', brand: 'Leki', model: 'Micro Vario', size: '115cm', status: 'scrapped', dailyPrice: 10, purchaseDate: '2022-11-01', condition: 30 },
  { id: '20', code: 'BOARD-K-004', name: '儿童单板', category: 'snowboard', brand: 'Burton', model: 'Chopper', size: '120cm', status: 'available', dailyPrice: 60, purchaseDate: '2024-12-15', condition: 96 },
];

export default function RentalInventory() {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('all');
  const [activeStatus, setActiveStatus] = useState<EquipmentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);

  const filteredEquipments = allEquipments.filter((eq) => {
    const matchCategory = activeCategory === 'all' || eq.category === activeCategory;
    const matchStatus = activeStatus === 'all' || eq.status === activeStatus;
    const matchSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleStatusChange = (id: string, status: EquipmentStatus) => {
    setShowStatusMenu(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">库存管理</h2>
          <p className="text-sm text-secondary/50 mt-1">管理所有雪具器材的状态和信息</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md shadow-primary/30 hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          新增器材
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryConfig) as EquipmentCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary/30'
                  : categoryConfig[category].color + ' hover:opacity-80'
              )}
            >
              {categoryConfig[category].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索器材编号、名称、品牌、型号..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-primary focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors"
            />
          </div>

          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-secondary/10 text-secondary/60 hover:border-primary hover:text-primary transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              <span>筛选状态</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            {(['all', 'available', 'rented', 'maintenance'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all border-2',
                  activeStatus === status
                    ? status === 'all'
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : statusConfig[status as EquipmentStatus].className + ' border-current'
                    : 'border-secondary/10 text-secondary/50 hover:border-secondary/30'
                )}
              >
                {status === 'all' ? '全部状态' : statusConfig[status as EquipmentStatus].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary/10 bg-secondary/5">
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">器材编号</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">器材名称</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">品牌型号</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">尺码</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">状态</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">日租金</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">成色</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-secondary/70">入库时间</th>
                <th className="text-right px-5 py-4 text-sm font-semibold text-secondary/70">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.map((eq) => {
                const StatusIcon = statusConfig[eq.status].icon;
                return (
                  <tr key={eq.id} className="border-b border-secondary/5 hover:bg-primary/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium text-primary">{eq.code}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary">{eq.name}</p>
                          <p className="text-xs text-secondary/40">{categoryConfig[eq.category].label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-secondary">{eq.brand}</p>
                      <p className="text-xs text-secondary/50">{eq.model}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-secondary">{eq.size}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                          statusConfig[eq.status].className
                        )}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[eq.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-secondary">¥{eq.dailyPrice}</span>
                      <span className="text-xs text-secondary/40">/天</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-secondary/10 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              eq.condition >= 80
                                ? 'bg-success'
                                : eq.condition >= 50
                                ? 'bg-warning'
                                : 'bg-danger'
                            )}
                            style={{ width: `${eq.condition}%` }}
                          />
                        </div>
                        <span className="text-xs text-secondary/60">{eq.condition}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-secondary/60">{eq.purchaseDate}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowStatusMenu(showStatusMenu === eq.id ? null : eq.id)
                          }
                          className="w-9 h-9 rounded-xl hover:bg-primary/10 flex items-center justify-center text-secondary/50 hover:text-primary transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {showStatusMenu === eq.id && (
                          <div className="absolute right-0 top-12 w-40 rounded-xl bg-white border border-secondary/10 shadow-xl py-2 z-50">
                            {(['available', 'maintenance', 'scrapped'] as EquipmentStatus[]).map(
                              (status) => {
                                const ItemIcon = statusConfig[status].icon;
                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(eq.id, status)}
                                    className={cn(
                                      'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary/5',
                                      statusConfig[status].className.split(' ')[1]
                                    )}
                                  >
                                    <ItemIcon className="w-4 h-4" />
                                    {statusConfig[status].label}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEquipments.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <p className="text-secondary/50">没有找到符合条件的器材</p>
          </div>
        )}

        <div className="px-5 py-4 border-t border-secondary/10 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-secondary/50">
            共 <span className="font-semibold text-secondary">{filteredEquipments.length}</span> 条记录
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-secondary/10 text-secondary/50 text-sm hover:border-primary hover:text-primary transition-colors">
              上一页
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-secondary/10 text-secondary/50 text-sm hover:border-primary hover:text-primary transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-secondary/10 text-secondary/50 text-sm hover:border-primary hover:text-primary transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-secondary/10 text-secondary/50 text-sm hover:border-primary hover:text-primary transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
