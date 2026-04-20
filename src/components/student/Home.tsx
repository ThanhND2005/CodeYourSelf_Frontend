import React, { useRef } from 'react';
import { Star, ChevronRight, ChevronLeft, StarHalf, Layers, Loader2, AlertCircle } from 'lucide-react';
import { useStudentStore } from '@/stores/useStudentStore';
import type { CourseRecord } from '@/types/student';
import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/StudentService';
import { useNewCourses, useTrendingCourses } from '@/hooks/useCourses';


// Helper: Format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component: Render Rating Stars
const RatingStars = ({ rate }: { rate: number }) => {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate - fullStars >= 0.5;

  return (
    <div className="flex items-center space-x-1 text-yellow-500">
      <span className="text-sm font-bold text-gray-800 mr-1">{rate.toFixed(1)}</span>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={14} fill="currentColor" strokeWidth={0} />
      ))}
      {hasHalfStar && <StarHalf size={14} fill="currentColor" strokeWidth={0} />}
    </div>
  );
};

// Component: Course Card
const CourseCard = ({ course, onClick }: { course: CourseRecord, onClick: (id: string) => void }) => {
  return (
    <div 
      onClick={() => onClick(course.courseId)}
      className="min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer group flex flex-col h-full hover:opacity-90 transition-opacity bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md relative"
    >
      {/* Badge hiển thị loại khóa học dựa trên isMultiple */}
      {course.isMultiple == "true" && (
        <div className="absolute top-2 right-2 bg-indigo-600 bg-opacity-90 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center shadow-sm z-10">
          <Layers size={12} className="mr-1" />
          Combo
        </div>
      )}

      <img 
        src={course.imageUrl} 
        alt={course.name} 
        className="w-full h-36 object-cover border-b border-gray-100"
      />
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600">
          {course.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{course.teacherName}</p>
        
        <div className="mt-1">
          <RatingStars rate={course.rate} />
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <span className="font-bold text-gray-900 text-base">{formatVND(course.cost)}</span>
            <span className="text-xs text-gray-400 line-through">
              {formatVND(course.cost*5)}
            </span>
          
        </div>

        
      </div>
    </div>
  );
};

// Component: Khối danh sách khóa học (Có nút cuộn ngang 2 bên)
const CourseSection = ({ title, courses, onCourseAction }: { title: string, courses: CourseRecord[], onCourseAction: (id: string) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý cuộn sang phải
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Hàm xử lý cuộn sang trái
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      
      <div className="relative group">
        {/* Nút cuộn trái */}
        <button 
          onClick={scrollLeft}
          className="absolute -left-4 top-1/3 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-lg z-10 hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center w-10 h-10"
        >
          <ChevronLeft className="text-gray-800" />
        </button>

        {/* Vùng chứa danh sách khóa học */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {courses.map(course => (
            <CourseCard 
              key={course.courseId} 
              course={course} 
              onClick={onCourseAction} 
            />
          ))}
        </div>
        
        {/* Nút cuộn phải */}
        <button 
          onClick={scrollRight}
          className="absolute -right-4 top-1/3 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-lg z-10 hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center w-10 h-10"
        >
          <ChevronRight className="text-gray-800" />
        </button>
      </div>
    </div>
  );
};

// 3. Main Page Layout
export default function MarketplaceDashboard() {
  const handleCourseInteraction = (courseId: string) => {
    console.log(`User clicked on course: ${courseId}`);
    alert(`Đang chuyển hướng tới chi tiết khóa học ID: ${courseId}`);
  };
  
  const {data : trendingCourses} = useTrendingCourses()
  const {data : newCourses}  = useNewCourses()
  return (
    <div className="min-h-screen py-8 px-6 md:px-12 font-sans ">
      <div className="max-w-7xl mx-auto">
        <CourseSection 
          title="Các khóa học thịnh hành" 
          courses={trendingCourses ?? []} 
          onCourseAction={handleCourseInteraction} 
        />
        
        <CourseSection 
          title="Các khóa mới đăng" 
          courses={newCourses ?? []} 
          onCourseAction={handleCourseInteraction} 
        />
      </div>
    </div>
  );
}