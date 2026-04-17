import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  CircleDollarSign,
  BookMarked,
  UserPlus,
} from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";
import { useTabAdminStore } from "@/stores/useTabStore";

// ─── 1. Interface DTO - Cấu trúc dữ liệu API cần trả về ─────────────────────
// CHÚ THÍCH CHO BE: 
// Khi viết API lấy danh sách thông báo, bạn cần JOIN/include các bảng lại với nhau.
// Dữ liệu trả về cho FE sẽ là một mảng các object có cấu trúc như sau:

// ─── 2. Mock Data đã gộp chuẩn DTO ─────────────────────────────────────────


// ─── 3. UI Component Helper Types ──────────────────────────────────────────
interface PendingItem {
  id: string;
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

// ─── Custom Tooltip & Icons ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-pink-200 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-pink-600">
          {payload[0].value.toFixed(1)} tr VND
        </p>
      </div>
    );
  }
  return null;
};

const StudentIcon = () => (
  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
    <Users className="w-5 h-5 text-emerald-400" />
  </div>
);

const TeacherIcon = () => (
  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
    <GraduationCap className="w-5 h-5 text-blue-400" />
  </div>
);

const CourseIcon = () => (
  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
    <BookOpen className="w-5 h-5 text-pink-400" />
  </div>
);

const RevenueIcon = () => (
  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
    <CircleDollarSign className="w-5 h-5 text-amber-500" />
  </div>
);

const BookIcon = () => (
  <div className="w-8 h-8 rounded-md bg-emerald-300 flex items-center justify-center">
    <BookMarked className="w-5 h-5 text-white" />
  </div>
);


// ─── Hàm Hỗ trợ Xử lý Thời gian ─────────────────────────────────────────────
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  // Fake logic format thời gian (Bạn có thể dùng thư viện date-fns hoặc dayjs sau)
  return `${date.getHours()} giờ trước`; 
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const {setTabActive} = useTabAdminStore()
  // Lấy dữ liệu từ Store
  const { students, teachers, courses, payments, waitCourses,receivedNotifications } = useAdminStore();

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handlePendingItemClick = (id: string, label: string) => {
    setTabActive('courses')
  };

  

  const handleViewAllNotifications = () => {
    setTabActive('notification')
  };

  // ─── Tính toán Dữ liệu Hiển thị ───────────────────────────────────────────
  const totalRevenue = (payments ?? [])
    .filter((p) => p.status == "SUCCESS")
    .reduce((s, p) => s + p.amount, 0);
  const totalRevenueTr = (totalRevenue / 1_000_000).toFixed(0);

  const monthlyRevenueData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const total = (payments ?? [])
        .filter((p) => p.periodMonth === month && p.status == "SUCCESS")
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        month: `T${month}`,
        revenue: total / 1_000_000,
      };
    });
  }, [payments]);

  const pendingItems: PendingItem[] = [
    {
      id: "pending-courses",
      label: "Yêu cầu duyệt khóa học",
      count: waitCourses?.length ?? 0,
      color: "from-green-100 to-green-200",
      icon: <BookIcon />,
    },
    
  ];

  return (
    <div className="p-6 font-sans">
      {/* ── Greeting ── */}
      <h1 className="text-2xl font-bold text-gray-700 mb-5">
        Xin chào <span className="text-pink-500">Admin</span>!
      </h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng học viên", value: students?.length, icon: <StudentIcon />, accent: "text-green-600" },
          { label: "Tổng giáo viên", value: teachers?.length, icon: <TeacherIcon />, accent: "text-blue-500" },
          { label: "Tổng khóa học", value: courses?.length, icon: <CourseIcon />, accent: "text-pink-500" },
          { label: "Tổng doanh số", value: `${totalRevenueTr}tr VND`, icon: <RevenueIcon />, accent: "text-amber-500" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-white hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-xs text-gray-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-extrabold ${card.accent}`}>{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Chờ phê duyệt */}
          <div className="bg-pink-100/70 backdrop-blur rounded-2xl p-5 border border-pink-200/60">
            <h2 className="text-base font-semibold text-gray-600 mb-4">Chờ phê duyệt</h2>
            <div className="flex flex-col gap-3">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePendingItemClick(item.id, item.label)}
                  className={`bg-gradient-to-r ${item.color} rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="bg-white rounded-lg w-9 h-9 flex items-center justify-center text-gray-800 font-bold text-sm shadow-sm">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Doanh thu tháng */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-white shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-600">Doanh thu tháng</h2>
              <span className="text-xs bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-full">
                Năm 2026
              </span>
            </div>

            {/* Summary row */}
            <div className="flex gap-4 mb-4">
              <div className="bg-pink-50 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-400">Cao nhất</p>
                <p className="text-sm font-bold text-pink-500">
                  {Math.max(...monthlyRevenueData.map((d) => d.revenue)).toFixed(1)} tr
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-400">Trung bình</p>
                <p className="text-sm font-bold text-purple-500">
                  {(
                    monthlyRevenueData.reduce((s, d) => s + d.revenue, 0) / 12
                  ).toFixed(1)}{" "}
                  tr
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-400">Tổng năm</p>
                <p className="text-sm font-bold text-amber-500">{totalRevenueTr} tr</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={monthlyRevenueData}
                barSize={22}
                onMouseLeave={() => setActiveBar(null)}
              >
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}tr`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(244,114,182,0.08)" }} />
                <Bar
                  dataKey="revenue"
                  fill="url(#barGrad)"
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(_, index) =>
                    setActiveBar(monthlyRevenueData[index].month)
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column — Thông báo gần đây */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-white shadow-sm">
          <h2 className="text-base font-semibold text-gray-600 mb-4">Thông báo gần đây:</h2>
          <div className="flex flex-col gap-3">
            {receivedNotifications?.map((ntf) => (
              <div
                key={ntf.id}
                className="bg-gray-50 hover:bg-pink-50 rounded-xl px-3 py-3 flex items-start gap-3 cursor-pointer transition-colors"
              >
                <img
                  src={ntf.senderAvatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-pink-100"
                />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{ntf.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(ntf.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View all button */}
          <button 
            onClick={handleViewAllNotifications}
            className="mt-4 w-full text-center text-xs text-pink-500 font-semibold py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition"
          >
            Xem tất cả thông báo →
          </button>
        </div>
      </div>
    </div>
  );
}