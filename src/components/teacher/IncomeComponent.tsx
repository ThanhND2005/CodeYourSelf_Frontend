import React, { useEffect } from "react";
import {
  BookOpen,
  DollarSign,
  Wallet,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTeacherStore } from "@/stores/useTeacherStore";
import { TeacherService } from "@/services/TeacherService";



// ==========================================
// 3. UI COMPONENT (Viết gọn trong 1 function duy nhất)
// ==========================================

export default function IncomeDashboard() {
  
 
  const {teacher,stats,setStats} = useTeacherStore()
  const formatMillions = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")} vnđ`;
  };
  useEffect(()=>{
    const fetchStat = async () =>{
      const {stats} = await TeacherService.getStats(teacher?.userId as string)
      setStats(stats)
    }
    fetchStat()
  },[])
  return (
    <div className="p-2 md:p-2 w-full min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          Báo cáo thu nhập
        </h1>

        <div className="space-y-8">
          {stats?.map((stat) => {
            const cardConfigs = [
              {
                title: "Tổng khóa học đã bán",
                value: stat.totalCoursesSold || 0,
                icon: BookOpen,
                colorClass: "bg-blue-100 text-blue-600",
                highlight: false,
              },
              {
                title: "Tổng lợi nhuận (Payment)",
                value: formatMillions(stat.totalProfit) || 0,
                icon: Wallet,
                colorClass: "bg-emerald-100 text-emerald-600",
                highlight: false,
              },
              {
                title: stat.isCurrent ? "Hoa hồng dự kiến (Salary)" : "Hoa hồng đã nhận (Salary)",
                value: formatMillions(stat.totalProfit*0.8) || 0,
                icon: DollarSign,
                colorClass: "bg-fuchsia-100 text-fuchsia-600",
                highlight: true, 
              },
              {
                // Hiển thị tên khóa học lấy từ bảng Course đã cập nhật
                title: "Khóa học bán chạy nhất",
                value: stat.bestSellingCourse.name || 'Chua co',
                icon: Trophy,
                colorClass: "bg-amber-100 text-amber-600",
                highlight: false,
              },
              {
                title: "Lượt bán khóa học cao nhất",
                value: stat.highestCourseSales || 0,
                icon: TrendingUp,
                colorClass: "bg-rose-100 text-rose-600",
                highlight: false,
              },
              {
                title: "Tổng học viên mới",
                value: stat.newStudents || 0,
                icon: Users,
                colorClass: "bg-indigo-100 text-indigo-600",
                highlight: false,
              },
            ];

            return (
              <div
                key={stat.id}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                {/* Header thời gian */}
                <div className="flex items-center mb-6">
                  <div
                    className={`w-2 h-8 rounded-full mr-3 ${
                      stat.isCurrent ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Thống kê:{" "}
                    <span
                      className={
                        stat.isCurrent ? "text-purple-600" : "text-gray-600"
                      }
                    >
                      Tháng {stat.periodMonth}/{stat.periodYear} {stat.isCurrent && "(Hiện tại)"}
                    </span>
                  </h2>
                </div>

                {/* Grid thống kê */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cardConfigs.map((config, index) => {
                    const Icon = config.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center p-5 rounded-2xl border ${
                          config.highlight
                            ? "border-purple-200 bg-purple-50"
                            : "border-gray-100 bg-white"
                        } shadow-sm hover:shadow-md transition-all duration-300`}
                      >
                        <div className={`p-3 rounded-xl ${config.colorClass} mr-4`}>
                          <Icon size={24} className="opacity-80" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-500 mb-1">
                            {config.title}
                          </span>
                          <span className="text-xl font-bold text-gray-800 line-clamp-1">
                            {config.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}