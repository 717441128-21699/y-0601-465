import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CourseStatus = 'pending' | 'ongoing' | 'completed' | 'cancelled';

interface Course {
  id: string;
  time: string;
  student: string;
  avatar: string;
  courseType: string;
  status: CourseStatus;
  location: string;
  duration: string;
}

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  pending: { label: '待上课', className: 'bg-warning/10 text-warning border-warning/20' },
  ongoing: { label: '进行中', className: 'bg-primary/10 text-primary border-primary/20' },
  completed: { label: '已完成', className: 'bg-success/10 text-success border-success/20' },
  cancelled: { label: '已取消', className: 'bg-secondary/10 text-secondary/60 border-secondary/20' },
};

const todayCourses: Course[] = [
  {
    id: '1',
    time: '09:00 - 11:00',
    student: '李明轩',
    avatar: '李',
    courseType: '单板初级',
    status: 'completed',
    location: 'A区初级道',
    duration: '2小时',
  },
  {
    id: '2',
    time: '11:30 - 13:30',
    student: '王小美',
    avatar: '王',
    courseType: '双板进阶',
    status: 'ongoing',
    location: 'B区中级道',
    duration: '2小时',
  },
  {
    id: '3',
    time: '14:00 - 16:00',
    student: '张子涵',
    avatar: '张',
    courseType: '儿童教学',
    status: 'pending',
    location: '儿童教学区',
    duration: '2小时',
  },
  {
    id: '4',
    time: '16:30 - 18:30',
    student: '刘浩然',
    avatar: '刘',
    courseType: '自由式技巧',
    status: 'pending',
    location: '公园区',
    duration: '2小时',
  },
  {
    id: '5',
    time: '19:00 - 21:00',
    student: '陈思雨',
    avatar: '陈',
    courseType: '单板高级',
    status: 'cancelled',
    location: 'C区高级道',
    duration: '2小时',
  },
];

const markedDates = [3, 5, 8, 10, 12, 15, 17, 19, 22, 25, 28];

export default function CoachSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15));
  const [selectedDate, setSelectedDate] = useState(15);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isMarked = markedDates.includes(day);
      const isSelected = day === selectedDate && month === currentDate.getMonth();
      const isToday = day === 15 && month === 5;
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={cn(
            'aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 relative',
            isSelected
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary/30'
              : isToday
              ? 'bg-primary/10 text-primary'
              : 'text-secondary/70 hover:bg-primary/10 hover:text-primary'
          )}
        >
          {day}
          {isMarked && (
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full mt-0.5',
                isSelected ? 'bg-white' : 'bg-primary'
              )}
            />
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up">
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl hover:bg-primary/10 flex items-center justify-center text-secondary/60 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-secondary">
            {year}年 {monthNames[month]}
          </h3>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl hover:bg-primary/10 flex items-center justify-center text-secondary/60 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-secondary/40 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        <div className="mt-5 pt-5 border-t border-secondary/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-secondary/60">有课程</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-secondary/60">已完成</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-secondary/60">待上课</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-secondary">
              {month + 1}月{selectedDate}日 课程
            </h3>
            <p className="text-sm text-secondary/50 mt-0.5">
              共 {todayCourses.length} 节课程
            </p>
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'ongoing', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-secondary/5 text-secondary/60 hover:bg-primary/10 hover:text-primary'
                )}
              >
                {filter === 'all'
                  ? '全部'
                  : statusConfig[filter as CourseStatus].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
          {todayCourses.map((course) => (
            <div
              key={course.id}
              className={cn(
                'p-4 rounded-xl border transition-all duration-300',
                course.status === 'cancelled'
                  ? 'bg-secondary/5 border-secondary/10 opacity-60'
                  : 'bg-gradient-to-r from-white to-primary/5 border-primary/10 hover:border-primary/30 hover:shadow-md'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {course.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-secondary">
                        {course.student}
                      </h4>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium border',
                          statusConfig[course.status].className
                        )}
                      >
                        {statusConfig[course.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-primary font-medium mb-2">
                      {course.courseType}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-secondary/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {course.location}
                      </span>
                    </div>
                  </div>
                </div>
                {course.status === 'pending' && (
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary/30 hover:shadow-lg transition-all">
                    签到
                  </button>
                )}
                {course.status === 'ongoing' && (
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-medium shadow-md shadow-success/30 hover:shadow-lg transition-all">
                    下课
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
