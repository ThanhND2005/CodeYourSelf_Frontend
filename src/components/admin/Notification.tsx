import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Inbox, Send, Trash2, X } from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';
import { AdminServices } from '@/services/AdminService';

// 1. Interfaces
export interface Notification {
  notificationId: string;
  senderId: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface DashboardNotificationDTO {
  id: string;
  message: string;
  createdAt: string;
  senderAvatarUrl: string;
}


// 3. Validation Schema với Zod
const notificationSchema = z.object({
  targetRole: z.enum(['Giáo viên', 'Học viên', 'Tất cả'], {
    required_error: 'Vui lòng chọn đối tượng nhận thông báo',
  }),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề thông báo').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  description: z.string().min(1, 'Vui lòng nhập nội dung thông báo'),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;



export default function NotificationPageContent() {
  // --- STATE ---
  const {notifications,receivedNotifications,setNotifications} = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      targetRole: 'Giáo viên',
      title: '',
      description: '',
    },
  });

  // --- HANDLERS ---
  const handleDeleteNotification = async (notificationId: string) => {
     try {
      await AdminServices.deleteNotification(notificationId)
      const {notifications : notifications1} = await AdminServices.getNotificaitons()
      setNotifications(notifications1)
     } catch (error) {
      console.error(error)
     }
  };

  const onSubmit = async (data: NotificationFormValues) => {
    const {targetRole,title,description} = data
    try {
      await AdminServices.postNotification(targetRole,title,description)
      const {notifications : notifications1} = await AdminServices.getNotificaitons()
      setNotifications(notifications1)
    } catch (error) {
      console.error(error)
    }finally{
      handleCloseDialog()
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    reset(); // Xóa trắng dữ liệu form khi đóng
  };

  // --- JSX ---
  return (
    <>
      <div className="w-full h-full  overflow-y-auto">
        <div className="w-full flex flex-col h-full gap-8 mx-auto">
          {/* Header & Nút Tạo */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Thông báo</h2>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#8b2c8b] hover:bg-[#702170] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={18} /> Tạo thông báo
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DANH SÁCH THÔNG BÁO ĐÃ NHẬN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Inbox className="text-purple-600" size={20} /> Thông báo đã nhận
                <span className="bg-purple-100 text-purple-700 text-xs py-1 px-2 rounded-full font-semibold">
                  {receivedNotifications?.length}
                </span>
              </h3>

              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {receivedNotifications?.map((notif) => (
                  <div
                    key={notif.id}
                    className="bg-gray-50/80 rounded-xl p-4 flex items-start gap-4 border border-gray-100 transition-colors hover:bg-gray-100"
                  >
                    <img src={notif.senderAvatarUrl} alt="avatar" className="w-10 h-10 rounded-full shadow-sm" />
                    <div className="space-y-1 text-sm text-gray-700 flex-1">
                      <p className="font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.createdAt}</p>
                    </div>
                  </div>
                ))}
                {receivedNotifications?.length === 0 && (
                  <p className="text-center text-gray-500 italic mt-6">Không có thông báo mới.</p>
                )}
              </div>
            </div>

            {/* DANH SÁCH THÔNG BÁO ĐÃ GỬI */}
            <div className="bg-[#fadcf5] rounded-2xl p-6 shadow-sm border border-pink-100 flex flex-col">
              <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Send className="text-pink-600" size={20} /> Thông báo đã gửi
              </h3>

              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {notifications?.map((notif) => (
                  <div
                    key={notif.notificationId}
                    className="bg-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4"
                  >
                    <div className="space-y-1.5 text-sm text-gray-700 flex-1">
                      <p>
                        <span className="font-semibold text-[#8b2c8b]">Gửi đến:</span> {notif.receiverRole}
                      </p>
                      <p>
                        <span className="font-semibold">Tiêu đề:</span> {notif.title}
                      </p>
                      <p className="line-clamp-2">
                        <span className="font-semibold">Nội dung:</span> {notif.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{notif.createdAt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notif.notificationId)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                ))}
                {notifications?.length === 0 && (
                  <p className="text-center text-gray-500 italic mt-6">Chưa gửi thông báo nào.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / DIALOG TẠO THÔNG BÁO */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[550px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 relative">
            <button 
              onClick={handleCloseDialog}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-center text-xl font-bold mb-6 text-gray-800">Tạo thông báo mới</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Target Role */}
              <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                <span className="mb-1">Đối tượng nhận thông báo:</span>
                <div className="flex items-center gap-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {['Giáo viên', 'Học viên', 'Tất cả'].map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#8b2c8b] transition-colors"
                    >
                      <input
                        type="radio"
                        value={role}
                        {...register('targetRole')}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      {role}
                    </label>
                  ))}
                </div>
                {errors.targetRole && (
                  <span className="text-red-500 text-xs">{errors.targetRole.message}</span>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tiêu đề:</label>
                <input
                  type="text"
                  placeholder="Nhập vào tiêu đề ..."
                  {...register('title')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 bg-gray-50/50 text-sm ${
                    errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-400'
                  }`}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">{errors.title.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Mô tả chi tiết:</label>
                <textarea
                  rows={4}
                  placeholder="Nhập nội dung thông báo ..."
                  {...register('description')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 bg-gray-50/50 text-sm resize-none ${
                    errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-400'
                  }`}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">{errors.description.message}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#8b2c8b] hover:bg-[#702170] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}