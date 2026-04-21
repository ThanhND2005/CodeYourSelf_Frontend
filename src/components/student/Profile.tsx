import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, BarChart, Bell, CalendarClock } from "lucide-react";
import { StudentService } from "@/services/StudentService";
import { useStudentInfor } from "@/hooks/useAuth";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";
import { useNotifcations, useProgressCourse } from "@/hooks/useStudent";
import { useCourseStore } from "@/stores/useCourseStore";
import { useTabStudentStore } from "@/stores/useTabStore";

// ==============================
// 1. SCHEMAS (Giữ nguyên)
// ==============================
const infoSchema = z.object({
  name: z.string().min(1, "Họ và tên không được để trống"),
  dob: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
    z.date({ invalid_type_error: "Ngày sinh không hợp lệ" })
  ),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không đúng định dạng"),
});

const avatarSchema = z.object({
  avatar: z
    .custom<FileList>((val) => val instanceof FileList, "Vui lòng chọn một file")
    .refine((files) => files.length === 1, "Vui lòng chọn ảnh")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "Kích thước tối đa 5MB")
    .refine(
      (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0]?.type),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .webp"
    ),
});

type InfoFormValues = z.infer<typeof infoSchema>;
type AvatarFormValues = z.infer<typeof avatarSchema>;



// Dựa trên bảng Notification

const ProfileAndDashboard = () => {
  const {data : student} = useStudentInfor()
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {data : progressCourse} = useProgressCourse()
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
    reset: resetInfo,
  } = useForm<InfoFormValues>({ resolver: zodResolver(infoSchema) });
  
  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
    watch: watchAvatar,
    reset: resetAvatar,
  } = useForm<AvatarFormValues>({ resolver: zodResolver(avatarSchema) });
  
  const avatarFile = watchAvatar("avatar");
  useEffect(() => {
    if (avatarFile?.[0]) {
      const objectUrl = URL.createObjectURL(avatarFile[0]);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);
  const queryClient = useQueryClient()

  // --- HANDLERS CHO PROFILE ---
  const onUpdateInforMutation = useMutation({
    mutationFn : async (data : InfoFormValues) =>{
      return await StudentService.patchInformation(student.userId, data.name,data.dob,data.address,data.phone,data.gender)
    },
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey:['auth','student']})
      setIsInfoDialogOpen(false)
    },
    onError: (error) =>{
      console.error(error)
    }
  })
  const onSubmitInfo = async (data : InfoFormValues) => {
    onUpdateInforMutation.mutate(data)
  }
  const updateAvatarMutation  = useMutation({
    mutationFn: async (file : File) =>{
      return await StudentService.patchAvatar(student?.userId as string, file)
    },
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:['auth','student']})  
      setIsAvatarDialogOpen(false);
    },
    onError: (error) =>{
      console.error(error)
    }
  })
  const onSubmitAvatar = async (data: AvatarFormValues) => {
    updateAvatarMutation.mutate(data.avatar[0])
  };
  const handleOpenInfoDialog = () => {
    const toInputDate = (date: any) => new Date(date).toISOString().split('T')[0];
    resetInfo({
      ...student,
      dob: student?.dob ? toInputDate(student.dob) : "",
    } as any);
    setIsInfoDialogOpen(true);
  };
  const {setCourse} = useCourseStore()
  const {setTabActive} = useTabStudentStore()
  const handleContinueCourse = async (courseId: string) => {
    try {
      const {course} = await StudentService.getDetailCourse(courseId)
      setCourse(course)
      setTabActive('courselearning')
    } catch (error) {
      console.error(error)
    }
  };
  const handleViewNotification = (notificationId: string) => {
    console.log(`Đánh dấu đã đọc và xem chi tiết thông báo: ${notificationId}`);
  };

  const learningCount = progressCourse?.filter(c => c.status === 'learning').length;
  const completedCount = progressCourse?.filter(c => c.status === 'completed').length;
  const avgProgress = progressCourse?.length 
    ? Math.round(progressCourse.reduce((acc, curr) => acc + curr.progress, 0) / progressCourse.length) 
    : 0;
  const {data : notifications} = useNotifcations()
  return (
    <div className="w-full mx-auto p-4 md:p-8 font-sans space-y-8">
      
      {/* =========================================
          PHẦN 1: PROFILE
      ========================================= */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
          <button
            onClick={handleOpenInfoDialog}
            className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            Sửa hồ sơ
          </button>
        </div>

        <div className="bg-pink-100 rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
          <div className="flex flex-col items-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                resetAvatar();
                setAvatarPreview(student?.avatarUrl || null);
                setIsAvatarDialogOpen(true);
              }}
            >
              <img
                src={student?.avatarUrl || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Đổi ảnh</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-2 text-gray-800 text-lg justify-center">
            <p><span className="font-semibold">Họ và tên:</span> {student?.name || "Chưa cập nhật"}</p>
            <p><span className="font-semibold">Ngày sinh:</span> {student?.dob ? new Date(student.dob).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
            <p><span className="font-semibold">Địa chỉ:</span> {student?.address || "Chưa cập nhật"}</p>
            <p><span className="font-semibold">Số điện thoại:</span> {student?.phone || "Chưa cập nhật"}</p>
            <p><span className="font-semibold">Giới tính:</span> {student?.gender || "Chưa cập nhật"}</p>
          </div>
        </div>
      </section>

      {/* =========================================
          PHẦN 2: DASHBOARD TIẾN ĐỘ
      ========================================= */}
      <section className="bg-[#FBD8F8] p-4 rounded-2xl shadow">
        <h2 className="mb-4 font-medium text-lg text-gray-800">Tổng quan học tập</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="flex-1 !bg-yellow-400 text-yellow-900 rounded-xl p-4 text-left hover:scale-[1.02] transition shadow cursor-default">
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span className="font-semibold">Khóa đang học</span>
            </div>
            <p className="text-4xl font-bold mt-2">{learningCount}</p>
          </button>

          <button className="flex-1 !bg-green-400 text-green-900 rounded-xl p-4 text-left hover:scale-[1.02] transition shadow cursor-default">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span className="font-semibold">Khóa hoàn thành</span>
            </div>
            <p className="text-4xl font-bold mt-2">{completedCount}</p>
          </button>

          <div className="flex-1 bg-orange-300 rounded-xl p-4 shadow">
            <div className="flex items-center gap-2 text-orange-900">
              <BarChart size={20} />
              <span className="font-semibold">Tiến độ trung bình</span>
            </div>
            <p className="text-4xl font-bold mt-2 text-orange-900">{avgProgress}%</p>
          </div>
        </div>
      </section>

      {/* =========================================
          PHẦN 3: COURSES & NOTIFICATIONS
      ========================================= */}
      <section className="flex flex-col lg:flex-row gap-6 h-[400px]">
        {/* Cột trái: Khóa học của tôi (Cuộn, tối đa 2 hàng) */}
        <div className="flex-1 bg-[#FBD8F8] p-4 rounded-2xl shadow flex flex-col h-full">
          <h2 className="mb-4 font-medium text-lg text-gray-800">Khóa học của tôi</h2>
          {/* Vùng chứa cuộn: max-h phù hợp cho ~2 hàng card */}
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {progressCourse?.map((course ) => (
                <div
                  key={course.courseId}
                  className={cn(
                    "p-4 rounded-xl shadow flex flex-col justify-between h-[130px] bg-white" ,
        
                  )}
                >
                  <div>
                    <h3 className="font-semibold line-clamp-1" title={course.name}>{course.name}</h3>
                    <p className="text-sm mt-1 opacity-90">Tiến độ: {course.progress}%</p>
                  </div>
                  <Button 
                    onClick={() => handleContinueCourse(course.courseId, course.name)}
                    className="mt-3 w-max !bg-[#FBD8F8] text-[#851385] hover:bg-white transition-colors h-8 px-4 text-sm"
                  >
                    Tiếp tục
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Thông báo gần đây */}
        <div className="w-full lg:w-[320px] bg-[#FBD8F8] p-4 rounded-2xl shadow flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Bell size={20} className="text-[#851385]" />
            <h2 className="font-medium text-lg">Thông báo gần đây</h2>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-2">
            {notifications?.map((item) => (
              <div
                key={item.notificationId}
                onClick={() => handleViewNotification(item.notificationId)}
                className="bg-white p-3 rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-[#851385] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.content}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                  <CalendarClock size={12} />
                  <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          DIALOGS (Giữ nguyên từ Profile)
      ========================================= */}
      {isInfoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật thông tin cá nhân</h2>
            <form onSubmit={handleSubmitInfo(onSubmitInfo)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input {...registerInfo("name")} className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" />
                  {infoErrors.name && <p className="text-red-500 text-xs mt-1">{infoErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                  <input type="date" {...registerInfo("dob")} className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select {...registerInfo("gender")} className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input {...registerInfo("address")} className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input type="tel" {...registerInfo("phone")} className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" />
                  {infoErrors.phone && <p className="text-red-500 text-xs mt-1">{infoErrors.phone.message}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsInfoDialogOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAvatarDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật ảnh đại diện</h2>
            <form onSubmit={handleSubmitAvatar(onSubmitAvatar)}>
              <input 
                type="file" 
                accept="image/*" 
                {...registerAvatar("avatar")} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 outline-none" 
              />
              {avatarErrors.avatar && <p className="text-red-500 text-xs mt-2">{String(avatarErrors.avatar.message)}</p>}
              {avatarPreview && (
                <div className="mt-6 flex justify-center">
                  <img src={avatarPreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-sm" />
                </div>
              )}
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsAvatarDialogOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium">Cập nhật ảnh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAndDashboard;