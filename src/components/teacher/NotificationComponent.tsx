import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { da } from 'zod/v4/locales';
import { TeacherService } from '@/services/TeacherService';

const notificationSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự." })
    .max(100, { message: "Tiêu đề không được vượt quá 100 ký tự." }),
  content: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự." }),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function NotificationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {teacher,notifications,setNotifications} = useTeacherStore()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  


  const handleDelete = async(id: string) => {
    try {
      await TeacherService.deleteNotification(id)
      const {notifications} = await TeacherService.getNotifications(teacher?.userId as string)
      setNotifications(notifications)
    } catch (error) {
      console.error(error)
    }
  };

  const onSubmit = async (data: NotificationFormData) => {
    const {title, content} = data
    try {
      await TeacherService.postNotification(teacher?.userId as string, title,content)
      const {notifications} = await TeacherService.getNotifications(teacher?.userId as string)
      setNotifications(notifications)
    } catch (error) {
      console.error(error)
    }finally{
      setIsDialogOpen(false);
      reset(); 

    }

  };

  // Hàm xử lý đóng Dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    reset();
  };


  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return `${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  return (
    <div className="p-8 w-full text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Thông báo !</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-purple-800 hover:bg-purple-900 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Tạo thông báo
        </button>
      </div>

      {/* Main Content Wrapper (Pinkish background) */}
      <div className="bg-pink-100 rounded-2xl p-6 shadow-sm">
        
        {/* Received Notifications */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Các thông báo đã nhận:</h2>
          <div className="space-y-4">
            {notifications?.filter(n => n.receiverId === teacher?.userId as string)?.map((notif) => (
              <div key={notif.notificationId} className="bg-white rounded-xl p-5 flex justify-between items-start shadow-sm">
                <div>
                  
                  <p className="font-semibold mb-1">Tiêu đề: <span className="font-normal">{notif.title}</span></p>
                  <p className="font-semibold mb-1">Nội dung: <span className="font-normal">{notif.content}</span></p>
                  <p className="font-semibold mt-2 text-sm">Ngày tạo: <span className="font-normal">{formatDate(notif.createdAt)}</span></p>
                </div>
                <button 
                  onClick={() => handleDelete(notif.notificationId)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg ml-4 transition-colors"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="text-right mt-2">
            <button className="text-purple-800 font-medium hover:underline text-sm">Xem tất cả</button>
          </div>
        </div>

        {/* Sent Notifications */}
        <div>
          <h2 className="text-xl font-bold mb-4">Các thông báo đã gửi:</h2>
          <div className="space-y-4">
            {notifications?.filter(n => n.senderId === teacher?.userId as string)?.map((notif) => (
              <div key={notif.notificationId} className="bg-white rounded-xl p-5 flex justify-between items-start shadow-sm">
                <div>
                  
                  <p className="font-semibold mb-1">Tiêu đề: <span className="font-normal">{notif.title}</span></p>
                  <p className="font-semibold mb-1">Nội dung: <span className="font-normal">{notif.content}</span></p>
                  <p className="font-semibold mt-2 text-sm">Ngày tạo: <span className="font-normal">{formatDate(notif.createdAt)}</span></p>
                </div>
                <button 
                  onClick={() => handleDelete(notif.notificationId)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg ml-4 transition-colors"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="text-right mt-2">
            <button className="text-purple-800 font-medium hover:underline text-sm">Xem tất cả</button>
          </div>
        </div>

      </div>

      {/* Create Notification Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50  bg-opacity-30">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl border-2 border-purple-800 shadow-xl relative">
            
            {/* Close icon for better UX */}
            <button 
              onClick={handleCloseDialog}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Tạo thông báo</h2>
            
            {/* Sử dụng handleSubmit của react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Căn chỉnh lại để phù hợp schema (chọn role người nhận) */}
              

              <div className="mb-6 flex flex-col">
                <label className="font-semibold text-lg mb-2">Tiêu đề:</label>
                <input 
                  type="text" 
                  placeholder="Nhập vào tiêu đề ..." 
                  {...register('title')}
                  className={`w-full border bg-gray-50 rounded-lg p-4 outline-none focus:ring-1 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div className="mb-8 flex flex-col">
                <label className="font-semibold text-lg mb-2">Mô tả:</label>
                <textarea 
                  placeholder="Nhập vào mô tả ..." 
                  rows={4}
                  {...register('content')}
                  className={`w-full border bg-gray-50 rounded-lg p-4 outline-none focus:ring-1 resize-none ${
                    errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                ></textarea>
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
              </div>

              <div className="flex justify-center">
                <button 
                  type="submit"
                  className="bg-purple-800 hover:bg-purple-900 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors"
                  
                >
                  Tạo thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}