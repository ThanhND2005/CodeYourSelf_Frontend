import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Teacher, Student } from '@/types/admin';
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

// --- PAGINATION SIZES ---
const PAGE_SIZES = [10, 20, 50];

// --- REUSABLE PAGINATION CONTROLS ---
interface PaginationControlsProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  loading: boolean;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}

function PaginationControls({
  page,
  totalPages,
  limit,
  total,
  loading,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-pink-100 gap-2 flex-wrap">
      {/* Hiển thị số / chọn limit */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span>Hiển thị:</span>
        {PAGE_SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onLimitChange(s)}
            className={`px-2 py-0.5 rounded-md border font-medium transition-all ${
              limit === s
                ? 'bg-[#851385] text-white border-[#851385]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#851385] hover:text-[#851385]'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-1">/ {total} người</span>
      </div>

      {/* Nút prev/next */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span>
          Trang {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="p-1 rounded-md border border-gray-300 hover:border-[#851385] hover:text-[#851385] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="p-1 rounded-md border border-gray-300 hover:border-[#851385] hover:text-[#851385] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function UserManageMain() {
  // ---- Teacher state ----
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherLimit, setTeacherLimit] = useState(10);
  const [teacherTotal, setTeacherTotal] = useState(0);
  const [teacherLoading, setTeacherLoading] = useState(false);

  // ---- Student state ----
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPage, setStudentPage] = useState(1);
  const [studentLimit, setStudentLimit] = useState(10);
  const [studentTotal, setStudentTotal] = useState(0);
  const [studentLoading, setStudentLoading] = useState(false);

  // ---- Edit teacher ----
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // ---- Derived ----
  const teacherTotalPages = Math.max(1, Math.ceil(teacherTotal / teacherLimit));
  const studentTotalPages = Math.max(1, Math.ceil(studentTotal / studentLimit));

  // ---- Fetch teachers ----
  const fetchTeachers = useCallback(async (page: number, limit: number) => {
    setTeacherLoading(true);
    try {
      const data = await AdminServices.getTeachersPaginated(page, limit);
      // Hỗ trợ cả backend trả về { teachers, total } lẫn chưa có phân trang (trả về mảng)
      if (Array.isArray(data)) {
        setTeachers(data);
        setTeacherTotal(data.length);
      } else {
        setTeachers(data.teachers ?? []);
        setTeacherTotal(data.total ?? (data.teachers?.length ?? 0));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTeacherLoading(false);
    }
  }, []);

  // ---- Fetch students ----
  const fetchStudents = useCallback(async (page: number, limit: number) => {
    setStudentLoading(true);
    try {
      const data = await AdminServices.getStudentsPaginated(page, limit);
      if (Array.isArray(data)) {
        setStudents(data);
        setStudentTotal(data.length);
      } else {
        setStudents(data.students ?? []);
        setStudentTotal(data.total ?? (data.students?.length ?? 0));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStudentLoading(false);
    }
  }, []);

  // Load lần đầu
  useEffect(() => {
    fetchTeachers(teacherPage, teacherLimit);
  }, [teacherPage, teacherLimit, fetchTeachers]);

  useEffect(() => {
    fetchStudents(studentPage, studentLimit);
  }, [studentPage, studentLimit, fetchStudents]);

  // ---- Actions ----
  const handleDeleteTeacher = async (id: string) => {
    try {
      await AdminServices.deleteTeacher(id);
      fetchTeachers(teacherPage, teacherLimit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await AdminServices.deleteStudent(id);
      fetchStudents(studentPage, studentLimit);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitTeacher = async (data: TeacherFormValues) => {
    const { name, dob, address, phone, gender } = data;
    const teacherId = editingTeacher?.userId as string;
    try {
      await AdminServices.patchTeacher(teacherId, name, new Date(dob), address, phone, gender);
      fetchTeachers(teacherPage, teacherLimit);
    } catch (error) {
      console.error(error);
    } finally {
      setEditingTeacher(null);
    }
  };

  // ---- Teacher limit change: reset về trang 1 ----
  const handleTeacherLimitChange = (l: number) => {
    setTeacherLimit(l);
    setTeacherPage(1);
  };

  const handleStudentLimitChange = (l: number) => {
    setStudentLimit(l);
    setStudentPage(1);
  };

  // ---- Form ----
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    if (editingTeacher) {
      reset({
        name: editingTeacher.name,
        dob: new Date(editingTeacher.dob).toISOString().split('T')[0],
        address: editingTeacher.address,
        phone: editingTeacher.phone,
        gender: editingTeacher.gender,
      });
    }
  }, [editingTeacher, reset]);

  const formatDateUI = (date: Date) => new Date(date).toLocaleDateString('vi-VN');

  return (
    <div className="w-full min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">

        {/* ===== Cột Giáo viên ===== */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Giáo viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 flex flex-col">

            {/* Danh sách */}
            <div className="space-y-4 min-h-[120px] max-h-[480px] overflow-y-auto pr-1 custom-scrollbar relative">
              {teacherLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#fceaf4]/70 rounded-xl z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#851385]" />
                </div>
              )}
              {!teacherLoading && teachers.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">Không có giáo viên nào.</p>
              )}
              {teachers.map((teacher) => (
                <div key={teacher.userId} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
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

            {/* Pagination */}
            <PaginationControls
              page={teacherPage}
              totalPages={teacherTotalPages}
              limit={teacherLimit}
              total={teacherTotal}
              loading={teacherLoading}
              onPageChange={setTeacherPage}
              onLimitChange={handleTeacherLimitChange}
            />
          </div>
        </div>

        {/* ===== Cột Học viên ===== */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Học viên</h2>
          <div className="bg-[#fceaf4] rounded-2xl p-6 shadow-sm border border-pink-100 flex flex-col">

            {/* Danh sách */}
            <div className="space-y-4 min-h-[120px] max-h-[480px] overflow-y-auto pr-1 custom-scrollbar relative">
              {studentLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#fceaf4]/70 rounded-xl z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#851385]" />
                </div>
              )}
              {!studentLoading && students.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">Không có học viên nào.</p>
              )}
              {students.map((student) => (
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

            {/* Pagination */}
            <PaginationControls
              page={studentPage}
              totalPages={studentTotalPages}
              limit={studentLimit}
              total={studentTotal}
              loading={studentLoading}
              onPageChange={setStudentPage}
              onLimitChange={handleStudentLimitChange}
            />
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