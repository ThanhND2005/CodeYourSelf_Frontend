import React, { useState } from 'react';

// --- INTERFACES (Dựa trên Database Schema) ---
interface Teacher {
  userId: string;
  name: string;
  dob: string; // YYYY-MM-DD
  address: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  createdAt: string;
  bankName: string;
  bankAccount: string;
  avatarUrl: string;
}

interface Student {
  userId: string;
  name: string;
  dob: string;
  address: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  avatarUrl: string;
}

// --- MOCK DATA ---
const mockTeachers: Teacher[] = [
  {
    userId: 't1',
    name: 'Đào Vũ Đạt',
    dob: '2000-03-20',
    address: 'Hà Đông',
    phone: '0987654321',
    gender: 'Nam',
    createdAt: '2025-03-01',
    bankName: 'MB Bank',
    bankAccount: '123456789',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    userId: 't2',
    name: 'Lê Thanh Thủy',
    dob: '2001-05-28',
    address: 'Thanh Xuân',
    phone: '0912345678',
    gender: 'Nữ',
    createdAt: '2025-03-15',
    bankName: 'Techcombank',
    bankAccount: '987654321',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

const mockStudents: Student[] = [
  {
    userId: 's1',
    name: 'Dương Ngọc Linh',
    dob: '2008-08-01',
    address: 'Ứng Hòa',
    phone: '0345678912',
    gender: 'Nữ',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
  },
  {
    userId: 's2',
    name: 'Dương Văn Chiến',
    dob: '2007-11-27',
    address: 'Thanh Hóa',
    phone: '0369874521',
    gender: 'Nam',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
];

export default function UserManageMain() {
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Format date từ YYYY-MM-DD sang DD-MM-YYYY để hiển thị UI
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        
        {/* Cột Giáo viên */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Giáo viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 flex flex-col h-full">
            <div className="flex-1 space-y-6">
              {mockTeachers.map((teacher) => (
                <div key={teacher.userId} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-300 overflow-hidden border-2 border-white shadow">
                      <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setEditingTeacher(teacher)}
                        className="bg-[#2fd159] hover:bg-green-500 text-white font-medium px-6 py-1.5 rounded-md transition-colors text-sm"
                      >
                        Sửa
                      </button>
                      <button className="bg-[#d93030] hover:bg-red-600 text-white font-medium px-6 py-1.5 rounded-md transition-colors text-sm">
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1.5 font-medium">
                    <p>Họ và tên: {teacher.name}</p>
                    <p>Ngày sinh: {formatDate(teacher.dob)}</p>
                    <p>Địa chỉ: {teacher.address}</p>
                    <p>Giới tính: {teacher.gender}</p>
                    <p>Ngày tham gia: {formatDate(teacher.createdAt.split(' ')[0])}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[#a03e87] font-semibold text-center mt-6 hover:underline w-full">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Cột Học viên */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Học viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 flex flex-col h-full">
            <div className="flex-1 space-y-6">
              {mockStudents.map((student) => (
                <div key={student.userId} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-300 overflow-hidden border-2 border-white shadow">
                      <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="bg-[#d93030] hover:bg-red-600 text-white font-medium px-6 py-1.5 rounded-md transition-colors text-sm">
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1.5 font-medium">
                    <p>Họ và tên: {student.name}</p>
                    <p>Ngày sinh: {formatDate(student.dob)}</p>
                    <p>Địa chỉ: {student.address}</p>
                    <p>Giới tính: {student.gender}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[#a03e87] font-semibold text-center mt-6 hover:underline w-full">
              Xem tất cả
            </button>
          </div>
        </div>

      </div>

      {/* --- DIALOG CẬP NHẬT THÔNG TIN GIÁO VIÊN --- */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Cập nhật thông tin Giáo viên</h3>
              <button onClick={() => setEditingTeacher(null)} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-6">
              <form className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input type="text" defaultValue={editingTeacher.name} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh (DOB)</label>
                  <input type="date" defaultValue={editingTeacher.dob} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input type="text" defaultValue={editingTeacher.address} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" defaultValue={editingTeacher.phone} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select defaultValue={editingTeacher.gender} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên Ngân hàng</label>
                  <input type="text" defaultValue={editingTeacher.bankName} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                  <input type="text" defaultValue={editingTeacher.bankAccount} className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <button 
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 font-medium transition"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  alert('Lưu thành công!');
                  setEditingTeacher(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}