import React, { useMemo } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  Wallet, 
  Trophy, 
  TrendingUp, 
  Users 
} from 'lucide-react';

// ==========================================
// 1. DATABASE SCHEMA TYPES (Based on provided images)
// ==========================================
interface Course {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  teacherId: string;
  status: string;
}

interface Payment {
  paymentId: string;
  createdAt: string; // ISO Datetime
  amount: number;
  courseId: string;
  studentId: string;
  status: string;
}

// ==========================================
// 2. MOCK DATA & AGGREGATION LOGIC
// ==========================================
// Giả lập dữ liệu bảng Course
const mockCourses: Record<string, Course> = {
  'c-001': { courseId: 'c-001', name: 'Springboot Thực chiến', cost: 1500000, summary: '', teacherId: 't-1', status: 'ACTIVE' },
  'c-002': { courseId: 'c-002', name: 'ReactJS Pro Mastery', cost: 1200000, summary: '', teacherId: 't-1', status: 'ACTIVE' },
};

// Interface cho dữ liệu đã được aggregate để hiển thị UI
interface MonthlyIncomeStat {
  id: string;
  periodLabel: string;
  isCurrent: boolean;
  totalCoursesSold: number;
  totalProfit: number;
  commission: number;
  bestSellingCourse: Course;
  highestCourseSales: number;
  newStudents: number;
}

// Giả lập kết quả trả về từ API sau khi đã query group by theo tháng từ bảng Payment & Course
const mockStats: MonthlyIncomeStat[] = [
  {
    id: 'month-1',
    periodLabel: 'Tháng 1 (Tháng trước)',
    isCurrent: false,
    totalCoursesSold: 15,
    totalProfit: 24000000, // Dựa trên SUM(amount) của Payment
    commission: 9600000,   // Tính toán logic nghiệp vụ (vd: 40% profit)
    bestSellingCourse: mockCourses['c-001'],
    highestCourseSales: 8,
    newStudents: 6,        // Dựa trên COUNT(DISTINCT studentId)
  },
  {
    id: 'month-2',
    periodLabel: 'Tháng 2 (Hiện tại)',
    isCurrent: true,
    totalCoursesSold: 23,
    totalProfit: 32000000,
    commission: 12800000,
    bestSellingCourse: mockCourses['c-002'],
    highestCourseSales: 7,
    newStudents: 10,
  }
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

// Helper format tiền tệ rút gọn (VD: 24,000,000 -> 24 Tr)
const formatMillions = (amount: number) => {
  return `${(amount / 1000000).toLocaleString('vi-VN')} Tr`;
};

// Sub-component cho từng ô thống kê
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass, 
  highlight = false 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  colorClass: string;
  highlight?: boolean;
}) => (
  <div className={`flex items-center p-5 rounded-2xl border ${highlight ? 'border-purple-200 bg-purple-50' : 'border-gray-100 bg-white'} shadow-sm hover:shadow-md transition-all duration-300`}>
    <div className={`p-3 rounded-xl ${colorClass} mr-4`}>
      <Icon size={24} className="opacity-80" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 mb-1">{title}</span>
      <span className="text-xl font-bold text-gray-800">{value}</span>
    </div>
  </div>
);

export default function IncomeDashboard() {
  return (
    <div className="p-6 md:p-8 w-full">
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Thu nhập</h1>

        <div className="space-y-8">
          {mockStats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              {/* Header của từng khối tháng */}
              <div className="flex items-center mb-6">
                <div className={`w-2 h-8 rounded-full mr-3 ${stat.isCurrent ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <h2 className="text-xl font-bold text-gray-800">
                  Thời gian dữ liệu: <span className={stat.isCurrent ? 'text-purple-600' : 'text-gray-600'}>{stat.periodLabel}</span>
                </h2>
              </div>

              {/* Grid thống kê */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard 
                  title="Tổng khóa học đã bán" 
                  value={stat.totalCoursesSold} 
                  icon={BookOpen} 
                  colorClass="bg-blue-100 text-blue-600" 
                />
                
                <StatCard 
                  title="Tổng lợi nhuận thu lại" 
                  value={formatMillions(stat.totalProfit)} 
                  icon={Wallet} 
                  colorClass="bg-emerald-100 text-emerald-600" 
                />
                
                <StatCard 
                  title={stat.isCurrent ? "Hoa hồng dự kiến" : "Hoa hồng nhận được"} 
                  value={formatMillions(stat.commission)} 
                  icon={DollarSign} 
                  colorClass="bg-fuchsia-100 text-fuchsia-600"
                  highlight={true}
                />
                
                <StatCard 
                  title="Khóa học bán chạy nhất" 
                  value={stat.bestSellingCourse.name} 
                  icon={Trophy} 
                  colorClass="bg-amber-100 text-amber-600" 
                />
                
                <StatCard 
                  title="Lượt bán khóa học cao nhất" 
                  value={stat.highestCourseSales} 
                  icon={TrendingUp} 
                  colorClass="bg-rose-100 text-rose-600" 
                />
                
                <StatCard 
                  title="Tổng học viên mới tham gia" 
                  value={stat.newStudents} 
                  icon={Users} 
                  colorClass="bg-indigo-100 text-indigo-600" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}