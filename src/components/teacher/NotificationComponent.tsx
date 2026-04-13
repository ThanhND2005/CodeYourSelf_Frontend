import React, { useState } from 'react';

// --- Types dựa trên Database Schema ---
interface Notification {
  notificationId: string;
  title: string;
  content: string; // Tương ứng với 'Mô tả' trong UI
  createdAt: string; // datetime
  deleted: number;
}

interface NotificationManagement {
  notificationId: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  deleted: number;
}

// Type kết hợp để hiển thị UI
interface JoinedNotification extends Notification, Omit<NotificationManagement, 'deleted'> {}

// --- Mock Data ---
const CURRENT_USER_ID = 'user-thi-nguyet-01'; // Mock user hiện tại
const CURRENT_USER_ROLE = 'Giáo viên';

const mockNotifications: JoinedNotification[] = [
  {
    notificationId: 'notif-01',
    title: 'Lịch trả thu nhập',
    content: 'Hiện tại thông tin thu nhập, các giáo viên vào kiểm tra và nếu có thắc mắc vui lòng ý kiến lại trong hôm nay.',
    createdAt: '2026-02-25T10:00:00Z',
    deleted: 0,
    senderId: 'admin-01',
    senderRole: 'Quản trị viên',
    receiverId: CURRENT_USER_ID,
    receiverRole: 'Giáo viên',
  },
  {
    notificationId: 'notif-02',
    title: 'Ưu đãi hè',
    content: 'Các khóa học ngôn ngữ lập trình cơ bản được giảm giá 15%. Đăng ký ngay, thời gian ưu đãi chỉ trong 2 tuần từ ngày 25/02/2026 đến 11/03/2026',
    createdAt: '2026-02-24T08:30:00Z',
    deleted: 0,
    senderId: CURRENT_USER_ID,
    senderRole: 'Giáo viên',
    receiverId: 'all-students',
    receiverRole: 'Học viên',
  }
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<JoinedNotification[]>(mockNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    receiverRole: 'Học viên',
    title: '',
    content: ''
  });

  // Lọc thông báo nhận và gửi
  const receivedNotifs = notifications.filter(n => n.receiverId === CURRENT_USER_ID || n.receiverRole === CURRENT_USER_ROLE);
  const sentNotifs = notifications.filter(n => n.senderId === CURRENT_USER_ID);

  const handleDelete = (id: string) => {
    // Trong thực tế sẽ gọi API set deleted = 1
    setNotifications(notifications.filter(n => n.notificationId !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tạo record mới (Mock)
    const newNotif: JoinedNotification = {
      notificationId: `notif-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
      deleted: 0,
      senderId: CURRENT_USER_ID,
      senderRole: CURRENT_USER_ROLE,
      receiverId: 'group-id', // Tùy logic nghiệp vụ
      receiverRole: formData.receiverRole,
    };

    setNotifications([newNotif, ...notifications]);
    setIsDialogOpen(false);
    setFormData({ receiverRole: 'Học viên', title: '', content: '' }); // reset form
  };

  // Helper format ngày tháng
  const formatDate = (dateString: string) => {
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
            {receivedNotifs.map((notif) => (
              <div key={notif.notificationId} className="bg-white rounded-xl p-5 flex justify-between items-start shadow-sm">
                <div>
                  <p className="font-semibold mb-1">Người nhận: <span className="font-normal">{notif.receiverRole}</span></p>
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
            {sentNotifs.map((notif) => (
              <div key={notif.notificationId} className="bg-white rounded-xl p-5 flex justify-between items-start shadow-sm">
                <div>
                  <p className="font-semibold mb-1">Người nhận: <span className="font-normal">{notif.receiverRole}</span></p>
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
        <div className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl border-2 border-purple-800 shadow-xl relative">
            
            {/* Close icon for better UX */}
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Tạo thông báo</h2>
            
            <form onSubmit={handleCreate}>
              {/* Căn chỉnh lại để phù hợp schema (chọn role người nhận) */}
              <div className="flex items-center mb-6">
                <label className="font-semibold text-lg w-32 shrink-0">Người nhận:</label>
                <select 
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={formData.receiverRole}
                  onChange={(e) => setFormData({...formData, receiverRole: e.target.value})}
                >
                  <option value="Học viên">Học viên</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Tất cả">Tất cả</option>
                </select>
              </div>

              <div className="mb-6 flex flex-col">
                <label className="font-semibold text-lg mb-2">Tiêu đề:</label>
                <input 
                  type="text" 
                  placeholder="Nhập vào tiêu đề ..." 
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="mb-8 flex flex-col">
                <label className="font-semibold text-lg mb-2">Mô tả:</label>
                <textarea 
                  placeholder="Nhập vào mô tả ..." 
                  required
                  rows={4}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
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