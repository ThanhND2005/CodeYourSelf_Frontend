import React, { useState } from "react";
import CommentDialog from "./CommentDialog";
import RatingDialog from "./RatingDialog";
import { StudentService } from "@/services/StudentService"; 

type CourseVideo = {
  courseId: string;
  videoName: string;
  videoUrl: string;
};

const courseData: {
  name: string;
  teacherName: string;
  courseVideo: CourseVideo[];
} = {
  name: "Java Springboot",
  teacherName: "Đào Vũ Đạt",
  courseVideo: [
    { courseId: "c-001", videoName: "Bài 1: Giới thiệu khóa học", videoUrl: "abc" },
    { courseId: "c-002", videoName: "Bài 2: Cài đặt môi trường", videoUrl: "def" },
    { courseId: "c-003", videoName: "Bài 3: Controller là gì?", videoUrl: "jqk" },
  ],
};

export default function CourseLearning() {
  const [openRating, setOpenRating] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);

  // ✅ FIX type đúng
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

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow-xl border border-gray-200">
      
      <div className="flex">
        
        {/* LEFT */}
        <div className="flex-1 flex flex-col">
          
          {/* VIDEO */}
          <div className="flex items-center justify-center bg-black aspect-video max-h-[520px]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/XhUXUYEwYf0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* INFO */}
          <div
            className="p-6 text-white flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #851385, #FBD8F8)",
            }}
          >
            <div>
              <h2 className="text-2xl font-semibold leading-snug">
                {courseData.courseVideo[0].videoName}
              </h2>

              <p className="text-sm opacity-90 mt-1">
                {courseData.teacherName}
              </p>
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

        {/* SIDEBAR */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 font-semibold border-b bg-gray-50 sticky top-0">
            Nội dung khóa học
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {courseData.courseVideo.map((lesson, index) => (
              <div
                key={lesson.courseId}
                className={`px-4 py-3 cursor-pointer transition hover:bg-gray-100 ${
                  index === 0
                    ? "bg-purple-50 text-[#851385] border-l-4 border-[#851385]"
                    : "border-l-4 border-transparent"
                }`}
              >
                {index + 1}. {lesson.videoName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Rating Dialog */}
      <RatingDialog
        open={openRating}
        onClose={() => setOpenRating(false)}
        courseId={courseData.courseVideo[0].courseId}
        onSubmit={handleRatingSubmit}
      />

      {/* ✅ Comment Dialog */}
      <CommentDialog
        open={openComment}
        onClose={() => setOpenComment(false)}
      />
    </div>
  );
}

