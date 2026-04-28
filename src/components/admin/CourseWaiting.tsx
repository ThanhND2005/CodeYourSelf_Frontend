import React, { useState, useEffect } from "react";
import { Check, X, Eye, PlayCircle, Layers, FileVideo, Image as ImageIcon, Video as VideoIcon, Clock, CheckCircle } from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";
import { TeacherService } from "@/services/TeacherService";
import { AdminServices } from "@/services/AdminService";

export interface WaitCourse {
  courseId: string;
  name: string;
  cost: string;
  summary: string;
  teacherId: string;
  teacherName: string;
  imageUrl: string;
  status: string,
}

export interface Video {
  courseId: string;
  name: string;
  videoId: string;
  videoUrl: string;
}

async function fetchCourseVideosApi(courseId: string): Promise<Video[]> {
  const { videos } = await TeacherService.getVideo(courseId);
  return Promise.resolve(videos);
}

async function fetchSubCoursesApi(course: WaitCourse): Promise<WaitCourse[]> {
  const { singleCourses } = await TeacherService.getSingleCourses(course.teacherId);
  return Promise.resolve(singleCourses.filter((t) => t.multipleCourseId === course.courseId));
}

function SingleCourseDialog({ course, onClose }: { course: WaitCourse; onClose: () => void }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchCourseVideosApi(course.courseId).then(setVideos);
  }, [course]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <FileVideo className="w-5 h-5" /> Chi tiết khóa học đơn: {course.name}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600 mb-4">{course.summary}</p>

          {activeVideo && (
            <div className="mb-6 bg-black rounded-xl overflow-hidden aspect-video">
              {activeVideo.videoUrl.includes("youtube.com") ? (
                <iframe
                  className="w-full h-full"
                  src={activeVideo.videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video className="w-full h-full" controls autoPlay src={activeVideo.videoUrl} />
              )}
            </div>
          )}

          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <VideoIcon className="w-4 h-4 text-sky-500" /> Danh sách Video ({videos.length})
          </h3>
          <div className="space-y-2">
            {videos.length === 0 && <p className="text-sm text-gray-500">Không có video nào.</p>}
            {videos.map((v) => (
              <div
                key={v.videoId}
                onClick={() => setActiveVideo(v)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                  activeVideo?.videoId === v.videoId ? "bg-sky-50 border-sky-200" : "bg-gray-50 hover:bg-gray-100 border-transparent"
                }`}
              >
                <PlayCircle className={`w-8 h-8 ${activeVideo?.videoId === v.videoId ? "text-sky-500" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-500">ID: {v.videoId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MultipleCourseDialog({ course, onClose }: { course: WaitCourse; onClose: () => void }) {
  const [subCourses, setSubCourses] = useState<WaitCourse[]>([]);

  useEffect(() => {
    fetchSubCoursesApi(course).then(setSubCourses);
  }, [course]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-violet-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5" /> Chi tiết Combo: {course.name}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600 mb-6">{course.summary}</p>

          <h3 className="font-semibold text-gray-800 mb-3">Các khóa học bao gồm ({subCourses.length})</h3>
          <div className="space-y-3">
            {subCourses.length === 0 && <p className="text-sm text-gray-500">Không có khóa học nào bên trong.</p>}
            {subCourses.map((c) => (
              <div key={c.courseId} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-20 h-14 object-cover rounded-md border" />
                ) : (
                  <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center"><ImageIcon className="text-gray-400" /></div>
                )}
                <div>
                  <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                  <p className="text-xs text-violet-600 font-medium mt-1">{c.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onApprove, onReject, onDetail, isMultiple }: {
  course: WaitCourse;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDetail: (course: WaitCourse) => void;
  isMultiple?: boolean;
}) {
  const isPending = course.status === 'Chờ duyệt';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition relative">
      <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-gray-300 w-8 h-8" />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold truncate ${isMultiple ? "text-violet-700" : "text-sky-700"}`}>
              {course.name}
            </h3>
            {/* Hiển thị Badge trạng thái */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
              {course.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.summary}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span>👨‍🏫 {course.teacherName}</span>
            <span className="font-medium text-red-500">💰 {course.cost}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
        {isPending && (
          <button onClick={() => onApprove(course.courseId)} className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition border border-emerald-200 hover:border-emerald-500">
            <Check className="w-3.5 h-3.5" /> Duyệt
          </button>
        )}
        
        <button onClick={() => onDetail(course)} className="flex items-center justify-center gap-1 bg-gray-50 text-gray-600 hover:bg-gray-800 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition border border-gray-200 hover:border-gray-800">
          <Eye className="w-3.5 h-3.5" /> Chi tiết
        </button>

        {isPending && (
          <button onClick={() => onReject(course.courseId)} className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition border border-red-200 hover:border-red-500">
            <X className="w-3.5 h-3.5" /> Từ chối
          </button>
        )}
      </div>
    </div>
  );
}

export default function CourseApprovalPage() {
  const { waitCourses, waitMultipleCourses, setWaitCourses, setWaitMultipleCourse } = useAdminStore()

  const [selectedSingle, setSelectedSingle] = useState<WaitCourse | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<WaitCourse | null>(null);

  const handleApproveSingle = async (id: string) => {
    try {
      await AdminServices.acceptWaitCourse(id)
      const { waitCourses: waitCourses1 } = await AdminServices.getWaitCourses()
      setWaitCourses(waitCourses1)
    } catch (error) {
      console.error(error)
    }
  };
  
  const handleRejectSingle = async (id: string) => {
    try {
      await AdminServices.denyWaitCourse(id)
      const { waitCourses: waitCourses1 } = await AdminServices.getWaitCourses()
      setWaitCourses(waitCourses1)
    } catch (error) {
      console.error(error)
    }
  };

  const handleApproveMultiple = async (id: string) => {
    try {
      await AdminServices.acceptWaitMultipleCourse(id)
      const { waitMultipleCourses: waitMultipleCourses1 } = await AdminServices.getWaitMultipleCourses()
      setWaitMultipleCourse(waitMultipleCourses1)
    } catch (error) {
      console.error(error)
    }
  };
  
  const handleRejectMultiple = async (id: string) => {
    try {
      await AdminServices.denyWaitMultipleCourse(id)
      const { waitMultipleCourses: waitMultipleCourses1 } = await AdminServices.getWaitMultipleCourses()
      setWaitMultipleCourse(waitMultipleCourses1)
    } catch (error) {
      console.error(error)
    }
  };

  // Phân loại dữ liệu thành 2 mảng Chờ duyệt và Đã duyệt
  const pendingSingle = waitCourses?.filter(c => c.status == 'Chờ duyệt') || [];
  const approvedSingle = waitCourses?.filter(c => c.status == 'Đã duyệt') || [];

  const pendingMultiple = waitMultipleCourses?.filter(c => c.status == 'Chờ duyệt') || [];
  const approvedMultiple = waitMultipleCourses?.filter(c => c.status == 'Đã duyệt') || [];

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 flex flex-col gap-8 pb-12">
      <h1 className="text-3xl font-extrabold text-gray-800">Quản lý xét duyệt khóa học</h1>

      {/* ================= VÙNG 1: KHÓA HỌC CHỜ DUYỆT ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-amber-700">Khóa học Chờ duyệt</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cột 1: Khóa học đơn chờ duyệt */}
          <div className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-sky-50 px-5 py-3 border-b border-sky-100 flex items-center gap-2">
              <FileVideo className="text-sky-600 w-5 h-5" />
              <h3 className="font-semibold text-sky-800">Khóa học đơn ({pendingSingle.length})</h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-[40vh] space-y-3">
              {pendingSingle.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">Không có khóa học đơn nào đang chờ.</p>
              ) : (
                pendingSingle.map(course => (
                  <CourseCard key={course.courseId} course={course} onApprove={handleApproveSingle} onReject={handleRejectSingle} onDetail={setSelectedSingle} />
                ))
              )}
            </div>
          </div>

          {/* Cột 2: Combo chờ duyệt */}
          <div className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-violet-50 px-5 py-3 border-b border-violet-100 flex items-center gap-2">
              <Layers className="text-violet-600 w-5 h-5" />
              <h3 className="font-semibold text-violet-800">Khóa học Combo ({pendingMultiple.length})</h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-[40vh] space-y-3">
              {pendingMultiple.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">Không có combo nào đang chờ.</p>
              ) : (
                pendingMultiple.map(course => (
                  <CourseCard key={course.courseId} course={course} isMultiple onApprove={handleApproveMultiple} onReject={handleRejectMultiple} onDetail={setSelectedMultiple} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= VÙNG 2: KHÓA HỌC ĐÃ DUYỆT ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-700">Khóa học Đã duyệt</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cột 1: Khóa học đơn đã duyệt */}
          <div className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-sky-50 px-5 py-3 border-b border-sky-100 flex items-center gap-2">
              <FileVideo className="text-sky-600 w-5 h-5" />
              <h3 className="font-semibold text-sky-800">Khóa học đơn ({approvedSingle.length})</h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-[40vh] space-y-3">
              {approvedSingle.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">Chưa có khóa học đơn nào được duyệt.</p>
              ) : (
                approvedSingle.map(course => (
                  <CourseCard key={course.courseId} course={course} onApprove={handleApproveSingle} onReject={handleRejectSingle} onDetail={setSelectedSingle} />
                ))
              )}
            </div>
          </div>

          {/* Cột 2: Combo đã duyệt */}
          <div className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-violet-50 px-5 py-3 border-b border-violet-100 flex items-center gap-2">
              <Layers className="text-violet-600 w-5 h-5" />
              <h3 className="font-semibold text-violet-800">Khóa học Combo ({approvedMultiple.length})</h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-[40vh] space-y-3">
              {approvedMultiple.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">Chưa có combo nào được duyệt.</p>
              ) : (
                approvedMultiple.map(course => (
                  <CourseCard key={course.courseId} course={course} isMultiple onApprove={handleApproveMultiple} onReject={handleRejectMultiple} onDetail={setSelectedMultiple} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedSingle && (
        <SingleCourseDialog course={selectedSingle} onClose={() => setSelectedSingle(null)} />
      )}
      {selectedMultiple && (
        <MultipleCourseDialog course={selectedMultiple} onClose={() => setSelectedMultiple(null)} />
      )}
    </div>
  );
}