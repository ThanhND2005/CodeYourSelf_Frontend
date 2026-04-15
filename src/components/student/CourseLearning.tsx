import React, { useState } from "react";

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

  return (
    // Đã thêm: max-w-6xl (thu hẹp), mx-auto (căn giữa), mt-24 (cách header), h-[85vh] (giới hạn chiều cao)
    <div className="flex flex-col max-w-6xl mx-auto mt-6 h-[78vh] bg-gray-100 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      
      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT */}
        <div className="flex-1 flex flex-col">
          {/* VIDEO */}
          <div className="flex items-center justify-center bg-black aspect-video text-white text-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/XhUXUYEwYf0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* INFO */}
          <div
            className="p-6 text-white"
            style={{
              background: "linear-gradient(135deg, #851385, #FBD8F8)",
            }}
          >
            <h2 className="text-xl font-semibold">
              {courseData.courseVideo[0].videoName}
            </h2>

            <p className="text-sm opacity-90">{courseData.teacherName}</p>

            <div className="mt-4 flex gap-3">
              <button
                className="bg-white text-[#851385] px-4 py-2 rounded-lg font-medium hover:scale-105 transition shadow-sm"
                onClick={() => setOpenRating(true)}
              >
                Đánh giá
              </button>

              <button
                className="bg-white text-[#851385] px-4 py-2 rounded-lg font-medium hover:scale-105 transition shadow-sm"
                onClick={() => setOpenComment(true)}
              >
                Bình luận
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white overflow-y-auto border-l border-gray-200">
          <div className="p-4 font-semibold border-b bg-gray-50 sticky top-0">
            Nội dung khóa học
          </div>

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

      {/* ================= DIALOG ĐÁNH GIÁ ================= */}
      {openRating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-96 p-6 rounded-xl shadow-2xl animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Đánh giá khóa học</h2>

            <div className="flex gap-2 text-2xl mb-4 cursor-pointer">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

            <textarea
              placeholder="Nhập đánh giá..."
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#851385] resize-none"
              rows={4}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenRating(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Hủy
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#851385] hover:bg-[#6a0f6a] transition text-white font-medium">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DIALOG BÌNH LUẬN ================= */}
      {openComment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-96 p-6 rounded-xl shadow-2xl animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Bình luận</h2>

            <textarea
              placeholder="Nhập bình luận..."
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#851385] resize-none"
              rows={4}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenComment(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Hủy
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#851385] hover:bg-[#6a0f6a] transition text-white font-medium">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}