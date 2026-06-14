import { NavLink, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Ticket,
  UserCheck,
  Mountain,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  PackagePlus,
  PackageMinus,
  Package,
  LifeBuoy,
  FileBarChart,
  Snowflake,
  ChevronRight,
  Ticket as TicketIcon,
  User as UserIcon,
  Package as PackageIcon,
} from 'lucide-react'
import { useAuthStore, getRoleName } from '@/store/authStore'
import type { UserRole } from '@shared/types'

interface MenuItem {
  path: string
  label: string
  icon: LucideIcon
  children?: MenuItem[]
}

const menuConfigs: Record<UserRole, MenuItem[]> = {
  visitor: [
    {
      path: '/visitor/dashboard',
      label: '首页',
      icon: LayoutDashboard,
    },
    {
      path: '/visitor/tickets',
      label: '票务中心',
      icon: Ticket,
      children: [
        { path: '/visitor/tickets', label: '购票', icon: TicketIcon },
        { path: '/visitor/tickets/mine', label: '我的雪票', icon: Ticket },
      ],
    },
    {
      path: '/visitor/coaches',
      label: '教练服务',
      icon: UserCheck,
      children: [
        { path: '/visitor/coaches', label: '教练列表', icon: UserCheck },
        { path: '/visitor/coaches/my', label: '我的教练', icon: UserIcon },
      ],
    },
    {
      path: '/visitor/rentals',
      label: '雪具租赁',
      icon: Package,
      children: [
        { path: '/visitor/rentals', label: '租赁雪具', icon: PackageIcon },
        { path: '/visitor/rentals/my', label: '我的租赁', icon: Package },
      ],
    },
    {
      path: '/visitor/slopes',
      label: '雪道地图',
      icon: Mountain,
    },
    {
      path: '/visitor/sos',
      label: '紧急救援',
      icon: AlertTriangle,
    },
  ],
  coach: [
    {
      path: '/coach/dashboard',
      label: '工作台',
      icon: LayoutDashboard,
    },
    {
      path: '/coach/schedule',
      label: '日程安排',
      icon: Calendar,
    },
    {
      path: '/coach/checkin',
      label: '学员打卡',
      icon: CheckCircle2,
    },
    {
      path: '/coach/income',
      label: '收入统计',
      icon: DollarSign,
    },
  ],
  rental_admin: [
    {
      path: '/rental/dashboard',
      label: '工作台',
      icon: LayoutDashboard,
    },
    {
      path: '/rental/lend',
      label: '雪具出借',
      icon: PackagePlus,
    },
    {
      path: '/rental/return',
      label: '雪具归还',
      icon: PackageMinus,
    },
    {
      path: '/rental/inventory',
      label: '库存管理',
      icon: Package,
    },
  ],
  manager: [
    {
      path: '/manager/dashboard',
      label: '运营概览',
      icon: LayoutDashboard,
    },
    {
      path: '/manager/slopes',
      label: '雪道管理',
      icon: Mountain,
    },
    {
      path: '/manager/rescue',
      label: '救援调度',
      icon: LifeBuoy,
    },
  ],
  finance: [
    {
      path: '/finance/dashboard',
      label: '财务概览',
      icon: LayoutDashboard,
    },
    {
      path: '/finance/reports',
      label: '财务报表',
      icon: FileBarChart,
    },
  ],
}

export default function Sidebar() {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) return null

  const menuItems = menuConfigs[user.role]

  const isChildActive = (item: MenuItem): boolean => {
    if (!item.children) return location.pathname === item.path
    return item.children.some((child) => location.pathname === child.path || location.pathname.startsWith(child.path + '/'))
  }

  const isParentActive = (item: MenuItem): boolean => {
    if (!item.children) return location.pathname === item.path
    return item.children.some((child) => location.pathname === child.path || location.pathname.startsWith(child.path + '/'))
  }

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-primary/10 flex flex-col shadow-lg">
      <div className="p-6 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Snowflake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">雪域云天</h1>
            <p className="text-xs text-secondary-500">滑雪场管理系统</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-primary/10">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-800 truncate">{user.name}</p>
              <p className="text-xs text-primary-600 font-medium">{getRoleName(user.role)}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.path}>
            {item.children ? (
              <div>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isParentActive(item)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isParentActive(item) ? 'text-primary-600' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${isChildActive(item) ? 'rotate-90 text-primary-500' : 'text-secondary-400'}`}
                  />
                </div>
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 ml-8 pl-2 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-primary-600 bg-primary-50 font-medium'
                          : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                      }`
                    }
                  >
                    <child.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{child.label}</span>
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-md shadow-primary/30'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-xl p-4 border border-primary/10">
          <p className="text-xs text-secondary-500 mb-1">系统版本</p>
          <p className="text-sm font-semibold text-primary-700">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
