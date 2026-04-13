import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Mock data tuân thủ theo CSDL ───────────────────────────────────────────

interface Payment {
  paymentId: string;
  createdAt: string;
  amount: number;
  courseId: string;
  studentId: string;
  qrUrl: string;
  status: string;
  deleted: number;
}

interface NotificationManagement {
  notificationId: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  deleted: number;
  // Thêm trường phụ để hiển thị UI
  message: string;
  timeAgo: string;
  avatarUrl: string;
}

interface PendingItem {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const mockPayments: Payment[] = [
  { paymentId: "pay-001", createdAt: "2025-01-15", amount: 5500000, courseId: "crs-001", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-002", createdAt: "2025-02-10", amount: 7200000, courseId: "crs-002", studentId: "acc-005", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-003", createdAt: "2025-03-05", amount: 6800000, courseId: "crs-003", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-004", createdAt: "2025-04-20", amount: 9100000, courseId: "crs-001", studentId: "acc-005", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-005", createdAt: "2025-05-12", amount: 8300000, courseId: "crs-002", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-006", createdAt: "2025-06-08", amount: 11500000, courseId: "crs-004", studentId: "acc-005", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-007", createdAt: "2025-07-25", amount: 10200000, courseId: "crs-003", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-008", createdAt: "2025-08-14", amount: 7900000, courseId: "crs-001", studentId: "acc-005", qrUrl: "", status: "pending", deleted: 0 },
  { paymentId: "pay-009", createdAt: "2025-09-03", amount: 12400000, courseId: "crs-002", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-010", createdAt: "2025-10-18", amount: 9800000, courseId: "crs-004", studentId: "acc-005", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-011", createdAt: "2025-11-07", amount: 13600000, courseId: "crs-003", studentId: "acc-004", qrUrl: "", status: "completed", deleted: 0 },
  { paymentId: "pay-012", createdAt: "2025-12-22", amount: 15200000, courseId: "crs-001", studentId: "acc-005", qrUrl: "", status: "completed", deleted: 0 },
];

const mockNotifications: NotificationManagement[] = [
  {
    notificationId: "ntf-001",
    senderId: "acc-004",
    senderRole: "student",
    receiverId: "99fdb54e-27e2-11f1-a6e5-2e8453cbf53b",
    receiverRole: "admin",
    deleted: 0,
    message: "Đã đăng ký khóa NodeJS",
    timeAgo: "5 phút trước",
    avatarUrl: "https://i.pravatar.cc/40?img=11",
  },
  {
    notificationId: "ntf-002",
    senderId: "5f17ed17-2eb4-11f1-89de-f68e7b428a1a",
    senderRole: "teacher",
    receiverId: "99fdb54e-27e2-11f1-a6e5-2e8453cbf53b",
    receiverRole: "admin",
    deleted: 0,
    message: "Yêu cầu duyệt khóa python cơ bản",
    timeAgo: "30 phút trước",
    avatarUrl: "https://i.pravatar.cc/40?img=23",
  },
  {
    notificationId: "ntf-003",
    senderId: "acc-005",
    senderRole: "student",
    receiverId: "99fdb54e-27e2-11f1-a6e5-2e8453cbf53b",
    receiverRole: "admin",
    deleted: 0,
    message: "Đã đăng ký khóa C++",
    timeAgo: "5 giờ trước",
    avatarUrl: "https://i.pravatar.cc/40?img=32",
  },
  {
    notificationId: "ntf-004",
    senderId: "640f4cc6-302b-11f1-bab7-eae648f6a63f",
    senderRole: "student",
    receiverId: "99fdb54e-27e2-11f1-a6e5-2e8453cbf53b",
    receiverRole: "admin",
    deleted: 0,
    message: "Duyệt yêu cầu rút tiền của Thị Nguyệt",
    timeAgo: "5 giờ trước",
    avatarUrl: "https://i.pravatar.cc/40?img=45",
  },
  {
    notificationId: "ntf-005",
    senderId: "acc-004",
    senderRole: "student",
    receiverId: "99fdb54e-27e2-11f1-a6e5-2e8453cbf53b",
    receiverRole: "admin",
    deleted: 0,
    message: "Đăng ký khóa C++",
    timeAgo: "1 ngày trước",
    avatarUrl: "https://i.pravatar.cc/40?img=57",
  },
];

// ─── Tính doanh thu theo tháng từ bảng Payment ──────────────────────────────
const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const total = mockPayments
    .filter((p) => {
      const m = new Date(p.createdAt).getMonth() + 1;
      return m === month && p.status === "completed" && p.deleted === 0;
    })
    .reduce((sum, p) => sum + p.amount, 0);
  return {
    month: `T${month}`,
    revenue: total / 1_000_000, // đơn vị: triệu VND
  };
});

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
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

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
const StudentIcon = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
    <circle cx="20" cy="20" r="20" fill="#d1fae5" />
    <circle cx="20" cy="15" r="6" fill="#34d399" />
    <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#34d399" />
  </svg>
);

const TeacherIcon = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
    <circle cx="20" cy="20" r="20" fill="#dbeafe" />
    <circle cx="20" cy="15" r="6" fill="#60a5fa" />
    <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#60a5fa" />
  </svg>
);

const CourseIcon = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
    <circle cx="20" cy="20" r="20" fill="#fce7f3" />
    <rect x="11" y="10" width="18" height="22" rx="3" fill="#f472b6" />
    <path d="M15 16h10M15 20h10M15 24h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 25l3 3" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
    <circle cx="27" cy="27" r="3" fill="#f9a8d4" />
    <path d="M26 27l1 1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RevenueIcon = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
    <circle cx="20" cy="20" r="20" fill="#fef3c7" />
    <circle cx="20" cy="20" r="9" stroke="#f59e0b" strokeWidth="2" />
    <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f59e0b">$</text>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#86efac" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FormIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#a78bfa" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="17" cy="16" r="2" fill="white" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const totalStudents = 165;
  const totalTeachers = 24;
  const totalCourses = 34;
  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed" && p.deleted === 0)
    .reduce((s, p) => s + p.amount, 0);
  const totalRevenueTr = (totalRevenue / 1_000_000).toFixed(0);

  const pendingItems: PendingItem[] = [
    {
      label: "Yêu cầu duyệt khóa học",
      count: 5,
      color: "from-green-100 to-green-200",
      icon: <BookIcon />,
    },
    {
      label: "Đơn đăng kí ứng tuyển giáo viên",
      count: 2,
      color: "from-purple-100 to-purple-200",
      icon: <FormIcon />,
    },
  ];

  return (
    <div className=" p-6 font-sans">
      {/* ── Greeting ── */}
      <h1 className="text-2xl font-bold text-gray-700 mb-5">
        Xin chào <span className="text-pink-500">Admin</span>!
      </h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng học viên", value: totalStudents, icon: <StudentIcon />, accent: "text-green-600" },
          { label: "Tổng giáo viên", value: totalTeachers, icon: <TeacherIcon />, accent: "text-blue-500" },
          { label: "Tổng khóa học", value: totalCourses, icon: <CourseIcon />, accent: "text-pink-500" },
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
              {pendingItems.map((item, i) => (
                <div
                  key={i}
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
                Năm 2025
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
            {mockNotifications
              .filter((n) => n.deleted === 0)
              .map((ntf) => (
                <div
                  key={ntf.notificationId}
                  className="bg-gray-50 hover:bg-pink-50 rounded-xl px-3 py-3 flex items-start gap-3 cursor-pointer transition-colors"
                >
                  <img
                    src={ntf.avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-pink-100"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{ntf.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{ntf.timeAgo}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* View all button */}
          <button className="mt-4 w-full text-center text-xs text-pink-500 font-semibold py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition">
            Xem tất cả thông báo →
          </button>
        </div>
      </div>
    </div>
  );
}