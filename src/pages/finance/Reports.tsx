import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  FileBarChart,
  Download,
  Smartphone,
  ChevronDown,
  Mountain,
  User,
  Snowflake,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const slopeRevenue = [
  { rank: 1, name: "玉兰道", revenue: 128500, visitors: 2150, avg: 59.77, growth: 15.2 },
  { rank: 2, name: "梅花园", revenue: 115800, visitors: 1980, avg: 58.48, growth: 12.8 },
  { rank: 3, name: "松涛道", revenue: 98600, visitors: 1720, avg: 57.33, growth: 8.6 },
  { rank: 4, name: "翠竹道", revenue: 89200, visitors: 1480, avg: 60.27, growth: 18.5 },
  { rank: 5, name: "幽兰谷", revenue: 76500, visitors: 1250, avg: 61.20, growth: 22.3 },
  { rank: 6, name: "金桂坡", revenue: 65800, visitors: 980, avg: 67.14, growth: -5.2 },
  { rank: 7, name: "雪莲峰", revenue: 54200, visitors: 720, avg: 75.28, growth: 28.6 },
  { rank: 8, name: "风云岭", revenue: 42800, visitors: 560, avg: 76.43, growth: 19.8 },
];

const coachRevenue = [
  { rank: 1, name: "刘雪峰", level: "国家级", bookings: 86, revenue: 51600, rating: 4.9, growth: 25.3 },
  { rank: 2, name: "王晓冰", level: "高级", bookings: 72, revenue: 32400, rating: 4.8, growth: 18.6 },
  { rank: 3, name: "赵玉龙", level: "高级", bookings: 65, revenue: 29250, rating: 4.7, growth: 12.4 },
  { rank: 4, name: "孙红梅", level: "中级", bookings: 58, revenue: 17400, rating: 4.8, growth: 8.9 },
  { rank: 5, name: "周鹏飞", level: "中级", bookings: 52, revenue: 15600, rating: 4.6, growth: 15.2 },
  { rank: 6, name: "吴雅婷", level: "中级", bookings: 48, revenue: 14400, rating: 4.7, growth: 22.1 },
  { rank: 7, name: "郑浩然", level: "初级", bookings: 35, revenue: 7000, rating: 4.5, growth: -3.5 },
  { rank: 8, name: "冯雪琴", level: "初级", bookings: 28, revenue: 5600, rating: 4.4, growth: 5.8 },
];

const equipmentStats = [
  { type: "双板滑雪板", total: 50, rented: 32, damaged: 3, maintenance: 2, utilization: 64, lossRate: 10 },
  { type: "单板滑雪板", total: 40, rented: 28, damaged: 2, maintenance: 1, utilization: 70, lossRate: 7.5 },
  { type: "滑雪靴", total: 60, rented: 45, damaged: 4, maintenance: 3, utilization: 75, lossRate: 11.7 },
  { type: "头盔", total: 60, rented: 42, damaged: 1, maintenance: 2, utilization: 70, lossRate: 5 },
  { type: "滑雪服", total: 45, rented: 30, damaged: 5, maintenance: 3, utilization: 66.7, lossRate: 17.8 },
  { type: "滑雪裤", total: 45, rented: 28, damaged: 3, maintenance: 2, utilization: 62.2, lossRate: 11.1 },
];

const monthlyComparison = [
  { month: "本月", ticket: 456800, coach: 168500, rental: 125600, damage: 39100, total: 790000 },
  { month: "上月", ticket: 398500, coach: 145200, rental: 132800, damage: 33800, total: 710300 },
  { month: "去年同期", ticket: 385200, coach: 128500, rental: 108600, damage: 42500, total: 664800 },
];

const months = [
  "2024年1月",
  "2024年2月",
  "2024年3月",
  "2024年4月",
  "2024年5月",
  "2024年6月",
];

export default function FinanceReports() {
  const [selectedMonth, setSelectedMonth] = useState("2024年6月");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showPushToast, setShowPushToast] = useState(false);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const handlePush = () => {
    setShowPushToast(true);
    setTimeout(() => setShowPushToast(false), 3000);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-br from-slate-300 to-slate-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
    return "bg-slate-700 text-slate-300";
  };

  return (
    <MainLayout
      title="运营报表"
      subtitle="查看和导出滑雪场各类运营数据报表"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary/30">
              <FileBarChart className="w-6 h-6 text-primary-400" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:border-primary/30 transition-colors"
              >
                <Calendar className="w-4 h-4 text-primary-400" />
                <span className="font-medium">{selectedMonth}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    showMonthDropdown && "rotate-180"
                  )}
                />
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl bg-slate-800 border border-white/10 shadow-xl overflow-hidden z-10">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month);
                        setShowMonthDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                        selectedMonth === month
                          ? "bg-primary-500/20 text-primary-400"
                          : "text-slate-300 hover:bg-white/5"
                      )}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePush}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-medium">推送至手机端</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>导出报表</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">各雪道收入排行</h3>
              </div>
              <span className="text-sm text-slate-400">TOP 8</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-slate-400 py-3 px-2">
                      排名
                    </th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 px-2">
                      雪道
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      收入
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      客流
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      同比
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slopeRevenue.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold",
                            getRankBadge(item.rank)
                          )}
                        >
                          {item.rank}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-white font-medium">
                        ¥{item.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-slate-300">
                        {item.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div
                          className={cn(
                            "inline-flex items-center gap-0.5 text-xs font-medium",
                            item.growth >= 0 ? "text-success-400" : "text-danger-400"
                          )}
                        >
                          {item.growth >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(item.growth)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-success-400" />
                <h3 className="text-lg font-bold text-white">教练收入排行</h3>
              </div>
              <span className="text-sm text-slate-400">TOP 8</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-slate-400 py-3 px-2">
                      排名
                    </th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 px-2">
                      教练
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      课时
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      收入
                    </th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-2">
                      同比
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coachRevenue.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold",
                            getRankBadge(item.rank)
                          )}
                        >
                          {item.rank}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm font-medium text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.level}</p>
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-slate-300">
                        {item.bookings} 节
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-white font-medium">
                        ¥{item.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div
                          className={cn(
                            "inline-flex items-center gap-0.5 text-xs font-medium",
                            item.growth >= 0 ? "text-success-400" : "text-danger-400"
                          )}
                        >
                          {item.growth >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(item.growth)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-warning-400" />
              <h3 className="text-lg font-bold text-white">雪具租赁损耗统计</h3>
            </div>
            <span className="text-sm text-slate-400">本月数据</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">
                    雪具类型
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    总数
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    在租
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    损坏
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    维护中
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    利用率
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    损耗率
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipmentStats.map((item) => (
                  <tr
                    key={item.type}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-white">
                      {item.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-slate-300">
                      {item.total}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-primary-400 font-medium">
                      {item.rented}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-danger-400">
                      {item.damaged}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-warning-400">
                      {item.maintenance}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                            style={{ width: `${item.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm text-white font-medium w-12">
                          {item.utilization}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              item.lossRate > 15
                                ? "bg-gradient-to-r from-danger-600 to-danger-400"
                                : item.lossRate > 10
                                ? "bg-gradient-to-r from-warning-600 to-warning-400"
                                : "bg-gradient-to-r from-success-600 to-success-400"
                            )}
                            style={{ width: `${item.lossRate * 3}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium w-12",
                            item.lossRate > 15
                              ? "text-danger-400"
                              : item.lossRate > 10
                              ? "text-warning-400"
                              : "text-success-400"
                          )}
                        >
                          {item.lossRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">收入趋势对比</h3>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-400" />
                <span className="text-slate-400">本月</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-400" />
                <span className="text-slate-400">上月</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-slate-400">去年同期</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">
                    周期
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">
                    票务收入
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">
                    教练收入
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">
                    租赁收入
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">
                    赔偿收入
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">
                    总收入
                  </th>
                  <th className="text-center text-xs font-medium text-slate-400 py-3 px-4">
                    环比
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyComparison.map((item, index) => {
                  const diff =
                    index > 0
                      ? ((item.total - monthlyComparison[index - 1].total) /
                          monthlyComparison[index - 1].total) *
                        100
                      : null;
                  return (
                    <tr
                      key={item.month}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "font-medium",
                            index === 0 ? "text-primary-400 text-base" : "text-white text-sm"
                          )}
                        >
                          {item.month}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-slate-300">
                        ¥{item.ticket.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-slate-300">
                        ¥{item.coach.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-slate-300">
                        ¥{item.rental.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-slate-300">
                        ¥{item.damage.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-white font-bold">
                        ¥{item.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {diff !== null ? (
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full",
                              diff >= 0
                                ? "bg-success-500/20 text-success-400"
                                : "bg-danger-500/20 text-danger-400"
                            )}
                          >
                            {diff >= 0 ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {diff >= 0 ? "+" : ""}
                            {diff.toFixed(1)}%
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-success-500/90 text-white shadow-xl backdrop-blur-xl">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">报表已成功导出并开始下载</span>
          </div>
        </div>
      )}

      {showPushToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary-500/90 text-white shadow-xl backdrop-blur-xl">
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">报表已推送至您的手机端</span>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
