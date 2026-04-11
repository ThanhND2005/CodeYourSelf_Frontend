import React from "react";
import {
  Clock,
  BookOpen,
  MapPin,
  Star,
  PlayCircle,
  MonitorPlay,
  CheckCircle2
} from "lucide-react";
import PaymentDialog from "./PaymentDialog";
import { useCourseStore } from "@/stores/useCourseStore";

// --- INTERFACES ---

// --- MOCK DATA ---


export default function SingleCourseDetail() {
  const formatCurrency = (amount: number) => {
    return amount === 0 
      ? "Miễn phí" 
      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  const {course,videos} = useCourseStore()
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Chi tiết khóa học:
      </h1>

      <div className="bg-[#fbd8f8] rounded-3xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION - COURSE CONTENT */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {course?.name}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-white">
              {course?.summary}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MonitorPlay className="text-[#851385]" size={28} />
              Nội dung khóa học
            </h3>
            <span className="bg-[#851385] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {videos?.length} bài học
            </span>
          </div>

          {/* VIDEO LIST */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex-grow">
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {videos?.length > 0 ? (
                videos?.map((video, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-5 py-4 rounded-xl bg-[#fff6ff] hover:bg-[#f7e8f7] transition-all duration-200 shadow-sm flex items-center justify-between group border border-transparent hover:border-[#fbd8f8]"
                    onClick={() => console.log(`Chuyển đến video: ${video.videoUrl}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle size={20} className="text-[#851385]" />
                      </div>
                      <span className="font-semibold text-gray-800 group-hover:text-[#851385] transition-colors">
                        Bài {index + 1}: {video.name}
                      </span>
                    </div>
                    
                    <CheckCircle2 size={18} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-8">Khóa học này đang được cập nhật video.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - PAYMENT & INFO CARD */}
        <div className="p-6 h-fit bg-white/60 rounded-3xl shadow-sm border border-white sticky top-6">
          <div className="flex justify-center mb-6 overflow-hidden rounded-xl shadow-md relative group">
            <img 
              src={course?.imageUrl} 
              alt={course?.name}
              className="w-full h-auto object-cover max-h-[220px] group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay play button just for styling */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayCircle size={48} className="text-white opacity-80" />
            </div>
          </div>

          <PaymentDialog>
            <button className="w-full bg-[#851385] hover:bg-[#6a0f6a] text-white py-3.5 rounded-xl font-bold text-lg mb-6 shadow-md transition-all active:scale-95 hover:shadow-lg">
              Đăng ký khóa học
            </button>
          </PaymentDialog>

          <div className="border-b border-gray-200 pb-5 mb-5">
            <h3 className="text-3xl font-extrabold text-[#851385] text-center">
              {formatCurrency(course?.cost ?? 0)}
            </h3>
          </div>

          <div className="space-y-4 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385] shadow-sm"><Star size={20} /></div>
              <span>Đánh giá: {Math.floor(course?.rate ?? 0)} / 5</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385] shadow-sm"><BookOpen size={20} /></div>
              <span>Tổng số bài học: {videos.length} bài</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385] shadow-sm"><Clock size={20} /></div>
              <span>Sở hữu trọn đời</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#fbd8f8] rounded-lg text-[#851385] shadow-sm"><MapPin size={20} /></div>
              <span>Học online mọi lúc, mọi nơi</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}