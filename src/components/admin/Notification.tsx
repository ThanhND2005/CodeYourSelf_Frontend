import React, { useState } from 'react';

// 1. Interface
export interface Notification {
  notificationId: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  deleted: number;
  title: string;
  content: string;
  createdAt: string;
}

// 2. Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notificationId: 'notif_001',
    senderId: 'admin_123',
    senderRole: 'Admin',
    receiverId: 'group_teacher',
    receiverRole: 'Giáo viên',
    deleted: 0,
    title: 'Lịch trả thu nhập',
    content: 'Hiện tại thông tin thu nhập, các giáo viên vào kiểm tra và nếu có thắc mắc vui lòng ý kiến lại trong hôm nay.',
    createdAt: '25 tháng 2 năm 2026'
  },
  {
    notificationId: 'notif_002',
    senderId: 'admin_123',
    senderRole: 'Admin',
    receiverId: 'group_student',
    receiverRole: 'Học viên',
    deleted: 0,
    title: 'Ưu đãi hè',
    content: 'Các khóa học ngôn ngữ lập trình cơ bản được giảm giá 15%. Đăng ký ngay, thời gian ưu đãi chỉ trong 2 tuần từ ngày 25/02/2026 đến 11/03/2026.',
    createdAt: '24 tháng 2 năm 2026'
  }
];

export default function NotificationPageContent() {
  // --- STATE ---
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    targetTeacher: false,
    targetStudent: false,
    title: '',
    description: ''
  });

  // --- HANDLERS ---
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      console.log(`Calling API to delete notification: ${notificationId}`);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
      alert('Đã xóa thông báo thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.description) {
        alert('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
        return;
      }
      if (!formData.targetTeacher && !formData.targetStudent) {
        alert('Vui lòng chọn ít nhất một đối tượng nhận.');
        return;
      }

      const receiverRole = formData.targetTeacher && formData.targetStudent 
        ? 'Tất cả' 
        : (formData.targetTeacher ? 'Giáo viên' : 'Học viên');

      // Thêm data giả vào UI
      const newNotif: Notification = {
        notificationId: `notif_${Math.random().toString(36).substr(2, 9)}`,
        senderId: 'admin_123', // Lấy từ auth context thực tế
        senderRole: 'Admin',
        receiverId: 'new_group',
        receiverRole: receiverRole,
        deleted: 0,
        title: formData.title,
        content: formData.description,
        createdAt: 'Hôm nay' // Cần format lại khi làm thật
      };

      setNotifications([newNotif, ...notifications]);
      setIsDialogOpen(false);
      setFormData({ targetTeacher: false, targetStudent: false, title: '', description: '' });
      
    } catch (error) {
      console.error('Lỗi khi tạo thông báo:', error);
    }
  };

  // --- JSX TRẢ VỀ (Chỉ Main Content + Dialog) ---
  return (
    <>
      {/* KHU VỰC NỘI DUNG CHÍNH */}
      {/* Xóa max-w-4xl, dùng w-full h-full để tràn viền và đổi màu nền đồng nhất */}
      <div className="w-full h-full p-8 overflow-y-auto ">
        <div className="w-full flex flex-col h-full">
          
          {/* Tiêu đề & Nút Tạo */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thông báo !</h2>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#8b2c8b] hover:bg-[#702170] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md whitespace-nowrap"
            >
              Tạo thông báo
            </button>
          </div>

          {/* Danh sách thông báo */}
          <div className="bg-[#fadcf5] rounded-2xl p-8 shadow-sm border border-pink-100 flex-1">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Các thông báo đã gửi:</h3>
            
            <div className="space-y-6">
              {notifications.map((notif) => (
                <div key={notif.notificationId} className="bg-white rounded-xl p-6 flex justify-between items-center shadow-sm gap-4">
                  <div className="space-y-1.5 text-sm text-gray-700 flex-1">
                    <p><span className="font-bold">Người nhận:</span> {notif.receiverRole}</p>
                    <p><span className="font-bold">Tiêu đề:</span> {notif.title}</p>
                    <p><span className="font-bold">Nội dung:</span> {notif.content}</p>
                    <p><span className="font-bold">Ngày tạo:</span> {notif.createdAt}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteNotification(notif.notificationId)}
                    className="bg-[#e74c3c] hover:bg-red-600 text-white px-8 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap h-fit"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <p className="text-center text-gray-500 italic mt-10">Chưa có thông báo nào.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL / DIALOG TẠO THÔNG BÁO (Giữ nguyên như cũ) */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[550px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-center text-xl font-bold mb-6 text-gray-800">Tạo thông báo</h2>
            
            <form onSubmit={handleCreateNotification} className="space-y-5">
              {/* Checkbox */}
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                <span className="w-24">Người nhận:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    checked={formData.targetTeacher}
                    onChange={(e) => setFormData({...formData, targetTeacher: e.target.checked})}
                  />
                  Giáo viên
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    checked={formData.targetStudent}
                    onChange={(e) => setFormData({...formData, targetStudent: e.target.checked})}
                  />
                  Học viên
                </label>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tiêu đề:</label>
                <input 
                  type="text" 
                  placeholder="Nhập vào tiêu đề ..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-gray-50/50 text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Mô tả:</label>
                <textarea 
                  rows={3}
                  placeholder="Nhập vào mô tả ..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-gray-50/50 text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="bg-[#8b2c8b] hover:bg-[#702170] text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-md"
                >
                  Tạo thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}