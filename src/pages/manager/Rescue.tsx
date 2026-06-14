import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  LifeBuoy,
  MapPin,
  Clock,
  User,
  Phone,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  Camera,
  X,
  Mountain,
  Award,
  Eye,
  Image,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RescueType = "injury" | "lost" | "equipment" | "other";
type RescueStatus = "pending" | "dispatched" | "in_progress" | "completed";
type RescuerStatus = "available" | "on_mission" | "off_duty" | "on_duty" | "busy";

interface RescueEvent {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  slopeName: string;
  location: string;
  type: RescueType;
  status: RescueStatus;
  rescuerId?: string;
  rescuerName?: string;
  description?: string;
  report?: string;
  photos?: string[];
  createdAt: string;
  dispatchedAt?: string;
  completedAt?: string;
}

interface Rescuer {
  id: string;
  name: string;
  phone: string;
  status: RescuerStatus;
  certifications: string[];
  currentLocation: string;
  rating: number;
}

const mockRescueEvents: RescueEvent[] = [
  {
    id: "rescue-001",
    visitorName: "李明辉",
    visitorPhone: "13800138001",
    slopeName: "幽兰谷",
    location: "幽兰谷中段",
    type: "injury",
    status: "in_progress",
    rescuerId: "rescuer-003",
    rescuerName: "张应急",
    description: "游客在滑行时摔倒，疑似脚踝扭伤，无法自行移动",
    createdAt: "2024-06-15 14:20",
    dispatchedAt: "2024-06-15 14:22",
  },
  {
    id: "rescue-002",
    visitorName: "匿名游客",
    slopeName: "冰瀑崖",
    location: "冰瀑崖入口附近",
    type: "equipment",
    status: "pending",
    description: "雪板固定器脱落，需要帮助",
    createdAt: "2024-06-15 14:35",
  },
  {
    id: "rescue-003",
    visitorName: "王女士",
    visitorPhone: "13800138099",
    slopeName: "雪莲峰",
    location: "雪莲峰上部",
    type: "lost",
    status: "pending",
    description: "与同伴走散，找不到下山路线",
    createdAt: "2024-06-15 14:38",
  },
  {
    id: "rescue-004",
    visitorName: "陈先生",
    slopeName: "梅花园",
    location: "梅花园出口",
    type: "other",
    status: "pending",
    description: "身体不适，需要医疗支援",
    createdAt: "2024-06-15 14:40",
  },
  {
    id: "rescue-005",
    visitorName: "王先生",
    visitorPhone: "13800138099",
    slopeName: "松涛道",
    location: "松涛道底部",
    type: "other",
    status: "completed",
    rescuerId: "rescuer-001",
    rescuerName: "李救援",
    description: "游客迷路，已安全送回服务中心",
    report: "游客因不熟悉雪道标识迷路，在松涛道底部被发现。已引导至服务中心，游客身体状况良好。",
    photos: ["photo1.jpg", "photo2.jpg"],
    createdAt: "2024-06-15 12:30",
    dispatchedAt: "2024-06-15 12:32",
    completedAt: "2024-06-15 13:15",
  },
  {
    id: "rescue-006",
    visitorName: "张小朋友",
    slopeName: "玉兰道",
    location: "玉兰道中间",
    type: "injury",
    status: "completed",
    rescuerId: "rescuer-002",
    rescuerName: "王安全",
    description: "儿童滑雪时轻微擦伤",
    report: "8岁儿童在初级道滑行时不慎摔倒，膝盖轻微擦伤。已进行消毒处理并贴上创可贴，家长陪同离开，无大碍。",
    photos: ["photo3.jpg"],
    createdAt: "2024-06-15 10:15",
    dispatchedAt: "2024-06-15 10:16",
    completedAt: "2024-06-15 10:30",
  },
];

const mockRescuers: Rescuer[] = [
  {
    id: "rescuer-001",
    name: "李救援",
    phone: "13900139001",
    status: "available",
    certifications: ["急救证", "滑雪救援证", "水上救生证"],
    currentLocation: "服务中心待命",
    rating: 4.8,
  },
  {
    id: "rescuer-002",
    name: "王安全",
    phone: "13900139002",
    status: "available",
    certifications: ["急救证", "滑雪救援证"],
    currentLocation: "中站巡逻",
    rating: 4.6,
  },
  {
    id: "rescuer-003",
    name: "张应急",
    phone: "13900139003",
    status: "on_mission",
    certifications: ["急救证", "滑雪救援证", "野外救援证"],
    currentLocation: "幽兰谷救援中",
    rating: 4.9,
  },
  {
    id: "rescuer-004",
    name: "刘守护",
    phone: "13900139004",
    status: "available",
    certifications: ["急救证", "滑雪救援证"],
    currentLocation: "山顶巡逻",
    rating: 4.7,
  },
  {
    id: "rescuer-005",
    name: "赵先锋",
    phone: "13900139005",
    status: "off_duty",
    certifications: ["急救证", "滑雪救援证"],
    currentLocation: "休息中",
    rating: 4.5,
  },
];

const getRescueTypeText = (type: RescueType) => {
  switch (type) {
    case "injury":
      return "受伤";
    case "lost":
      return "迷路";
    case "equipment":
      return "装备故障";
    case "other":
      return "其他";
  }
};

const getRescueTypeColor = (type: RescueType) => {
  switch (type) {
    case "injury":
      return "bg-danger-500/20 text-danger-400 border-danger/40";
    case "lost":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "equipment":
      return "bg-primary-500/20 text-primary-400 border-primary/40";
    case "other":
      return "bg-slate-500/20 text-slate-300 border-slate/40";
  }
};

const getRescueStatusText = (status: RescueStatus) => {
  switch (status) {
    case "pending":
      return "待处理";
    case "dispatched":
      return "已派遣";
    case "in_progress":
      return "进行中";
    case "completed":
      return "已完成";
  }
};

const getRescueStatusColor = (status: RescueStatus) => {
  switch (status) {
    case "pending":
      return "bg-danger-500/20 text-danger-400 border-danger/40";
    case "dispatched":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "in_progress":
      return "bg-primary-500/20 text-primary-400 border-primary/40";
    case "completed":
      return "bg-success-500/20 text-success-400 border-success/40";
  }
};

const getRescuerStatusText = (status: RescuerStatus) => {
  switch (status) {
    case "available":
      return "可派遣";
    case "on_mission":
      return "任务中";
    case "off_duty":
      return "休息中";
    case "on_duty":
      return "值班中";
    case "busy":
      return "忙碌中";
  }
};

const getRescuerStatusColor = (status: RescuerStatus) => {
  switch (status) {
    case "available":
      return "bg-success-500/20 text-success-400 border-success/40";
    case "on_mission":
      return "bg-primary-500/20 text-primary-400 border-primary/40";
    case "off_duty":
      return "bg-slate-500/20 text-slate-400 border-slate/40";
    case "on_duty":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "busy":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
  }
};

export default function ManagerRescue() {
  const [events] = useState<RescueEvent[]>(mockRescueEvents);
  const [rescuers] = useState<Rescuer[]>(mockRescuers);
  const [selectedEvent, setSelectedEvent] = useState<RescueEvent | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRescuer, setSelectedRescuer] = useState<string>("");
  const [reportData, setReportData] = useState({ report: "", photos: [] as string[] });

  const pendingEvents = events.filter((e) => e.status === "pending");
  const inProgressEvents = events.filter(
    (e) => e.status === "dispatched" || e.status === "in_progress"
  );
  const completedEvents = events.filter((e) => e.status === "completed");

  const handleDispatch = () => {
    if (!selectedRescuer || !selectedEvent) return;
    const rescuer = rescuers.find((r) => r.id === selectedRescuer);
    alert(`已派遣 ${rescuer?.name} 前往 ${selectedEvent.location} 进行救援`);
    setShowDispatchModal(false);
    setSelectedEvent(null);
    setSelectedRescuer("");
  };

  const handleCompleteRescue = () => {
    if (!selectedEvent) return;
    alert("救援报告已提交，救援任务已完成");
    setShowReportModal(false);
    setSelectedEvent(null);
    setReportData({ report: "", photos: [] });
  };

  return (
    <MainLayout
      title="救援调度中心"
      subtitle="管理救援事件、调度救援人员、跟踪救援进度"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-danger/30 bg-gradient-to-br from-danger-500/10 to-danger-600/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">待处理呼救</p>
                <p className="mt-1 text-3xl font-bold text-danger-400">
                  {pendingEvents.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-danger-500/20">
                <AlertTriangle className="w-6 h-6 text-danger-400" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary-500/10 to-primary-600/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">进行中救援</p>
                <p className="mt-1 text-3xl font-bold text-primary-400">
                  {inProgressEvents.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary-500/20">
                <LifeBuoy className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-success/30 bg-gradient-to-br from-success-500/10 to-success-600/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">今日已完成</p>
                <p className="mt-1 text-3xl font-bold text-success-400">
                  {completedEvents.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success-500/20">
                <CheckCircle className="w-6 h-6 text-success-400" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-warning/30 bg-gradient-to-br from-warning-500/10 to-warning-600/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">可用救援人员</p>
                <p className="mt-1 text-3xl font-bold text-warning-400">
                  {rescuers.filter((r) => r.status === "available").length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-warning-500/20">
                <User className="w-6 h-6 text-warning-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-danger/20 bg-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">待处理呼救事件</h3>
                </div>
                <span className="text-sm text-danger-400 font-medium">
                  {pendingEvents.length} 条紧急
                </span>
              </div>
              <div className="space-y-3">
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    暂无待处理呼救事件
                  </div>
                ) : (
                  pendingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-danger/20 bg-danger-500/5 p-4 hover:bg-danger-500/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-medium",
                              getRescueTypeColor(event.type)
                            )}
                          >
                            {getRescueTypeText(event.type)}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.createdAt}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                            getRescueStatusColor(event.status)
                          )}
                        >
                          {getRescueStatusText(event.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">位置：</span>
                            {event.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mountain className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">雪道：</span>
                            {event.slopeName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <User className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">游客：</span>
                            {event.visitorName}
                          </div>
                        </div>
                        {event.visitorPhone && (
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                            <div>
                              <span className="text-slate-500">电话：</span>
                              {event.visitorPhone}
                            </div>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3 mb-3">
                          {event.description}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDispatchModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-danger-500 to-danger-600 text-white font-medium shadow-lg shadow-danger/30 hover:shadow-danger/50 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        立即派遣
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {inProgressEvents.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">进行中的救援</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {inProgressEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-primary/20 bg-primary-500/5 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-medium",
                              getRescueTypeColor(event.type)
                            )}
                          >
                            {getRescueTypeText(event.type)}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-medium",
                              getRescueStatusColor(event.status)
                            )}
                          >
                            {getRescueStatusText(event.status)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          派遣时间：{event.dispatchedAt}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-sm">
                          <span className="text-slate-500">位置：</span>
                          <span className="text-slate-300">{event.location}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">游客：</span>
                          <span className="text-slate-300">{event.visitorName}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">救援人员：</span>
                          <span className="text-primary-400">{event.rescuerName}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">开始时间：</span>
                          <span className="text-slate-300">{event.createdAt}</span>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">已完成救援记录</h3>
                <span className="text-sm text-slate-400">
                  共 {completedEvents.length} 条
                </span>
              </div>
              <div className="space-y-3">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                            getRescueTypeColor(event.type)
                          )}
                        >
                          {getRescueTypeText(event.type)}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                            getRescueStatusColor(event.status)
                          )}
                        >
                          {getRescueStatusText(event.status)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {event.completedAt}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-slate-500">位置：</span>
                        <span className="text-slate-300">{event.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">游客：</span>
                        <span className="text-slate-300">{event.visitorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">救援人员：</span>
                        <span className="text-success-400">{event.rescuerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">用时：</span>
                        <span className="text-slate-300">约45分钟</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowReportModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        查看报告
                      </button>
                      {event.status === "in_progress" && (
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowReportModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-500/20 text-success-400 text-sm font-medium hover:bg-success-500/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          完成救援
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-4">可用救援人员</h3>
            <div className="space-y-3">
              {rescuers.map((rescuer) => (
                <div
                  key={rescuer.id}
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    rescuer.status === "available"
                      ? "border-success/20 bg-success-500/5 hover:bg-success-500/10"
                      : "border-white/10 bg-slate-900/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{rescuer.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {rescuer.phone}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap",
                        getRescuerStatusColor(rescuer.status)
                      )}
                    >
                      {getRescuerStatusText(rescuer.status)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {rescuer.currentLocation}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {rescuer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary/20"
                      >
                        <Award className="w-3 h-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          i < Math.floor(rescuer.rating)
                            ? "text-warning-400"
                            : "text-slate-600"
                        )}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-slate-400 ml-1">{rescuer.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDispatchModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-primary/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">派遣救援人员</h3>
                <p className="text-sm text-slate-400 mt-1">
                  选择一名救援人员前往 {selectedEvent.location}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDispatchModal(false);
                  setSelectedEvent(null);
                  setSelectedRescuer("");
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="rounded-xl bg-danger-500/10 border border-danger/30 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-danger-400" />
                  <span className="font-medium text-danger-400">事件详情</span>
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-500">类型：</span>
                    {getRescueTypeText(selectedEvent.type)}
                  </p>
                  <p>
                    <span className="text-slate-500">位置：</span>
                    {selectedEvent.location}
                  </p>
                  <p>
                    <span className="text-slate-500">游客：</span>
                    {selectedEvent.visitorName}
                  </p>
                  {selectedEvent.description && (
                    <p>
                      <span className="text-slate-500">描述：</span>
                      {selectedEvent.description}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-white mb-2">选择救援人员：</p>
              {rescuers
                .filter((r) => r.status === "available")
                .map((rescuer) => (
                  <button
                    key={rescuer.id}
                    onClick={() => setSelectedRescuer(rescuer.id)}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all",
                      selectedRescuer === rescuer.id
                        ? "border-primary-500 bg-primary-500/20"
                        : "border-white/10 bg-slate-800/50 hover:border-primary/30 hover:bg-slate-800/80"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{rescuer.name}</p>
                          <p className="text-xs text-slate-400">
                            {rescuer.currentLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "text-sm",
                              i < Math.floor(rescuer.rating)
                                ? "text-warning-400"
                                : "text-slate-600"
                            )}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setShowDispatchModal(false);
                  setSelectedEvent(null);
                  setSelectedRescuer("");
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDispatch}
                disabled={!selectedRescuer}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all",
                  selectedRescuer
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                确认派遣
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-primary/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedEvent.report ? "查看救援报告" : "填写救援报告"}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedEvent.visitorName} - {selectedEvent.location}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedEvent(null);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">救援类型：</span>
                  <span className="text-white">
                    {getRescueTypeText(selectedEvent.type)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">救援人员：</span>
                  <span className="text-primary-400">
                    {selectedEvent.rescuerName || "待分配"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">开始时间：</span>
                  <span className="text-white">{selectedEvent.createdAt}</span>
                </div>
                {selectedEvent.completedAt && (
                  <div>
                    <span className="text-slate-500">完成时间：</span>
                    <span className="text-white">{selectedEvent.completedAt}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-2">
                  <FileText className="w-4 h-4 text-primary-400" />
                  救援报告
                </label>
                <textarea
                  value={selectedEvent.report || reportData.report}
                  onChange={(e) =>
                    setReportData({ ...reportData, report: e.target.value })
                  }
                  readOnly={!!selectedEvent.report}
                  rows={6}
                  placeholder="请详细描述救援过程、处理结果等..."
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors resize-none",
                    selectedEvent.report
                      ? "bg-slate-800/50 border-white/10 cursor-default"
                      : "bg-slate-800 border-white/10"
                  )}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-2">
                  <Camera className="w-4 h-4 text-primary-400" />
                  现场照片
                </label>
                {selectedEvent.photos && selectedEvent.photos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedEvent.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <Image className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                          <span className="text-xs text-slate-500">{photo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      点击或拖拽上传照片（模拟）
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedEvent(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-colors"
              >
                {selectedEvent.report ? "关闭" : "取消"}
              </button>
              {!selectedEvent.report && (
                <button
                  onClick={handleCompleteRescue}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-medium shadow-lg shadow-success/30 hover:shadow-success/50 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  完成救援
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
