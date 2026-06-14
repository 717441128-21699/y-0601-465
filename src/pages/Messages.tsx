import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Bell,
  Ticket,
  Calendar,
  Snowflake,
  Mountain,
  LifeBuoy,
  PieChart,
  Settings,
  CheckCheck,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  X,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MessageCategory =
  | "all"
  | "ticket"
  | "booking"
  | "rental"
  | "slope"
  | "rescue"
  | "finance"
  | "system";

interface Message {
  id: string;
  category: Exclude<MessageCategory, "all">;
  title: string;
  content: string;
  fullContent: string;
  time: string;
  read: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
  relatedUrl?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    category: "ticket",
    title: "购票成功通知",
    content: "您已成功购买今日全天雪票，票价308元。请在入口处出示电子票二维码...",
    fullContent:
      "尊敬的用户，您已成功购买今日（2024年6月15日）全天雪票，票价308元。\n\n订单号：TICKET-20240615-00023\n票种：成人全天票\n有效期：2024年6月15日\n\n请在入口处出示电子票二维码或订单号进行核销。祝您滑雪愉快！\n\n温馨提示：\n1. 请提前30分钟到达雪场\n2. 请携带有效身份证件\n3. 建议购买意外保险",
    time: "10分钟前",
    read: false,
    hasAttachment: true,
    attachmentName: "电子票凭证.pdf",
    relatedUrl: "/tickets/TICKET-20240615-00023",
  },
  {
    id: "2",
    category: "rescue",
    title: "新的救援请求通知",
    content: "幽兰谷雪道有游客呼救，疑似脚踝扭伤，请运营经理及时调度救援人员...",
    fullContent:
      "紧急通知：幽兰谷雪道收到新的救援请求。\n\n呼救位置：幽兰谷中段\n呼救类型：受伤\n游客姓名：李明辉\n联系电话：13800138001\n呼救时间：2024-06-15 14:20\n\n情况描述：游客在滑行时摔倒，疑似脚踝扭伤，无法自行移动。\n\n请运营经理立即调度最近的救援人员前往现场处理。",
    time: "25分钟前",
    read: false,
    relatedUrl: "/manager/rescue",
  },
  {
    id: "3",
    category: "rental",
    title: "雪具领取提醒",
    content: "您租赁的雪具已准备就绪，请凭订单号 rental-00001 到雪具租赁处领取...",
    fullContent:
      "尊敬的用户，您租赁的雪具已准备就绪。\n\n订单号：rental-00001\n租赁物品：\n- 单板滑雪板（155cm）x1\n- 专业滑雪头盔（M码）x1  \n- 专业滑雪靴（42码）x1\n\n请凭订单号和有效身份证件到雪具租赁处领取。\n\n领取时间：今日 08:00 - 17:00\n租赁处位置：雪具大厅一楼",
    time: "1小时前",
    read: false,
    hasAttachment: true,
    attachmentName: "租赁订单.pdf",
    relatedUrl: "/equipment",
  },
  {
    id: "4",
    category: "slope",
    title: "雪道状态变更通知",
    content: "雪莲峰（高级道）因风力较大，状态已变更为【谨慎开放】，请滑行时注意安全...",
    fullContent:
      "雪道状态变更通知：\n\n雪道名称：雪莲峰（高级道）\n变更时间：2024-06-15 10:30\n原状态：开放\n新状态：谨慎开放\n\n变更原因：实时监测显示该区域风力达到15m/s，部分区域有结冰现象。\n\n安全提示：\n1. 建议中级及以下水平滑雪者避免前往\n2. 滑行时请降低速度，保持安全距离\n3. 注意观察雪道警示标志\n4. 如遇紧急情况请立即拨打救援电话：400-123-4567",
    time: "2小时前",
    read: true,
  },
  {
    id: "5",
    category: "booking",
    title: "教练预约确认",
    content: "您已成功预约许金刚教练今日10:00-12:00的课程，费用900元...",
    fullContent:
      "教练预约确认通知：\n\n预约编号：BOOKING-20240615-00001\n教练：许金刚（国家级教练）\n课程时间：2024-06-15 10:00 - 12:00\n课程时长：2小时\n课程费用：900元\n\n集合地点：雪具大厅二楼教练服务台\n\n请提前15分钟到达集合地点，携带好个人滑雪装备。如需取消请提前24小时操作。",
    time: "3小时前",
    read: true,
    relatedUrl: "/coaches/bookings",
  },
  {
    id: "6",
    category: "finance",
    title: "本月财务报表已生成",
    content: "6月份运营财务报表已生成，总收入790,000元，净利润404,400元...",
    fullContent:
      "财务报表生成通知：\n\n报表周期：2024年6月\n生成时间：2024-06-15 09:00\n\n核心数据：\n- 票务收入：456,800元（占比58%）\n- 教练收入：168,500元（占比21%）\n- 租赁收入：125,600元（占比16%）\n- 赔偿收入：39,100元（占比5%）\n- 总收入：790,000元\n- 总支出：385,600元\n- 净利润：404,400元\n- 利润率：51.2%\n\n请登录财务端查看详细报表。",
    time: "5小时前",
    read: true,
    hasAttachment: true,
    attachmentName: "2024年6月财务报表.xlsx",
    relatedUrl: "/finance/reports",
  },
  {
    id: "7",
    category: "system",
    title: "系统维护通知",
    content: "系统将于6月16日凌晨02:00-04:00进行维护升级，期间部分功能可能无法使用...",
    fullContent:
      "系统维护通知：\n\n尊敬的用户，为提升系统性能和用户体验，我们将于以下时间进行系统维护：\n\n维护时间：2024年6月16日 02:00 - 04:00\n维护内容：\n1. 数据库性能优化\n2. 安全补丁更新\n3. 新功能预部署\n4. 系统稳定性提升\n\n影响范围：\n- 在线购票功能将暂停服务\n- 预约系统将暂时关闭\n- 消息通知可能延迟\n\n请您提前做好相关安排，给您带来的不便敬请谅解。\n\n维护完成后系统将自动恢复，如有疑问请联系客服：400-123-4567",
    time: "昨天 18:30",
    read: true,
  },
  {
    id: "8",
    category: "ticket",
    title: "票务退款成功",
    content: "您申请退款的订单 TICKET-20240614-00156 已处理完成，退款299元将在1-3个工作日内到账...",
    fullContent:
      "退款成功通知：\n\n订单号：TICKET-20240614-00156\n原订单金额：299元\n退款金额：299元\n退款时间：2024-06-14 16:30\n\n退款将原路退回至您的支付账户，预计1-3个工作日内到账，具体到账时间以银行处理为准。\n\n如有疑问请联系客服：400-123-4567",
    time: "昨天 16:45",
    read: true,
  },
  {
    id: "9",
    category: "booking",
    title: "课程评价提醒",
    content: "您昨日参加的王教练课程已结束，邀请您对课程进行评价，参与评价可获得50积分...",
    fullContent:
      "课程评价邀请：\n\n您昨日参加的王晓冰教练课程已顺利结束。\n\n教练：王晓冰（高级教练）\n课程时间：2024-06-14 14:00 - 16:00\n\n我们非常重视您的体验，诚邀您对本次课程进行评价。\n\n参与评价即可获得50积分，积分可用于兑换滑雪场优惠券和礼品。\n\n感谢您的支持！",
    time: "昨天 17:00",
    read: true,
  },
];

const categoryTabs: { key: MessageCategory; label: string; icon: typeof Bell }[] = [
  { key: "all", label: "全部", icon: Inbox },
  { key: "ticket", label: "票务", icon: Ticket },
  { key: "booking", label: "预约", icon: Calendar },
  { key: "rental", label: "租赁", icon: Snowflake },
  { key: "slope", label: "雪道", icon: Mountain },
  { key: "rescue", label: "救援", icon: LifeBuoy },
  { key: "finance", label: "财务", icon: PieChart },
  { key: "system", label: "系统", icon: Settings },
];

const getCategoryColor = (category: Exclude<MessageCategory, "all">) => {
  switch (category) {
    case "ticket":
      return "bg-primary-500/20 text-primary-400 border-primary/40";
    case "booking":
      return "bg-success-500/20 text-success-400 border-success/40";
    case "rental":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "slope":
      return "bg-cyan-500/20 text-cyan-400 border-cyan/40";
    case "rescue":
      return "bg-danger-500/20 text-danger-400 border-danger/40";
    case "finance":
      return "bg-purple-500/20 text-purple-400 border-purple/40";
    case "system":
      return "bg-slate-500/20 text-slate-300 border-slate/40";
  }
};

export default function Messages() {
  const [activeTab, setActiveTab] = useState<MessageCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredMessages =
    activeTab === "all"
      ? messages
      : messages.filter((m) => m.category === activeTab);

  const unreadCount = messages.filter((m) => !m.read).length;

  const getUnreadByCategory = (category: MessageCategory) => {
    if (category === "all") return unreadCount;
    return messages.filter((m) => m.category === category && !m.read).length;
  };

  const handleMarkAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  const handleClearAll = () => {
    if (confirm("确定要删除所有消息吗？")) {
      setMessages([]);
    }
  };

  const handleMessageClick = (message: Message) => {
    if (!message.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
      );
    }
    setExpandedId(expandedId === message.id ? null : message.id);
  };

  return (
    <MainLayout
      title="消息中心"
      subtitle="查看和管理所有系统通知"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary/30">
              <Bell className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {filteredMessages.length}
              </p>
              <p className="text-sm text-slate-400">
                条消息
                {unreadCount > 0 && (
                  <span className="text-danger-400 ml-2">
                    ({unreadCount} 条未读)
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                unreadCount > 0
                  ? "bg-slate-800 border border-white/10 text-white hover:bg-slate-700"
                  : "bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed"
              )}
            >
              <CheckCheck className="w-4 h-4" />
              全部标记已读
            </button>
            <button
              onClick={handleClearAll}
              disabled={messages.length === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                messages.length > 0
                  ? "bg-danger-500/20 border border-danger/30 text-danger-400 hover:bg-danger-500/30"
                  : "bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed"
              )}
            >
              <Trash2 className="w-4 h-4" />
              全部删除
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const unread = getUnreadByCategory(tab.key);
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {unread > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-xs font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-danger-500 text-white"
                      )}
                    >
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl p-16 text-center">
              <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-400">暂无消息</p>
              <p className="text-sm text-slate-500 mt-1">
                当前分类下没有任何消息
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const tabConfig = categoryTabs.find(
                (t) => t.key === message.category
              );
              const CategoryIcon = tabConfig?.icon || Bell;
              const isExpanded = expandedId === message.id;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-2xl border backdrop-blur-xl overflow-hidden transition-all",
                    isExpanded
                      ? "border-primary/40 bg-slate-800/80"
                      : "border-white/10 bg-slate-800/50 hover:bg-slate-800/80 hover:border-white/20"
                  )}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div
                          className={cn(
                            "p-3 rounded-xl border",
                            getCategoryColor(message.category)
                          )}
                        >
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        {!message.read && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-danger-500 border-2 border-slate-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4
                              className={cn(
                                "font-medium truncate",
                                message.read ? "text-slate-300" : "text-white"
                              )}
                            >
                              {message.title}
                            </h4>
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full border flex-shrink-0",
                                getCategoryColor(message.category)
                              )}
                            >
                              {tabConfig?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-500">
                              {message.time}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-sm line-clamp-1",
                            message.read ? "text-slate-500" : "text-slate-400"
                          )}
                        >
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/10 animate-fade-in-up">
                      <div className="pt-4">
                        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                            {message.fullContent}
                          </pre>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {message.relatedUrl && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                              <ExternalLink className="w-4 h-4" />
                              查看详情
                            </button>
                          )}
                          {message.hasAttachment && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 border border-white/10 text-white text-sm font-medium hover:bg-slate-600 transition-colors">
                              <Download className="w-4 h-4" />
                              {message.attachmentName || "下载附件"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
