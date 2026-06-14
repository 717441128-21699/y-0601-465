import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore, getRoleDashboardPath, type UserRole } from '@/store/authStore'
import MainLayout from '@/components/layout/MainLayout'
import Login from '@/pages/Login'
import Messages from '@/pages/Messages'

import VisitorDashboard from '@/pages/visitor/Dashboard'
import VisitorTickets from '@/pages/visitor/Tickets'
import VisitorMyTickets from '@/pages/visitor/MyTickets'
import VisitorCoaches from '@/pages/visitor/Coaches'
import VisitorMyBookings from '@/pages/visitor/MyBookings'
import VisitorRentals from '@/pages/visitor/Rentals'
import VisitorMyRentals from '@/pages/visitor/MyRentals'
import VisitorSlopes from '@/pages/visitor/Slopes'
import VisitorSOS from '@/pages/visitor/SOS'

import CoachDashboard from '@/pages/coach/Dashboard'
import CoachSchedule from '@/pages/coach/Schedule'
import CoachCheckIn from '@/pages/coach/CheckIn'
import CoachIncome from '@/pages/coach/Income'

import RentalDashboard from '@/pages/rental/Dashboard'
import RentalLend from '@/pages/rental/Lend'
import RentalReturn from '@/pages/rental/Return'
import RentalInventory from '@/pages/rental/Inventory'

import ManagerDashboard from '@/pages/manager/Dashboard'
import ManagerSlopes from '@/pages/manager/Slopes'
import ManagerRescue from '@/pages/manager/Rescue'

import FinanceDashboard from '@/pages/finance/Dashboard'
import FinanceReports from '@/pages/finance/Reports'

function RequireAuth({
  children,
  allowedRoles,
}: {
  children: ReactNode
  allowedRoles?: UserRole[]
}) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />
  }

  return <>{children}</>
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getRoleDashboardPath(user.role)} replace />
}

const allRoles: UserRole[] = ['visitor', 'coach', 'rental_admin', 'manager', 'finance']
const visitorRoles: UserRole[] = ['visitor']
const coachRoles: UserRole[] = ['coach']
const rentalRoles: UserRole[] = ['rental_admin']
const managerRoles: UserRole[] = ['manager']
const financeRoles: UserRole[] = ['finance']

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-danger/20 text-center">
        <h1 className="text-4xl font-bold text-danger mb-4">403</h1>
        <p className="text-secondary/70 mb-4">抱歉，您没有权限访问此页面</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-warning/20 text-center">
        <h1 className="text-4xl font-bold text-warning mb-4">404</h1>
        <p className="text-secondary/70 mb-4">抱歉，您访问的页面不存在</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative z-10 min-h-screen">
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />

        <Route
          path="/visitor"
          element={
            <RequireAuth allowedRoles={visitorRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/visitor/dashboard" replace />} />
          <Route path="dashboard" element={<VisitorDashboard />} />
          <Route path="tickets" element={<VisitorTickets />} />
          <Route path="tickets/mine" element={<VisitorMyTickets />} />
          <Route path="coaches" element={<VisitorCoaches />} />
          <Route path="coaches/my" element={<VisitorMyBookings />} />
          <Route path="rentals" element={<VisitorRentals />} />
          <Route path="rentals/my" element={<VisitorMyRentals />} />
          <Route path="slopes" element={<VisitorSlopes />} />
          <Route path="sos" element={<VisitorSOS />} />
        </Route>

        <Route
          path="/coach"
          element={
            <RequireAuth allowedRoles={coachRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/coach/dashboard" replace />} />
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="schedule" element={<CoachSchedule />} />
          <Route path="checkin" element={<CoachCheckIn />} />
          <Route path="income" element={<CoachIncome />} />
        </Route>

        <Route
          path="/rental"
          element={
            <RequireAuth allowedRoles={rentalRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/rental/dashboard" replace />} />
          <Route path="dashboard" element={<RentalDashboard />} />
          <Route path="lend" element={<RentalLend />} />
          <Route path="return" element={<RentalReturn />} />
          <Route path="inventory" element={<RentalInventory />} />
        </Route>

        <Route
          path="/manager"
          element={
            <RequireAuth allowedRoles={managerRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="slopes" element={<ManagerSlopes />} />
          <Route path="rescue" element={<ManagerRescue />} />
        </Route>

        <Route
          path="/finance"
          element={
            <RequireAuth allowedRoles={financeRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/finance/dashboard" replace />} />
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="reports" element={<FinanceReports />} />
        </Route>

        <Route
          path="/messages"
          element={
            <RequireAuth allowedRoles={allRoles}>
              <MainLayout>
                <Messages />
              </MainLayout>
            </RequireAuth>
          }
        />

        <Route path="/403" element={<ForbiddenPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
