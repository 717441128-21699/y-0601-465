import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, ChevronDown, MessageSquare } from 'lucide-react'
import { useAuthStore, getRoleName } from '@/store/authStore'

interface TopbarProps {
  onMessageClick: () => void
  unreadCount?: number
  title?: string
  subtitle?: string
}

export default function Topbar({ onMessageClick, unreadCount = 0, title, subtitle }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }

  if (!user) return null

  const displayTitle = title || `${getRoleName(user.role)}工作台`

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-primary/10 flex items-center justify-between px-6 shadow-sm w-full">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary-800">{displayTitle}</h2>
          {subtitle && <p className="text-xs text-secondary-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onMessageClick}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-secondary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('/messages')}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-secondary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full">
              <span className="absolute inset-0 bg-danger rounded-full animate-ping opacity-75"></span>
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-secondary-200 mx-2"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-primary-50 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary/20">
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-secondary-800 leading-tight">{user.name}</p>
              <p className="text-xs text-secondary-500 leading-tight">{getRoleName(user.role)}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-secondary-200/50 border border-primary/10 py-2 animate-fade-in-up z-50">
              <div className="px-4 py-3 border-b border-primary/10">
                <p className="text-sm font-semibold text-secondary-800">{user.name}</p>
                <p className="text-xs text-secondary-500">{getRoleName(user.role)}</p>
                {user.phone && <p className="text-xs text-secondary-400 mt-0.5">{user.phone}</p>}
                {user.employeeId && <p className="text-xs text-secondary-400">工号: {user.employeeId}</p>}
              </div>

              <Link
                to="/messages"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                消息中心
              </Link>

              <div className="h-px bg-secondary-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
