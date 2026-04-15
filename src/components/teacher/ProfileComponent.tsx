import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// Giả định import store của bạn
import { useTeacherStore } from "@/stores/useTeacherStore";
import { TeacherService } from "@/services/TeacherService";


// 2. Định nghĩa Zod Schemas
const infoSchema = z.object({
  name: z.string().min(1, "Họ và tên không được để trống"),
  dob: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date({ invalid_type_error: "Ngày sinh không hợp lệ" }),
  ),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Số điện thoại không đúng định dạng",
    ),
  bankName: z.string().min(1, "Tên ngân hàng không được để trống"),
  bankAccount: z.string().min(1, "Số tài khoản không được để trống"),
});

const avatarSchema = z.object({
  avatar: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Vui lòng chọn một file",
    )
    .refine((files) => files.length === 1, "Vui lòng chọn ảnh")
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "Kích thước ảnh tối đa là 5MB",
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type,
        ),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .webp",
    ),
});

type InfoFormValues = z.infer<typeof infoSchema>;
type AvatarFormValues = z.infer<typeof avatarSchema>;

const TeacherProfile = () => {
  // Lấy dữ liệu và action từ store (Giả định store trả về teacher và hàm setTeacher)
  const teacher = useTeacherStore((s) => s.teacher);

  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {setTeacher} = useTeacherStore()
  // 3. Setup React Hook Form cho Thông tin
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
    reset: resetInfo,
  } = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
  });

  // 4. Setup React Hook Form cho Avatar
  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
    watch: watchAvatar,
    reset: resetAvatar,
  } = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
  });

  // Theo dõi file được chọn để hiển thị preview
  const avatarFile = watchAvatar("avatar");
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const objectUrl = URL.createObjectURL(avatarFile[0]);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up memory
    }
  }, [avatarFile]);

  // Hàm format ngày tháng (YYYY-MM-DD to DD-MM-YYYY)
  const formatDate = (dateString: Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  
  // Submit form thông tin
  const onSubmitInfo = async (data: InfoFormValues) => {
    const { name, dob, gender, address, phone, bankName, bankAccount } = data;
    try {
      await TeacherService.patchInformation(teacher?.userId as string,name,dob,address,phone,gender,bankName,bankAccount)
      const {teacher : teacher1} = await TeacherService.getInformation(teacher?.userId as string)
      setTeacher(teacher1)
      setIsInfoDialogOpen(false)
    } catch (error) {
      console.error(error)
    }
  };

  // Submit form avatar
  const onSubmitAvatar = async (data: AvatarFormValues) => {
    const file = data.avatar[0]
    try {
      await TeacherService.patchAvatar(teacher?.userId as string, file)
      
      const {teacher : teacher1} = await TeacherService.getInformation(teacher?.userId as string)

      setTeacher(teacher1)
      setIsAvatarDialogOpen(false)
    } catch (error) {
      console.error(error)
    }
  };

  // Xử lý mở dialog thông tin
  const handleOpenInfoDialog = () => {
    // Hàm phụ trợ convert Date -> "YYYY-MM-DD"
    const toInputDate = (date: Date) => {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    };

    resetInfo({
      ...teacher,

      dob: teacher?.dob ? toInputDate(teacher.dob) : "",
    } as any);

    setIsInfoDialogOpen(true);
  };

  // Xử lý mở dialog avatar
  const handleOpenAvatarDialog = () => {
    resetAvatar(); // Reset lại input file
    setAvatarPreview(teacher?.avatarUrl as string); // Hiển thị lại ảnh cũ ban đầu
    setIsAvatarDialogOpen(true);
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 font-sans">
      {/* Tiêu đề & Nút sửa */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hồ sơ cá nhân
        </h1>
        <button
          onClick={handleOpenInfoDialog}
          className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Sửa hồ sơ
        </button>
      </div>

      {/* Thẻ hiển thị thông tin */}
      <div className="bg-pink-100 rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        {/* Phần Avatar */}
        <div className="flex flex-col items-center space-y-3">
          <div
            className="relative group cursor-pointer"
            onClick={handleOpenAvatarDialog}
          >
            <img
              src={teacher?.avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">Đổi ảnh</span>
            </div>
          </div>
        </div>

        {/* Phần Thông tin chi tiết */}
        <div className="flex-1 flex flex-col space-y-2 text-gray-800 text-lg">
          <p>
            <span className="font-semibold">Họ và tên:</span> {teacher?.name}
          </p>
          <p>
            <span className="font-semibold">Ngày sinh:</span>{" "}
            {formatDate(teacher?.dob as Date)}
          </p>
          <p>
            <span className="font-semibold">Địa chỉ:</span> {teacher?.address}
          </p>
          <p>
            <span className="font-semibold">Số điện thoại:</span>{" "}
            {teacher?.phone}
          </p>
          <p>
            <span className="font-semibold">Giới tính:</span> {teacher?.gender}
          </p>
          <p>
            <span className="font-semibold">Ngân hàng:</span>{" "}
            {teacher?.bankName}
          </p>
          <p>
            <span className="font-semibold">Số tài khoản:</span>{" "}
            {teacher?.bankAccount}
          </p>
          <p>
            <span className="font-semibold">Ngày tham gia:</span>{" "}
            {formatDate(teacher?.createdAt as Date)}
          </p>
        </div>
      </div>

      {/* ======================= DIALOG: CẬP NHẬT THÔNG TIN ======================= */}
      {isInfoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Cập nhật thông tin cá nhân
            </h2>
            <form onSubmit={handleSubmitInfo(onSubmitInfo)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Họ và tên */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    {...registerInfo("name")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    {...registerInfo("dob")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.dob && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.dob.message}
                    </p>
                  )}
                </div>

                {/* Giới tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </label>
                  <select
                    {...registerInfo("gender")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {infoErrors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.gender.message}
                    </p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    {...registerInfo("address")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.address.message}
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...registerInfo("phone")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.phone.message}
                    </p>
                  )}
                </div>

                {/* Tên ngân hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Ngân Hàng
                  </label>
                  <input
                    type="text"
                    {...registerInfo("bankName")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.bankName && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.bankName.message}
                    </p>
                  )}
                </div>

                {/* Số tài khoản */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    {...registerInfo("bankAccount")}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {infoErrors.bankAccount && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.bankAccount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInfoDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= DIALOG: CẬP NHẬT ẢNH ======================= */}
      {isAvatarDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Cập nhật ảnh đại diện
            </h2>
            <form onSubmit={handleSubmitAvatar(onSubmitAvatar)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tải ảnh lên (Max 5MB)
                </label>
                {/* File Input */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  {...registerAvatar("avatar")}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100 outline-none"
                />
                {avatarErrors.avatar && (
                  <p className="text-red-500 text-xs mt-2">
                    {String(avatarErrors.avatar.message)}
                  </p>
                )}

                {/* Preview ảnh trước khi lưu */}
                {avatarPreview && (
                  <div className="mt-6 flex justify-center">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAvatarDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium"
                >
                  Cập nhật ảnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
