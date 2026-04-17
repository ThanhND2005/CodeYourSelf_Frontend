import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X, User } from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';
import type { Teacher } from '@/types/admin';
import { AdminServices } from '@/services/AdminService';



// --- ZOD SCHEMA ---
const teacherSchema = z.object({
  name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  dob: z.string().date(),
  address: z.string().min(5, 'Địa chỉ chi tiết hơn'),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  gender: z.string().min(1, 'Vui lòng chọn giới tính'),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export default function UserManageMain() {
  const {teachers,students,setTeachers,setStudents} = useAdminStore()
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // --- ACTIONS ---
  const handleDeleteTeacher = async (id: string) => {
    try {
      await AdminServices.deleteTeacher(id)
      const {teachers : teachers1} = await AdminServices.getTeachers()
      setTeachers(teachers1)
    } catch (error) {
      console.error(error)
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await AdminServices.deleteStudent(id)
      const {students : students1} = await AdminServices.getStudents()
      setStudents(students1)
    } catch (error) {
      console.error(error)
    }
  };

  const onSubmitTeacher = async (data: TeacherFormValues) => {
    const {name, dob, address,phone,gender} = data
    const teacherId = editingTeacher?.userId as string 
    try {
      await AdminServices.patchTeacher(teacherId,name, new Date(dob),address,phone,gender)
      const {teachers : teachers1} = await AdminServices.getTeachers()
      setTeachers(teachers1)
    } catch (error) {
      console.error(error)
    }finally{
      setEditingTeacher(null)
    }
  };

  // --- FORM HOOKS ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
  });

  // Reset form khi chọn giáo viên mới để sửa
  useEffect(() => {
    if (editingTeacher) {
      reset({
        name: editingTeacher.name,
        dob: (new Date(editingTeacher.dob)).toISOString().split('T')[0], // Chuyển Date sang YYYY-MM-DD
        address: editingTeacher.address,
        phone: editingTeacher.phone,
        gender: editingTeacher.gender,
      });
    }
  }, [editingTeacher, reset]);

  // Format date hiển thị UI
  const formatDateUI = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
        
        {/* Cột Giáo viên */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Giáo viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 h-[450px] flex flex-col">
            {/* Vùng scroll danh sách (max-h giới hạn khoảng 2 thẻ) */}
            <div className="flex-1 space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {teachers?.map((teacher) => (
                <div key={teacher.userId} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    {/* Placeholder Avatar vì Teacher interface không còn avatarUrl */}
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow">
                      <User className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTeacher(teacher)}
                        className="bg-[#2fd159] hover:bg-green-500 text-white p-2 rounded-md transition-colors"
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(teacher.userId)}
                        className="bg-[#d93030] hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1.5 font-medium">
                    <p><span className="text-gray-500">Họ và tên:</span> {teacher.name}</p>
                    <p><span className="text-gray-500">Ngày sinh:</span> {formatDateUI(teacher.dob)}</p>
                    <p><span className="text-gray-500">Địa chỉ:</span> {teacher.address}</p>
                    <p><span className="text-gray-500">SĐT:</span> {teacher.phone}</p>
                    <p><span className="text-gray-500">Giới tính:</span> {teacher.gender}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột Học viên */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Học viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 h-[450px] flex flex-col">
            <div className="flex-1 space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {students?.map((student) => (
                <div key={student.userId} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-300 overflow-hidden border-2 border-white shadow">
                      <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeleteStudent(student.userId)}
                        className="bg-[#d93030] hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1.5 font-medium">
                    <p><span className="text-gray-500">Họ và tên:</span> {student.name}</p>
                    <p><span className="text-gray-500">Ngày sinh:</span> {formatDateUI(student.dob)}</p>
                    <p><span className="text-gray-500">Địa chỉ:</span> {student.address}</p>
                    <p><span className="text-gray-500">Giới tính:</span> {student.gender}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- DIALOG CẬP NHẬT GIÁO VIÊN --- */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Cập nhật thông tin Giáo viên</h3>
              <button 
                onClick={() => setEditingTeacher(null)} 
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitTeacher)}>
              <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input 
                    {...register('name')} 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input 
                    {...register('dob')} 
                    type="date" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input 
                    {...register('address')} 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    {...register('phone')} 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select 
                    {...register('gender')} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>

              </div>

              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}