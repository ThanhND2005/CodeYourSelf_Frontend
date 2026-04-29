import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Bell, Users, BookOpen, BarChart3, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import AdminNotifications from "@/components/admin/Notification";
import UserManageMain from "@/components/admin/User";
import CourseApprovalPage from "@/components/admin/CourseWaiting";
import DoanhSoPage from "@/components/admin/Stat";
import AdminDashboard from "../components/admin/DashBoard";
import { useTabAdminStore } from "@/stores/useTabStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { AdminServices } from "@/services/AdminService";

export default function HomePageAdmin() {
  const { tabActive, setTabActive } = useTabAdminStore();
  const signout = useAuthStore((state) => state.signout);
  const {
    setCourses,
    setPayments,
    setStudents,
    setTeachers,
    setWaitCourses,
    setReceivedNotificatons,
    setNotifications,
    setWaitMultipleCourse,
    setSalary,
  } = useAdminStore();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signout();
      setTabActive("dashboard");
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };
  const onlickDashBoard = async () => {
    const { students } = await AdminServices.getStudents();
    const { teachers } = await AdminServices.getTeachers();
    const { courses } = await AdminServices.getCourses();
    const { studentBills } = await AdminServices.getStudentBills();
    const { waitCourses } = await AdminServices.getWaitCourses();
    const { receivedNotifications } = await AdminServices.ReceiveNotification();
    setWaitCourses(waitCourses);
    setStudents(students);
    setTeachers(teachers);
    setCourses(courses);
    setPayments(studentBills);
    setReceivedNotificatons(receivedNotifications);
    setTabActive("dashboard");
  };
  const onclickNotification = async () => {
    setTabActive("notification");
    const { notifications } = await AdminServices.getNotificaitons();
    const { receivedNotifications } = await AdminServices.ReceiveNotification();
    setReceivedNotificatons(receivedNotifications);
    setNotifications(notifications);
  };
  const onclickWaitCourse = async () => {
    setTabActive("courses");
    const {waitCourses} = await AdminServices.getWaitCourses()
    const {waitMultipleCourses} = await AdminServices.getWaitMultipleCourses()
    console.log(waitCourses)
    console.log(waitMultipleCourses)
    setWaitCourses(waitCourses)
    setWaitMultipleCourse(waitMultipleCourses)
  };
  const onclickRevenue = async () => {
    setTabActive('revenue')
    const {teacherBills} = await AdminServices.getSalary()
    setSalary(teacherBills) 
  }
  const onclickUser = () => {
    setTabActive('users');
    
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#F8F2F9] to-[#CBABCF]">
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full h-[80px] flex items-center justify-between px-6 border-b-2 border-gray-300 bg-white/10 backdrop-blur-md z-50">
        <div className="flex gap-2 items-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden">
            <img
              src="https://res.cloudinary.com/dlzg0btqt/image/upload/f_auto,q_auto/Blue_and_White_Coding_Minimalist_Business_Agency_Logo_1_jmjwft"
              alt="logo"
            />
          </div>
          <h1 className="text-sm font-semibold">Create your future</h1>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
          <span>Admin</span>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="fixed top-[80px] left-0 w-[90px] h-[calc(100vh-80px)] bg-white/10 backdrop-blur-md flex flex-col items-center py-6 gap-6 shadow-lg z-40">
        <div className="flex flex-col items-center gap-6 text-gray-700">
          <div
            onClick={() => onlickDashBoard()}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "dashboard" && "text-[#851385]",
            )}
          >
            <Home size={22} />
            <span className="text-xs">Trang chủ</span>
          </div>

          <div
            onClick={() => onclickNotification()}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "notification" && "text-[#851385]",
            )}
          >
            <Bell size={22} />
            <span className="text-xs">Thông báo</span>
          </div>

          <div
            onClick={() => onclickUser()}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "users" && "text-[#851385]",
            )}
          >
            <Users size={22} />
            <span className="text-xs">Người dùng</span>
          </div>

          <div
            onClick={() => onclickWaitCourse()}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "courses" && "text-[#851385]",
            )}
          >
            <BookOpen size={22} />
            <span className="text-xs">Khóa học</span>
          </div>

          <div
            onClick={() => onclickRevenue()}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "revenue" && "text-[#851385]",
            )}
          >
            <BarChart3 size={22} />
            <span className="text-xs">Doanh số</span>
          </div>
        </div>

        {/* Logout */}
        <div
          className="mt-auto flex flex-col items-center gap-1 text-gray-700 hover:text-[#851385] cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut size={22} />
          <span className="text-xs">Đăng xuất</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-[80px] pl-[90px]">
        <div className="p-6 overflow-y-auto min-h-[calc(100vh-80px)]">
          {tabActive === "dashboard" && <AdminDashboard />}
          {tabActive === "notification" && <AdminNotifications />}
          {tabActive === "users" && <UserManageMain />}
          {tabActive === "courses" && <CourseApprovalPage />}
          {tabActive === "revenue" && <DoanhSoPage />}
        </div>
      </div>
    </div>
  );
}
