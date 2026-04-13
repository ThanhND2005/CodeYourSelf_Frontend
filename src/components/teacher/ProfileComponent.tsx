import React, { useState } from 'react';

// 1. Khai báo interface dựa theo đúng các trường trong bảng Teacher
export interface Teacher {
  userId: string;
  name: string;
  dob: string; // date
  address: string;
  phone: string;
  gender: string;
  deleted: number;
  createdAt: string; // datetime
  bankName: string;
  bankAccount: string;
  avatarUrl: string;
}

// 2. Mock data mẫu
const mockTeacherData: Teacher = {
  userId: 'uuid-1234-5678',
  name: 'Nguyễn Thị Nguyệt',
  dob: '1990-09-29',
  address: 'Ứng Thiên',
  phone: '0987654321',
  gender: 'Nữ',
  deleted: 0,
  createdAt: '2026-01-01T08:00:00Z',
  bankName: 'Vietcombank',
  bankAccount: '1029384756',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
};

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState<Teacher>(mockTeacherData);

  // States quản lý trạng thái mở/đóng của Dialog
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // States lưu trữ dữ liệu đang được chỉnh sửa trong form
  const [editFormData, setEditFormData] = useState<Teacher>(teacher);
  const [newAvatarUrl, setNewAvatarUrl] = useState(teacher.avatarUrl);

  // Hàm format ngày tháng (YYYY-MM-DD to DD-MM-YYYY)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handlers cho form thông tin
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveInfo = () => {
    setTeacher(editFormData);
    setIsInfoDialogOpen(false);
  };

  // Handlers cho form ảnh đại diện
  const handleSaveAvatar = () => {
    setTeacher({ ...teacher, avatarUrl: newAvatarUrl });
    setIsAvatarDialogOpen(false);
  };

  return (
    <div className="w-full  mx-auto p-4 md:p-8 font-sans">
      {/* Tiêu đề & Nút sửa */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
        <button
          onClick={() => {
            setEditFormData(teacher);
            setIsInfoDialogOpen(true);
          }}
          className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Sửa hồ sơ
        </button>
      </div>

      {/* Thẻ hiển thị thông tin */}
      <div className="bg-pink-100 rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        {/* Phần Avatar */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <img
              src={teacher.avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              onClick={() => {
                setNewAvatarUrl(teacher.avatarUrl);
                setIsAvatarDialogOpen(true);
              }}
              className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium"
            >
              Đổi ảnh
            </button>
          </div>
        </div>

        {/* Phần Thông tin chi tiết */}
        <div className="flex-1 flex flex-col space-y-2 text-gray-800 text-lg">
          <p><span className="font-semibold">Họ và tên:</span> {teacher.name}</p>
          <p><span className="font-semibold">Ngày sinh:</span> {formatDate(teacher.dob)}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {teacher.address}</p>
          <p><span className="font-semibold">Số điện thoại:</span> {teacher.phone}</p>
          <p><span className="font-semibold">Giới tính:</span> {teacher.gender}</p>
          <p><span className="font-semibold">Ngân hàng:</span> {teacher.bankName}</p>
          <p><span className="font-semibold">Số tài khoản:</span> {teacher.bankAccount}</p>
          <p><span className="font-semibold">Ngày tham gia:</span> {formatDate(teacher.createdAt)}</p>
        </div>
      </div>

      {/* ======================= DIALOG: CẬP NHẬT THÔNG TIN ======================= */}
      {isInfoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật thông tin cá nhân</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text" name="name" value={editFormData.name} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                  type="date" name="dob" value={editFormData.dob} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                <select
                  name="gender" value={editFormData.gender} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text" name="address" value={editFormData.address} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="tel" name="phone" value={editFormData.phone} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Ngân Hàng</label>
                <input
                  type="text" name="bankName" value={editFormData.bankName} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Số tài khoản</label>
                <input
                  type="text" name="bankAccount" value={editFormData.bankAccount} onChange={handleInfoChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsInfoDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= DIALOG: CẬP NHẬT ẢNH ======================= */}
      {isAvatarDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật ảnh đại diện</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Ảnh (Link)</label>
              <input
                type="text"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="Nhập đường dẫn ảnh mới..."
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
              />
              {/* Preview ảnh nhỏ nếu link hợp lệ */}
              {newAvatarUrl && (
                <div className="mt-4 flex justify-center">
                  <img src={newAvatarUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAvatarDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAvatar}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium"
              >
                Cập nhật ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;