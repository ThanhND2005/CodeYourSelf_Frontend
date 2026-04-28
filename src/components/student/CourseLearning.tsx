import React, { useState, useEffect, useRef } from "react";
import CommentDialog from "./CommentDialog";
import { CheckCircle, PlayCircle, ClipboardList, RefreshCw, Trophy } from "lucide-react";
import { useLessonProgress, useVideo } from "@/hooks/useCourses";
import { StudentService } from "@/services/StudentService";
import { useCourseStore } from "@/stores/useCourseStore";
import RatingDialog from "./RatingDialog";
import { TeacherService } from "@/services/TeacherService";
import { useTeacherStore } from "@/stores/useTeacherStore";

// ============================================================
// TYPES (theo chuẩn DB)
// ============================================================
interface Question {
  questionId: string;
  videoId: string;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string; // "A" | "B" | "C" | "D"
  timestamp: number;     // giây trong video (int)
}

// ============================================================
// MOCK DATA — Videos (đầy đủ trường theo StudentVideoProgress DB)
// ============================================================
const MOCK_VIDEOS: any[] = [
  {
    videoId: "vid-001",
    courseId: "course-001",
    name: "Bài 1: Giới thiệu HTML",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 320,
    order: 1,
  },
  {
    videoId: "vid-002",
    courseId: "course-001",
    name: "Bài 2: CSS Cơ bản",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 450,
    order: 2,
  },
  {
    videoId: "vid-003",
    courseId: "course-001",
    name: "Bài 3: JavaScript Nhập môn",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 600,
    order: 3,
  },
];

// ============================================================
// MOCK DATA — Questions (theo chuẩn bảng Questions DB)
// ============================================================
const MOCK_QUESTIONS: Question[] = [
  // Bài 1
  {
    questionId: "q-001",
    videoId: "vid-001",
    content: "HTML là viết tắt của cụm từ nào?",
    optionA: "Hyper Text Markup Language",
    optionB: "High Tech Modern Language",
    optionC: "Hyper Transfer Markup Language",
    optionD: "Home Tool Markup Language",
    correctAnswer: "A",
    timestamp: 60,
  },
  {
    questionId: "q-002",
    videoId: "vid-001",
    content: "Thẻ nào dùng để tạo tiêu đề lớn nhất trong HTML?",
    optionA: "<header>",
    optionB: "<h6>",
    optionC: "<h1>",
    optionD: "<title>",
    correctAnswer: "C",
    timestamp: 120,
  },
  {
    questionId: "q-003",
    videoId: "vid-001",
    content: "Thuộc tính nào dùng để thêm đường dẫn cho thẻ <a>?",
    optionA: "src",
    optionB: "href",
    optionC: "link",
    optionD: "url",
    correctAnswer: "B",
    timestamp: 200,
  },
  // Bài 2
  {
    questionId: "q-004",
    videoId: "vid-002",
    content: "CSS là viết tắt của cụm từ nào?",
    optionA: "Creative Style Sheets",
    optionB: "Cascading Style Sheets",
    optionC: "Computer Style Syntax",
    optionD: "Colorful Style Sheets",
    correctAnswer: "B",
    timestamp: 30,
  },
  {
    questionId: "q-005",
    videoId: "vid-002",
    content: "Thuộc tính CSS nào dùng để thay đổi màu chữ?",
    optionA: "font-color",
    optionB: "text-color",
    optionC: "color",
    optionD: "foreground-color",
    correctAnswer: "C",
    timestamp: 150,
  },
  // Bài 3
  {
    questionId: "q-006",
    videoId: "vid-003",
    content: "Cách khai báo biến trong JavaScript hiện đại là?",
    optionA: "var x = 5",
    optionB: "let x = 5 hoặc const x = 5",
    optionC: "int x = 5",
    optionD: "dim x = 5",
    correctAnswer: "B",
    timestamp: 45,
  },
  {
    questionId: "q-007",
    videoId: "vid-003",
    content: "Hàm nào dùng để in ra console trong JavaScript?",
    optionA: "print()",
    optionB: "log()",
    optionC: "console.log()",
    optionD: "echo()",
    correctAnswer: "C",
    timestamp: 90,
  },
  {
    questionId: "q-008",
    videoId: "vid-003",
    content: "Kiểu dữ liệu nào KHÔNG tồn tại trong JavaScript?",
    optionA: "string",
    optionB: "boolean",
    optionC: "integer",
    optionD: "undefined",
    correctAnswer: "C",
    timestamp: 180,
  },
];


export default function CourseLearning() {
  const [openRating, setOpenRating] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const { setComment } = useTeacherStore();

  const onclickCommnent = async () => {
    const { comments } = await TeacherService.getComment(
      useCourseStore.getState().course?.courseId as string
    );
    setComment(comments);
    setOpenComment(true);
  };

  // Lấy data từ API (fallback sang mock nếu API chưa có)
  const { data: videosFromApi } = useVideo();
  const { data: lessonprogress } = useLessonProgress();

  // Dùng mock nếu API trả về rỗng/chưa sẵn sàng
  const videos: any[] = (videosFromApi && videosFromApi.length > 0) ? videosFromApi : MOCK_VIDEOS;

  const handleRatingSubmit = async (courseId: string, rate: number): Promise<void> => {
    try {
      await StudentService.patchCourse(courseId, rate);
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

  // ==========================================
  // STATE CHO BÀI KIỂM TRA
  // ==========================================
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: "A"|"B"|... }
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreMap, setScoreMap] = useState<Record<string, number>>({}); // { videoId: score }

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

  // Load câu hỏi khi đổi video
  useEffect(() => {
    if (!activeVideo) return;
    setShowQuiz(false);
    setAnswers({});
    setQuizResult(null);

    // Thử gọi API, fallback sang mock
    const loadQuestions = async () => {
      try {
        const data = await StudentService.getQuestionsByVideo(activeVideo.videoId);
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          throw new Error("No data from API");
        }
      } catch {
        const mocked = MOCK_QUESTIONS.filter((q) => q.videoId === activeVideo.videoId);
        setQuestions(mocked);
      }
    };
    loadQuestions();
  }, [activeVideo]);

  
  const apiUpdateScore = async (videoId: string, score: number): Promise<void> => {
    console.log(`[API CALL] Update score: Video ${videoId} | Điểm: ${score}`);
    try {
      await StudentService.updateScore(videoId, score);
      setScoreMap((prev) => ({ ...prev, [videoId]: score }));
    } catch (error) {
      console.error("[apiUpdateScore] Lỗi:", error);
    }
  };

  // ==========================================
  // XỬ LÝ KIỂM TRA BÀI
  // ==========================================
  const handleCheckAnswers = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Vui lòng trả lời tất cả câu hỏi trước khi kiểm tra!");
      return;
    }
    setIsSubmitting(true);

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.questionId] === q.correctAnswer) correct++;
    });

    const score = parseFloat(((correct / questions.length) * 10).toFixed(1));
    setQuizResult({ score, total: questions.length });

    // Gọi API cập nhật score vào StudentVideoProgress
    await apiUpdateScore(activeVideo.videoId, score);
    setIsSubmitting(false);
  };

  const handleRetry = async () => {
    setAnswers({});
    setQuizResult(null);
    // Reset score về 0 trong DB
    await apiUpdateScore(activeVideo.videoId, 0);
  };

  // ==========================================
  // CÁC HÀM GỌI API TIẾN ĐỘ VIDEO
  // ==========================================
  const apiSyncProgress = async (videoId: string, currentTime: number, isCompleted: boolean) => {
    try {
      await StudentService.SyncProgress(videoId, currentTime, isCompleted);
    } catch (error) {
      console.error(error);
    }
  };

  const apiUpdateCourseProgress = async () => {
    try {
      await StudentService.patchCourseProgress(
        useCourseStore.getState().course?.courseId as string
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // LOGIC XỬ LÝ VIDEO
  // ==========================================
  useEffect(() => {
    if (!activeVideo) return;
    const currentProgress = (progressData || []).find((p) => p.videoId === activeVideo.videoId);
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
          const currentProgress = (progressData || []).find(
            (p) => p.videoId === activeVideo.videoId
          );
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

    if (duration > 0 && currentTime / duration >= 0.9) {
      const currentProgress = (progressData || []).find((p) => p.videoId === activeVideo.videoId);
      if (!currentProgress || currentProgress.isCompleted === 0) {
        setProgressData((prev) => {
          const safePrev = prev || [];
          const existing = safePrev.find((p) => p.videoId === activeVideo.videoId);
          if (existing) {
            return safePrev.map((p) =>
              p.videoId === activeVideo.videoId ? { ...p, isCompleted: 1 } : p
            );
          }
          return [
            ...safePrev,
            {
              id: "temp",
              studentId: "s1",
              videoId: activeVideo.videoId,
              courseId: activeVideo.courseId,
              lastPosition: currentTime,
              isCompleted: 1,
              updatedAt: new Date().toISOString(),
              score: 0,
            },
          ];
        });
        apiSyncProgress(activeVideo.videoId, currentTime, true);
        apiUpdateCourseProgress();
      }
    }
  };

  const getLessonStatusUI = (videoId: string) => {
    const prog = (progressData || []).find((p) => p.videoId === videoId);
    if (prog?.isCompleted === 1) return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (prog && prog.lastPosition > 0) return <PlayCircle className="text-yellow-500 w-5 h-5" />;
    return <PlayCircle className="text-gray-300 w-5 h-5" />;
  };

  // ==========================================
  // BẢO VỆ GIAO DIỆN KHI DỮ LIỆU ĐANG TẢI
  // ==========================================
  if (!videos || !activeVideo) {
    return (
      <div className="flex items-center justify-center min-h-[400px] mt-8 bg-gray-100 rounded-2xl shadow-xl">
        <p className="text-xl font-medium text-gray-500">Đang tải dữ liệu khóa học...</p>
      </div>
    );
  }

  const currentScore = scoreMap[activeVideo?.videoId] ?? null;
  const optionLabels = ["A", "B", "C", "D"] as const;
  const optionKeys = ["optionA", "optionB", "optionC", "optionD"] as const;

  return (
    <div className="flex flex-col max-w-7xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* ==================== LEFT: VIDEO PLAYER + QUIZ ==================== */}
        <div className="flex-1 flex flex-col">
          {/* Video player */}
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

          {/* Video info bar */}
          <div
            className="p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #851385, #FBD8F8)" }}
          >
            <div>
              <h2 className="text-2xl font-semibold leading-snug">{activeVideo.name}</h2>
              <p className="text-sm opacity-90 mt-1">Giảng viên: Đào Vũ Đạt</p>
              {currentScore !== null && (
                <p className="text-sm mt-1 font-semibold">
                  🏆 Điểm bài kiểm tra:{" "}
                  <span className="text-yellow-200">{currentScore} / 10</span>
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              {questions.length > 0 && (
                <button
                  className="px-5 py-2 rounded-xl bg-yellow-400 text-gray-900 font-medium shadow hover:shadow-md hover:scale-105 transition flex items-center gap-2"
                  onClick={() => setShowQuiz((v) => !v)}
                >
                  <ClipboardList className="w-4 h-4" />
                  {showQuiz ? "Ẩn bài tập" : "Làm bài tập"}
                </button>
              )}
              <button
                className="px-5 py-2 rounded-xl bg-white text-[#851385] font-medium shadow hover:shadow-md hover:scale-105 transition"
                onClick={() => setOpenRating(true)}
              >
                ⭐ Đánh giá
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-[#851385] text-white font-medium shadow hover:bg-[#6a0f6a] hover:scale-105 transition"
                onClick={() => onclickCommnent()}
              >
                💬 Bình luận
              </button>
            </div>
          </div>

          {/* ==================== QUIZ SECTION ==================== */}
          {showQuiz && (
            <div className="bg-white border-t border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#851385] mb-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Bài kiểm tra — {activeVideo.name}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Trả lời {questions.length} câu hỏi để kiểm tra kiến thức của bạn.
              </p>

              {/* Danh sách câu hỏi */}
              <div className="flex flex-col gap-6">
                {questions.map((q, idx) => (
                  <div
                    key={q.questionId}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm"
                  >
                    <p className="font-semibold text-gray-800 mb-3">
                      Câu {idx + 1}: {q.content}
                      <span className="ml-2 text-xs text-gray-400 font-normal">
                        (tại {q.timestamp}s)
                      </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {optionLabels.map((label, i) => {
                        const optionText = q[optionKeys[i]];
                        const isSelected = answers[q.questionId] === label;
                        const isCorrect = quizResult && label === q.correctAnswer;
                        const isWrong =
                          quizResult && isSelected && label !== q.correctAnswer;

                        let btnClass =
                          "w-full text-left px-4 py-2.5 rounded-lg border-2 transition font-medium text-sm";
                        if (isCorrect) {
                          btnClass +=
                            " bg-green-50 border-green-500 text-green-700";
                        } else if (isWrong) {
                          btnClass +=
                            " bg-red-50 border-red-400 text-red-700";
                        } else if (isSelected) {
                          btnClass +=
                            " bg-purple-50 border-[#851385] text-[#851385]";
                        } else {
                          btnClass +=
                            " bg-white border-gray-200 text-gray-700 hover:border-[#851385] hover:bg-purple-50";
                        }

                        return (
                          <button
                            key={label}
                            className={btnClass}
                            onClick={() => {
                              if (quizResult) return; // không cho thay đổi sau khi kiểm tra
                              setAnswers((prev) => ({
                                ...prev,
                                [q.questionId]: label,
                              }));
                            }}
                            disabled={!!quizResult}
                          >
                            <span className="font-bold mr-2">{label}.</span>
                            {optionText}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Kết quả */}
              {quizResult && (
                <div
                  className={`mt-6 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow ${
                    quizResult.score >= 7
                      ? "bg-green-50 border border-green-300"
                      : "bg-orange-50 border border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy
                      className={`w-8 h-8 ${
                        quizResult.score >= 7
                          ? "text-green-500"
                          : "text-orange-400"
                      }`}
                    />
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        Điểm của bạn:{" "}
                        <span
                          className={
                            quizResult.score >= 7
                              ? "text-green-600"
                              : "text-orange-500"
                          }
                        >
                          {quizResult.score} / 10
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Đúng{" "}
                        {
                          questions.filter(
                            (q) => answers[q.questionId] === q.correctAnswer
                          ).length
                        }{" "}
                        / {quizResult.total} câu &nbsp;·&nbsp;{" "}
                        {quizResult.score >= 9
                          ? "🎉 Xuất sắc!"
                          : quizResult.score >= 7
                          ? "✅ Đạt yêu cầu"
                          : "📖 Cần ôn lại"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-[#851385] text-[#851385] font-semibold hover:bg-purple-50 transition"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Làm lại
                  </button>
                </div>
              )}

              {/* Nút kiểm tra */}
              {!quizResult && (
                <div className="mt-6 flex justify-end">
                  <button
                    className="px-8 py-3 rounded-xl bg-[#851385] text-white font-semibold text-base shadow-md hover:bg-[#6a0f6a] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleCheckAnswers}
                    disabled={
                      isSubmitting ||
                      Object.keys(answers).length < questions.length
                    }
                  >
                    {isSubmitting ? "Đang chấm điểm..." : "✅ Kiểm tra"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================== RIGHT: SIDEBAR ==================== */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col max-h-[600px]">
          <div className="p-4 font-semibold border-b bg-gray-50 sticky top-0 z-10 flex justify-between items-center">
            <span>Nội dung khóa học</span>
            <span className="text-sm font-normal text-gray-500">
              {(progressData || []).filter((p) => p.isCompleted === 1).length} /{" "}
              {videos.length} bài
            </span>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1">
            {videos?.map((lesson: any, index: number) => {
              const isActive = activeVideo.videoId === lesson.videoId;
              const lessonScore = scoreMap[lesson.videoId];
              return (
                <div
                  key={lesson.videoId}
                  onClick={() => setActiveVideo(lesson)}
                  className={`px-4 py-4 cursor-pointer transition flex items-center justify-between border-b border-gray-100 hover:bg-purple-50 ${
                    isActive
                      ? "bg-purple-50 text-[#851385] border-l-4 border-[#851385]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span
                      className={`font-medium ${
                        isActive ? "text-[#851385]" : "text-gray-700"
                      }`}
                    >
                      {index + 1}. {lesson.name}
                    </span>
                    {lessonScore !== undefined && (
                      <span className="text-xs text-yellow-600 font-semibold">
                        🏆 Điểm: {lessonScore} / 10
                      </span>
                    )}
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