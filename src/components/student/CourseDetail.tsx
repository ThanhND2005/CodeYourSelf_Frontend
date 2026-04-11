import React, { useState } from "react";
import {
  Plus,
  Minus,
  Clock,
  BookOpen,
  MapPin,
  Star,
  PlayCircle
} from "lucide-react";
import PaymentDialog from "./PaymentDialog";
import { useCourseStore } from "@/stores/useCourseStore";

// --- MOCK DATA ---




export default function CourseDetail() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const {multipleCourse,courses} = useCourseStore()
  const toggleCourse = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleExpandAll = () => {
    if (expanded.length === courses?.length) {
      setExpanded([]);
    } else {
      setExpanded(courses?.map((c) => c.courseId) ?? []);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount === 0 ? "Miễn phí" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Chi tiết lộ trình:
      </h1>

      <div className="bg-[#fbd8f8] rounded-3xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4">
            {multipleCourse?.name}
          </h2>

          <p className="text-lg text-gray-700 mb-6 italic">
            {multipleCourse?.sumary}
          </p>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">
              Danh sách khóa học ({courses?.length} khóa)
            </h3>

            <button
              onClick={toggleExpandAll}
              className="text-[#851385] font-semibold hover:underline"
            >
              {expanded.length === courses?.length
                ? "Thu gọn tất cả"
                : "Mở rộng tất cả"}
            </button>
          </div>

          <div className="space-y-4">
            {courses?.map((course) => {
              const isOpen = expanded.includes(course.courseId);

              return (
                <div
                  key={course.courseId}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleCourse(course.courseId)}
                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 "
                  >
                    <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
                      {isOpen ? (
                        <Minus className="text-[#851385] flex-shrink-0 " />
                      ) : (
                        <Plus className="text-[#851385] flex-shrink-0" />
                      )}

                      <span className="font-semibold text-lg text-left">
                        {course.name}
                      </span>
                    </div>

                    <span className="font-semibold text-[#851385] whitespace-nowrap ml-4">
                      {formatCurrency(course.cost)}
                    </span>
                  </button>

                  {/* Hiển thị danh sách bài học khi mở rộng */}
                  {isOpen && (
                    <div className="px-6 pb-4 pt-2 space-y-2">
                      {course.lessons && course.lessons.length > 0 ? (
                        course.lessons.map((lesson, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-3 rounded-xl bg-[#fff6ff] hover:bg-[#f7e8f7] transition shadow-sm flex items-center gap-3"
                            onClick={() => console.log(`Chuyển đến video: ${lesson.videoUrl}`)}
                          >
                            <PlayCircle size={18} className="text-[#851385] flex-shrink-0" />
                            <span className="font-medium text-gray-800">
                              Bài {index + 1}: {lesson.name}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-gray-500 italic px-4 py-2">Khóa học này chưa có bài giảng nào.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-6 h-fit bg-white/60 rounded-3xl shadow-sm border border-white">
          <div className="flex justify-center mb-6 overflow-hidden rounded-xl shadow-md">
            <img 
              src={multipleCourse?.imageUrl} 
              alt={multipleCourse?.name}
              className="w-full h-auto object-cover max-h-[200px]"
            />
          </div>

          <PaymentDialog>
            <button className="w-full bg-[#851385] hover:bg-[#6a0f6a] text-white py-3 rounded-xl font-semibold mb-6 shadow-md transition-transform active:scale-95">
              Đăng ký lộ trình
            </button>
          </PaymentDialog>

          <h3 className="text-2xl font-bold mb-5 text-[#851385]">
            Học phí: {formatCurrency(multipleCourse?.cost ?? 0)}
          </h3>

          <div className="space-y-4 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385]"><Star size={20} /></div>
              <span>Đánh giá trung bình: {Math.floor(multipleCourse?.rate ?? 0)} / 5</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385]"><BookOpen size={20} /></div>
              <span>Tổng số khóa học: {courses?.length} khóa</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385]"><Clock size={20} /></div>
              <span>Học theo lộ trình bài bản</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385]"><MapPin size={20} /></div>
              <span>Học mọi lúc, mọi nơi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}