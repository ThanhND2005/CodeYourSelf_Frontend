import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudentStore } from "@/stores/useStudentStore";
import { StudentService } from "@/services/StudentService";

// 1. Zod Schema cho Sinh viên (Lược bỏ bankName và bankAccount)
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

const StudentProfile = () => {
  const { student, setStudent } = useStudentStore();
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Setup Form Thông tin
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
    reset: resetInfo,
  } = useForm<InfoFormValues>({ resolver: zodResolver(infoSchema) });

  // Setup Form Avatar
  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
    watch: watchAvatar,
    reset: resetAvatar,
  } = useForm<AvatarFormValues>({ resolver: zodResolver(avatarSchema) });

  // Preview ảnh
  const avatarFile = watchAvatar("avatar");
  useEffect(() => {
    if (avatarFile?.[0]) {
      const objectUrl = URL.createObjectURL(avatarFile[0]);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  // Submit Thông tin (Gọi StudentService với tham số tương ứng bảng SQL)
  const onSubmitInfo = async (data: InfoFormValues) => {
    try {
      await StudentService.patchInformation(
        student?.userId as string,
        data.name,
        data.dob,
        data.address,
        data.phone,
        data.gender
      );
      const res = await StudentService.getInformation(student?.userId as string);
      setStudent(res.student || res); // Cập nhật store
      setIsInfoDialogOpen(false);
    } catch (error) { console.error(error); }
  };

  const onSubmitAvatar = async (data: AvatarFormValues) => {
    try {
      await StudentService.patchAvatar(student?.userId as string, data.avatar[0]);
      const res = await StudentService.getInformation(student?.userId as string);
      setStudent(res.student || res);
      setIsAvatarDialogOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleOpenInfoDialog = () => {
    const toInputDate = (date: any) => new Date(date).toISOString().split('T')[0];
    resetInfo({
      ...student,
      dob: student?.dob ? toInputDate(student.dob) : "",
    } as any);
    setIsInfoDialogOpen(true);
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 font-sans">
      {/* Header & Nút sửa - Tông Purple cũ */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
        <button
          onClick={handleOpenInfoDialog}
          className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Sửa hồ sơ
        </button>
      </div>

      {/* Thẻ hiển thị - Tông Pink nhạt cũ */}
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

        <div className="flex-1 flex flex-col space-y-2 text-gray-800 text-lg">
          <p><span className="font-semibold">Họ và tên:</span> {student?.name}</p>
          <p><span className="font-semibold">Ngày sinh:</span> {student?.dob ? new Date(student.dob).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {student?.address}</p>
          <p><span className="font-semibold">Số điện thoại:</span> {student?.phone}</p>
          <p><span className="font-semibold">Giới tính:</span> {student?.gender}</p>
        </div>
      </div>

      {/* DIALOG: THÔNG TIN - Lược bỏ bank, giữ tông Purple */}
      {isInfoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
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

      {/* DIALOG: AVATAR - Tông Purple */}
      {isAvatarDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
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

export default StudentProfile;