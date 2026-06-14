import { useState } from 'react';
import {
  Snowflake,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Ruler,
  Weight,
  Check,
  X,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type EquipmentTab = 'snowboard' | 'ski' | 'helmet' | 'boots' | 'jacket' | 'pants';

interface Equipment {
  id: string;
  type: EquipmentTab;
  brand: string;
  model: string;
  size: string;
  dailyPrice: number;
  stock: number;
  gender?: 'male' | 'female' | 'unisex';
}

interface CartItem extends Equipment {
  quantity: number;
}

const tabConfig: { key: EquipmentTab; label: string; icon: typeof Snowflake }[] = [
  { key: 'snowboard', label: '单板', icon: Snowflake },
  { key: 'ski', label: '双板', icon: Snowflake },
  { key: 'helmet', label: '头盔', icon: Snowflake },
  { key: 'boots', label: '雪靴', icon: Snowflake },
  { key: 'jacket', label: '雪服', icon: Snowflake },
  { key: 'pants', label: '雪裤', icon: Snowflake },
];

const mockEquipment: Equipment[] = [
  { id: 'e1', type: 'snowboard', brand: 'Burton', model: '全能板', size: '155cm', dailyPrice: 120, stock: 15, gender: 'unisex' },
  { id: 'e2', type: 'snowboard', brand: 'K2', model: '自由式板', size: '150cm', dailyPrice: 130, stock: 8, gender: 'unisex' },
  { id: 'e3', type: 'snowboard', brand: 'Nitro', model: '高山板', size: '160cm', dailyPrice: 140, stock: 10, gender: 'unisex' },
  { id: 'e4', type: 'ski', brand: 'Atomic', model: '全能双板', size: '165cm', dailyPrice: 150, stock: 20, gender: 'unisex' },
  { id: 'e5', type: 'ski', brand: 'Head', model: '竞技双板', size: '170cm', dailyPrice: 180, stock: 12, gender: 'unisex' },
  { id: 'e6', type: 'ski', brand: 'Salomon', model: '自由式双板', size: '160cm', dailyPrice: 160, stock: 10, gender: 'unisex' },
  { id: 'e7', type: 'helmet', brand: 'Giro', model: '经典款', size: 'M', dailyPrice: 30, stock: 40, gender: 'unisex' },
  { id: 'e8', type: 'helmet', brand: 'Smith', model: '竞速款', size: 'L', dailyPrice: 40, stock: 25, gender: 'unisex' },
  { id: 'e9', type: 'helmet', brand: 'POC', model: '自由式款', size: 'L', dailyPrice: 45, stock: 18, gender: 'unisex' },
  { id: 'e10', type: 'boots', brand: 'Burton', model: '单板靴', size: '42', dailyPrice: 60, stock: 30, gender: 'male' },
  { id: 'e11', type: 'boots', brand: 'ThirtyTwo', model: '单板靴', size: '39', dailyPrice: 55, stock: 25, gender: 'female' },
  { id: 'e12', type: 'boots', brand: 'Dalbello', model: '双板靴', size: '41', dailyPrice: 65, stock: 28, gender: 'unisex' },
  { id: 'e13', type: 'jacket', brand: 'The North Face', model: '冲锋衣', size: 'M', dailyPrice: 50, stock: 20, gender: 'male' },
  { id: 'e14', type: 'jacket', brand: 'Columbia', model: '滑雪服', size: 'S', dailyPrice: 45, stock: 15, gender: 'female' },
  { id: 'e15', type: 'jacket', brand: 'Patagonia', model: '羽绒服', size: 'L', dailyPrice: 60, stock: 12, gender: 'unisex' },
  { id: 'e16', type: 'pants', brand: 'The North Face', model: '滑雪裤', size: 'M', dailyPrice: 40, stock: 25, gender: 'male' },
  { id: 'e17', type: 'pants', brand: 'Arc\'teryx', model: '冲锋裤', size: 'S', dailyPrice: 55, stock: 18, gender: 'female' },
  { id: 'e18', type: 'pants', brand: 'Volcom', model: '背带裤', size: 'L', dailyPrice: 50, stock: 15, gender: 'unisex' },
];

const sizeRecommendation = {
  snowboard: (height: number) => {
    const cm = height;
    if (cm < 160) return '140-150cm';
    if (cm < 175) return '150-155cm';
    if (cm < 185) return '155-160cm';
    return '160-165cm';
  },
  ski: (height: number) => {
    const cm = height;
    if (cm < 160) return '150-155cm';
    if (cm < 175) return '155-165cm';
    if (cm < 185) return '165-175cm';
    return '175-180cm';
  },
  helmet: (weight: number) => {
    const kg = weight;
    if (kg < 55) return 'S';
    if (kg < 75) return 'M';
    if (kg < 90) return 'L';
    return 'XL';
  },
  boots: (height: number) => {
    const cm = height;
    if (cm < 165) return '38-40';
    if (cm < 175) return '40-42';
    if (cm < 185) return '42-44';
    return '44-45';
  },
  jacket: (height: number, weight: number) => {
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 20) return 'S';
    if (bmi < 24) return 'M';
    if (bmi < 28) return 'L';
    return 'XL';
  },
  pants: (height: number, weight: number) => {
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 20) return 'S';
    if (bmi < 24) return 'M';
    if (bmi < 28) return 'L';
    return 'XL';
  },
};

export default function Rentals() {
  const [activeTab, setActiveTab] = useState<EquipmentTab>('snowboard');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredEquipment = mockEquipment.filter((e) => e.type === activeTab);

  const recommendedSize = sizeRecommendation[activeTab]?.(height, weight) || 'M';

  const addToCart = (equipment: Equipment) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === equipment.id);
      if (existing) {
        return prev.map((c) =>
          c.id === equipment.id ? { ...c, quantity: Math.min(c.quantity + 1, equipment.stock) } : c
        );
      }
      return [...prev, { ...equipment, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === id
            ? { ...c, quantity: Math.max(0, Math.min(c.quantity + delta, c.stock)) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalPrice = cart.reduce((sum, c) => sum + c.dailyPrice * c.quantity, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleSubmit = () => {
    if (cart.length === 0) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowCart(false);
      setCart([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          智能尺码推荐
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-sky-50 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-secondary">身高</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="150"
                max="200"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="flex-1 h-2 bg-secondary/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="w-16 text-right font-bold text-lg text-secondary">{height}cm</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-sky-50 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Weight className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-secondary">体重</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="40"
                max="120"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="flex-1 h-2 bg-secondary/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="w-16 text-right font-bold text-lg text-secondary">{weight}kg</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-secondary">推荐尺码</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {recommendedSize}
              </span>
              <span className="text-xs text-secondary/50">适用于当前{tabConfig.find((t) => t.key === activeTab)?.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-2 border border-white/60 shadow-lg">
        <div className="flex gap-2 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 min-w-[90px] py-3 px-4 rounded-2xl font-medium transition-all duration-200 whitespace-nowrap',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((equipment) => {
          const inCart = cart.find((c) => c.id === equipment.id);
          const isRecommended = equipment.size.includes(recommendedSize.split('-')[0]) || equipment.size === recommendedSize;

          return (
            <div
              key={equipment.id}
              className={cn(
                'relative bg-white/70 backdrop-blur-xl rounded-3xl p-5 border-2 transition-all duration-300 hover:shadow-xl',
                isRecommended ? 'border-amber-300 shadow-lg shadow-amber-200/30' : 'border-white/60 hover:border-primary/30'
              )}
            >
              {isRecommended && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  推荐
                </div>
              )}

              <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-sky-100 flex items-center justify-center mb-4">
                <Snowflake className="w-12 h-12 text-primary/40" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-secondary">{equipment.brand}</h4>
                  {equipment.gender && equipment.gender !== 'unisex' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary/60">
                      {equipment.gender === 'male' ? '男款' : '女款'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary/60">{equipment.model}</p>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    {equipment.size}
                  </span>
                  <span className={cn(
                    'text-sm',
                    equipment.stock > 5 ? 'text-success' : equipment.stock > 0 ? 'text-warning' : 'text-danger'
                  )}>
                    库存 {equipment.stock} 件
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                    ¥{equipment.dailyPrice}
                  </span>
                  <span className="text-xs text-secondary/50">/天</span>
                </div>

                {inCart ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(equipment.id, -1)}
                      className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-secondary">{inCart.quantity}</span>
                    <button
                      onClick={() => updateQuantity(equipment.id, 1)}
                      disabled={inCart.quantity >= equipment.stock}
                      className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(equipment)}
                    disabled={equipment.stock === 0}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    加入清单
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 text-white font-semibold shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            查看租赁清单
            <span className="text-lg font-bold">¥{totalPrice}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {showCart && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-secondary/40 backdrop-blur-sm"
          onClick={() => !showSuccess && setShowCart(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[85vh] overflow-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-success-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-success/30">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">预约成功！</h3>
                <p className="text-secondary/60">请凭订单号到雪具租赁处领取</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 bg-white/95 backdrop-blur-xl p-5 border-b border-secondary/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    租赁清单
                  </h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 rounded-xl hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-sky-100 flex items-center justify-center flex-shrink-0">
                        <Snowflake className="w-7 h-7 text-primary/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-secondary">{item.brand} {item.model}</h4>
                        <p className="text-sm text-secondary/50">{item.size}</p>
                        <p className="text-sm font-bold text-primary">¥{item.dailyPrice}/天</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary hover:bg-secondary/10 transition-colors border border-secondary/10"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-medium text-secondary">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg text-danger hover:bg-danger/10 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-secondary/10 space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-sky-50 border border-primary/10">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary/60">
                        请在滑雪当日凭订单到雪具大厅租赁处领取，押金将在归还时退还
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-secondary/60">共 {totalItems} 件</span>
                    <div>
                      <span className="text-sm text-secondary/50">合计：</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                        ¥{totalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-500 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    提交预约
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
