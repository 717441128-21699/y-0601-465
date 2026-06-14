import MainLayout from "@/components/layout/MainLayout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  User,
  Snowflake,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinanceStatCardProps {
  title: string;
  value: string;
  icon: typeof DollarSign;
  change?: string;
  changeUp?: boolean;
  color: "blue" | "green" | "orange" | "purple";
}

function FinanceStatCard({
  title,
  value,
  icon: Icon,
  change,
  changeUp,
  color,
}: FinanceStatCardProps) {
  const colorClasses = {
    blue: "from-primary-500/20 to-primary-600/20 text-primary-400 border-primary/30",
    green:
      "from-success-500/20 to-success-600/20 text-success-400 border-success/30",
    orange:
      "from-warning-500/20 to-warning-600/20 text-warning-400 border-warning/30",
    purple:
      "from-purple-500/20 to-purple-600/20 text-purple-400 border-purple/30",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]",
        colorClasses[color],
        "bg-slate-800/50"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {change && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
                changeUp ? "text-success-400" : "text-danger-400"
              )}
            >
              {changeUp ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {change}
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

const revenueBreakdown = [
  { name: "票务收入", value: 456800, percentage: 58, color: "#0EA5E9", icon: Ticket },
  { name: "教练收入", value: 168500, percentage: 21, color: "#10B981", icon: User },
  { name: "租赁收入", value: 125600, percentage: 16, color: "#F97316", icon: Snowflake },
  { name: "赔偿收入", value: 39100, percentage: 5, color: "#A855F7", icon: FileWarning },
];

const monthlyRevenue = [
  { month: "1月", revenue: 620000, visitors: 8500 },
  { month: "2月", revenue: 780000, visitors: 11200 },
  { month: "3月", revenue: 540000, visitors: 7200 },
  { month: "4月", revenue: 320000, visitors: 4100 },
  { month: "5月", revenue: 180000, visitors: 2200 },
  { month: "6月", revenue: 790000, visitors: 11800 },
  { month: "7月", revenue: 0, visitors: 0 },
  { month: "8月", revenue: 0, visitors: 0 },
  { month: "9月", revenue: 0, visitors: 0 },
  { month: "10月", revenue: 280000, visitors: 3500 },
  { month: "11月", revenue: 450000, visitors: 5800 },
  { month: "12月", revenue: 680000, visitors: 9200 },
];

const last30Days = [
  { day: "06/16", revenue: 25800 },
  { day: "06/17", revenue: 32100 },
  { day: "06/18", revenue: 28600 },
  { day: "06/19", revenue: 35200 },
  { day: "06/20", revenue: 42800 },
  { day: "06/21", revenue: 48500 },
  { day: "06/22", revenue: 52300 },
  { day: "06/23", revenue: 31200 },
  { day: "06/24", revenue: 27800 },
  { day: "06/25", revenue: 33500 },
  { day: "06/26", revenue: 38900 },
  { day: "06/27", revenue: 45600 },
  { day: "06/28", revenue: 51200 },
  { day: "06/29", revenue: 55800 },
  { day: "06/30", revenue: 49300 },
  { day: "07/01", revenue: 28500 },
  { day: "07/02", revenue: 31800 },
  { day: "07/03", revenue: 36200 },
  { day: "07/04", revenue: 41500 },
  { day: "07/05", revenue: 47800 },
  { day: "07/06", revenue: 53200 },
  { day: "07/07", revenue: 58600 },
  { day: "07/08", revenue: 32400 },
  { day: "07/09", revenue: 29800 },
  { day: "07/10", revenue: 34500 },
  { day: "07/11", revenue: 40200 },
  { day: "07/12", revenue: 46800 },
  { day: "07/13", revenue: 52100 },
  { day: "07/14", revenue: 57300 },
  { day: "07/15", revenue: 62800 },
];

function PieChart() {
  const total = revenueBreakdown.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const paths = revenueBreakdown.map((slice) => {
    const startPercent = cumulativePercent / 100;
    cumulativePercent += slice.percentage;
    const endPercent = cumulativePercent / 100;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = slice.percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      "L 0 0",
    ].join(" ");

    return {
      d: pathData,
      fill: slice.color,
      name: slice.name,
      value: slice.value,
      percentage: slice.percentage,
    };
  });

  return (
    <div className="flex items-center justify-center gap-8">
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-48 h-48 transform -rotate-90">
        {paths.map((path, index) => (
          <path
            key={index}
            d={path.d}
            fill={path.fill}
            stroke="rgba(15, 23, 42, 0.8)"
            strokeWidth="0.02"
          />
        ))}
        <circle cx="0" cy="0" r="0.5" fill="rgba(15, 23, 42, 1)" />
      </svg>
      <div className="space-y-3">
        {revenueBreakdown.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RevenueTrendChart() {
  const maxRevenue = Math.max(...last30Days.map((d) => d.revenue));
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="relative h-[200px] flex items-end gap-0.5 px-1">
        {last30Days.map((item, index) => {
          const height = (item.revenue / maxRevenue) * chartHeight;
          const isToday = index === last30Days.length - 1;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-300",
                  isToday
                    ? "bg-gradient-to-t from-primary-600 to-primary-400"
                    : "bg-gradient-to-t from-primary-600/60 to-primary-400/60 hover:from-primary-500 hover:to-primary-300"
                )}
                style={{ height: `${height}px` }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                ¥{item.revenue.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-1">
        {last30Days
          .filter((_, i) => i % 5 === 0 || i === last30Days.length - 1)
          .map((item, index) => (
            <span key={index} className="text-xs text-slate-500">
              {item.day}
            </span>
          ))}
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  const todayRevenue = 62800;
  const monthRevenue = 790000;
  const monthExpense = 385600;
  const netProfit = monthRevenue - monthExpense;

  return (
    <MainLayout
      title="财务总览"
      subtitle="实时监控滑雪场财务数据与收入趋势"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FinanceStatCard
            title="今日收入"
            value={`¥${todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            change="较昨日 +18.2%"
            changeUp={true}
            color="blue"
          />
          <FinanceStatCard
            title="本月收入"
            value={`¥${monthRevenue.toLocaleString()}`}
            icon={Wallet}
            change="较上月 +12.8%"
            changeUp={true}
            color="green"
          />
          <FinanceStatCard
            title="本月支出"
            value={`¥${monthExpense.toLocaleString()}`}
            icon={TrendingDown}
            change="较上月 -5.3%"
            changeUp={false}
            color="orange"
          />
          <FinanceStatCard
            title="净利润"
            value={`¥${netProfit.toLocaleString()}`}
            icon={PiggyBank}
            change="利润率 51.2%"
            changeUp={true}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">收入构成分析</h3>
                <p className="text-sm text-slate-400">本月各类收入占比</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ¥{monthRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">本月总收入</p>
              </div>
            </div>
            <PieChart />
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    ¥{item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">近30天收入趋势</h3>
                <p className="text-sm text-slate-400">每日收入变化情况</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-success-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+23.5% 增长</span>
              </div>
            </div>
            <RevenueTrendChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">同比环比数据</h3>
            <div className="space-y-4">
              {[
                {
                  name: "票务收入",
                  current: 456800,
                  yoy: 15.2,
                  mom: 8.6,
                  yoyUp: true,
                  momUp: true,
                },
                {
                  name: "教练收入",
                  current: 168500,
                  yoy: 22.8,
                  mom: 12.3,
                  yoyUp: true,
                  momUp: true,
                },
                {
                  name: "租赁收入",
                  current: 125600,
                  yoy: 8.4,
                  mom: -2.1,
                  yoyUp: true,
                  momUp: false,
                },
                {
                  name: "赔偿收入",
                  current: 39100,
                  yoy: -5.6,
                  mom: 15.8,
                  yoyUp: false,
                  momUp: true,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5"
                >
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      ¥{item.current.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">同比</p>
                      <div
                        className={cn(
                          "flex items-center gap-0.5 text-sm font-medium",
                          item.yoyUp ? "text-success-400" : "text-danger-400"
                        )}
                      >
                        {item.yoyUp ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(item.yoy)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">环比</p>
                      <div
                        className={cn(
                          "flex items-center gap-0.5 text-sm font-medium",
                          item.momUp ? "text-success-400" : "text-danger-400"
                        )}
                      >
                        {item.momUp ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(item.mom)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">月度收入对比</h3>
                <p className="text-sm text-slate-400">全年各月收入情况</p>
              </div>
            </div>
            <div className="space-y-3">
              {monthlyRevenue.map((item, index) => {
                const maxRev = Math.max(...monthlyRevenue.map((m) => m.revenue));
                const percentage = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">{item.month}</span>
                      <span className="text-sm font-medium text-white">
                        ¥{item.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          item.revenue > 0
                            ? "bg-gradient-to-r from-primary-600 to-primary-400"
                            : "bg-slate-600"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
