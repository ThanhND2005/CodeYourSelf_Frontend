import React, { useState } from "react";
import { cn } from "@/lib/utils";
import DashBoard from "@/components/admin/Dashboard";
import {
  Home,
  Bell,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
} from "lucide-react";

const NotificationTab = () => <div>Trang Thông báo</div>;
const UsersTab = () => <div>Quản lý người dùng</div>;
const CoursesTab = () => <div>Quản lý khóa học</div>;
const RevenueTab = () => <div>Trang Doanh số</div>;

export default function HomePageAdmin() {
  const [tabActive, setTabActive] = useState("dashboard");

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
            onClick={() => setTabActive("dashboard")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "dashboard" && "text-[#851385]"
            )}
          >
            <Home size={22} />
            <span className="text-xs">Trang chủ</span>
          </div>

          <div
            onClick={() => setTabActive("notification")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "notification" && "text-[#851385]"
            )}
          >
            <Bell size={22} />
            <span className="text-xs">Thông báo</span>
          </div>

          <div
            onClick={() => setTabActive("users")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "users" && "text-[#851385]"
            )}
          >
            <Users size={22} />
            <span className="text-xs">Người dùng</span>
          </div>

          <div
            onClick={() => setTabActive("courses")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "courses" && "text-[#851385]"
            )}
          >
            <BookOpen size={22} />
            <span className="text-xs">Khóa học</span>
          </div>

          <div
            onClick={() => setTabActive("revenue")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "revenue" && "text-[#851385]"
            )}
          >
            <BarChart3 size={22} />
            <span className="text-xs">Doanh số</span>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto flex flex-col items-center gap-1 text-gray-700 hover:text-[#851385] cursor-pointer">
          <LogOut size={22} />
          <span className="text-xs">Đăng xuất</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-[80px] pl-[90px]">
        <div className="p-6 overflow-y-auto min-h-[calc(100vh-80px)]">

          {tabActive === "dashboard" && <DashBoard />}
          {tabActive === "notification" && <NotificationTab />}
          {tabActive === "users" && <UsersTab />}
          {tabActive === "courses" && <CoursesTab />}
          {tabActive === "revenue" && <RevenueTab />}

        </div>
      </div>
    </div>
  );
}