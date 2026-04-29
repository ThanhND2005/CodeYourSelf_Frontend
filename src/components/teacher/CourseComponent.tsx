import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  PlaySquare,
  X,
  BookOpen,
  Layers,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  Camera,
  Image as ImageIcon,
  Upload,
  Film,
  HelpCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeacherStore } from "@/stores/useTeacherStore";
import { TeacherService } from "@/services/TeacherService";
import type { SingleCourse, Video } from "@/types/teacher";
import { useTabTeacherStore } from "@/stores/useTabStore";





interface MultipleCourse {
  multipleCourseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  rate: number;
  teacherId: string;
  imageUrl: string;
  status: string; 
}



const multipleCourseschema = z.object({
  name: z.string().min(5, "Tên phải có ít nhất 5 ký tự"),
  cost: z.coerce.number().min(0, "Giá không được âm"),
  summary: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});


const videoUploadSchema = z.object({
  name: z.string().min(5, "Tiêu đề video ít nhất 5 ký tự"),
  videoFile: z
    .any()
    .refine((files) => files?.length === 1, "Vui lòng chọn 1 file video.")
    .refine(
      (files) => files?.[0]?.size <= 10000 * 1024 * 1024,
      "Dung lượng tối đa 10000MB.",
    ) 
    .refine(
      (files) =>
        ["video/mp4", "video/webm", "video/quicktime"].includes(
          files?.[0]?.type,
        ),
      "Chỉ chấp nhận định dạng .mp4, .webm hoặc .mov",
    ),
});


const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageUploadSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, "Vui lòng chọn một tệp ảnh.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Kích thước ảnh tối đa là 5MB.",
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Chỉ chấp nhận định dạng .jpg, .png, hoặc .webp.",
    ),
});


const questionSchema = z.object({
  content: z.string().min(5, "Nội dung câu hỏi ít nhất 5 ký tự"),
  optionA: z.string().min(1, "Không được để trống"),
  optionB: z.string().min(1, "Không được để trống"),
  optionC: z.string().min(1, "Không được để trống"),
  optionD: z.string().min(1, "Không được để trống"),
  correctAnswer: z.enum(["A", "B", "C", "D"], { required_error: "Chọn đáp án đúng" }),
  timestamp: z.coerce.number().min(0, "Thời điểm không được âm"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface Question {
  videoId: string;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  timestamp: number;
}

type CourseFormData = z.infer<typeof multipleCourseschema>;
type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
type VideoUploadFormData = z.infer<typeof videoUploadSchema>;



export default function CourseManagementComponent() {
  const {
    singleCourses,
    multipleCourses,
    setSingleCourses,
    setMultipleCoures,
    setCourse,
    setStudents,
    setVideos,
    teacher,

  } = useTeacherStore();
  const { setTabActive } = useTabTeacherStore()
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false);
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [targetVideoForQuestion, setTargetVideoForQuestion] = useState<{ videoId: string; videoName: string } | null>(null);
  const [questionsByVideo, setQuestionsByVideo] = useState<Record<string, Question[]>>({});

  const [editingSingleCourse, setEditingSingleCourse] = useState<SingleCourse | null>(null);
  const [editingMultiCourse, setEditingMultiCourse] = useState<MultipleCourse | null>(null);

  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);

  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetImageUpload, setTargetImageUpload] = useState<{
    id: string;
    type: "single" | "combo";
  } | null>(null);


  const createSingleForm = useForm<CourseFormData>({ resolver: zodResolver(multipleCourseschema) });
  const createMultiForm = useForm<CourseFormData>({ resolver: zodResolver(multipleCourseschema) });
  const editSingleForm = useForm<CourseFormData>({ resolver: zodResolver(multipleCourseschema) });
  const editMultiForm = useForm<CourseFormData>({ resolver: zodResolver(multipleCourseschema) });
  const videoForm = useForm<VideoUploadFormData>({ resolver: zodResolver(videoUploadSchema) });
  const imageForm = useForm<ImageUploadFormData>({ resolver: zodResolver(imageUploadSchema) });
  const questionForm = useForm<QuestionFormData>({ resolver: zodResolver(questionSchema) });

  useEffect(()=>{
    const fetchCourse = async () =>{
      const {singleCourses} = await TeacherService.getSingleCourses(teacher?.userId as string)
      const {multipleCourses} = await TeacherService.getMultipleCourses(teacher?.userId as string)
      setSingleCourses(singleCourses)
      setMultipleCoures(multipleCourses)
    }
    fetchCourse()
  },[])
  const handleDeleteSingleCourse = async (courseId: string) => {
    try {
      await TeacherService.deleteCourse(courseId)
      const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string)
      setSingleCourses(singleCourses1)
    } catch (error) {
      console.error(error)
    }
  };

  const handleDeleteMultiCourse = async (multiCourseId: string) => {
    try {
      await TeacherService.deleteMultipleCourse(multiCourseId)
      const { multipleCourses: multipleCourses1 } = await TeacherService.getMultipleCourses(teacher?.userId as string)
      setMultipleCoures(multipleCourses1)
    } catch (error) {
      console.error(error)
    }
  };

  const handleViewSingleDetails = async (course: SingleCourse) => {
    setCourse(course)
    try {
      const { students } = await TeacherService.getStudents(course.courseId as string)
      setStudents(students)
      setTabActive('CourseDetail')
    } catch (error) {
      console.error(error)
    }
  };

  const handleViewMultiDetails = (multiCourse: MultipleCourse) => {
    console.log("Xem chi tiết combo:", multiCourse);
    
  };

  
  const triggerImageUpload = (id: string, type: "single" | "combo") => {
    setTargetImageUpload({ id, type });
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onSubmitImage = async (data: ImageUploadFormData) => {
    const file = data.file[0];
    const courseId = targetImageUpload?.id as string;
    const type = targetImageUpload?.type as string;
    try {
      if (type == "single") {
        await TeacherService.patchImageCourse(courseId, file);
        const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string);
        setSingleCourses(singleCourses1);
      } else if (type == "combo") {
        await TeacherService.patchImageMultipleCourse(courseId, file);
        const { multipleCourses: multipleCourses1 } = await TeacherService.getMultipleCourses(teacher?.userId as string);
        setMultipleCoures(multipleCourses1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onImageError = (errors: any) => {
    if (errors.file?.message) {
      alert(`Lỗi upload ảnh: ${errors.file.message}`);
    }
    imageForm.reset();
    setTargetImageUpload(null);
  };

  const { ref: rhfImageRef, onChange: rhfImageOnChange, ...rhfImageRest } = imageForm.register("file");

  
  const onSubmitCreateSingle = async (data: CourseFormData) => {
    const { name, cost, summary } = data;
    try {
      await TeacherService.postCourse(teacher?.userId as string, name, cost, summary);
      const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string);
      setSingleCourses(singleCourses1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSingleDialogOpen(false);
      createSingleForm.reset();
    }
  };

  const onSubmitCreateMulti = async (data: CourseFormData) => {
    const { name, cost, summary } = data;
    try {
      await TeacherService.postMultipleCourse(teacher?.userId as string, name, cost, summary);
      const { multipleCourses: multipleCourses1 } = await TeacherService.getMultipleCourses(teacher?.userId as string);
      setMultipleCoures(multipleCourses1);
    } catch (error) {
      console.error(error);
    } finally {
      createMultiForm.reset();
      setIsMultiDialogOpen(false);
    }
  };

  const handleOpenEditSingle = async (course: SingleCourse) => {
    setEditingSingleCourse(course);
    const { videos: videos1 } = await TeacherService.getVideo(course.courseId as string);
    setVideos(videos1);
    const currentVideo = useTeacherStore.getState().videos;
    setCourseVideos(currentVideo ?? []);
    editSingleForm.reset({
      name: course.name,
      cost: course.cost,
      summary: course.summary,
    });
  };

  const onSubmitUpdateSingleInfo = async (data: CourseFormData) => {
    const { name, cost, summary } = data;
    const courseId = editingSingleCourse?.courseId;
    try {
      await TeacherService.patchCourse(courseId as string, name, cost, summary);
      const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string);
      setSingleCourses(singleCourses1);
    } catch (error) {
      console.error(error);
    } finally {
      setEditingSingleCourse(null);
      editSingleForm.reset();
    }
  };

  const handleOpenEditMulti = (multiCourse: MultipleCourse) => {
    setEditingMultiCourse(multiCourse);
    editMultiForm.reset({
      name: multiCourse.name,
      cost: multiCourse.cost,
      summary: multiCourse.summary,
    });
  };

  const onSubmitUpdateMultiInfo = async (data: CourseFormData) => {
    const { name, cost, summary } = data;
    const courseId = editingMultiCourse?.multipleCourseId as string;
    try {
      await TeacherService.patchMultipleCourse(courseId, name, cost, summary);
      const { multipleCourses: multipleCourses1 } = await TeacherService.getMultipleCourses(teacher?.userId as string);
      setMultipleCoures(multipleCourses1);
    } catch (error) {
      console.error(error);
    } finally {
      setEditingMultiCourse(null);
      editMultiForm.reset();
    }
  };

  const onSubmitAddVideo = async (data: VideoUploadFormData) => {
    const videoFile = data.videoFile[0];
    try {
      await TeacherService.addVideo(editingSingleCourse?.courseId as string, data.name, videoFile);
      const { videos: videos1 } = await TeacherService.getVideo(editingSingleCourse?.courseId as string);
      setCourseVideos(videos1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVideoDialogOpen(false);
      videoForm.reset();
    }
  };

  const executeToggleCourseInMulti = async (courseId: string, isAdding: boolean) => {
    if (isAdding === false) {
      try {
        await TeacherService.removeCourse(courseId);
        const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string);
        setSingleCourses(singleCourses1);
      } catch (error) {
        console.error(error);
      }
    }
    if (!editingMultiCourse) return;
    if (isAdding === true) {
      const targetComboId = isAdding ? editingMultiCourse.multipleCourseId : null;
      try {
        await TeacherService.addCourse(courseId, targetComboId as string);
        const { singleCourses: singleCourses1 } = await TeacherService.getSingleCourses(teacher?.userId as string);
        setSingleCourses(singleCourses1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOpenQuestionDialog = (video: Video) => {
    setTargetVideoForQuestion({ videoId: video.videoId, videoName: video.name });
    questionForm.reset({ content: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", timestamp: 0 });
    setIsQuestionDialogOpen(true);
  };

  // TODO: Viết logic gọi API thêm câu hỏi
  const onSubmitQuestion = async (data: QuestionFormData) => {
    if (!targetVideoForQuestion) return;
    try {
      const newQuestion: Question = {
        videoId: targetVideoForQuestion.videoId,
        content: data.content,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        timestamp: data.timestamp,
      };
      await TeacherService.postQuestion(newQuestion.videoId, newQuestion.content, newQuestion.optionA, newQuestion.optionB, newQuestion.optionC, newQuestion.optionD, newQuestion.correctAnswer, newQuestion.timestamp)
      setQuestionsByVideo((prev) => ({
        ...prev,
        [targetVideoForQuestion.videoId]: [...(prev[targetVideoForQuestion.videoId] ?? []), newQuestion],
      }));
      setIsQuestionDialogOpen(false);
      questionForm.reset();

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="w-full h-full p-8 font-sans text-gray-800">
      {/* FORM ẨN CHO TÍNH NĂNG UPLOAD ẢNH */}
      <form className="hidden">
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          {...rhfImageRest}
          ref={(e) => {
            rhfImageRef(e);
            fileInputRef.current = e;
          }}
          onChange={(e) => {
            rhfImageOnChange(e);
            imageForm.handleSubmit(onSubmitImage, onImageError)();
          }}
        />
      </form>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Quản lý khóa học</h1>
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm min-w-[150px]">
              <div className="text-sm text-gray-500 mb-1">Tổng khóa đơn</div>
              <span className="text-3xl font-bold text-purple-700">{singleCourses?.length || 0}</span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm min-w-[150px]">
              <div className="text-sm text-gray-500 mb-1">Tổng khóa Combo</div>
              <span className="text-3xl font-bold text-pink-600">{multipleCourses?.length || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setIsSingleDialogOpen(true);
              createSingleForm.reset({ name: "", cost: 0, summary: "" });
            }}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors"
          >
            <Plus size={20} /> Tạo khóa học đơn
          </button>
          <button
            onClick={() => {
              setIsMultiDialogOpen(true);
              createMultiForm.reset({ name: "", cost: 0, summary: "" });
            }}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors"
          >
            <Layers size={20} /> Tạo khóa Combo
          </button>
        </div>
      </div>

      {/* DANH SÁCH COMBO */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-pink-800">
          <Layers size={24} /> Khóa học Combo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COMBO ĐÃ DUYỆT */}
          <div>
            <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle size={14} /> Đã duyệt ({multipleCourses?.filter(m => m.status === "Đã duyệt").length || 0})
            </h3>
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 space-y-3 max-h-80 overflow-y-auto">
              {multipleCourses?.filter(m => m.status === "Đã duyệt").length === 0 && (
                <p className="text-gray-400 text-sm italic">Chưa có combo nào được duyệt.</p>
              )}
              {multipleCourses?.filter(m => m.status === "Đã duyệt").map((multi) => (
                <div key={multi.multipleCourseId} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border-l-4 border-l-green-400 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div onClick={() => triggerImageUpload(multi.multipleCourseId, "combo")} className="relative w-14 h-14 bg-pink-50 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-pink-100" title="Đổi ảnh">
                      {multi.imageUrl ? <img src={multi.imageUrl} alt={multi.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-pink-300"><BookOpen size={20} /></div>}
                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white"><Camera size={16} /></div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{multi.name}</p>
                      <p className="text-xs text-pink-700">{multi.cost.toLocaleString("vi-VN")} vnđ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button onClick={() => handleViewMultiDetails(multi)} className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <BookOpen size={14} /> Xem
                    </button>
                    <button onClick={() => handleDeleteMultiCourse(multi.multipleCourseId)} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* COMBO CHƯA DUYỆT */}
          <div>
            <h3 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-1">
              <Film size={14} /> Chưa duyệt ({multipleCourses?.filter(m => m.status !== "Đã duyệt").length || 0})
            </h3>
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 space-y-3 max-h-80 overflow-y-auto">
              {multipleCourses?.filter(m => m.status !== "Đã duyệt").length === 0 && (
                <p className="text-gray-400 text-sm italic">Không có combo nào đang chờ duyệt.</p>
              )}
              {multipleCourses?.filter(m => m.status !== "Đã duyệt").map((multi) => (
                <div key={multi.multipleCourseId} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border-l-4 border-l-orange-400 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div onClick={() => triggerImageUpload(multi.multipleCourseId, "combo")} className="relative w-14 h-14 bg-pink-50 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-pink-100" title="Đổi ảnh">
                      {multi.imageUrl ? <img src={multi.imageUrl} alt={multi.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-pink-300"><BookOpen size={20} /></div>}
                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white"><Camera size={16} /></div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{multi.name}</p>
                      <p className="text-xs text-orange-600">{multi.cost.toLocaleString("vi-VN")} vnđ  </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button onClick={() => handleOpenEditMulti(multi)} className="flex items-center gap-1 bg-pink-100 text-pink-700 hover:bg-pink-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Edit size={14} /> Sửa
                    </button>
                    <button onClick={() => handleDeleteMultiCourse(multi.multipleCourseId)} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* DANH SÁCH KHÓA ĐƠN */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-800">
          <BookOpen size={24} /> Khóa học Đơn lẻ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KHÓA ĐƠN ĐÃ DUYỆT */}
          <div>
            <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle size={14} /> Đã duyệt ({singleCourses?.filter(c => c.status === "Đã duyệt").length || 0})
            </h3>
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 space-y-3 max-h-80 overflow-y-auto">
              {singleCourses?.filter(c => c.status === "Đã duyệt").length === 0 && (
                <p className="text-gray-400 text-sm italic">Chưa có khóa nào được duyệt.</p>
              )}
              {singleCourses?.filter(c => c.status === "Đã duyệt").map((course) => (
                <div key={course.courseId} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border-l-4 border-l-green-400 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div onClick={() => triggerImageUpload(course.courseId, "single")} className="relative w-14 h-14 bg-purple-50 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-purple-100" title="Đổi ảnh">
                      {course.imageUrl ? <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-purple-300"><ImageIcon size={20} /></div>}
                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white"><Camera size={16} /></div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{course.name}</p>
                      <p className="text-xs text-purple-700">{course.cost.toLocaleString("vi-VN")} vnđ</p>
                      {course.multipleCourseId && <span className="text-xs text-gray-500 flex items-center gap-0.5"><CheckCircle size={10} /> Thuộc Combo</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button onClick={() => handleViewSingleDetails(course)} className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <BookOpen size={14} /> Xem
                    </button>
                    <button onClick={() => handleDeleteSingleCourse(course.courseId)} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* KHÓA ĐƠN CHƯA DUYỆT */}
          <div>
            <h3 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-1">
              <Film size={14} /> Chưa duyệt ({singleCourses?.filter(c => c.status !== "Đã duyệt").length || 0})
            </h3>
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 space-y-3 max-h-80 overflow-y-auto">
              {singleCourses?.filter(c => c.status !== "Đã duyệt").length === 0 && (
                <p className="text-gray-400 text-sm italic">Không có khóa nào đang chờ duyệt.</p>
              )}
              {singleCourses?.filter(c => c.status !== "Đã duyệt").map((course) => (
                <div key={course.courseId} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border-l-4 border-l-orange-400 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div onClick={() => triggerImageUpload(course.courseId, "single")} className="relative w-14 h-14 bg-purple-50 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-purple-100" title="Đổi ảnh">
                      {course.imageUrl ? <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-purple-300"><ImageIcon size={20} /></div>}
                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white"><Camera size={16} /></div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{course.name}</p>
                      <p className="text-xs text-orange-600">{course.cost.toLocaleString("vi-VN")} vnđ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button onClick={() => handleOpenEditSingle(course)} className="flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Edit size={14} /> Sửa & Video
                    </button>
                    <button onClick={() => handleDeleteSingleCourse(course.courseId)} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DIALOG THÊM VIDEO MỚI */}
      {isVideoDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setIsVideoDialogOpen(false);
                videoForm.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-800">
              <Film size={24} /> Thêm Video Bài Giảng
            </h2>

            <form onSubmit={videoForm.handleSubmit(onSubmitAddVideo)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Tiêu đề bài giảng</label>
                <input
                  placeholder="Ví dụ: Bài 1 - Lời nói đầu..."
                  {...videoForm.register("name")}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                {videoForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{videoForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">File Video (.mp4, .webm, .mov)</label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Bấm để tải lên</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4, video/webm, video/quicktime"
                      className="hidden"
                      {...videoForm.register("videoFile")}
                    />
                  </label>
                </div>
                {videoForm.watch("videoFile")?.[0] && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={14} /> Đã chọn: {videoForm.watch("videoFile")[0].name}
                  </p>
                )}
                {videoForm.formState.errors.videoFile && (
                  <p className="text-red-500 text-xs mt-1">
                    {videoForm.formState.errors.videoFile.message as string}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoadingProcess}
                  className={`w-full text-white py-3 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 
                    ${isLoadingProcess ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"}`}
                >
                  {isLoadingProcess ? <span>Đang tải lên và xử lý...</span> : <><Plus size={20} /> Thêm Video</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG THÊM CÂU HỎI VÀO VIDEO */}
      {isQuestionDialogOpen && targetVideoForQuestion && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsQuestionDialogOpen(false); questionForm.reset(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-indigo-800">
              <HelpCircle size={22} /> Thêm câu hỏi
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Video: <span className="font-semibold text-gray-700">{targetVideoForQuestion.videoName}</span>
            </p>

            <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
              {/* Nội dung câu hỏi */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Nội dung câu hỏi</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Biến trong JavaScript được khai báo bằng từ khóa nào?"
                  {...questionForm.register("content")}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                />
                {questionForm.formState.errors.content && (
                  <p className="text-red-500 text-xs mt-1">{questionForm.formState.errors.content.message}</p>
                )}
              </div>

              {/* 4 đáp án */}
              <div className="grid grid-cols-2 gap-3">
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <div key={opt}>
                    <label className="text-xs font-semibold text-gray-600">Đáp án {opt}</label>
                    <input
                      placeholder={`Đáp án ${opt}`}
                      {...questionForm.register(`option${opt}` as "optionA" | "optionB" | "optionC" | "optionD")}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm focus:outline-indigo-500"
                    />
                    {questionForm.formState.errors[`option${opt}` as "optionA" | "optionB" | "optionC" | "optionD"] && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {questionForm.formState.errors[`option${opt}` as "optionA" | "optionB" | "optionC" | "optionD"]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Đáp án đúng */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Đáp án đúng</label>
                <select
                  {...questionForm.register("correctAnswer")}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-indigo-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {questionForm.formState.errors.correctAnswer && (
                  <p className="text-red-500 text-xs mt-1">{questionForm.formState.errors.correctAnswer.message}</p>
                )}
              </div>

              {/* Thời điểm xuất hiện (giây) */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Thời điểm xuất hiện (giây)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Ví dụ: 120"
                  {...questionForm.register("timestamp")}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-indigo-500"
                />
                {questionForm.formState.errors.timestamp && (
                  <p className="text-red-500 text-xs mt-1">{questionForm.formState.errors.timestamp.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Thêm câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG TẠO KHÓA ĐƠN */}
      {isSingleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative">
            <button onClick={() => setIsSingleDialogOpen(false)} className="absolute top-4 right-4">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Tạo khóa học đơn</h2>
            <form onSubmit={createSingleForm.handleSubmit(onSubmitCreateSingle)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên khóa học</label>
                <input
                  {...createSingleForm.register("name")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500"
                />
                {createSingleForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Giá</label>
                <input
                  type="number"
                  {...createSingleForm.register("cost")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500"
                />
                {createSingleForm.formState.errors.cost && (
                  <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.cost.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  rows={3}
                  {...createSingleForm.register("summary")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-purple-500"
                />
                {createSingleForm.formState.errors.summary && (
                  <p className="text-red-500 text-xs mt-1">{createSingleForm.formState.errors.summary.message}</p>
                )}
              </div>
              <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg font-medium">
                Tạo khóa học
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG TẠO COMBO */}
      {isMultiDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative">
            <button onClick={() => setIsMultiDialogOpen(false)} className="absolute top-4 right-4">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-pink-700">Tạo Combo</h2>
            <form onSubmit={createMultiForm.handleSubmit(onSubmitCreateMulti)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên Combo</label>
                <input
                  {...createMultiForm.register("name")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500"
                />
                {createMultiForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{createMultiForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Giá</label>
                <input
                  type="number"
                  {...createMultiForm.register("cost")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  rows={3}
                  {...createMultiForm.register("summary")}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-pink-500"
                />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium">
                Tạo Combo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG EDIT SINGLE */}
      {editingSingleCourse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between bg-purple-50">
              <h2 className="text-xl font-bold">Chỉnh sửa: {editingSingleCourse.name}</h2>
              <button onClick={() => setEditingSingleCourse(null)}><X /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              <div className="flex-1 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-purple-800">Chỉnh sửa thông tin</h3>
                <form onSubmit={editSingleForm.handleSubmit(onSubmitUpdateSingleInfo)} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tên khóa học</label>
                    <input
                      {...editSingleForm.register("name")}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none"
                    />
                    {editSingleForm.formState.errors.name && (
                      <span className="text-red-500 text-xs">{editSingleForm.formState.errors.name.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Giá</label>
                    <input
                      type="number"
                      {...editSingleForm.register("cost")}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                    <textarea
                      {...editSingleForm.register("summary")}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingProcess}
                    className="w-full py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200"
                  >
                    {isLoadingProcess ? "Đang lưu..." : "Lưu lại thông tin"}
                  </button>
                </form>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-purple-800">Quản lý Video bài giảng</h3>
                  <button
                    onClick={() => setIsVideoDialogOpen(true)}
                    disabled={isLoadingProcess}
                    className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-700"
                  >
                    <Plus size={16} /> Thêm Video mới
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {courseVideos.length === 0 && (
                    <p className="text-gray-400 text-sm italic">Chưa có video bài giảng nào.</p>
                  )}
                  {courseVideos.map((video) => (
                    <div key={video.videoId} className="flex flex-col gap-2 p-3 bg-gray-50 border rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <PlaySquare size={20} className="text-purple-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">{video.name}</p>
                          {(questionsByVideo[video.videoId]?.length ?? 0) > 0 && (
                            <p className="text-xs text-indigo-600 mt-0.5 flex items-center gap-1">
                              <HelpCircle size={11} />
                              {questionsByVideo[video.videoId].length} câu hỏi
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleOpenQuestionDialog(video)}
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                        >
                          <HelpCircle size={13} /> Thêm câu hỏi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG EDIT MULTI */}
      {editingMultiCourse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between bg-pink-50">
              <h2 className="text-xl font-bold">Chỉnh sửa Combo: {editingMultiCourse.name}</h2>
              <button onClick={() => setEditingMultiCourse(null)}><X /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              <div className="flex-1 border-r pr-6 border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-pink-800">Thông tin chung</h3>
                <form onSubmit={editMultiForm.handleSubmit(onSubmitUpdateMultiInfo)} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tên Combo</label>
                    <input
                      {...editMultiForm.register("name")}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none"
                    />
                    {editMultiForm.formState.errors.name && (
                      <span className="text-red-500 text-xs">{editMultiForm.formState.errors.name.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Giá</label>
                    <input
                      type="number"
                      {...editMultiForm.register("cost")}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                    <textarea
                      {...editMultiForm.register("summary")}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:border-pink-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingProcess}
                    className="w-full py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200"
                  >
                    {isLoadingProcess ? "Đang lưu..." : "Lưu thông tin Combo"}
                  </button>
                </form>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-pink-800 mb-2">Cấu trúc Combo</h3>
                <p className="text-sm text-gray-500 mb-4">Thêm hoặc gỡ các khóa học đơn lẻ.</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {singleCourses?.filter((t) => t.status === 'Đã duyệt' && (t.multipleCourseId === null || t.multipleCourseId === editingMultiCourse.multipleCourseId))?.map((course) => {
                    const isIncluded = course.multipleCourseId === editingMultiCourse.multipleCourseId;
                    const isBelongToOther = course.multipleCourseId !== null && !isIncluded;
                    return (
                      <div key={course.courseId} className={`flex items-center justify-between p-3 border rounded-xl ${isIncluded ? "bg-pink-50 border-pink-200" : "bg-white border-gray-200"}`}>
                        <p className={`text-sm font-medium ${isIncluded ? "text-pink-800" : "text-gray-700"}`}>
                          {course.name}
                        </p>
                        {isIncluded ? (
                          <button
                            disabled={isLoadingProcess}
                            onClick={() => executeToggleCourseInMulti(course.courseId, false)}
                            className="text-red-500 flex items-center gap-1 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm hover:bg-red-50"
                          >
                            <MinusCircle size={14} /> Gỡ
                          </button>
                        ) : (
                          !isBelongToOther && (
                            <button
                              disabled={isLoadingProcess}
                              onClick={() => executeToggleCourseInMulti(course.courseId, true)}
                              className="text-pink-600 flex items-center gap-1 text-xs font-medium bg-pink-50 px-2 py-1 rounded shadow-sm hover:bg-pink-100"
                            >
                              <PlusCircle size={14} /> Thêm
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}