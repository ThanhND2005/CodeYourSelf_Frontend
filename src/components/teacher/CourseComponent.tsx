import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit, PlaySquare, X,
  BookOpen, Layers, CheckCircle, PlusCircle, MinusCircle, Camera, Image as ImageIcon, Upload, Film
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// --- BƯỚC 1: ĐỊNH NGHĨA TYPES ---

interface Course {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  teacherId: string;
  rate: number;
  multipleCourseId: string | null;
  status: string;
  imageUrl: string;
}

interface MultipleCourse {
  multipleCourseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  rate: number;
  teacherId: string;
  imageUrl: string;
}

interface VideoLesson {
  videoId: string;
  title: string;
  duration: string;
  description?: string; // Thêm trường description
}

// --- BƯỚC 2: ZOD SCHEMAS CHO VALIDATE FORM ---

const courseSchema = z.object({
  name: z.string().min(5, 'Tên phải có ít nhất 5 ký tự'),
  cost: z.coerce.number().min(0, 'Giá không được âm'),
  summary: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  imageUrl: z.string().optional(),
});

// Schema cho Upload Video
const videoUploadSchema = z.object({
  title: z.string().min(5, 'Tiêu đề video ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả video ít nhất 10 ký tự'),
  videoFile: z.any()
    .refine((files) => files?.length === 1, "Vui lòng chọn 1 file video.")
    .refine((files) => files?.[0]?.size <= 10000 * 1024 * 1024, "Dung lượng tối đa 100MB.") // Giới hạn 100MB
    .refine(
      (files) => ["video/mp4", "video/webm", "video/quicktime"].includes(files?.[0]?.type),
      "Chỉ chấp nhận định dạng .mp4, .webm hoặc .mov"
    )
});

// Schema đặc biệt cho việc upload file ảnh
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageUploadSchema = z.object({
  file: z.any()
    .refine((files) => files?.length === 1, "Vui lòng chọn một tệp ảnh.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Kích thước ảnh tối đa là 5MB.")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Chỉ chấp nhận định dạng .jpg, .png, hoặc .webp."
    )
});

type CourseFormData = z.infer<typeof courseSchema>;
type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
type VideoUploadFormData = z.infer<typeof videoUploadSchema>; // Type cho form video

// --- BƯỚC 3: MOCK DATA ---

const MOCK_TEACHER_ID = 'uuid-teacher-123';

const initialMultipleCourses: MultipleCourse[] = [
  {
    multipleCourseId: 'm1',
    name: 'Combo Lập trình Game Toàn diện',
    cost: 1500000,
    summary: 'Bao gồm cả 2D và 3D Game Development.',
    deleted: 0,
    rate: 4.9,
    teacherId: MOCK_TEACHER_ID,
    imageUrl: 'https://picsum.photos/seed/combo1/200/200',
  }
];

const initialCourses: Course[] = [
  {
    courseId: 'c1',
    name: 'Web design basic',
    cost: 499000,
    summary: 'Khóa học thiết kế web cơ bản cho người mới bắt đầu.',
    deleted: 0,
    teacherId: MOCK_TEACHER_ID,
    rate: 4.5,
    multipleCourseId: null,
    status: 'Đã duyệt',
    imageUrl: 'https://picsum.photos/seed/course1/200/200',
  },
  {
    courseId: 'c2',
    name: '2D Games Development',
    cost: 899000,
    summary: 'Lập trình game 2D với các framework phổ biến.',
    deleted: 0,
    teacherId: MOCK_TEACHER_ID,
    rate: 4.8,
    multipleCourseId: 'm1',
    status: 'Chờ duyệt',
    imageUrl: 'https://picsum.photos/seed/course2/200/200',
  }
];

export default function CourseManagementComponent() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [multipleCourses, setMultipleCourses] = useState<MultipleCourse[]>(initialMultipleCourses);
  
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false);
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false); // State quản lý Dialog Video
  
  const [editingSingleCourse, setEditingSingleCourse] = useState<Course | null>(null);
  const [editingMultiCourse, setEditingMultiCourse] = useState<MultipleCourse | null>(null);
  
  const [courseVideos, setCourseVideos] = useState<VideoLesson[]>([]);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);

  // State lưu id khóa học đang được chọn để đổi ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetImageUpload, setTargetImageUpload] = useState<{id: string, type: 'single' | 'combo'} | null>(null);

  // --- THIẾT LẬP REACT-HOOK-FORM ---
  
  const createSingleForm = useForm<CourseFormData>({ resolver: zodResolver(courseSchema) });
  const createMultiForm = useForm<CourseFormData>({ resolver: zodResolver(courseSchema) });
  const editSingleForm = useForm<CourseFormData>({ resolver: zodResolver(courseSchema) });
  const editMultiForm = useForm<CourseFormData>({ resolver: zodResolver(courseSchema) });

  // Form thêm video
  const videoForm = useForm<VideoUploadFormData>({ resolver: zodResolver(videoUploadSchema) });

  // Hook form dành riêng cho chức năng Upload ảnh
  const imageForm = useForm<ImageUploadFormData>({ 
    resolver: zodResolver(imageUploadSchema) 
  });

  // --- MÔ PHỎNG API ---

  // API upload video thực tế
  const apiUploadVideoReal = async (courseId: string, data: VideoUploadFormData) => {
    setIsLoadingProcess(true);
    try {
      // Cách tạo FormData thực tế để gửi file lên server
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('name', data.title);
      formData.append('videoFile', data.videoFile[0]);

      // Mock gọi API (ví dụ: axios.post('/api/videos', formData))
      console.log("Đang upload dữ liệu:", formData);
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      return { 
        success: true, 
        data: { 
          videoId: `v-${Date.now()}`, 
          title: data.title, 
          duration: "15:00", // Giả lập server trả về độ dài video
          description: data.description 
        } 
      };
    } catch (error) {
      console.error("Lỗi upload video:", error);
      return { success: false };
    } finally {
      setIsLoadingProcess(false);
    }
  };

  const apiUpdateCourseImage = async (id: string, file: File, type: 'single' | 'combo') => {
    setIsLoadingProcess(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      const fakeUrl = URL.createObjectURL(file);
      return { success: true, newImageUrl: fakeUrl };
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoadingProcess(false);
    }
  };

  const apiUpdateCourseInfo = async (id: string, payload: CourseFormData, type: 'single' | 'combo') => {
    setIsLoadingProcess(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } finally { setIsLoadingProcess(false); }
  };

  const apiUpdateCourseComboStatus = async (courseId: string, comboId: string | null) => {
    setIsLoadingProcess(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } finally { setIsLoadingProcess(false); }
  };

  // --- HANDLERS: UPLOAD ẢNH QUA RHF ---

  const triggerImageUpload = (id: string, type: 'single' | 'combo') => {
    setTargetImageUpload({ id, type });
    if (fileInputRef.current) fileInputRef.current.click(); 
  };

  const onSubmitImage = async (data: ImageUploadFormData) => {
    const file = data.file[0];
    if (!file || !targetImageUpload) return;

    const res = await apiUpdateCourseImage(targetImageUpload.id, file, targetImageUpload.type);
    
    if (res.success && res.newImageUrl) {
      if (targetImageUpload.type === 'single') {
        setCourses(prev => prev.map(c => c.courseId === targetImageUpload.id ? { ...c, imageUrl: res.newImageUrl } : c));
        if (editingSingleCourse?.courseId === targetImageUpload.id) {
          setEditingSingleCourse(prev => prev ? { ...prev, imageUrl: res.newImageUrl } : prev);
        }
      } else {
        setMultipleCourses(prev => prev.map(c => c.multipleCourseId === targetImageUpload.id ? { ...c, imageUrl: res.newImageUrl } : c));
        if (editingMultiCourse?.multipleCourseId === targetImageUpload.id) {
          setEditingMultiCourse(prev => prev ? { ...prev, imageUrl: res.newImageUrl } : prev);
        }
      }
    } else {
      alert("Cập nhật ảnh thất bại!");
    }
    imageForm.reset();
    setTargetImageUpload(null);
  };

  const onImageError = (errors: any) => {
    if (errors.file?.message) {
      alert(`Lỗi upload ảnh: ${errors.file.message}`);
    }
    imageForm.reset();
    setTargetImageUpload(null);
  };

  const { ref: rhfImageRef, onChange: rhfImageOnChange, ...rhfImageRest } = imageForm.register('file');

  // --- HANDLERS: TẠO MỚI & CHỈNH SỬA ---

  const onSubmitCreateSingle = (data: CourseFormData) => {
    const newCourse: Course = {
      courseId: `c-${Date.now()}`, name: data.name, cost: data.cost, summary: data.summary, imageUrl: '',
      deleted: 0, teacherId: MOCK_TEACHER_ID, rate: 0, multipleCourseId: null, status: 'Bản nháp',
    };
    setCourses([...courses, newCourse]);
    setIsSingleDialogOpen(false);
  };

  const onSubmitCreateMulti = (data: CourseFormData) => {
    const newMulti: MultipleCourse = {
      multipleCourseId: `m-${Date.now()}`, name: data.name, cost: data.cost, summary: data.summary, imageUrl: '',
      deleted: 0, rate: 0, teacherId: MOCK_TEACHER_ID,
    };
    setMultipleCourses([...multipleCourses, newMulti]);
    setIsMultiDialogOpen(false);
  };

  const handleOpenEditSingle = (course: Course) => {
    setEditingSingleCourse(course);
    setCourseVideos([{ videoId: `v-${Date.now()}`, title: 'Bài 1: Giới thiệu', duration: '10:00' }]);
    editSingleForm.reset({ name: course.name, cost: course.cost, summary: course.summary, imageUrl: course.imageUrl });
  };

  const onSubmitUpdateSingleInfo = async (data: CourseFormData) => {
    if (!editingSingleCourse) return;
    const res = await apiUpdateCourseInfo(editingSingleCourse.courseId, data, 'single');
    if (res.success) {
      setCourses(courses.map(c => c.courseId === editingSingleCourse.courseId ? { ...c, ...data } : c));
      alert("Cập nhật thông tin thành công!");
    }
  };

  const handleOpenEditMulti = (multiCourse: MultipleCourse) => {
    setEditingMultiCourse(multiCourse);
    editMultiForm.reset({ name: multiCourse.name, cost: multiCourse.cost, summary: multiCourse.summary, imageUrl: multiCourse.imageUrl });
  };

  const onSubmitUpdateMultiInfo = async (data: CourseFormData) => {
    if (!editingMultiCourse) return;
    const res = await apiUpdateCourseInfo(editingMultiCourse.multipleCourseId, data, 'combo');
    if (res.success) {
      setMultipleCourses(multipleCourses.map(c => c.multipleCourseId === editingMultiCourse.multipleCourseId ? { ...c, ...data } : c));
      alert("Cập nhật thông tin Combo thành công!");
    }
  };

  // Handler xử lý submit form Video
  const onSubmitAddVideo = async (data: VideoUploadFormData) => {
    if (!editingSingleCourse) return;
    const res = await apiUploadVideoReal(editingSingleCourse.courseId, data);
    
    if (res.success && res.data) {
      setCourseVideos([...courseVideos, res.data]);
      setIsVideoDialogOpen(false);
      videoForm.reset(); // Xóa form sau khi thêm thành công
    } else {
      alert("Lỗi khi thêm video!");
    }
  };

  const executeToggleCourseInMulti = async (courseId: string, isAdding: boolean) => {
    if (!editingMultiCourse) return;
    const targetComboId = isAdding ? editingMultiCourse.multipleCourseId : null;
    const res = await apiUpdateCourseComboStatus(courseId, targetComboId);
    if (res.success) setCourses(courses.map(c => c.courseId === courseId ? { ...c, multipleCourseId: targetComboId } : c));
  };

  return (
    <div className="w-full h-full p-8 font-sans text-gray-800">
      
      {/* FORM ẨN CHO TÍNH NĂNG UPLOAD ẢNH */}
      <form className="hidden">
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp"
          {...rhfImageRest}
          ref={(e) => {
            rhfImageRef(e);
            fileInputRef.current = e;
          }}
          onChange={(e) => {
            rhfImageOnChange(e);
            imageForm.handleSubmit(onSubmitImage, onImageError)();
          }}
        />
      </form>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Quản lý khóa học</h1>
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm min-w-[150px]">
              <div className="text-sm text-gray-500 mb-1">Tổng khóa đơn</div>
              <span className="text-3xl font-bold text-purple-700">{courses.length}</span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm min-w-[150px]">
              <div className="text-sm text-gray-500 mb-1">Tổng khóa Combo</div>
              <span className="text-3xl font-bold text-pink-600">{multipleCourses.length}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => { setIsSingleDialogOpen(true); createSingleForm.reset({name: '', cost: 0, summary: ''}); }} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors">
            <Plus size={20} /> Tạo khóa học đơn
          </button>
          <button onClick={() => { setIsMultiDialogOpen(true); createMultiForm.reset({name: '', cost: 0, summary: ''}); }} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors">
            <Layers size={20} /> Tạo khóa Combo
          </button>
        </div>
      </div>

      {/* DANH SÁCH COMBO */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-pink-800">
          <Layers size={24} /> Khóa học Combo
        </h2>
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60 space-y-4">
          {multipleCourses.map((multi) => {
            const includedCount = courses.filter(c => c.multipleCourseId === multi.multipleCourseId).length;
            return (
              <div key={multi.multipleCourseId} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-pink-500 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    onClick={() => triggerImageUpload(multi.multipleCourseId, 'combo')}
                    className={`relative w-20 h-20 bg-pink-50 rounded-xl overflow-hidden cursor-pointer group shrink-0 border border-pink-100 ${isLoadingProcess && targetImageUpload?.id === multi.multipleCourseId ? 'opacity-50' : ''}`}
                    title="Bấm để đổi ảnh"
                  >
                    {multi.imageUrl ? (
                      <img src={multi.imageUrl} alt={multi.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pink-300"><BookOpen size={28} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white backdrop-blur-[1px] transition-all">
                      <Camera size={24} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{multi.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{multi.summary}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                      <span className="text-pink-700 bg-pink-50 px-2 py-1 rounded-md">{multi.cost.toLocaleString('vi-VN')} VNĐ</span>
                      <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded-md">Bao gồm {includedCount} khóa</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button onClick={() => handleOpenEditMulti(multi)} className="flex items-center gap-2 bg-pink-100 text-pink-700 hover:bg-pink-200 px-4 py-2 rounded-xl font-medium transition-colors">
                    <Edit size={18} /> Sửa nội dung & Khóa con
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DANH SÁCH KHÓA ĐƠN */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-800">
          <BookOpen size={24} /> Khóa học Đơn lẻ
        </h2>
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60 space-y-4">
          {courses.map((course) => (
            <div key={course.courseId} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div 
                  onClick={() => triggerImageUpload(course.courseId, 'single')}
                  className={`relative w-20 h-20 bg-purple-50 rounded-xl overflow-hidden cursor-pointer group shrink-0 border border-purple-100 ${isLoadingProcess && targetImageUpload?.id === course.courseId ? 'opacity-50' : ''}`}
                  title="Bấm để đổi ảnh"
                >
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-300"><ImageIcon size={28} /></div>
                  )}
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white backdrop-blur-[1px] transition-all">
                    <Camera size={24} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{course.summary}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                    <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded-md">{course.cost.toLocaleString('vi-VN')} VNĐ</span>
                    <span className={`px-2 py-1 rounded-md ${course.status === 'Đã duyệt' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{course.status}</span>
                    {course.multipleCourseId && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle size={12}/> Thuộc 1 Combo</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <button onClick={() => handleOpenEditSingle(course)} className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-xl font-medium transition-colors">
                  <Edit size={18} /> Sửa thông tin & Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIALOG THÊM VIDEO MỚI */}
      {isVideoDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => { setIsVideoDialogOpen(false); videoForm.reset(); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-800">
              <Film size={24}/> Thêm Video Bài Giảng
            </h2>
            
            <form onSubmit={videoForm.handleSubmit(onSubmitAddVideo)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Tiêu đề bài giảng</label>
                <input 
                  placeholder="Ví dụ: Bài 1 - Lời nói đầu..." 
                  {...videoForm.register('title')} 
                  className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-purple-500 focus:ring-2 focus:ring-purple-200" 
                />
                {videoForm.formState.errors.title && <p className="text-red-500 text-xs mt-1">{videoForm.formState.errors.title.message}</p>}
              </div>

              
              <div>
                <label className="text-sm font-semibold text-gray-700">File Video (.mp4, .webm, .mov)</label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Bấm để tải lên</span></p>
                    </div>
                    <input 
                      type="file" 
                      accept="video/mp4, video/webm, video/quicktime" 
                      className="hidden" 
                      {...videoForm.register('videoFile')} 
                    />
                  </label>
                </div>
                {/* Hiển thị tên file nếu đã chọn */}
                {videoForm.watch('videoFile')?.[0] && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={14}/> Đã chọn: {videoForm.watch('videoFile')[0].name}
                  </p>
                )}
                {videoForm.formState.errors.videoFile && <p className="text-red-500 text-xs mt-1">{videoForm.formState.errors.videoFile.message as string}</p>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoadingProcess} 
                  className={`w-full text-white py-3 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 
                    ${isLoadingProcess ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'}`}
                >
                  {isLoadingProcess ? (
                     <span>Đang tải lên và xử lý...</span>
                  ) : (
                    <> <Plus size={20}/> Thêm Video </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG TẠO KHÓA ĐƠN */}
      {isSingleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          {/* ... code cũ giữ nguyên ... */}
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative">
            <button onClick={() => setIsSingleDialogOpen(false)} className="absolute top-4 right-4"><X /></button>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Tạo khóa học đơn</h2>
            <form onSubmit={createSingleForm.handleSubmit(onSubmitCreateSingle)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên khóa học</label>
                <input {...createSingleForm.register('name')} className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500" />
                {createSingleForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Giá</label>
                <input type="number" {...createSingleForm.register('cost')} className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500" />
                {createSingleForm.formState.errors.cost && <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.cost.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <textarea rows={3} {...createSingleForm.register('summary')} className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500" />
                {createSingleForm.formState.errors.summary && <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.summary.message}</p>}
              </div>
              <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg font-medium">Tạo khóa học</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG TẠO COMBO */}
      {isMultiDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          {/* ... code cũ giữ nguyên ... */}
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative">
            <button onClick={() => setIsMultiDialogOpen(false)} className="absolute top-4 right-4"><X /></button>
            <h2 className="text-2xl font-bold mb-4 text-pink-700">Tạo Combo</h2>
            <form onSubmit={createMultiForm.handleSubmit(onSubmitCreateMulti)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên Combo</label>
                <input {...createMultiForm.register('name')} className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500" />
                {createMultiForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{createMultiForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Giá</label>
                <input type="number" {...createMultiForm.register('cost')} className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500" />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <textarea rows={3} {...createMultiForm.register('summary')} className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500" />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium">Tạo Combo</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG EDIT SINGLE */}
      {editingSingleCourse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between bg-purple-50">
              <h2 className="text-xl font-bold">Chỉnh sửa: {editingSingleCourse.name}</h2>
              <button onClick={() => setEditingSingleCourse(null)}><X /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              <div className="flex-1 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-purple-800">Chỉnh sửa thông tin</h3>
                <form onSubmit={editSingleForm.handleSubmit(onSubmitUpdateSingleInfo)} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tên khóa học</label>
                    <input {...editSingleForm.register('name')} className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none" />
                    {editSingleForm.formState.errors.name && <span className="text-red-500 text-xs">{editSingleForm.formState.errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Giá</label>
                    <input type="number" {...editSingleForm.register('cost')} className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                    <textarea {...editSingleForm.register('summary')} rows={4} className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none" />
                  </div>
                  <button type="submit" disabled={isLoadingProcess} className="w-full py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200">
                    {isLoadingProcess ? 'Đang lưu...' : 'Lưu lại thông tin'}
                  </button>
                </form>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-purple-800">Quản lý Video bài giảng</h3>
                  {/* NÚT MỞ DIALOG THÊM VIDEO MỚI */}
                  <button 
                    onClick={() => setIsVideoDialogOpen(true)} 
                    disabled={isLoadingProcess} 
                    className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-700"
                  >
                    <Plus size={16}/> Thêm Video mới
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {courseVideos.length === 0 && <p className="text-gray-400 text-sm italic">Chưa có video bài giảng nào.</p>}
                  {courseVideos.map(video => (
                    <div key={video.videoId} className="flex flex-col gap-1 p-3 bg-gray-50 border rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <PlaySquare size={20} className="text-purple-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">{video.title}</p>
                          {video.description && <p className="text-xs text-gray-500 line-clamp-1">{video.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG EDIT MULTI */}
      {editingMultiCourse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          {/* ... code cũ giữ nguyên ... */}
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between bg-pink-50">
              <h2 className="text-xl font-bold">Chỉnh sửa Combo: {editingMultiCourse.name}</h2>
              <button onClick={() => setEditingMultiCourse(null)}><X /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              <div className="flex-1 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-pink-800">Thông tin chung</h3>
                <form onSubmit={editMultiForm.handleSubmit(onSubmitUpdateMultiInfo)} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tên Combo</label>
                    <input {...editMultiForm.register('name')} className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none" />
                    {editMultiForm.formState.errors.name && <span className="text-red-500 text-xs">{editMultiForm.formState.errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Giá</label>
                    <input type="number" {...editMultiForm.register('cost')} className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                    <textarea {...editMultiForm.register('summary')} rows={4} className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none" />
                  </div>
                  <button type="submit" disabled={isLoadingProcess} className="w-full py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200">
                    {isLoadingProcess ? 'Đang lưu...' : 'Lưu thông tin Combo'}
                  </button>
                </form>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-pink-800 mb-2">Cấu trúc Combo</h3>
                <p className="text-sm text-gray-500 mb-4">Thêm hoặc gỡ các khóa học đơn lẻ.</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {courses.map(course => {
                    const isIncluded = course.multipleCourseId === editingMultiCourse.multipleCourseId;
                    const isBelongToOther = course.multipleCourseId !== null && !isIncluded;
                    return (
                      <div key={course.courseId} className={`flex items-center justify-between p-3 border rounded-xl ${isIncluded ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200'}`}>
                        <p className={`text-sm font-medium ${isIncluded ? 'text-pink-800' : 'text-gray-700'}`}>{course.name}</p>
                        {isIncluded ? (
                          <button disabled={isLoadingProcess} onClick={() => executeToggleCourseInMulti(course.courseId, false)} className="text-red-500 flex items-center gap-1 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm hover:bg-red-50">
                            <MinusCircle size={14} /> Gỡ
                          </button>
                        ) : !isBelongToOther && (
                          <button disabled={isLoadingProcess} onClick={() => executeToggleCourseInMulti(course.courseId, true)} className="text-pink-600 flex items-center gap-1 text-xs font-medium bg-pink-50 px-2 py-1 rounded shadow-sm hover:bg-pink-100">
                            <PlusCircle size={14} /> Thêm
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}