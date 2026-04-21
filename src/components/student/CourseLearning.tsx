import React, { useState, useEffect, useRef } from "react";
import CommentDialog from "./CommentDialog";
import { CheckCircle, PlayCircle } from "lucide-react";
import { useLessonProgress, useVideo } from "@/hooks/useCourses";
import { StudentService } from "@/services/StudentService";
import { useCourseStore } from "@/stores/useCourseStore";
import RatingDialog from "./RatingDialog";
// import { useCourseStore } from "@/stores/useCourseStore"; // Mở lại nếu bạn có dùng

export default function CourseLearning() {
  const [openRating, setOpenRating] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [rating, setRating] = useState(0);
  
  // Lấy data từ API
  const { data: videos } = useVideo();
  const { data: lessonprogress } = useLessonProgress();
  const handleRatingSubmit = async (
    courseId: string,
    rate: number
  ): Promise<void> => {
    try {
      await StudentService.patchCourse(courseId, rate);
      console.log("Rating success");
    } catch (err) {
      console.error("Rating failed:", err);
    }
  };
  // ==========================================
  // STATE & REFS CHO TRACKING TIẾN ĐỘ
  // ==========================================
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [activeVideo, setActiveVideo] = useState<any>(null); 
  
  
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

 
  useEffect(() => {
    if (videos && videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0]);
    }
  }, [videos, activeVideo]);

  
  useEffect(() => {
    if (lessonprogress) {
      setProgressData(lessonprogress);
    }
  }, [lessonprogress]);

  // ==========================================
  // CÁC HÀM GỌI API (ĐỂ SẴN CHO BACKEND)
  // ==========================================
  const apiSyncProgress = async (videoId: string, currentTime: number, isCompleted: boolean) => {
    console.log(`[API CALL] Heartbeat: Video ${videoId} | Thời điểm: ${currentTime}s | Hoàn thành: ${isCompleted}`);
    try {
      await StudentService.SyncProgress(videoId,currentTime,isCompleted)
    } catch (error) {
      console.error(error)
    }
  };

  const apiUpdateCourseProgress = async () => {
    console.log(`[API CALL] Đã hoàn thành một video. Cập nhật lại tổng tiến độ khóa học!`);
    try {
      await StudentService.patchCourseProgress(useCourseStore.getState().course?.courseId as string)
    } catch (error) {
      console.error(error)
    }
  };

  // ==========================================
  // LOGIC XỬ LÝ VIDEO
  // ==========================================

  useEffect(() => {
    if (!activeVideo) return; 

    // Đảm bảo progressData luôn là mảng an toàn
    const currentProgress = (progressData || []).find(p => p.videoId === activeVideo.videoId);
    if (videoRef.current) {
      videoRef.current.currentTime = currentProgress ? currentProgress.lastPosition : 0;
      videoRef.current.play().catch(() => console.log("Trình duyệt chặn autoplay"));
    }
  }, [activeVideo, progressData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeVideo) { 
      interval = setInterval(() => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const currentProgress = (progressData || []).find(p => p.videoId === activeVideo.videoId);
          apiSyncProgress(activeVideo.videoId, currentTime, currentProgress?.isCompleted === 1);
        }
      }, 10000); 
    }
    return () => clearInterval(interval); 
  }, [isPlaying, activeVideo, progressData]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeVideo) return; 
    
    const currentTime = videoRef.current.currentTime;
    const duration = activeVideo.duration || videoRef.current.duration;
    
    if (duration > 0 && (currentTime / duration) >= 0.9) {
      const currentProgress = (progressData || []).find(p => p.videoId === activeVideo.videoId);
      
      if (!currentProgress || currentProgress.isCompleted === 0) {
        setProgressData(prev => {
          const safePrev = prev || [];
          const existing = safePrev.find(p => p.videoId === activeVideo.videoId);
          if (existing) {
            return safePrev.map(p => p.videoId === activeVideo.videoId ? { ...p, isCompleted: 1 } : p);
          }
          return [...safePrev, { id: "temp", studentId: "s1", videoId: activeVideo.videoId, courseId: activeVideo.courseId, lastPosition: currentTime, isCompleted: 1 }];
        });

        apiSyncProgress(activeVideo.videoId, currentTime, true);
        apiUpdateCourseProgress(); 
      }
    }
  };

  const getLessonStatusUI = (videoId: string) => {
    const prog = (progressData || []).find(p => p.videoId === videoId);
    if (prog?.isCompleted === 1) return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (prog && prog.lastPosition > 0) return <PlayCircle className="text-yellow-500 w-5 h-5" />;
    return <PlayCircle className="text-gray-300 w-5 h-5" />;
  };

  // ==========================================
  // BẢO VỆ GIAO DIỆN KHI DỮ LIỆU ĐANG TẢI VÀ LỖI
  // ==========================================
  if (!videos || !activeVideo) {
    return (
      <div className="flex items-center justify-center min-h-[400px] mt-8 bg-gray-100 rounded-2xl shadow-xl">
        <p className="text-xl font-medium text-gray-500">Đang tải dữ liệu khóa học, hoặc Backend đang bị lỗi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        
        {/* ==================== LEFT: VIDEO PLAYER ==================== */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-center bg-black aspect-video max-h-[520px] relative">
            <video
              ref={videoRef}
              src={activeVideo.videoUrl}
              className="w-full h-full object-contain bg-black"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* INFO */}
          <div
            className="p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #851385, #FBD8F8)" }}
          >
            <div>
              <h2 className="text-2xl font-semibold leading-snug">{activeVideo.name}</h2>
              <p className="text-sm opacity-90 mt-1">Giảng viên: Đào Vũ Đạt</p>
            </div>

            <div className="flex gap-3">
              <button
                className="px-5 py-2 rounded-xl bg-white text-[#851385] font-medium shadow hover:shadow-md hover:scale-105 transition"
                onClick={() => setOpenRating(true)}
              >
                ⭐ Đánh giá
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-[#851385] text-white font-medium shadow hover:bg-[#6a0f6a] hover:scale-105 transition"
                onClick={() => setOpenComment(true)}
              >
                💬 Bình luận
              </button>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT: SIDEBAR ==================== */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col max-h-[600px]">
          <div className="p-4 font-semibold border-b bg-gray-50 sticky top-0 z-10 flex justify-between items-center">
            <span>Nội dung khóa học</span>
            <span className="text-sm font-normal text-gray-500">
              {/* SỬA LỖI 4: Đảm bảo progressData.filter không bị sập */}
              {(progressData || []).filter(p => p.isCompleted === 1).length} / {videos.length} bài
            </span>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1">
            {videos?.map((lesson: any, index: number) => {
              const isActive = activeVideo.videoId === lesson.videoId;
              return (
                <div
                  key={lesson.videoId}
                  onClick={() => setActiveVideo(lesson)}
                  className={`px-4 py-4 cursor-pointer transition flex items-center justify-between border-b border-gray-100 hover:bg-purple-50 ${
                    isActive ? "bg-purple-50 text-[#851385] border-l-4 border-[#851385]" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className={`font-medium ${isActive ? "text-[#851385]" : "text-gray-700"}`}>
                      {index + 1}. {lesson.name}
                    </span>
                    <span className="text-xs text-gray-400">Thời lượng: {lesson.duration}s</span>
                  </div>
                  <div>{getLessonStatusUI(lesson.videoId)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= DIALOG ĐÁNH GIÁ ================= */}
      <RatingDialog
        open={openRating}
        onClose={() => setOpenRating(false)}
        courseId={useCourseStore.getState().course?.courseId as string}
        onSubmit={handleRatingSubmit}
      />

      {/* COMMENT DIALOG */}
      <CommentDialog open={openComment} onClose={() => setOpenComment(false)} />
    </div>
  );
}