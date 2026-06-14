import { useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import SOSButton from './SOSButton'
import MessageCenter from './MessageCenter'
import { useAuthStore } from '@/store/authStore'

interface MainLayoutProps {
  children?: ReactNode
  title?: string
  subtitle?: string
}

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const { user } = useAuthStore()
  const [messageOpen, setMessageOpen] = useState(false)

  const unreadCount = 2

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMessageClick={() => setMessageOpen(true)}
          unreadCount={unreadCount}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-6 overflow-auto">
          {children ?? <Outlet />}
        </main>
      </div>

      {user?.role === 'visitor' && <SOSButton />}

      <MessageCenter
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
      />
    </div>
  )
}
