import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Image as ImageIcon, 
  PlaySquare, 
  X,
  Star,
  BookOpen,
  Layers,
  CheckCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

// --- BƯỚC 1: ĐỊNH NGHĨA TYPES DỰA TRÊN DATABASE SCHEMA ---

interface Course {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  teacherId: string;
  rate: number;
  multipleCourseId: string | null; // Khóa ngoại liên kết tới MultipleCourse
  status: string;
  imageUrl: string;
}

interface MultipleCourse {
  multipleCourseId: string;
  name: string;
  cost: number;
  summary: string; // Trong ảnh db là 'sumary' nhưng viết 'summary' cho chuẩn JS
  deleted: number;
  rate: number;
  teacherId: string;
  imageUrl: string;
}

interface VideoLesson {
  videoId: string;
  title: string;
  duration: string;
}

// --- BƯỚC 2: MOCK DATA TUÂN THỦ DATABASE SCHEMA ---

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
    imageUrl: '',
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
    multipleCourseId: null, // Chưa thuộc combo nào
    status: 'Đã duyệt',
    imageUrl: '',
  },
  {
    courseId: 'c2',
    name: '2D Games Development',
    cost: 899000,
    summary: 'Lập trình game 2D với các framework phổ biến.',
    deleted: 0,
    teacherId: MOCK_TEACHER_ID,
    rate: 4.8,
    multipleCourseId: 'm1', // Nằm trong Combo m1
    status: 'Chờ duyệt',
    imageUrl: '',
  },
  {
    courseId: 'c3',
    name: '3D Games with Unity',
    cost: 999000,
    summary: 'Lập trình game 3D chuyên sâu.',
    deleted: 0,
    teacherId: MOCK_TEACHER_ID,
    rate: 4.7,
    multipleCourseId: 'm1', // Nằm trong Combo m1
    status: 'Đã duyệt',
    imageUrl: '',
  }
];

export default function CourseManagementComponent() {
  // --- STATE QUẢN LÝ DỮ LIỆU VÀ UI ---
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [multipleCourses, setMultipleCourses] = useState<MultipleCourse[]>(initialMultipleCourses);
  
  // State quản lý việc mở/đóng các Dialog tạo mới
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false);
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);
  
  // State quản lý Edit
  const [editingSingleCourse, setEditingSingleCourse] = useState<Course | null>(null);
  const [editingMultiCourse, setEditingMultiCourse] = useState<MultipleCourse | null>(null);
  
  // State giả lập danh sách video cho khóa đơn
  const [courseVideos, setCourseVideos] = useState<VideoLesson[]>([]);

  // --- HANDLERS: TẠO MỚI ---

  const handleCreateSingleCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCourse: Course = {
      courseId: `c-${Date.now()}`,
      name: formData.get('name') as string,
      cost: Number(formData.get('cost')),
      summary: formData.get('summary') as string,
      deleted: 0,
      teacherId: MOCK_TEACHER_ID,
      rate: 0,
      multipleCourseId: null,
      status: 'Bản nháp',
      imageUrl: formData.get('imageUrl') as string || '',
    };
    setCourses([...courses, newCourse]);
    setIsSingleDialogOpen(false);
    handleOpenEditSingle(newCourse); // Mở ngay popup chỉnh sửa/thêm video
  };

  const handleCreateMultipleCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMulti: MultipleCourse = {
      multipleCourseId: `m-${Date.now()}`,
      name: formData.get('name') as string,
      cost: Number(formData.get('cost')),
      summary: formData.get('summary') as string,
      deleted: 0,
      rate: 0,
      teacherId: MOCK_TEACHER_ID,
      imageUrl: formData.get('imageUrl') as string || '',
    };
    setMultipleCourses([...multipleCourses, newMulti]);
    setIsMultiDialogOpen(false);
    handleOpenEditMulti(newMulti); // Mở ngay popup để add khóa đơn vào combo
  };

  // --- HANDLERS: XÓA ---
  const handleDeleteSingle = (id: string) => {
    if(confirm('Bạn có chắc muốn xóa khóa học đơn này?')) {
      setCourses(courses.filter(c => c.courseId !== id));
    }
  };

  const handleDeleteMulti = (id: string) => {
    if(confirm('Bạn có chắc muốn xóa khóa Combo này? Các khóa học con sẽ không bị xóa.')) {
      setMultipleCourses(multipleCourses.filter(m => m.multipleCourseId !== id));
      // Cập nhật lại các khóa con: gỡ multipleCourseId
      setCourses(courses.map(c => c.multipleCourseId === id ? { ...c, multipleCourseId: null } : c));
    }
  };

  // --- HANDLERS: EDIT SINGLE COURSE (Thêm Video) ---
  const handleOpenEditSingle = (course: Course) => {
    setEditingSingleCourse(course);
    setCourseVideos([{ videoId: `v-${Date.now()}`, title: 'Bài 1: Giới thiệu', duration: '10:00' }]);
  };

  const handleAddVideoMock = () => {
    const newVideo: VideoLesson = {
      videoId: `v-${Date.now()}`,
      title: `Bài học mới ${courseVideos.length + 1}`,
      duration: '00:00'
    };
    setCourseVideos([...courseVideos, newVideo]);
  };

  // --- HANDLERS: EDIT MULTIPLE COURSE (Thêm/Gỡ Khóa Đơn) ---
  const handleOpenEditMulti = (multiCourse: MultipleCourse) => {
    setEditingMultiCourse(multiCourse);
  };

  const handleToggleCourseInMulti = (courseId: string, isAdding: boolean) => {
    if (!editingMultiCourse) return;
    setCourses(courses.map(c => {
      if (c.courseId === courseId) {
        // Cập nhật multipleCourseId cho khóa đơn
        return { ...c, multipleCourseId: isAdding ? editingMultiCourse.multipleCourseId : null };
      }
      return c;
    }));
  };

  return (
    <div className="w-full h-full p-8 font-sans text-gray-800">
      {/* HEADER COMPONENT */}
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

        {/* NÚT TẠO */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsSingleDialogOpen(true)}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors"
          >
            <Plus size={20} /> Tạo khóa học đơn
          </button>
          <button 
            onClick={() => setIsMultiDialogOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors"
          >
            <Layers size={20} /> Tạo khóa Combo
          </button>
        </div>
      </div>

      {/* DANH SÁCH: KHÓA HỌC COMBO (MULTIPLE) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-pink-800">
          <Layers size={24} /> Khóa học Combo (Multiple Courses)
        </h2>
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60 space-y-4">
          {multipleCourses.map((multi) => {
            // Đếm số lượng khóa con nằm trong combo này
            const includedCoursesCount = courses.filter(c => c.multipleCourseId === multi.multipleCourseId).length;
            
            return (
              <div key={multi.multipleCourseId} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-pink-500 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center text-pink-300 shrink-0">
                    {multi.imageUrl ? <img src={multi.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : <BookOpen size={28} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{multi.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{multi.summary}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                      <span className="text-pink-700 bg-pink-50 px-2 py-1 rounded-md">{multi.cost.toLocaleString('vi-VN')} VNĐ</span>
                      <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded-md">Bao gồm {includedCoursesCount} khóa</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button onClick={() => handleDeleteMulti(multi.multipleCourseId)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={18} /></button>
                  <button onClick={() => handleOpenEditMulti(multi)} className="flex items-center gap-2 bg-pink-100 text-pink-700 hover:bg-pink-200 px-4 py-2 rounded-xl font-medium transition-colors">
                    <Edit size={18} /> Cấu hình & Thêm khóa
                  </button>
                </div>
              </div>
            );
          })}
          {multipleCourses.length === 0 && <div className="text-center py-6 text-gray-500">Chưa có khóa Combo nào.</div>}
        </div>
      </div>

      {/* DANH SÁCH: KHÓA HỌC ĐƠN (SINGLE) */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-800">
          <BookOpen size={24} /> Khóa học Đơn lẻ (Single Courses)
        </h2>
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60 space-y-4">
          {courses.map((course) => (
            <div key={course.courseId} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center text-purple-300 shrink-0">
                  {course.imageUrl ? <img src={course.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : <ImageIcon size={28} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{course.summary}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                    <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded-md">{course.cost.toLocaleString('vi-VN')} VNĐ</span>
                    <span className={`px-2 py-1 rounded-md ${course.status === 'Đã duyệt' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{course.status}</span>
                    {/* Hiển thị badge nếu khóa này nằm trong 1 combo */}
                    {course.multipleCourseId && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle size={12}/> Thuộc 1 Combo</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <button onClick={() => handleDeleteSingle(course.courseId)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={18} /></button>
                <button onClick={() => handleOpenEditSingle(course)} className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-xl font-medium transition-colors">
                  <Edit size={18} /> Cấu hình & Video
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="text-center py-6 text-gray-500">Chưa có khóa học đơn nào.</div>}
        </div>
      </div>


      {/* ======================= CÁC DIALOGS TẠO MỚI ======================= */}
      
      {/* Dialog Tạo Khóa Đơn */}
      {isSingleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onClick={() => setIsSingleDialogOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-purple-800">Tạo khóa học đơn</h2>
            <form onSubmit={handleCreateSingleCourse} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label><input required name="name" type="text" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-purple-500 outline-none" placeholder="VD: Lập trình ReactJS..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label><input required name="cost" type="number" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-purple-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label><textarea required name="summary" rows={3} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-purple-500 outline-none"></textarea></div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSingleDialogOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-medium">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-medium">Tạo & Thêm Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Tạo Khóa Combo (Multiple) */}
      {isMultiDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onClick={() => setIsMultiDialogOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-pink-700">Tạo khóa Combo</h2>
            <form onSubmit={handleCreateMultipleCourse} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên Combo</label><input required name="name" type="text" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-pink-500 outline-none" placeholder="VD: Combo Fullstack..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Giá Combo (VNĐ)</label><input required name="cost" type="number" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-pink-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label><textarea required name="summary" rows={3} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-pink-500 outline-none"></textarea></div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsMultiDialogOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 font-medium">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-medium">Tạo & Thêm Khóa</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ======================= DIALOG EDIT SINGLE (THÊM VIDEO) ======================= */}
      {editingSingleCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between bg-purple-50">
              <div><h2 className="text-2xl font-bold text-purple-900">Chỉnh sửa Khóa Đơn</h2><p className="text-sm text-purple-700">{editingSingleCourse.name}</p></div>
              <button onClick={() => setEditingSingleCourse(null)} className="p-2 text-gray-500 hover:text-gray-800"><X size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              {/* Form Cấu hình */}
              <div className="flex-1 space-y-4 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg">Cấu hình thông tin</h3>
                <div><label className="block text-sm text-gray-500">Tên khóa học</label><input type="text" defaultValue={editingSingleCourse.name} className="w-full border-b py-2 focus:border-purple-500 outline-none" /></div>
                <div><label className="block text-sm text-gray-500">Giá (VNĐ)</label><input type="number" defaultValue={editingSingleCourse.cost} className="w-full border-b py-2 focus:border-purple-500 outline-none" /></div>
                <div><label className="block text-sm text-gray-500">Mô tả</label><textarea defaultValue={editingSingleCourse.summary} rows={3} className="w-full border rounded-lg p-2 mt-1 focus:ring-1 focus:ring-purple-500 outline-none" /></div>
              </div>

              {/* Quản lý Video */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center"><h3 className="font-semibold text-lg">Bài giảng (Videos)</h3><button onClick={handleAddVideoMock} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-purple-200"><Plus size={16}/> Thêm Video</button></div>
                <div className="space-y-3">
                  {courseVideos.map(video => (
                    <div key={video.videoId} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-xl">
                      <PlaySquare size={20} className="text-purple-500" />
                      <div className="flex-1"><p className="text-sm font-medium">{video.title}</p></div>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingSingleCourse(null)} className="px-6 py-2 bg-purple-700 text-white rounded-xl font-medium">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}


      {/* ======================= DIALOG EDIT MULTIPLE (THÊM KHÓA ĐƠN) ======================= */}
      {editingMultiCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between bg-pink-50">
              <div><h2 className="text-2xl font-bold text-pink-900">Chỉnh sửa Combo</h2><p className="text-sm text-pink-700">{editingMultiCourse.name}</p></div>
              <button onClick={() => setEditingMultiCourse(null)} className="p-2 text-gray-500 hover:text-gray-800"><X size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              {/* Form Cấu hình */}
              <div className="flex-1 space-y-4 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg text-gray-800">Cấu hình thông tin</h3>
                <div><label className="block text-sm text-gray-500">Tên Combo</label><input type="text" defaultValue={editingMultiCourse.name} className="w-full border-b py-2 focus:border-pink-500 outline-none" /></div>
                <div><label className="block text-sm text-gray-500">Giá (VNĐ)</label><input type="number" defaultValue={editingMultiCourse.cost} className="w-full border-b py-2 focus:border-pink-500 outline-none" /></div>
                <div><label className="block text-sm text-gray-500">Mô tả</label><textarea defaultValue={editingMultiCourse.summary} rows={3} className="w-full border rounded-lg p-2 mt-1 focus:ring-1 focus:ring-pink-500 outline-none" /></div>
              </div>

              {/* Quản lý Khóa con */}
              <div className="flex-1 space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Cấu trúc Combo</h3>
                <p className="text-xs text-gray-500">Thêm hoặc bớt các khóa học đơn lẻ vào Combo này.</p>
                
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {courses.map(course => {
                    const isIncluded = course.multipleCourseId === editingMultiCourse.multipleCourseId;
                    const isBelongToOther = course.multipleCourseId !== null && !isIncluded;
                    
                    return (
                      <div key={course.courseId} className={`flex items-center justify-between p-3 border rounded-xl ${isIncluded ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200'}`}>
                        <div>
                          <p className={`text-sm font-medium ${isIncluded ? 'text-pink-800' : 'text-gray-700'}`}>{course.name}</p>
                          <p className="text-xs text-gray-500">{course.cost.toLocaleString('vi-VN')} đ</p>
                        </div>
                        
                        {isIncluded ? (
                          <button onClick={() => handleToggleCourseInMulti(course.courseId, false)} className="text-red-500 flex items-center gap-1 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm hover:bg-red-50">
                            <MinusCircle size={14} /> Gỡ bỏ
                          </button>
                        ) : isBelongToOther ? (
                          <span className="text-xs text-gray-400 italic">Đã thuộc combo khác</span>
                        ) : (
                          <button onClick={() => handleToggleCourseInMulti(course.courseId, true)} className="text-pink-600 flex items-center gap-1 text-xs font-medium bg-pink-50 px-2 py-1 rounded shadow-sm hover:bg-pink-100">
                            <PlusCircle size={14} /> Thêm vào
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingMultiCourse(null)} className="px-6 py-2 bg-pink-600 text-white rounded-xl font-medium">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}