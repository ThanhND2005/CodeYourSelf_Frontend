import React, { useState } from "react";
import CommentDialog from "./CommentDialog";

const courseData = {
  name: "Java Springboot",
  teacherName: "Đào Vũ Đạt",
  courseVideo: [
    { courseId: 1, videoName: "Bài 1: Giới thiệu khóa học", videoUrl: "abc" },
    { courseId: 2, videoName: "Bài 2: Cài đặt môi trường", videoUrl: "def" },
    { courseId: 3, videoName: "Bài 3: Controller là gì?", videoUrl: "jqk" },
  ],
};

export default function CourseLearning() {
  const [openRating, setOpenRating] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow-xl border border-gray-200">
      
      {/* MAIN */}
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
            {/* TEXT */}
            <div>
              <h2 className="text-2xl font-semibold leading-snug">
                {courseData.courseVideo[0].videoName}
              </h2>

              <p className="text-sm opacity-90 mt-1">
                {courseData.teacherName}
              </p>
            </div>

            {/* BUTTONS */}
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

      {/* ================= DIALOG ĐÁNH GIÁ ================= */}
      {openRating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-80 p-6 rounded-xl shadow-2xl">
            <h2 className="text-lg font-semibold mb-5 text-center">
              Đánh giá khóa học
            </h2>

            {/* STAR */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl cursor-pointer transition ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:scale-125`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenRating(false);
                  setRating(0);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Hủy
              </button>

              <button
                onClick={() => {
                  console.log("Rating:", rating);
                  setOpenRating(false);
                  setRating(0);
                }}
                disabled={rating === 0}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  rating === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#851385] hover:bg-[#6a0f6a]"
                }`}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENT DIALOG */}
      <CommentDialog 
        open={openComment} 
        onClose={() => setOpenComment(false)} 
      />
    </div>
  );
}