import React, { useState, useEffect } from 'react';
// Import các icon từ lucide-react
import { Users, Library, Layers, BookOpen } from 'lucide-react';

// ==========================================
// 1. ĐỊNH NGHĨA TYPES (Dựa theo Database Schema)
// ==========================================

// Tuân thủ bảng Course
interface SingleCourse {
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
  // TRƯỜNG THÊM: Cần join với bảng Payment (hoặc Enrollment) để lấy tổng số học viên
  totalStudents?: number; 
}

// Tuân thủ bảng MultipleCourse
interface MultipleCourse {
  multipleCourseId: string;
  name: string;
  cost: number;
  summary: string; 
  deleted: number;
  rate: number;
  teacherId: string;
  imageUrl: string;
  // TRƯỜNG THÊM: Số lượng khóa học con bên trong lộ trình
  totalCourses?: number;
}

// Tuân thủ bảng Notification
interface CourseNotification {
  notificationId: string;
  title: string;
  content: string;
  createdAt: string; // datetime
  deleted: number;
  // TRƯỜNG THÊM: Để hiển thị "Học sinh vừa đăng ký", cần join lấy thông tin học sinh
  studentName?: string;
  studentAvatar?: string;
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const mockSingleCourses: SingleCourse[] = [
  {
    courseId: 'c1-uuid',
    name: 'Web Design Basic',
    cost: 500000,
    summary: 'Khóa học thiết kế web cơ bản dành cho người mới bắt đầu.',
    deleted: 0,
    teacherId: 't1-uuid',
    rate: 4.8,
    multipleCourseId: null,
    status: 'ACTIVE',
    imageUrl: 'https://via.placeholder.com/150',
    totalStudents: 120,
  },
  {
    courseId: 'c2-uuid',
    name: '2D Games Development',
    cost: 750000,
    summary: 'Lập trình game 2D cơ bản với Unity.',
    deleted: 0,
    teacherId: 't1-uuid',
    rate: 4.5,
    multipleCourseId: null,
    status: 'DRAFT',
    imageUrl: 'https://via.placeholder.com/150',
    totalStudents: 45,
  },
];

const mockMultipleCourses: MultipleCourse[] = [
  {
    multipleCourseId: 'mc1-uuid',
    name: 'Lộ trình Fullstack Developer',
    cost: 2000000,
    summary: 'Lộ trình từ Zero đến Hero bao gồm Front-end và Back-end.',
    deleted: 0,
    rate: 4.9,
    teacherId: 't1-uuid',
    imageUrl: 'https://via.placeholder.com/150',
    totalCourses: 5,
  }
];

const mockNotifications: CourseNotification[] = [
  {
    notificationId: 'n1-uuid',
    title: 'Đăng ký khóa học mới',
    content: 'Đã thanh toán thành công khóa Web Design Basic',
    createdAt: '2026-04-13T10:30:00Z',
    deleted: 0,
    studentName: 'Trần Văn A',
    studentAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    notificationId: 'n2-uuid',
    title: 'Đăng ký lộ trình',
    content: 'Đã đăng ký Lộ trình Fullstack Developer',
    createdAt: '2026-04-13T09:15:00Z',
    deleted: 0,
    studentName: 'Nguyễn Thị B',
    studentAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    notificationId: 'n3-uuid',
    title: 'Đăng ký khóa học mới',
    content: 'Đã thanh toán thành công khóa 2D Games',
    createdAt: '2026-04-12T15:45:00Z',
    deleted: 0,
    studentName: 'Lê Hoàng C',
    studentAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
  }
];

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function TeacherDashboardContent() {
  // --- STATES ---
  const [singleCourses, setSingleCourses] = useState<SingleCourse[]>([]);
  const [multipleCourses, setMultipleCourses] = useState<MultipleCourse[]>([]);
  const [notifications, setNotifications] = useState<CourseNotification[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });

  // --- API CALL PLACEHOLDERS ---
  const fetchSingleCourses = async () => {
    try {
      // Mock API call
      setSingleCourses(mockSingleCourses);
    } catch (error) {
      console.error("Lỗi khi tải khóa học đơn:", error);
    }
  };

  const fetchMultipleCourses = async () => {
    try {
      // Mock API call
      setMultipleCourses(mockMultipleCourses);
    } catch (error) {
      console.error("Lỗi khi tải lộ trình:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Mock API call
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Mock API call
      setStats({
        totalStudents: 165,
        totalCourses: mockSingleCourses.length + mockMultipleCourses.length
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  // --- HANDLERS ---
  const handleEditCourse = (id: string, isMultiple: boolean) => {
    console.log(`Edit ${isMultiple ? 'MultipleCourse' : 'SingleCourse'} with ID:`, id);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchSingleCourses();
    fetchMultipleCourses();
    fetchNotifications();
    fetchDashboardStats();
  }, []);

  return (
    <div className="flex-1 bg-[#F9FAFB] p-6 lg:p-10 w-full min-h-screen font-sans">
      
      {/* 1. THỐNG KÊ TỔNG QUAN */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Card: Tổng học viên */}
        <div className="bg-[#FFD1E3] rounded-2xl p-6 flex-1 flex items-center justify-between shadow-sm border border-pink-100">
          <div>
            <h3 className="text-gray-700 font-medium mb-1">Học viên của tôi</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalStudents} <span className="text-base font-normal">học viên</span></p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-inner flex items-center justify-center">
            {/* Sử dụng icon Users từ lucide-react */}
            <Users className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        {/* Card: Tổng khóa học */}
        <div className="bg-[#FFD1E3] rounded-2xl p-6 flex-1 flex items-center justify-between shadow-sm border border-pink-100">
          <div>
            <h3 className="text-gray-700 font-medium mb-1">Các khóa học đã đăng</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCourses} <span className="text-base font-normal">khóa học</span></p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-inner flex items-center justify-center">
             {/* Sử dụng icon Library từ lucide-react */}
             <Library className="w-8 h-8 text-pink-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. CÁC KHÓA HỌC CỦA TÔI */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Khóa học của tôi</h2>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            
            {/* LỘ TRÌNH (MULTIPLE COURSES) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Lộ trình học (Multiple Courses)</h3>
              <div className="space-y-4">
                {multipleCourses.map((course) => (
                  <div key={course.multipleCourseId} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                      <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {/* Sử dụng icon Layers từ lucide-react */}
                        <Layers className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{course.name}</h4>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                          <span className="flex items-center gap-1">💰 {course.cost.toLocaleString('vi-VN')}đ</span>
                          <span className="flex items-center gap-1">⭐ {course.rate}</span>
                          <span className="flex items-center gap-1">📚 {course.totalCourses} khóa học con</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEditCourse(course.multipleCourseId, true)}
                      className="w-full sm:w-auto px-6 py-2 bg-white border border-purple-300 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors">
                      Sửa lộ trình
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KHÓA HỌC ĐƠN (SINGLE COURSES) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Khóa học lẻ (Single Courses)</h3>
              <div className="space-y-4">
                {singleCourses.map((course) => {
                  const bgColors = ['bg-green-100', 'bg-blue-100', 'bg-red-100', 'bg-yellow-100'];
                  const randomBg = bgColors[course.name.length % bgColors.length];

                  return (
                    <div key={course.courseId} className={`flex flex-col sm:flex-row items-center justify-between p-4 ${randomBg} rounded-xl hover:shadow-md transition-shadow`}>
                      <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                        <div className="w-16 h-16 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                           {/* Sử dụng icon BookOpen từ lucide-react */}
                           <BookOpen className="w-8 h-8 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            {course.name}
                            {course.status === 'DRAFT' && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Bản nháp</span>}
                          </h4>
                          <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-3">
                            <span className="flex items-center gap-1 font-medium text-red-500">💰 {course.cost.toLocaleString('vi-VN')}đ</span>
                            <span className="flex items-center gap-1">⭐ {course.rate}</span>
                            <span className="flex items-center gap-1">👥 {course.totalStudents} học viên</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleEditCourse(course.courseId, false)}
                        className="w-full sm:w-auto px-6 py-2 bg-white/80 border border-transparent text-gray-800 font-medium rounded-lg hover:bg-white transition-colors">
                        Sửa khóa học
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 3. THÔNG BÁO - ĐĂNG KÝ MỚI */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thông báo học viên mới</h2>
          <div className="bg-[#FFD1E3] rounded-3xl p-6 shadow-sm border border-pink-100 h-full max-h-[800px] overflow-y-auto">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-10 bg-white/50 rounded-xl">Chưa có thông báo mới.</p>
              ) : (
                notifications.map((noti) => (
                  <div key={noti.notificationId} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                    <img 
                      src={noti.studentAvatar} 
                      alt={noti.studentName} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">{noti.studentName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{noti.title}</p>
                      <p className="text-sm text-gray-700 mt-1.5 font-medium bg-pink-50 p-2 rounded-lg">
                        {noti.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(noti.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}