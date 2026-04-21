import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  CheckCircle2,
  X,
  CreditCard,
  ReceiptText,
  Code,
  FileCode2,
  Database,
  GitBranch,
  LayoutTemplate,
  Loader2
} from "lucide-react";
import { StudentService } from "@/services/StudentService";

// --- 1. TYPES & MOCK DATA (Chuẩn theo DB Schema) ---
export interface Course {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  teacherId: string;
  rate: number;
  multipleCourseId: string; 
  status: string;
  imageUrl: string;
  createdAt: string;
}

export interface RoadmapStep {
  id: string; 
  title: string;
  icon: React.ElementType;
  searchKeyword: string; // Đã thêm keyword để tìm kiếm API
}

export interface Roadmap {
  id: string;
  name: string;
  steps: RoadmapStep[];
}

const ROADMAPS: Roadmap[] = [
  {
    id: "rm_backend",
    name: "Backend Web",
    steps: [
      { id: "step_html", title: "HTML", icon: FileCode2, searchKeyword: "html" },
      { id: "step_css", title: "CSS", icon: LayoutTemplate, searchKeyword: "css" },
      { id: "step_js", title: "Backend Language", icon: Code, searchKeyword: "nodejs" }, // VD tìm NodeJS
      { id: "step_git", title: "GIT", icon: GitBranch, searchKeyword: "git" },
      { id: "step_db", title: "Database", icon: Database, searchKeyword: "sql" },
      { id: "step_fw", title: "Framework", icon: Code, searchKeyword: "nestjs" }, // Cập nhật theo Stack của bạn
    ],
  },
  {
    id: "rm_frontend",
    name: "Frontend Web",
    steps: [
      { id: "step_html", title: "HTML", icon: FileCode2, searchKeyword: "html" },
      { id: "step_css", title: "CSS", icon: LayoutTemplate, searchKeyword: "tailwind" }, // VD tìm Tailwind
      { id: "step_js", title: "JavaScript Pro", icon: Code, searchKeyword: "javascript" },
      { id: "step_git", title: "GIT", icon: GitBranch, searchKeyword: "git" },
      { id: "step_fw_fe", title: "Framework UI", icon: LayoutTemplate, searchKeyword: "reactjs" },
    ],
  },
];

// --- 2. ZOD SCHEMA & FORM VALIDATION ---
const courseSchema = z.object({
  courseId: z.string(),
  name: z.string(),
  cost: z.number(),
  teacherId: z.string(),
  rate: z.number(),
}).passthrough(); 

const roadmapSchema = z.object({
  roadmapId: z.string().min(1, "Vui lòng chọn một roadmap để bắt đầu"),
  selectedCourses: z.record(z.string(), courseSchema).refine(
    (data) => Object.keys(data).length > 0,
    { message: "Vui lòng chọn ít nhất một khóa học" }
  ),
});

type RoadmapFormValues = z.infer<typeof roadmapSchema>;

// --- 3. MAIN COMPONENT ---
export default function StudentRoadmapSelected() {
  const [activeStep, setActiveStep] = useState<RoadmapStep | null>(null);
  
  // State quản lý API và UI
  const [activeStepCourses, setActiveStepCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{ total: number, qrData: string } | null>(null);
  
  const [showInvoice, setShowInvoice] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { watch, setValue, handleSubmit, formState: { errors } } = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      roadmapId: "",
      selectedCourses: {},
    },
  });

  const selectedRoadmapId = watch("roadmapId");
  const selectedCoursesMap = watch("selectedCourses");
  const currentRoadmap = ROADMAPS.find((r) => r.id === selectedRoadmapId);

  // --- 4. HANDLERS ---
  const handleRoadmapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("roadmapId", e.target.value);
    setValue("selectedCourses", {}); 
    setShowInvoice(false);
    setShowQR(false);
  };

  const handleOpenCourseSelect = async (step: RoadmapStep) => {
    setActiveStep(step);
    setIsLoadingCourses(true);
    setActiveStepCourses([]); // Reset list cũ
    
    try {
      // TODO: Thay thế bằng API Fetch thực tế sử dụng searchKeyword
      // Ví dụ: GET /api/courses?keyword=nodejs
      // const res = await fetch(`YOUR_API_URL/courses?keyword=${encodeURIComponent(step.searchKeyword)}`);
      // const data = await res.json();
      
      // MOCK CALL API (Giả lập mạng delay 600ms)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Tạo dữ liệu giả lập dựa trên keyword để dễ hình dung
      const {courseSearchs} = await StudentService.searchSingleCourse(step.searchKeyword)
      setActiveStepCourses(courseSearchs);

    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleSelectCourse = (stepId: string, course: Course) => {
    setValue("selectedCourses", {
      ...selectedCoursesMap,
      [stepId]: course,
    });
    setActiveStep(null); 
  };

  const onSubmit = async (data: RoadmapFormValues) => {
    const requiredStepsCount = currentRoadmap?.steps.length || 0;
    const selectedStepsCount = Object.keys(data.selectedCourses).length;

    if (selectedStepsCount < requiredStepsCount) {
      alert("Vui lòng hoàn thành việc chọn khóa học cho tất cả các bước trong lộ trình!");
      return;
    }

    setIsSubmittingInvoice(true);
    try {
      // Dữ liệu sẽ gửi đi backend
      const payload = {
        roadmapId: data.roadmapId,
        selectedCourseIds: Object.values(data.selectedCourses).map(c => c.courseId)
      };

      // TODO: Thay bằng API thực tế
      // const res = await fetch(`YOUR_API_URL/invoices/create`, { method: 'POST', body: JSON.stringify(payload) });
      // const result = await res.json();

      // MOCK CALL API 
      await new Promise(resolve => setTimeout(resolve, 800));
      const calculatedTotal = Object.values(data.selectedCourses).reduce((sum, c) => sum + c.cost, 0);
      
      setInvoiceData({
        total: calculatedTotal,
        qrData: `PAY_${calculatedTotal}_CODEYOURSELF_${Date.now()}` // Mã sinh từ API backend
      });

      setShowInvoice(true);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const handlePayment = () => {
    setShowInvoice(false);
    setShowQR(true);
  };

  return (
    <div className="p-8 font-sans text-[#4a3b32] relative">
      {/* HEADER TÙY CHỌN ROADMAP */}
      <div className="flex justify-end mb-10 w-full max-w-4xl mx-auto">
        <select
          className="px-4 py-2 rounded-full border border-orange-200 shadow-sm outline-none bg-white font-medium min-w-[200px] focus:ring-2 focus:ring-orange-400"
          value={selectedRoadmapId}
          onChange={handleRoadmapChange}
        >
          <option value="" disabled>Chọn roadmap...</option>
          {ROADMAPS.map((rm) => (
            <option key={rm.id} value={rm.id}>{rm.name}</option>
          ))}
        </select>
      </div>

      {errors.roadmapId && !selectedRoadmapId && (
        <p className="text-center text-red-500 font-medium">{errors.roadmapId.message}</p>
      )}

      {/* LƯỢC ĐỒ (FLOWCHART) */}
      {currentRoadmap && (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center pb-20">
          {currentRoadmap.steps.map((step, index) => {
            const selectedCourseDetail = selectedCoursesMap[step.id];

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => handleOpenCourseSelect(step)}
                  className="w-full bg-white py-4 px-6 rounded-2xl shadow-sm border border-orange-100 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {selectedCourseDetail ? (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500" />
                      <step.icon className="text-orange-600" size={24} />
                      <span className="font-bold text-lg text-orange-900">{selectedCourseDetail.name}</span>
                    </>
                  ) : (
                    <span className="font-bold text-lg text-[#6d5b50]">{step.title}</span>
                  )}
                </div>

                {index < currentRoadmap.steps.length - 1 && (
                  <div className="py-3 text-orange-300">
                    <ArrowDown size={24} strokeWidth={2} />
                  </div>
                )}
              </React.Fragment>
            );
          })}

          <div className="mt-8 self-end">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmittingInvoice}
              className="bg-[#d97706] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b45309] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmittingInvoice ? <Loader2 className="animate-spin" size={20} /> : <ReceiptText size={20} />}
              Tổng / Xuất hóa đơn
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CHỌN KHÓA HỌC */}
      {activeStep && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border-t-[6px] border-orange-400">
            <button
              onClick={() => setActiveStep(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-800"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-[#4a3b32]">Chọn khóa học cho: {activeStep.title}</h2>
              
              {isLoadingCourses ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                   <Loader2 className="animate-spin text-orange-500" size={32} />
                   <p className="text-[#8c7365]">Đang tải dữ liệu khóa học...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
                  {activeStepCourses.map((course) => {
                    const isSelected = selectedCoursesMap[activeStep.id]?.courseId === course.courseId;

                    return (
                      <div key={course.courseId} className={`p-4 rounded-xl flex items-center justify-between transition-all ${
                        isSelected ? "bg-orange-50 border-l-4 border-orange-500 shadow-sm" : "bg-white border border-[#e8dfd8] hover:border-orange-300"
                      }`}>
                        <div>
                          <p className="font-bold text-[#4a3b32]">{course.name}</p>
                          <p className="text-sm text-[#8c7365]">Học phí: {course.cost === 0 ? "Miễn phí" : `${(course.cost / 1000)}k VNĐ`}</p>
                          <p className="text-sm text-[#8c7365]">Giáo viên: {course.teacherName}</p>
                          <p className="text-sm text-[#8c7365]">Đánh giá: {course.rate} ⭐</p>
                        </div>
                        <button
                          onClick={() => handleSelectCourse(activeStep.id, course)}
                          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                            isSelected ? "bg-orange-600 text-white" : "bg-[#f4ebe1] text-[#8c7365] hover:bg-orange-100 hover:text-orange-800"
                          }`}
                        >
                          {isSelected ? <CheckCircle2 size={18} /> : "Chọn"}
                        </button>
                      </div>
                    );
                  })}
                  {activeStepCourses.length === 0 && !isLoadingCourses && (
                    <p className="text-center text-gray-500 py-4">Chưa có khóa học nào cho kỹ năng này.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HÓA ĐƠN (INVOICE) */}
      {showInvoice && invoiceData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative border-[6px] border-[#d97706]">
             <button
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#4a3b32]"
            >
              <X size={24} />
            </button>
            <div className="flex justify-between items-start mb-6">
               <h2 className="text-2xl font-bold text-[#4a3b32]">Chi tiết lộ trình</h2>
               <div className="bg-orange-100 text-orange-600 p-4 rounded-full">
                 <ReceiptText size={40} />
               </div>
            </div>

            <div className="space-y-3 mb-8 text-lg">
              {currentRoadmap?.steps.map((step) => {
                const course = selectedCoursesMap[step.id];
                if (!course) return null;
                return (
                  <div key={course.courseId} className="flex justify-between items-center border-b border-[#f4ebe1] pb-2">
                    <div className="flex items-center gap-3 font-medium text-[#6d5b50]">
                       <step.icon size={20} className="text-orange-500" />
                       {course.name}
                    </div>
                    <div className="font-semibold text-[#4a3b32]">
                      {course.cost === 0 ? "0 VNĐ" : `${(course.cost / 1000)}k VNĐ`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-3xl font-bold text-[#b45309]">
                Tổng: {(invoiceData.total / 1000)}k VNĐ
              </div>
              <button
                onClick={handlePayment}
                className="bg-[#d97706] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b45309] transition-colors flex items-center gap-2"
              >
                <CreditCard size={20} />
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR THANH TOÁN */}
      {showQR && invoiceData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl flex flex-col items-center relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#4a3b32]"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-[#d97706] mb-6">Mã VietQR</h2>
            
            <div className="bg-white p-4 border-4 border-orange-50 rounded-2xl shadow-sm mb-6">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${invoiceData.qrData}`} 
                 alt="QR Thanh Toan" 
                 className="w-48 h-48 object-contain"
               />
            </div>

            <div className="text-center space-y-1 text-sm font-medium text-[#4a3b32]">
              <p className="text-orange-600 text-lg font-bold mb-2">Số tiền: {invoiceData.total.toLocaleString('vi-VN')} VNĐ</p>
              <p>Nội dung CK: <span className="font-bold">THANH TOAN ROADMAP</span></p>
            </div>

            <button
              onClick={() => {
                alert("Đã xác nhận thanh toán thành công!");
                setShowQR(false);
              }}
              className="mt-8 bg-[#d97706] text-white w-full py-3 rounded-xl font-bold shadow-md hover:bg-[#b45309] transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}