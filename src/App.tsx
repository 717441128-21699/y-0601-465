import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore, type UserRole } from "@/store/authStore";
import Home from "@/pages/Home";
import MainLayout from "@/components/layout/MainLayout";
import CoachDashboard from "@/pages/coach/Dashboard";
import CoachSchedule from "@/pages/coach/Schedule";
import CoachCheckIn from "@/pages/coach/CheckIn";
import CoachIncome from "@/pages/coach/Income";
import RentalDashboard from "@/pages/rental/Dashboard";
import RentalLend from "@/pages/rental/Lend";
import RentalReturn from "@/pages/rental/Return";
import RentalInventory from "@/pages/rental/Inventory";

interface RouteConfig {
  path: string;
  element: ReactNode;
  roles?: UserRole[];
  requiresAuth?: boolean;
}

function RequireAuth({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const allRoles: UserRole[] = ["visitor", "coach", "rental_admin", "manager", "finance"];
const coachRoles: UserRole[] = ["coach", "manager"];
const rentalRoles: UserRole[] = ["rental_admin", "manager"];
const managerRoles: UserRole[] = ["manager"];

const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PublicOnly>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">登录页面</h1>
            <p className="text-secondary/60">登录页面 - Coming Soon</p>
          </div>
        </div>
      </PublicOnly>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnly>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">注册页面</h1>
            <p className="text-secondary/60">注册页面 - Coming Soon</p>
          </div>
        </div>
      </PublicOnly>
    ),
  },

  {
    path: "/tickets",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
          <h1 className="text-2xl font-bold text-secondary mb-4">票务中心</h1>
          <p className="text-secondary/60">票务中心 - Coming Soon</p>
        </div>
      </div>
    ),
  },
  {
    path: "/tickets/:id",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
          <h1 className="text-2xl font-bold text-secondary mb-4">票务详情</h1>
          <p className="text-secondary/60">票务详情 - Coming Soon</p>
        </div>
      </div>
    ),
  },

  {
    path: "/coaches",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
          <h1 className="text-2xl font-bold text-secondary mb-4">教练列表</h1>
          <p className="text-secondary/60">教练列表 - Coming Soon</p>
        </div>
      </div>
    ),
  },
  {
    path: "/coaches/:id",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
          <h1 className="text-2xl font-bold text-secondary mb-4">教练详情</h1>
          <p className="text-secondary/60">教练详情 - Coming Soon</p>
        </div>
      </div>
    ),
  },

  {
    path: "/equipment",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
          <h1 className="text-2xl font-bold text-secondary mb-4">装备租赁</h1>
          <p className="text-secondary/60">装备租赁 - Coming Soon</p>
        </div>
      </div>
    ),
  },

  {
    path: "/orders",
    requiresAuth: true,
    roles: allRoles,
    element: (
      <RequireAuth allowedRoles={allRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">我的订单</h1>
            <p className="text-secondary/60">我的订单 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },

  {
    path: "/profile",
    requiresAuth: true,
    roles: allRoles,
    element: (
      <RequireAuth allowedRoles={allRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">个人中心</h1>
            <p className="text-secondary/60">个人中心 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },

  {
    path: "/messages",
    requiresAuth: true,
    roles: allRoles,
    element: (
      <RequireAuth allowedRoles={allRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">消息中心</h1>
            <p className="text-secondary/60">消息中心 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },

  {
    path: "/admin/dashboard",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 数据概览
            </h1>
            <p className="text-secondary/60">数据概览 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/tickets",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 票务管理
            </h1>
            <p className="text-secondary/60">票务管理 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/coaches",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 教练管理
            </h1>
            <p className="text-secondary/60">教练管理 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/equipment",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 装备管理
            </h1>
            <p className="text-secondary/60">装备管理 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/users",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 用户管理
            </h1>
            <p className="text-secondary/60">用户管理 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/orders",
    requiresAuth: true,
    roles: managerRoles,
    element: (
      <RequireAuth allowedRoles={managerRoles}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-primary/20">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              管理后台 - 订单管理
            </h1>
            <p className="text-secondary/60">订单管理 - Coming Soon</p>
          </div>
        </div>
      </RequireAuth>
    ),
  },

  {
    path: "/403",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-danger/20 text-center">
          <h1 className="text-4xl font-bold text-danger mb-4">403</h1>
          <p className="text-secondary/70 mb-4">
            抱歉，您没有权限访问此页面
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    ),
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-warning/20 text-center">
          <h1 className="text-4xl font-bold text-warning mb-4">404</h1>
          <p className="text-secondary/70 mb-4">抱歉，您访问的页面不存在</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    ),
  },
];

export default function App() {
  return (
    <div className="relative z-10 min-h-screen">
      <Routes>
        <Route
          path="/coach"
          element={
            <RequireAuth allowedRoles={coachRoles}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<CoachDashboard />} />
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
          <Route index element={<RentalDashboard />} />
          <Route path="dashboard" element={<RentalDashboard />} />
          <Route path="lend" element={<RentalLend />} />
          <Route path="return" element={<RentalReturn />} />
          <Route path="inventory" element={<RentalInventory />} />
        </Route>

        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </div>
  );
}
