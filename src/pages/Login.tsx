import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Snowflake,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  Info,
  X,
  Mountain,
  Users,
  Wrench,
  BarChart3,
  Wallet,
} from 'lucide-react';
import {
  useAuthStore,
  type UserRole,
  roleLabels,
  roleDescriptions,
} from '@/store/authStore';
import { cn } from '@/lib/utils';

const roleIcons: Record<UserRole, typeof Mountain> = {
  visitor: Users,
  coach: Mountain,
  rental_admin: Wrench,
  manager: BarChart3,
  finance: Wallet,
};

const roleGradientColors: Record<UserRole, string> = {
  visitor: 'from-sky-400 to-blue-500',
  coach: 'from-emerald-400 to-teal-500',
  rental_admin: 'from-amber-400 to-orange-500',
  manager: 'from-violet-400 to-purple-500',
  finance: 'from-rose-400 to-pink-500',
};

const demoAccounts: { role: UserRole; username: string; password: string }[] = [
  { role: 'visitor', username: 'visitor', password: '123456' },
  { role: 'coach', username: 'coach', password: '123456' },
  { role: 'rental_admin', username: 'rental', password: '123456' },
  { role: 'manager', username: 'manager', password: '123456' },
  { role: 'finance', username: 'finance', password: '123456' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('visitor');
  const [username, setUsername] = useState('visitor');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/visitor/dashboard';

  useEffect(() => {
    setMounted(true);
    const account = demoAccounts.find((a) => a.role === selectedRole);
    if (account) {
      setUsername(account.username);
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(username, password, selectedRole);
    navigate(from, { replace: true });
  };

  const handleDemoLogin = async (role: UserRole) => {
    const account = demoAccounts.find((a) => a.role === role);
    if (account) {
      setSelectedRole(role);
      setUsername(account.username);
      setPassword(account.password);
      setShowDemo(false);
      await login(account.username, account.password, role);
      navigate('/visitor/dashboard', { replace: true });
    }
  };

  const roles: UserRole[] = ['visitor', 'coach', 'rental_admin', 'manager', 'finance'];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100" />

      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-96"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="snow1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>
        </defs>
        <path
          d="M0,400 L0,280 L200,120 L350,220 L500,80 L700,200 L900,100 L1100,180 L1300,60 L1440,160 L1440,400 Z"
          fill="url(#mountain1)"
          opacity="0.6"
        />
        <path
          d="M0,400 L0,320 L150,200 L350,300 L550,160 L750,260 L950,180 L1150,280 L1350,140 L1440,240 L1440,400 Z"
          fill="url(#mountain2)"
          opacity="0.5"
        />
        <path
          d="M200,120 L180,140 L220,140 Z"
          fill="url(#snow1)"
          opacity="0.9"
        />
        <path
          d="M500,80 L480,110 L520,110 Z"
          fill="url(#snow1)"
          opacity="0.9"
        />
        <path
          d="M900,100 L880,130 L920,130 Z"
          fill="url(#snow1)"
          opacity="0.9"
        />
        <path
          d="M1300,60 L1275,95 L1325,95 Z"
          fill="url(#snow1)"
          opacity="0.9"
        />
      </svg>

      <div className="absolute top-20 left-10 w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute top-32 right-20 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-48 left-1/4 w-2.5 h-2.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-1/3 w-3.5 h-3.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-80 left-20 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />

      <div
        className={cn(
          'relative z-10 w-full max-w-2xl transition-all duration-700 transform',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 shadow-2xl shadow-primary/40 mb-4 group-hover:scale-110 transition-transform">
            <Snowflake className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            雪域智慧滑雪场运营管理系统
          </h1>
          <p className="text-secondary/50">智能 · 高效 · 安全</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary/70 mb-3">
              选择登录角色
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {roles.map((role) => {
                const Icon = roleIcons[role];
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'relative group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden',
                      isActive
                        ? 'border-transparent bg-white shadow-lg shadow-primary/20 scale-105'
                        : 'border-white/60 bg-white/40 hover:bg-white/70 hover:shadow-md'
                    )}
                  >
                    {isActive && (
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-10',
                          roleGradientColors[role]
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                        isActive
                          ? `bg-gradient-to-br ${roleGradientColors[role]} text-white shadow-md`
                          : 'bg-secondary/5 text-secondary/50 group-hover:bg-primary/10 group-hover:text-primary'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors',
                        isActive ? 'text-secondary' : 'text-secondary/60'
                      )}
                    >
                      {roleLabels[role]}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-primary/70 text-center leading-tight px-1">
                        {roleDescriptions[role]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary/70 mb-2">
                账号
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-primary/20 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary/70 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/80 border border-primary/20 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  登录系统
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/10">
            <button
              onClick={() => setShowDemo(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 font-medium hover:from-amber-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              查看演示账号
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-secondary/40 mt-6">
          © 2024 雪域智慧滑雪场 · 智能运营管理系统
        </p>
      </div>

      {showDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-in slide-in-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary">演示账号</h3>
                <p className="text-sm text-secondary/50">点击角色快速登录体验</p>
              </div>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((account) => {
                const Icon = roleIcons[account.role];
                return (
                  <button
                    key={account.role}
                    onClick={() => handleDemoLogin(account.role)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/60 hover:bg-white border border-white/80 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md',
                        roleGradientColors[account.role]
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-secondary">{roleLabels[account.role]}</p>
                      <p className="text-sm text-secondary/50">
                        账号：{account.username} · 密码：{account.password}
                      </p>
                    </div>
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <LogIn className="w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
