import { useState, useMemo, useEffect } from "react";
import { Download, QrCode, Trash2, X } from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";
import type { Salary, Teacher } from "@/types/admin";
import { AdminServices } from "@/services/AdminService";

// =============================================
// TYPES
// =============================================
interface TeacherSalaryCard {
  teacher: Teacher;
  salary: Salary;
}

interface RevenueStats {
  totalRevenue: number; 
  monthlyRevenue: number; 
  currentMonth: number;
  totalCoursesSoldInMonth: number; 
}

// =============================================
// HELPER
// =============================================
function formatMillions(value: number): string {
  return `${value.toLocaleString("vi-VN")} vnđ`;
}

// =============================================
// SUB-COMPONENTS
// =============================================
function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <div className="bg-pink-100 rounded-2xl px-6 py-5 min-h-[90px] flex items-center">
        {children}
      </div>
    </div>
  );
}

function MonthBadge({ month }: { month: number }) {
  return (
    <span className="inline-flex items-center justify-center bg-yellow-300 text-gray-900 font-bold rounded-md px-3 py-1 text-lg mx-2">
      {month}
    </span>
  );
}

function TeacherInvoiceCard({
  data,
  onDelete,
  onViewQR,
}: {
  data: TeacherSalaryCard;
  onDelete: (salaryId: string) => void;
  onViewQR: (qrUrl: string) => void;
}) {
  const { teacher, salary } = data;
  const setSalary = useAdminStore((state) => state.setSalary);
  useEffect(() =>{
    if(!salary) return
    let interval : ReturnType<typeof setInterval>
    if(salary.status == "PENDING"){
      interval = setInterval(async () =>{
        try {
          console.log(salary.salaryId)
          const salary1 = await AdminServices.getTeacherBill(salary.salaryId)
          if(salary1 && salary1.status == "PAID"){
            const {teacherBills} = await AdminServices.getSalary()
            setSalary(teacherBills)
            clearInterval(interval)
          }
        } catch (error) {
          console.error(error)
        }
      },5000)
    }
    return () => {
      if(interval){
        clearInterval(interval)
      }
    }
  },[salary.status,salary.salaryId])
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm min-w-[320px] max-w-[320px] flex-shrink-0 snap-center border border-gray-100 relative">
      <button 
        onClick={() => onDelete(salary.salaryId)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        title="Xóa hóa đơn"
      >
        <Trash2 size={18} />
      </button>

      <img
        src={teacher.avatarUrl}
        alt={teacher.name}
        className="w-20 h-20 rounded-full object-cover bg-gray-200 border-2 border-pink-100"
      />

      <div className="text-sm text-gray-700 w-full space-y-1.5 mt-2">
        <p className="flex justify-between border-b pb-1">
          <span className="font-semibold">Họ và tên:</span> <span className="font-medium text-gray-900">{teacher.name}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-semibold">Kỳ lương:</span> <span>Tháng {salary.periodMonth}/{salary.periodYear}</span>
        </p>
        <p className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mt-2">
          <span className="font-bold text-gray-900">Thu nhập:</span> 
          <span className="font-bold text-purple-700 text-base">{formatMillions(salary.amount)}</span>
        </p>
        
        <div className="flex justify-between items-center pt-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              salary.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {salary.status === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
          </span>
          
          <button 
            onClick={() => onViewQR(salary.qrUrl)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            <QrCode size={14} /> Xem QR
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
export default function DoanhSoPage() {
  // Lấy dữ liệu trực tiếp từ store
  const payments = useAdminStore((state) => state.payments);
  const salaries = useAdminStore((state) => state.salary);
  const teachers = useAdminStore((state) => state.teachers);
  const {setSalary} = useAdminStore()
  // State filter và UI
  const [selectedMonth] = useState<number>(3); // Mặc định tháng 3 để test
  const [selectedYear] = useState<number>(2026);
  const [selectedQrUrl, setSelectedQrUrl] = useState<string | null>(null);

  // 1. Tự động tính toán RevenueStats
  const stats = useMemo<RevenueStats>(() => {
    const successfulPayments = payments?.filter(p => p.status === "SUCCESS") || [];
    
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const currentMonthPayments = successfulPayments.filter(
      p => p.periodMonth === selectedMonth && p.periodYear === selectedYear
    );
    
    const monthlyRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCoursesSoldInMonth = currentMonthPayments.length;

    return {
      totalRevenue,
      monthlyRevenue,
      currentMonth: selectedMonth,
      totalCoursesSoldInMonth
    };
  }, [payments, selectedMonth, selectedYear]);

  // 2. Tự động lấy danh sách hóa đơn theo tháng/năm
  const invoices = useMemo<TeacherSalaryCard[]>(() => {
    if (!salaries || !teachers) return [];

    const filtered = salaries?.filter(s => s.periodMonth === selectedMonth && s.periodYear === selectedYear);
    
    const cards = filtered.map(salary => {
      const teacher = teachers.find(t => t.userId === salary.teacherId);
      return { teacher, salary };
    }).filter(card => card.teacher !== undefined) as TeacherSalaryCard[];

    // Sắp xếp: Ưu tiên PENDING lên trước -> Sau đó đến thời gian tạo mới nhất
    return cards.sort((a, b) => {
      const statusPriority = { "PENDING": 0, "PAID": 1 };
      const priorityA = statusPriority[a.salary.status as keyof typeof statusPriority] ?? 99;
      const priorityB = statusPriority[b.salary.status as keyof typeof statusPriority] ?? 99;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      const timeA = new Date(a.salary.createdAt).getTime();
      const timeB = new Date(b.salary.createdAt).getTime();
      return timeB - timeA;
    });
  }, [salaries, teachers, selectedMonth, selectedYear]);


  // =============================================
  // HANDLERS
  // =============================================
  
  const handleDeleteInvoice = async (salaryId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa hóa đơn này không?")) return;
    try {
      console.log(`[API] Xóa hóa đơn salaryId=${salaryId}`);
      // Thực hiện logic gọi API hoặc cập nhật lại Zustand store ở đây
      // Ví dụ: useAdminStore.getState().deleteSalary(salaryId);
      
      alert('Đã xóa thành công!');
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const handleExportInvoices = async () => {
    try {
      await AdminServices.postSalary()
      const {teacherBills} = await AdminServices.getSalary()
      setSalary(teacherBills) 
    } catch (error) {
      console.error(error)
    }
  };

  // Do data đã có sẵn ở Store, không cần màn hình Loading nữa. 
  // Chỉ render UI ngay lập tức.
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen relative">
      {/* ===== THỐNG KÊ TỔNG QUAN ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng doanh thu:">
          <span className="text-3xl font-extrabold text-gray-900">
            {formatMillions(stats.totalRevenue)}
          </span>
        </StatCard>

        <StatCard title="Doanh thu tháng:">
          <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
            <span>Tháng</span>
            <MonthBadge month={stats.currentMonth} />
            <span>{formatMillions(stats.monthlyRevenue)}</span>
          </div>
        </StatCard>

        <StatCard title="Khóa học đã bán:">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span>Tháng</span>
            <MonthBadge month={stats.currentMonth} />
            <span>{stats.totalCoursesSoldInMonth} khóa</span>
          </div>
        </StatCard>
      </div>

      {/* ===== HÓA ĐƠN GIÁO VIÊN (SCROLL NGANG) ===== */}
      <div className="bg-pink-100 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            Hóa đơn thu nhập giáo viên tháng {selectedMonth}/{selectedYear}:
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleExportInvoices}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white active:scale-95 transition-all font-semibold rounded-xl px-5 py-2.5 text-sm shadow-md"
            >
              <Download size={18} /> Xuất dữ liệu
            </button>
          </div>
        </div>

        {invoices.length === 0 ? (
          <p className="text-center text-gray-500 py-10 bg-white/50 rounded-2xl">
            Không có hóa đơn nào trong tháng này.
          </p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory hide-scrollbar">
            {invoices.map((item) => (
              <TeacherInvoiceCard
                key={item.salary.salaryId}
                data={item}
                onDelete={handleDeleteInvoice}
                onViewQR={setSelectedQrUrl}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== DIALOG XEM MÃ QR ===== */}
      {selectedQrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedQrUrl(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-800">Mã QR Thanh Toán</h3>
            <div className="bg-gray-50 p-4 rounded-xl border w-full flex justify-center">
              <img 
                src={selectedQrUrl} 
                alt="QR Code" 
                className="w-48 h-48 object-contain"
                onError={(e) => {(e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=L%E1%BB%97i+QR"}}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Quét mã này bằng ứng dụng ngân hàng để thực hiện thanh toán lương cho giáo viên.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}