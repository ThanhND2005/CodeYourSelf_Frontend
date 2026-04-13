import { useState, useEffect } from "react";

// =============================================
// TYPES - Định nghĩa kiểu dữ liệu theo CSDL
// =============================================

/** Bảng Teacher trong CSDL */
interface Teacher {
  userId: string;
  name: string;
  dob: string; // date dạng string "YYYY-MM-DD"
  address: string;
  phone: string;
  gender: string;
  deleted: number; // 0 = active, 1 = đã xóa
  createdAt: string;
  bankName: string;
  bankAccount: string;
  avatarUrl: string;
}

/** Bảng Salary trong CSDL */
interface Salary {
  salaryId: string;
  createdAt: string; // datetime
  amount: number; // decimal(10,2)
  teacherId: string;
  deleted: number; // 0 = active, 1 = đã xóa
  status: string; // e.g. "PAID", "PENDING"
  qrUrl: string;
}

/** Dữ liệu tổng hợp cho card giáo viên (join Teacher + Salary) */
interface TeacherSalaryCard {
  teacher: Teacher;
  salary: Salary;
  coursesSold: number; // số khóa học bán được trong tháng
}

/** Thống kê tổng quan doanh thu */
interface RevenueStats {
  totalRevenue: number; // tổng doanh thu (VND)
  monthlyRevenue: number; // doanh thu tháng hiện tại
  currentMonth: number;
  paidCoursesSold: number; // số khóa học mất phí đã bán
  freeCoursesSold: number; // số khóa học miễn phí đã bán
  totalCoursesSold: number; // tổng khóa học đã bán
}

// =============================================
// MOCK DATA - Dữ liệu giả để phát triển UI
// =============================================

const MOCK_TEACHERS: Teacher[] = [
  {
    userId: "uuid-teacher-001",
    name: "Đào Vũ Đạt",
    dob: "2000-03-20",
    address: "Hà Đông, Hà Nội",
    phone: "0912345678",
    gender: "Nam",
    deleted: 0,
    createdAt: "2024-01-10T08:00:00",
    bankName: "Vietcombank",
    bankAccount: "1234567890",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    userId: "uuid-teacher-002",
    name: "Nguyễn Thị Lan",
    dob: "1998-07-15",
    address: "Cầu Giấy, Hà Nội",
    phone: "0987654321",
    gender: "Nữ",
    deleted: 0,
    createdAt: "2024-02-01T09:00:00",
    bankName: "Techcombank",
    bankAccount: "9876543210",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  {
    userId: "uuid-teacher-003",
    name: "Trần Minh Khoa",
    dob: "1995-11-30",
    address: "Đống Đa, Hà Nội",
    phone: "0901234567",
    gender: "Nam",
    deleted: 0,
    createdAt: "2024-01-20T10:00:00",
    bankName: "MB Bank",
    bankAccount: "1122334455",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
  },
];

const MOCK_SALARIES: Salary[] = [
  {
    salaryId: "uuid-salary-001",
    createdAt: "2025-03-31T00:00:00",
    amount: 2400000,
    teacherId: "uuid-teacher-001",
    deleted: 0,
    status: "PAID",
    qrUrl: "https://example.com/qr/001.png",
  },
  {
    salaryId: "uuid-salary-002",
    createdAt: "2025-03-31T00:00:00",
    amount: 3600000,
    teacherId: "uuid-teacher-002",
    deleted: 0,
    status: "PENDING",
    qrUrl: "https://example.com/qr/002.png",
  },
  {
    salaryId: "uuid-salary-003",
    createdAt: "2025-03-31T00:00:00",
    amount: 1800000,
    teacherId: "uuid-teacher-003",
    deleted: 0,
    status: "PAID",
    qrUrl: "https://example.com/qr/003.png",
  },
];

const MOCK_COURSES_SOLD: Record<string, number> = {
  "uuid-teacher-001": 3,
  "uuid-teacher-002": 5,
  "uuid-teacher-003": 2,
};

const MOCK_REVENUE_STATS: RevenueStats = {
  totalRevenue: 82000000,
  monthlyRevenue: 48000000,
  currentMonth: 3,
  paidCoursesSold: 10,
  freeCoursesSold: 12,
  totalCoursesSold: 34,
};

// =============================================
// API FUNCTIONS - Hàm gọi API (sẵn để tích hợp)
// =============================================

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:8080/api";

/** Lấy thống kê doanh thu tổng quan */
async function fetchRevenueStats(): Promise<RevenueStats> {
  // TODO: thay bằng endpoint thực tế
  // const res = await fetch(`${BASE_URL}/admin/revenue/stats`);
  // if (!res.ok) throw new Error("Lỗi lấy thống kê doanh thu");
  // return res.json();
  return Promise.resolve(MOCK_REVENUE_STATS);
}

/** Lấy danh sách hóa đơn thu nhập giáo viên theo tháng */
async function fetchTeacherSalaries(month: number, year: number): Promise<TeacherSalaryCard[]> {
  // TODO: thay bằng endpoint thực tế
  // const res = await fetch(`${BASE_URL}/admin/salaries?month=${month}&year=${year}`);
  // if (!res.ok) throw new Error("Lỗi lấy danh sách hóa đơn");
  // return res.json();

  // Ghép mock data Teacher + Salary + CoursesSold
  const cards: TeacherSalaryCard[] = MOCK_SALARIES.filter((s) => s.deleted === 0).map((salary) => {
    const teacher = MOCK_TEACHERS.find((t) => t.userId === salary.teacherId)!;
    return {
      teacher,
      salary,
      coursesSold: MOCK_COURSES_SOLD[teacher.userId] ?? 0,
    };
  });
  return Promise.resolve(cards);
}

/** Xóa mềm một hóa đơn (đặt deleted = 1) */
async function deleteSalaryById(salaryId: string): Promise<void> {
  // TODO: thay bằng endpoint thực tế
  // const res = await fetch(`${BASE_URL}/admin/salaries/${salaryId}`, { method: "DELETE" });
  // if (!res.ok) throw new Error("Lỗi xóa hóa đơn");
  console.log(`[API] Xóa hóa đơn salaryId=${salaryId}`);
  return Promise.resolve();
}

/** Xuất tất cả hóa đơn dưới dạng file (PDF / Excel) */
async function exportSalaryInvoices(month: number, year: number): Promise<void> {
  // TODO: thay bằng endpoint thực tế (trả về blob)
  // const res = await fetch(`${BASE_URL}/admin/salaries/export?month=${month}&year=${year}`);
  // const blob = await res.blob();
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a"); a.href = url; a.download = `hoadon_${month}_${year}.pdf`; a.click();
  console.log(`[API] Xuất hóa đơn tháng ${month}/${year}`);
  alert(`Xuất hóa đơn tháng ${month}/${year} thành công! (mock)`);
}

// =============================================
// HELPER - Hàm tiện ích
// =============================================

/** Định dạng số tiền sang dạng triệu đồng */
function formatMillions(value: number): string {
  return `${(value / 1_000_000).toLocaleString("vi-VN")} tr (VND)`;
}

/** Định dạng ngày sinh từ "YYYY-MM-DD" sang "DD-MM-YYYY" */
function formatDob(dob: string): string {
  const [y, m, d] = dob.split("-");
  return `${d}-${m}-${y}`;
}

/** Lấy tháng từ chuỗi datetime */
function getMonthFromDate(dateStr: string): number {
  return new Date(dateStr).getMonth() + 1;
}

// =============================================
// SUB-COMPONENTS
// =============================================

/** Card thống kê tổng quan */
function StatCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <div className="bg-pink-100 rounded-2xl px-6 py-5 min-h-[90px] flex items-center">
        {children}
      </div>
    </div>
  );
}

/** Huy hiệu tháng màu vàng */
function MonthBadge({ month }: { month: number }) {
  return (
    <span className="inline-flex items-center justify-center bg-yellow-300 text-gray-900 font-bold rounded-md px-3 py-1 text-lg mx-2">
      {month}
    </span>
  );
}

/** Card hóa đơn giáo viên */
function TeacherInvoiceCard({
  data,
  onDelete,
}: {
  data: TeacherSalaryCard;
  onDelete: (salaryId: string) => void;
}) {
  const { teacher, salary, coursesSold } = data;
  const salaryMonth = getMonthFromDate(salary.createdAt);

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm">
      {/* Ảnh đại diện giáo viên */}
      <img
        src={teacher.avatarUrl}
        alt={teacher.name}
        className="w-20 h-20 rounded-full object-cover bg-gray-200"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://i.pinimg.com/736x84/a.jpg"; // fallback
        }}
      />

      {/* Thông tin giáo viên */}
      <div className="text-sm text-gray-700 w-full space-y-1">
        <p>
          <span className="font-semibold">Họ và tên:</span> {teacher.name}
        </p>
        <p>
          <span className="font-semibold">Ngày sinh:</span>{" "}
          {formatDob(teacher.dob)}
        </p>
        <p>
          <span className="font-semibold">Giới tính:</span> {teacher.gender}
        </p>
        <p>
          <span className="font-semibold">Địa chỉ:</span> {teacher.address}
        </p>
        <p>
          <span className="font-semibold">Lương tháng:</span> tháng{" "}
          {salaryMonth}
        </p>
        <p>
          <span className="font-semibold">Số khóa học bán được:</span>{" "}
          {coursesSold}
        </p>
        <p>
          <span className="font-semibold">Tổng thu nhập:</span>{" "}
          {formatMillions(salary.amount)}
        </p>
        {/* Trạng thái thanh toán */}
        <p>
          <span className="font-semibold">Trạng thái:</span>{" "}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              salary.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {salary.status === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
          </span>
        </p>
      </div>

      {/* Nút xóa hóa đơn */}
      <button
        onClick={() => onDelete(salary.salaryId)}
        className="mt-2 w-full bg-purple-700 hover:bg-purple-800 active:scale-95 transition-all text-white font-semibold rounded-xl py-2 text-sm"
      >
        Xóa
      </button>
    </div>
  );
}

// =============================================
// MAIN COMPONENT - Trang Doanh Số
// =============================================

export default function DoanhSoPage() {
  // State thống kê doanh thu
  const [stats, setStats] = useState<RevenueStats | null>(null);
  // State danh sách hóa đơn giáo viên
  const [invoices, setInvoices] = useState<TeacherSalaryCard[]>([]);
  // State loading
  const [loading, setLoading] = useState(true);
  // State lọc theo tháng (mặc định tháng hiện tại)
  const [selectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear] = useState<number>(new Date().getFullYear());

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    loadPageData();
  }, [selectedMonth, selectedYear]);

  /** Tải toàn bộ dữ liệu trang */
  async function loadPageData() {
    setLoading(true);
    try {
      const [statsData, invoicesData] = await Promise.all([
        fetchRevenueStats(),
        fetchTeacherSalaries(selectedMonth, selectedYear),
      ]);
      setStats(statsData);
      setInvoices(invoicesData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu trang doanh số:", err);
    } finally {
      setLoading(false);
    }
  }

  /** Xử lý xóa một hóa đơn giáo viên */
  async function handleDeleteInvoice(salaryId: string) {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa hóa đơn này không?"
    );
    if (!confirmed) return;

    try {
      await deleteSalaryById(salaryId);
      // Cập nhật state local sau khi xóa thành công
      setInvoices((prev) =>
        prev.filter((item) => item.salary.salaryId !== salaryId)
      );
    } catch (err) {
      console.error("Lỗi xóa hóa đơn:", err);
      alert("Xóa hóa đơn thất bại!");
    }
  }

  /** Xử lý xuất hóa đơn */
  async function handleExportInvoices() {
    try {
      await exportSalaryInvoices(selectedMonth, selectedYear);
    } catch (err) {
      console.error("Lỗi xuất hóa đơn:", err);
      alert("Xuất hóa đơn thất bại!");
    }
  }

  // Hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-purple-600 text-lg font-semibold animate-pulse">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ===== KHU VỰC THỐNG KÊ TỔNG QUAN ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card tổng doanh thu */}
        <StatCard title="Tổng doanh thu:">
          <span className="text-3xl font-extrabold text-gray-900">
            {stats ? formatMillions(stats.totalRevenue) : "—"}
          </span>
        </StatCard>

        {/* Card doanh thu tháng */}
        <StatCard title="Doanh thu tháng:">
          <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
            <span>Tháng</span>
            <MonthBadge month={stats?.currentMonth ?? selectedMonth} />
            <span>{stats ? formatMillions(stats.monthlyRevenue) : "—"}</span>
          </div>
        </StatCard>

        {/* Card khóa học đã bán */}
        <StatCard title="Khóa học đã bán:">
          <div className="flex items-start gap-2 text-sm text-gray-800 font-semibold">
            <div className="flex items-center gap-1">
              <span>Tháng</span>
              <MonthBadge month={stats?.currentMonth ?? selectedMonth} />
            </div>
            <div className="space-y-0.5">
              <p>Mất phí: {stats?.paidCoursesSold ?? 0}</p>
              <p>Miễn phí: {stats?.freeCoursesSold ?? 0}</p>
              <p className="font-extrabold">
                Tổng khóa đã bán: {stats?.totalCoursesSold ?? 0}
              </p>
            </div>
          </div>
        </StatCard>
      </div>

      {/* ===== KHU VỰC HÓA ĐƠN GIÁO VIÊN ===== */}
      <div className="bg-pink-100 rounded-3xl p-6 space-y-5">
        {/* Tiêu đề + nút xuất hóa đơn */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            Hóa đơn thu nhập giáo viên trong hệ thống:
          </h2>
          <button
            onClick={handleExportInvoices}
            className="bg-purple-700 hover:bg-purple-800 active:scale-95 transition-all text-white font-semibold rounded-2xl px-6 py-3 text-sm shadow-md"
          >
            Xuất hóa đơn
          </button>
        </div>

        {/* Danh sách card giáo viên */}
        {invoices.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Không có hóa đơn nào trong tháng này.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((item) => (
              <TeacherInvoiceCard
                key={item.salary.salaryId}
                data={item}
                onDelete={handleDeleteInvoice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}