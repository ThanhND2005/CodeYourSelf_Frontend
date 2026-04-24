import React, { useState, useEffect } from 'react';
// Import các icon từ lucide-react
import { Users, Library, Layers, BookOpen } from 'lucide-react';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { useTabTeacherStore } from '@/stores/useTabStore';
import { useNotificationCourse } from '@/hooks/useTeacher';




export default function TeacherDashboardContent() {
  // --- STATES ---
  
  const {data : notifications} = useNotificationCourse()


  // --- EFFECTS ---
  const {setTabActive} = useTabTeacherStore()
  const students = useTeacherStore((s) => s.students)
  const singleCourses = useTeacherStore((s) => s.singleCourses)
  const multipleCourses = useTeacherStore((s) => s.multipleCourses)
  return (
    <div className="flex-1 bg-[#F9FAFB] p-6 lg:p-10 w-full min-h-screen font-sans">
      
      {/* 1. THỐNG KÊ TỔNG QUAN */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Card: Tổng học viên */}
        <div className="bg-[#FFD1E3] rounded-2xl p-6 flex-1 flex items-center justify-between shadow-sm border border-pink-100">
          <div>
            <h3 className="text-gray-700 font-medium mb-1">Học viên của tôi</h3>
            <p className="text-3xl font-bold text-gray-900">{students?.length ?? 0} <span className="text-base font-normal">học viên</span></p>
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
            <p className="text-3xl font-bold text-gray-900">{(multipleCourses?.length ?? 0 ) + (singleCourses?.length ?? 0 )}<span className="text-base font-normal">{' '}khóa học</span></p>
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
                {multipleCourses?.map((course) => (
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
                          <span className="flex items-center gap-1">⭐ {Math.round(course.rate*10)/10}</span>
                          
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTabActive("courses")}
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
                {singleCourses?.map((course) => {
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
                            <span className="flex items-center gap-1">⭐ {Math.round(course.rate*10)/10}</span>
                            
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTabActive("courses")}
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
              {notifications?.length === 0 ? (
                <p className="text-center text-gray-500 py-10 bg-white/50 rounded-xl">Chưa có thông báo mới.</p>
              ) : (
                notifications?.map((noti) => (
                  <div key={noti.notificationId} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                    <img 
                      src={noti.avatarUrl} 
                      alt={noti.studentName} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                    />
                    <div className="flex-1">
              
                      <p className="text-xs text-gray-500 mt-0.5">{noti.title}</p>
                     
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