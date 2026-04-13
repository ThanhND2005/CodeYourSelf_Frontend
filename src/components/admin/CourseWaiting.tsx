import { useState } from "react";

// ─── Types (khớp với schema database) ───────────────────────────────────────

interface CourseVideo {
  videoUrl: string;
  name: string;
  deleted: number;
}

interface Course {
  courseId: string;
  name: string;
  cost: number | null;       // null = Miễn Phí
  summary: string;
  deleted: number;
  teacherId: string;
  teacherName: string;       // join từ Teacher table
  teacherAvatar?: string;
  rate: number;
  multipleCourseId: string | null;
  status: "pending" | "approved" | "rejected";
  imageUrl: string;
  totalVideos: number;       // tính từ CourseVideo
  totalDurationMinutes: number;
  submittedAt: string;       // ISO string
  videos: CourseVideo[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_COURSES: Course[] = [
  {
    courseId: "c-101",
    name: "C++ basic",
    cost: null,
    summary: "Khóa học lập trình C++ cơ bản dành cho người mới bắt đầu.",
    deleted: 0,
    teacherId: "t-001",
    teacherName: "Đào Vũ Đạt",
    teacherAvatar: "",
    rate: 0,
    multipleCourseId: null,
    status: "pending",
    imageUrl: "",
    totalVideos: 15,
    totalDurationMinutes: 5 * 60 + 24,
    submittedAt: "2026-02-28T09:00:00Z",
    videos: [
      { videoUrl: "https://www.youtube.com/watch?v=cpp1", name: "Sơ lược về C++, cài đặt môi trường", deleted: 0 },
      { videoUrl: "https://www.youtube.com/watch?v=cpp2", name: "Các kiểu dữ liệu, biến, comments, built-in", deleted: 0 },
      { videoUrl: "https://www.youtube.com/watch?v=cpp3", name: "Vòng lặp", deleted: 0 },
      { videoUrl: "https://www.youtube.com/watch?v=cpp4", name: "Mảng, xâu kí tự", deleted: 0 },
    ],
  },
  {
    courseId: "c-102",
    name: "React Pro",
    cost: 1990000,
    summary: "Khóa học React nâng cao, bao gồm Hooks, Context API và tối ưu hiệu năng.",
    deleted: 0,
    teacherId: "t-002",
    teacherName: "Lê Thanh Thủy",
    teacherAvatar: "",
    rate: 0,
    multipleCourseId: null,
    status: "pending",
    imageUrl: "",
    totalVideos: 30,
    totalDurationMinutes: 7 * 60 + 44,
    submittedAt: "2026-02-28T07:00:00Z",
    videos: [
      { videoUrl: "https://www.youtube.com/watch?v=React1", name: "Hooks là gì?", deleted: 0 },
      { videoUrl: "http://localhost:9000/images/video2.mp4", name: "Images là gì?", deleted: 0 },
      { videoUrl: "https://www.youtube.com/watch?v=React3", name: "Context API", deleted: 0 },
    ],
  },
  {
    courseId: "c-103",
    name: "SQL & Database Design",
    cost: 850000,
    summary: "Thiết kế cơ sở dữ liệu quan hệ, viết truy vấn SQL hiệu quả từ cơ bản đến nâng cao.",
    deleted: 0,
    teacherId: "t-003",
    teacherName: "Nguyễn Minh Khoa",
    teacherAvatar: "",
    rate: 0,
    multipleCourseId: "mc-001",
    status: "pending",
    imageUrl: "",
    totalVideos: 22,
    totalDurationMinutes: 6 * 60 + 10,
    submittedAt: "2026-02-27T14:30:00Z",
    videos: [
      { videoUrl: "https://www.youtube.com/watch?v=SQL1", name: "Normalization", deleted: 0 },
      { videoUrl: "https://www.youtube.com/watch?v=SQL2", name: "JOIN & Subquery", deleted: 0 },
    ],
  },
];

// ─── API Functions (placeholder – thay bằng fetch thực tế) ──────────────────

async function fetchPendingCourses(): Promise<Course[]> {
  // TODO: GET /api/admin/courses?status=pending
  return Promise.resolve(MOCK_COURSES);
}

async function approveCourse(courseId: string): Promise<void> {
  // TODO: PATCH /api/admin/courses/:courseId  { status: "approved" }
  console.log("Approve course:", courseId);
}

async function rejectCourse(courseId: string, reason?: string): Promise<void> {
  // TODO: PATCH /api/admin/courses/:courseId  { status: "rejected", reason }
  console.log("Reject course:", courseId, reason);
}

async function fetchCourseDetail(courseId: string): Promise<Course | null> {
  // TODO: GET /api/admin/courses/:courseId
  console.log("Fetch detail:", courseId);
  return Promise.resolve(MOCK_COURSES.find((c) => c.courseId === courseId) ?? null);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} giờ ${m} phút`;
}

function formatCost(cost: number | null): string {
  if (cost === null || cost === 0) return "Miễn Phí";
  return cost.toLocaleString("vi-VN") + " (vnđ)";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}Am, ${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const sizeClass = size === "sm" ? "w-9 h-9 text-xs" : "w-12 h-12 text-sm";
  const colors = [
    "bg-violet-400",
    "bg-pink-400",
    "bg-sky-400",
    "bg-emerald-400",
    "bg-amber-400",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// Detail modal
interface DetailModalProps {
  course: Course;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function DetailModal({ course, onClose, onApprove, onReject }: DetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Chi tiết khóa học</p>
            <h2 className="text-white text-lg font-bold mt-0.5">{course.name}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={course.teacherName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{course.teacherName}</p>
              <p className="text-xs text-gray-400">{course.teacherId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <span>💰 {formatCost(course.cost)}</span>
            <span>📹 {course.totalVideos} video</span>
            <span>⏱ {formatDuration(course.totalDurationMinutes)}</span>
            <span>📅 {formatDate(course.submittedAt)}</span>
          </div>
          {course.summary && (
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">{course.summary}</p>
          )}
        </div>

        {/* Video list */}
        <div className="px-6 py-4 max-h-56 overflow-y-auto space-y-2">
          {course.videos.map((v, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-500">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">Video {i + 1}: {v.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{v.videoUrl}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3 border-t border-gray-100">
          <button
            onClick={() => { onApprove(course.courseId); onClose(); }}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            ✓ Duyệt
          </button>
          <button
            onClick={() => { onReject(course.courseId); onClose(); }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            ✗ Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

// Course card
interface CourseCardProps {
  course: Course;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDetail: (course: Course) => void;
}

function CourseCard({ course, onApprove, onReject, onDetail }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4">
      <Avatar name={course.teacherName} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-gray-500">
              Giáo viên: <span className="font-semibold text-gray-800">{course.teacherName}</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Khóa học: <span className="font-semibold text-violet-600">{course.name}</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Phí: <span className="font-medium text-gray-700">{formatCost(course.cost)}</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Thời lượng:{" "}
              <span className="font-medium text-gray-700">
                {course.totalVideos} video ({formatDuration(course.totalDurationMinutes)})
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Thời gian gửi yêu cầu:{" "}
              <span className="font-medium text-gray-700">{formatDate(course.submittedAt)}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => onApprove(course.courseId)}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            >
              Duyệt
            </button>
            <button
              onClick={() => onDetail(course)}
              className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            >
              Chi tiết
            </button>
            <button
              onClick={() => onReject(course.courseId)}
              className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            >
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CourseApprovalPage() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(false);

  function addToast(message: string, type: "success" | "error") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }

  async function handleApprove(courseId: string) {
    try {
      setLoading(true);
      await approveCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
      addToast("Đã duyệt khóa học thành công!", "success");
    } catch {
      addToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(courseId: string) {
    try {
      setLoading(true);
      await rejectCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
      addToast("Đã từ chối khóa học.", "success");
    } catch {
      addToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Gọi khi mount thực tế:
  // useEffect(() => {
  //   fetchPendingCourses().then(setCourses);
  // }, []);

  return (
    <div className=" p-6">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all
              ${t.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedCourse && (
        <DetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Page content */}
      <div className="mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Yêu cầu duyệt khóa học</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} khóa học đang chờ phê duyệt
          </p>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-medium">Không còn khóa học nào chờ duyệt!</p>
          </div>
        )}

        {/* Course list */}
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onApprove={handleApprove}
              onReject={handleReject}
              onDetail={setSelectedCourse}
            />
          ))}
        </div>
      </div>
    </div>
  );
}