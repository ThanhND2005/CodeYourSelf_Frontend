import React, { useState } from "react";
import { Trash2, MessageSquare, User, Calendar, Activity, GraduationCap } from "lucide-react";
import { useTeacherStore } from "@/stores/useTeacherStore";
import { TeacherService } from "@/services/TeacherService";
import CommentDialog from "./CommentDialog"; // Đảm bảo đường dẫn import này đúng với project của bạn

// --- INTERFACES ---
export interface Course {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  teacherId: string;
  rate: number | null;
  multipleCourseId: string;
  status: string;
  imageUrl: string | null;
}

export interface CourseStudent {
  studentId: string;
  courseId: string;
  name: string;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  progress: number;
}

export default function CourseDetailTeacher() {
  const { students, course, setStudents ,setComment} = useTeacherStore()
  const [openComment, setOpenComment] = useState(false);

  // --- HANDLERS ---
  const handleDeleteStudent = async (studentId: string) => {
    try {
      await TeacherService.deleteStudent(course?.courseId as string, studentId)
      const { students } = await TeacherService.getStudents(course?.courseId as string)
      setStudents(students)
    } catch (error) {
      console.error(error)
    }
  };

  const handleOpenComments = async () => {
    const {comments} = await TeacherService.getComment(course?.courseId as string)
    setComment(comments)
    setOpenComment(true)
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <GraduationCap className="text-[#851385]" size={28} />
        Danh sách học viên:{" "}
        <span className="text-[#851385]">{course?.name}</span>
      </h2>

      {/* CARD */}
      <div
        className="rounded-3xl p-6 shadow-sm border border-purple-100"
        style={{
          background: "linear-gradient(135deg, #FBD8F8 0%, #ffffff 100%)",
        }}
      >
        {/* HEADER */}
        <div className="grid grid-cols-4 text-gray-700 font-medium mb-4 px-4 items-center">
          <div className="flex items-center gap-2"><User size={18} /> Học viên</div>
          <div className="flex items-center gap-2"><Calendar size={18} /> Ngày tham gia</div>
          <div className="flex items-center gap-2"><Activity size={18} /> Trạng thái</div>
          <div className="flex items-center gap-2 justify-end pr-2">Thao tác</div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {students?.length === 0 ? (
            <p className="text-center text-gray-500 py-4 bg-white rounded-2xl">Chưa có học viên nào tham gia khóa học này.</p>
          ) : (
            students?.map((student) => (
              <div
                key={student.studentId}
                className="grid grid-cols-4 items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-white"
              >
                {/* USER INFO */}
                <div className="flex items-center gap-3">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border border-purple-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </div>
                </div>

                {/* CREATED AT */}
                <div className="text-gray-600 text-sm">
                  {new Date(student.createdAt).toLocaleDateString("vi-VN")}
                </div>

                {/* STATUS & PROGRESS */}
                <div className="flex flex-col gap-1 items-start">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {student.status === "Completed" ? "Hoàn thành" : "Đang học"}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold ml-2">
                    Tiến độ: {student.progress}%
                  </span>
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteStudent(student.studentId)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COMMENT BUTTON */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleOpenComments}
            className="flex items-center gap-2 bg-white hover:bg-purple-50 px-6 py-2.5 rounded-xl shadow-sm text-[#851385] font-medium transition-colors border border-purple-100"
          >
            <MessageSquare size={20} />
            Xem Bình luận
          </button>
        </div>
        
        {/* COMPONENT DIALOG MỚI */}
        <CommentDialog 
          open={openComment} 
          onClose={() => setOpenComment(false)} 
          courseId={course?.courseId} 
        />
      </div>
    </div>
  );
}