import React from "react";

const courseData = {
  courseId: 1,
  name: "Springboot căn bản",
};

const students = [
  {
    studentId: 1,
    studentName: "Trang Nguyễn",
    createdAt: "2025-02-25T10:30:00",
    progress: 100,
  },
  {
    studentId: 2,
    studentName: "Nguyễn Văn A",
    createdAt: "2025-03-10T14:00:00",
    progress: 50,
  },
];

export default function CourseDetailTeacher() {
  return (
    <div className="p-6">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-6">
        Danh sách học viên:{" "}
        <span className="text-[#851385]">
          {courseData.name}
        </span>
      </h2>

      {/* CARD */}
      <div
        className="rounded-3xl p-6 shadow"
        style={{
          background: "linear-gradient(135deg, #FBD8F8, #ffffff)"
        }}
      >

        {/* HEADER */}
        <div className="grid grid-cols-4 text-gray-700 font-medium mb-4 px-4">
          <div>Học viên</div>
          <div>Ngày tham gia</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.studentId}
              className="grid grid-cols-4 items-center bg-white p-4 rounded-2xl shadow-sm"
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <span>{student.studentName}</span>
              </div>

              {/* CREATED AT */}
              <div>
                {new Date(student.createdAt).toLocaleDateString("vi-VN")}
              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    student.progress === 100
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {student.progress === 100
                    ? "Hoàn thành"
                    : "Đang học"}
                </span>
              </div>

              {/* ACTION */}
              <div>
                <button className="bg-[#851385] text-white px-4 py-1 rounded-full hover:opacity-90">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COMMENT BUTTON */}
        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-[#851385]">
            Bình luận
          </button>
        </div>

      </div>
    </div>
  );
}