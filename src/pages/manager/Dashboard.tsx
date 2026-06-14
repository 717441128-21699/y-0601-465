import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Users,
  Snowflake,
  Mountain,
  AlertTriangle,
  TrendingUp,
  Ticket,
  Calendar,
  Phone,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: typeof Users;
  trend?: string;
  trendUp?: boolean;
  color: "blue" | "green" | "orange" | "red";
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: "from-primary-500/20 to-primary-600/20 text-primary-400 border-primary/30",
    green:
      "from-success-500/20 to-success-600/20 text-success-400 border-success/30",
    orange:
      "from-warning-500/20 to-warning-600/20 text-warning-400 border-warning/30",
    red: "from-danger-500/20 to-danger-600/20 text-danger-400 border-danger/30",
  };

  const glowClasses = {
    blue: "shadow-primary-500/20",
    green: "shadow-success-500/20",
    orange: "shadow-warning-500/20",
    red: "shadow-danger-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]",
        colorClasses[color],
        "bg-slate-800/50 shadow-xl",
        glowClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="mt-2 text-4xl font-bold text-white">{value}</p>
          {trend && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
                trendUp ? "text-success-400" : "text-danger-400"
              )}
            >
              <TrendingUp
                className={cn(
                  "w-3 h-3",
                  !trendUp && "rotate-180"
                )}
              />
              {trend}
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            colorClasses[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div
        className={cn(
          "absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br",
          colorClasses[color]
        )}
      />
    </div>
  );
}

interface TimelineEvent {
  id: string;
  type: "ticket" | "booking" | "rescue" | "system";
  title: string;
  content: string;
  time: string;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "ticket",
    title: "新购票订单",
    content: "用户李明辉购买全天雪票 ¥308",
    time: "2分钟前",
  },
  {
    id: "2",
    type: "booking",
    title: "教练预约确认",
    content: "张伟教练确认 14:00-16:00 课程",
    time: "8分钟前",
  },
  {
    id: "3",
    type: "rescue",
    title: "救援请求",
    content: "幽兰谷雪道游客呼救 - 脚踝疑似扭伤",
    time: "15分钟前",
  },
  {
    id: "4",
    type: "ticket",
    title: "票务核销",
    content: "票号 TICKET-20240615-00023 已核销",
    time: "25分钟前",
  },
  {
    id: "5",
    type: "system",
    title: "雪道状态变更",
    content: "雪莲峰雪道状态更新为【谨慎开放】",
    time: "45分钟前",
  },
  {
    id: "6",
    type: "booking",
    title: "课程完成",
    content: "王教练上午课程已完成，获得5星好评",
    time: "1小时前",
  },
];

const mockSlopes = [
  { id: "1", name: "玉兰道", status: "open", people: 85, capacity: 200 },
  { id: "2", name: "梅花园", status: "open", people: 120, capacity: 220 },
  { id: "3", name: "松涛道", status: "open", people: 95, capacity: 250 },
  { id: "4", name: "翠竹道", status: "open", people: 110, capacity: 180 },
  { id: "5", name: "幽兰谷", status: "open", people: 78, capacity: 200 },
  { id: "6", name: "金桂坡", status: "caution", people: 45, capacity: 220 },
  { id: "7", name: "雪莲峰", status: "caution", people: 30, capacity: 120 },
  { id: "8", name: "冰瀑崖", status: "closed", people: 0, capacity: 100 },
  { id: "9", name: "风云岭", status: "open", people: 65, capacity: 110 },
  { id: "10", name: "龙腾道", status: "open", people: 28, capacity: 60 },
  { id: "11", name: "虎跳峡", status: "open", people: 18, capacity: 50 },
  { id: "12", name: "鹰喙峰", status: "closed", people: 0, capacity: 40 },
];

const mockFlowData = [
  { time: "08:00", count: 45 },
  { time: "09:00", count: 128 },
  { time: "10:00", count: 256 },
  { time: "11:00", count: 389 },
  { time: "12:00", count: 412 },
  { time: "13:00", count: 398 },
  { time: "14:00", count: 445 },
  { time: "15:00", count: 478 },
  { time: "16:00", count: 456 },
  { time: "17:00", count: 389 },
  { time: "18:00", count: 267 },
  { time: "19:00", count: 156 },
];

function FlowChart() {
  const maxCount = Math.max(...mockFlowData.map((d) => d.count));
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="relative h-[200px] flex items-end gap-2 px-2">
        {mockFlowData.map((item, index) => {
          const height = (item.count / maxCount) * chartHeight;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300 hover:from-primary-500 hover:to-primary-300 relative cursor-pointer"
                style={{ height: `${height}px` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.count} 人
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 px-2">
        {mockFlowData.map((item, index) => (
          <div
            key={index}
            className="flex-1 text-center text-xs text-slate-500"
          >
            {item.time}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalOnSnow = mockSlopes.reduce((sum, s) => sum + s.people, 0);
  const openSlopes = mockSlopes.filter((s) => s.status === "open").length;
  const pendingRescue = 2;

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "ticket":
        return Ticket;
      case "booking":
        return Calendar;
      case "rescue":
        return Phone;
      default:
        return Activity;
    }
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "ticket":
        return "bg-primary-500/20 text-primary-400 border-primary/30";
      case "booking":
        return "bg-success-500/20 text-success-400 border-success/30";
      case "rescue":
        return "bg-danger-500/20 text-danger-400 border-danger/30";
      default:
        return "bg-warning-500/20 text-warning-400 border-warning/30";
    }
  };

  const getSlopeStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-success-500/20 text-success-400 border-success/40";
      case "caution":
        return "bg-warning-500/20 text-warning-400 border-warning/40";
      case "closed":
        return "bg-danger-500/20 text-danger-400 border-danger/40";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate/40";
    }
  };

  const getSlopeStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "开放";
      case "caution":
        return "注意";
      case "closed":
        return "关闭";
      default:
        return status;
    }
  };

  return (
    <MainLayout
      title="运营仪表盘"
      subtitle={`实时监控滑雪场运营数据 · ${currentTime.toLocaleTimeString("zh-CN")}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="今日客流"
            value="1,286"
            icon={Users}
            trend="较昨日 +12.5%"
            trendUp={true}
            color="blue"
          />
          <StatCard
            title="在雪人数"
            value={totalOnSnow}
            icon={Snowflake}
            trend="高峰时段"
            trendUp={true}
            color="green"
          />
          <StatCard
            title="开放雪道"
            value={`${openSlopes}/${mockSlopes.length}`}
            icon={Mountain}
            trend="2条谨慎开放"
            trendUp={false}
            color="orange"
          />
          <StatCard
            title="待处理救援"
            value={pendingRescue}
            icon={AlertTriangle}
            trend="需立即处理"
            trendUp={false}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">实时客流趋势</h3>
                <p className="text-sm text-slate-400">今日每小时客流量统计</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-500/20 text-success-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                实时更新
              </div>
            </div>
            <FlowChart />
          </div>

          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">实时事件动态</h3>
              <p className="text-sm text-slate-400">最新运营事件时间线</p>
            </div>
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
              {mockTimelineEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={event.id} className="flex gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg border h-fit",
                        getEventColor(event.type)
                      )}
                    >
                      <EventIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white truncate">
                          {event.title}
                        </p>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {event.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">雪道状态总览</h3>
              <p className="text-sm text-slate-400">
                各雪道实时状态与客流密度
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-400" />
                <span className="text-slate-400">开放</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning-400" />
                <span className="text-slate-400">谨慎</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger-400" />
                <span className="text-slate-400">关闭</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {mockSlopes.map((slope) => {
              const occupancy =
                slope.capacity > 0
                  ? Math.round((slope.people / slope.capacity) * 100)
                  : 0;
              return (
                <div
                  key={slope.id}
                  className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:bg-slate-900/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-white text-sm">
                      {slope.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        getSlopeStatusColor(slope.status)
                      )}
                    >
                      {getSlopeStatusText(slope.status)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">客流密度</span>
                      <span className="text-white font-medium">
                        {occupancy}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          occupancy > 80
                            ? "bg-gradient-to-r from-danger-500 to-danger-400"
                            : occupancy > 60
                            ? "bg-gradient-to-r from-warning-500 to-warning-400"
                            : "bg-gradient-to-r from-success-500 to-success-400"
                        )}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {slope.people}/{slope.capacity} 人
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
