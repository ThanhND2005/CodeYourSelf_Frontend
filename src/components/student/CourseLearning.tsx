import React, { useState } from "react";

const courseData = {
  name: "Java Springboot",
  teacherName: "Đào Vũ Đạt",
  courseVideo: [
    { courseId: 1, videoName: "Bài 1: Giới thiệu khóa học",videoUrl: "abc" },
    { courseId: 2, videoName: "Bài 2: Cài đặt môi trường",videoUrl: "def" },
    { courseId: 3, videoName: "Bài 3: Controller là gì?",videoUrl: "jqk" }
  ]
};

export default function CourseLearning() {
  const [openRating, setOpenRating] = useState(false);
  const [openComment, setOpenComment] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-6 bg-white shadow">
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg text-[#851385]">
            CodeYourself
          </div>
          <div className="text-gray-600 text-sm">
            {courseData.name}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT */}
        <div className="flex-1 flex flex-col">
          
          {/* VIDEO */}
          <div className="bg-black flex items-center justify-center aspect-video text-white text-xl">
            Video Player
          </div>

          {/* INFO */}
          <div
            className="p-6 text-white"
            style={{
              background: "linear-gradient(135deg, #851385, #FBD8F8)"
            }}
          >
            <h2 className="text-xl font-semibold">
              {courseData.courseVideo[0].videoName}
            </h2>

            <p className="text-sm opacity-90">
              {courseData.teacherName}
            </p>

            <div className="mt-4 flex gap-3">
              
              <button
                className="bg-white text-[#851385] px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
                onClick={() => setOpenRating(true)}
              >
                Đánh giá
              </button>

              <button
                className="bg-white text-[#851385] px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
                onClick={() => setOpenComment(true)}
              >
                Bình luận
              </button>

            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4 font-semibold border-b">
            Nội dung khóa học
          </div>

          {courseData.courseVideo.map((lesson, index) => (
            <div
              key={lesson.courseId}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                index === 0
                  ? "bg-purple-100 text-[#851385] border-l-4 border-[#851385]"
                  : ""
              }`}
            >
              {index + 1}. {lesson.videoName}
            </div>
          ))}
        </div>
      </div>

      {/* ================= DIALOG ĐÁNH GIÁ ================= */}
      {openRating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            
            <h2 className="text-lg font-semibold mb-4">
              Đánh giá khóa học
            </h2>

            <div className="flex gap-2 text-2xl mb-4 cursor-pointer">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

            <textarea
              placeholder="Nhập đánh giá..."
              className="w-full border p-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenRating(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Hủy
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#851385] text-white">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DIALOG BÌNH LUẬN ================= */}
      {openComment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            
            <h2 className="text-lg font-semibold mb-4">
              Bình luận
            </h2>

            <textarea
              placeholder="Nhập bình luận..."
              className="w-full border p-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenComment(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Hủy
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#851385] text-white">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}