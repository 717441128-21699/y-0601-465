import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Mountain,
  Plus,
  Clock,
  Users,
  Thermometer,
  Eye,
  Wind,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SlopeDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
type SlopeStatus = "open" | "caution" | "closed";

interface Slope {
  id: string;
  name: string;
  difficulty: SlopeDifficulty;
  status: SlopeStatus;
  currentCount: number;
  capacity: number;
  lastInspection: string;
  length: number;
  elevation: number;
}

interface InspectionRecord {
  id: string;
  slopeId: string;
  slopeName: string;
  snowQuality: number;
  temperature: number;
  visibility: number;
  windSpeed: number;
  safetyHazards: string[];
  notes: string;
  createdAt: string;
}

const mockSlopes: Slope[] = [
  {
    id: "1",
    name: "玉兰道",
    difficulty: "beginner",
    status: "open",
    currentCount: 85,
    capacity: 200,
    lastInspection: "2024-06-15 08:30",
    length: 300,
    elevation: 50,
  },
  {
    id: "2",
    name: "梅花园",
    difficulty: "beginner",
    status: "open",
    currentCount: 120,
    capacity: 220,
    lastInspection: "2024-06-15 08:45",
    length: 350,
    elevation: 55,
  },
  {
    id: "3",
    name: "松涛道",
    difficulty: "beginner",
    status: "open",
    currentCount: 95,
    capacity: 250,
    lastInspection: "2024-06-15 09:00",
    length: 400,
    elevation: 60,
  },
  {
    id: "4",
    name: "翠竹道",
    difficulty: "intermediate",
    status: "open",
    currentCount: 110,
    capacity: 180,
    lastInspection: "2024-06-15 09:15",
    length: 600,
    elevation: 120,
  },
  {
    id: "5",
    name: "幽兰谷",
    difficulty: "intermediate",
    status: "open",
    currentCount: 78,
    capacity: 200,
    lastInspection: "2024-06-15 09:30",
    length: 700,
    elevation: 140,
  },
  {
    id: "6",
    name: "金桂坡",
    difficulty: "intermediate",
    status: "caution",
    currentCount: 45,
    capacity: 220,
    lastInspection: "2024-06-15 10:00",
    length: 800,
    elevation: 160,
  },
  {
    id: "7",
    name: "雪莲峰",
    difficulty: "advanced",
    status: "caution",
    currentCount: 30,
    capacity: 120,
    lastInspection: "2024-06-15 10:30",
    length: 1000,
    elevation: 250,
  },
  {
    id: "8",
    name: "冰瀑崖",
    difficulty: "advanced",
    status: "closed",
    currentCount: 0,
    capacity: 100,
    lastInspection: "2024-06-15 07:00",
    length: 1200,
    elevation: 300,
  },
  {
    id: "9",
    name: "风云岭",
    difficulty: "advanced",
    status: "open",
    currentCount: 65,
    capacity: 110,
    lastInspection: "2024-06-15 09:45",
    length: 1100,
    elevation: 280,
  },
  {
    id: "10",
    name: "龙腾道",
    difficulty: "expert",
    status: "open",
    currentCount: 28,
    capacity: 60,
    lastInspection: "2024-06-15 10:15",
    length: 1500,
    elevation: 400,
  },
  {
    id: "11",
    name: "虎跳峡",
    difficulty: "expert",
    status: "open",
    currentCount: 18,
    capacity: 50,
    lastInspection: "2024-06-15 10:45",
    length: 1800,
    elevation: 450,
  },
  {
    id: "12",
    name: "鹰喙峰",
    difficulty: "expert",
    status: "closed",
    currentCount: 0,
    capacity: 40,
    lastInspection: "2024-06-14 16:00",
    length: 2000,
    elevation: 500,
  },
];

const mockInspectionRecords: InspectionRecord[] = [
  {
    id: "1",
    slopeId: "1",
    slopeName: "玉兰道",
    snowQuality: 5,
    temperature: -8,
    visibility: 10,
    windSpeed: 5,
    safetyHazards: [],
    notes: "雪质优良，状态良好，适合初学者练习",
    createdAt: "2024-06-15 08:30",
  },
  {
    id: "2",
    slopeId: "7",
    slopeName: "雪莲峰",
    snowQuality: 3,
    temperature: -12,
    visibility: 6,
    windSpeed: 15,
    safetyHazards: ["ice", "wind"],
    notes: "风较大，部分区域有结冰，已设置警示标志，建议谨慎滑行",
    createdAt: "2024-06-15 10:30",
  },
  {
    id: "3",
    slopeId: "6",
    slopeName: "金桂坡",
    snowQuality: 4,
    temperature: -10,
    visibility: 8,
    windSpeed: 10,
    safetyHazards: ["thin_snow"],
    notes: "部分区域积雪较薄，已提醒工作人员补雪",
    createdAt: "2024-06-15 10:00",
  },
  {
    id: "4",
    slopeId: "8",
    slopeName: "冰瀑崖",
    snowQuality: 2,
    temperature: -15,
    visibility: 4,
    windSpeed: 20,
    safetyHazards: ["ice", "rock", "wind"],
    notes: "天气恶劣，能见度低，存在安全隐患，已关闭",
    createdAt: "2024-06-15 07:00",
  },
  {
    id: "5",
    slopeId: "5",
    slopeName: "幽兰谷",
    snowQuality: 5,
    temperature: -9,
    visibility: 9,
    windSpeed: 6,
    safetyHazards: [],
    notes: "雪况极佳，一切正常",
    createdAt: "2024-06-15 09:30",
  },
];

const hazardOptions = [
  { value: "ice", label: "冰面" },
  { value: "rock", label: "裸露岩石" },
  { value: "thin_snow", label: "积雪过薄" },
  { value: "marker", label: "标志物损坏" },
  { value: "other", label: "其他" },
];

const getDifficultyText = (difficulty: SlopeDifficulty) => {
  switch (difficulty) {
    case "beginner":
      return "初级";
    case "intermediate":
      return "中级";
    case "advanced":
      return "高级";
    case "expert":
      return "专家级";
  }
};

const getDifficultyColor = (difficulty: SlopeDifficulty) => {
  switch (difficulty) {
    case "beginner":
      return "bg-success-500/20 text-success-400 border-success/40";
    case "intermediate":
      return "bg-primary-500/20 text-primary-400 border-primary/40";
    case "advanced":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "expert":
      return "bg-danger-500/20 text-danger-400 border-danger/40";
  }
};

const getStatusIcon = (status: SlopeStatus) => {
  switch (status) {
    case "open":
      return CheckCircle;
    case "caution":
      return AlertCircle;
    case "closed":
      return XCircle;
  }
};

const getStatusColor = (status: SlopeStatus) => {
  switch (status) {
    case "open":
      return "bg-success-500/20 text-success-400 border-success/40";
    case "caution":
      return "bg-warning-500/20 text-warning-400 border-warning/40";
    case "closed":
      return "bg-danger-500/20 text-danger-400 border-danger/40";
  }
};

const getStatusText = (status: SlopeStatus) => {
  switch (status) {
    case "open":
      return "开放";
    case "caution":
      return "注意";
    case "closed":
      return "关闭";
  }
};

export default function ManagerSlopes() {
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [slopes] = useState<Slope[]>(mockSlopes);
  const [inspectionRecords] = useState<InspectionRecord[]>(mockInspectionRecords);
  const [formData, setFormData] = useState({
    slopeId: "",
    snowQuality: 3,
    temperature: -8,
    visibility: 8,
    windSpeed: 5,
    safetyHazards: [] as string[],
    notes: "",
  });

  const handleHazardToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      safetyHazards: prev.safetyHazards.includes(value)
        ? prev.safetyHazards.filter((h) => h !== value)
        : [...prev.safetyHazards, value],
    }));
  };

  const handleSubmit = () => {
    alert("巡检记录已提交，系统将自动更新雪道状态");
    setShowInspectionModal(false);
    setFormData({
      slopeId: "",
      snowQuality: 3,
      temperature: -8,
      visibility: 8,
      windSpeed: 5,
      safetyHazards: [],
      notes: "",
    });
  };

  return (
    <MainLayout title="雪道巡检与管理" subtitle="管理所有雪道状态并完成巡检记录">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary/30">
              <Mountain className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{slopes.length}</p>
              <p className="text-sm text-slate-400">条雪道</p>
            </div>
            <div className="w-px h-10 bg-white/10 mx-2" />
            <div>
              <p className="text-lg font-semibold text-success-400">
                {slopes.filter((s) => s.status === "open").length} 开放
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-warning-400">
                {slopes.filter((s) => s.status === "caution").length} 注意
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-danger-400">
                {slopes.filter((s) => s.status === "closed").length} 关闭
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white hover:bg-slate-700/80 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">巡检历史</span>
              {showHistory ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setShowInspectionModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>新增巡检</span>
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="rounded-2xl border border-primary/20 bg-slate-800/50 backdrop-blur-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">巡检历史记录</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      雪道
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      雪质评分
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      温度
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      能见度
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      风速
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      安全隐患
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 py-3 px-4">
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-white">
                        {record.slopeName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < record.snowQuality
                                  ? "text-warning-400 fill-warning-400"
                                  : "text-slate-600"
                              )}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">
                        {record.temperature}°C
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">
                        {record.visibility}/10
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">
                        {record.windSpeed} m/s
                      </td>
                      <td className="py-3 px-4">
                        {record.safetyHazards.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {record.safetyHazards.map((h) => {
                              const opt = hazardOptions.find(
                                (o) => o.value === h
                              );
                              return (
                                <span
                                  key={h}
                                  className="text-xs px-2 py-0.5 rounded-full bg-danger-500/20 text-danger-400 border border-danger/30"
                                >
                                  {opt?.label || h}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-success-400">无</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">
                        {record.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {slopes.map((slope) => {
            const StatusIcon = getStatusIcon(slope.status);
            const occupancy =
              slope.capacity > 0
                ? Math.round((slope.currentCount / slope.capacity) * 100)
                : 0;
            return (
              <div
                key={slope.id}
                className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl p-5 hover:border-primary/30 hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary/30">
                      <Mountain className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{slope.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border",
                            getDifficultyColor(slope.difficulty)
                          )}
                        >
                          {getDifficultyText(slope.difficulty)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {slope.length}m · {slope.elevation}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-lg border",
                      getStatusColor(slope.status)
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>当前人数</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {slope.currentCount}/{slope.capacity}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
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

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>最后巡检</span>
                    </div>
                    <span className="text-sm text-slate-300">
                      {slope.lastInspection}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border",
                        getStatusColor(slope.status)
                      )}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {getStatusText(slope.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-primary/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">新增雪道巡检</h3>
                <p className="text-sm text-slate-400 mt-1">
                  填写巡检信息，系统将自动判断并更新雪道状态
                </p>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  选择雪道 <span className="text-danger">*</span>
                </label>
                <select
                  value={formData.slopeId}
                  onChange={(e) =>
                    setFormData({ ...formData, slopeId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">请选择雪道</option>
                  {slopes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({getDifficultyText(s.difficulty)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">
                    雪质评分
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setFormData({ ...formData, snowQuality: i + 1 })
                        }
                        className="p-0.5"
                      >
                        <Star
                          className={cn(
                            "w-6 h-6 transition-colors",
                            i < formData.snowQuality
                              ? "text-warning-400 fill-warning-400"
                              : "text-slate-600 hover:text-slate-400"
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-white font-medium">
                      {formData.snowQuality}/5
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.snowQuality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      snowQuality: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 rounded-full bg-slate-700 appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-2">
                    <Thermometer className="w-4 h-4 text-primary-400" />
                    温度 (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        temperature: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-2">
                    <Eye className="w-4 h-4 text-success-400" />
                    能见度 (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: Math.min(
                          10,
                          Math.max(1, parseInt(e.target.value) || 1)
                        ),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-2">
                    <Wind className="w-4 h-4 text-warning-400" />
                    风速 (m/s)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.windSpeed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        windSpeed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-3">
                  <AlertCircle className="w-4 h-4 text-danger-400" />
                  安全隐患（可多选）
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hazardOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleHazardToggle(option.value)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        formData.safetyHazards.includes(option.value)
                          ? "bg-danger-500/20 text-danger-400 border-danger/50"
                          : "bg-slate-800 text-slate-400 border-white/10 hover:border-white/30 hover:text-white"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  备注说明
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                  placeholder="请输入巡检备注说明..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => setShowInspectionModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.slopeId}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-medium transition-all",
                  formData.slopeId
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                提交巡检
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
