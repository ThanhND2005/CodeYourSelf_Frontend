import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Bell,
  User,
  Map,
  LogOut,
  Search,
} from "lucide-react";

import DashBoard from "@/components/student/DashBoard";

const NotificationTab = () => <div>Trang Thông báo</div>;
const ProfileTab = () => <div>Trang Hồ sơ</div>;
const RoadmapTab = () => <div>Trang Lộ trình</div>;

export default function HomePageStudent() {
  const [tabActive, setTabActive] = useState("dashboard");

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-r from-[#F8F2F9] to-[#CBABCF]">

      {/* SIDEBAR */}
      <div className="w-[90px] bg-white/40 backdrop-blur-md flex flex-col items-center py-6 gap-6 shadow-lg">
        <div className="flex flex-col items-center gap-6 mt-6 text-gray-700">

          <div onClick={() => setTabActive("dashboard")}
            className={cn("flex flex-col items-center gap-1 cursor-pointer", tabActive==="dashboard" && "text-[#851385]")}
          >
            <Home size={22}/>
            <span className="text-xs">Trang chủ</span>
          </div>

          <div onClick={() => setTabActive("notification")}
            className={cn("flex flex-col items-center gap-1 cursor-pointer", tabActive==="notification" && "text-[#851385]")}
          >
            <Bell size={22}/>
            <span className="text-xs">Thông báo</span>
          </div>

          <div onClick={() => setTabActive("profile")}
            className={cn("flex flex-col items-center gap-1 cursor-pointer", tabActive==="profile" && "text-[#851385]")}
          >
            <User size={22}/>
            <span className="text-xs">Hồ sơ</span>
          </div>

          <div onClick={() => setTabActive("roadmap")}
            className={cn("flex flex-col items-center gap-1 cursor-pointer", tabActive==="roadmap" && "text-[#851385]")}
          >
            <Map size={22}/>
            <span className="text-xs">Lộ trình</span>
          </div>
        </div>

        <button className="mt-auto flex flex-col items-center gap-1 text-gray-700 hover:text-[#851385]">
          <LogOut size={22}/>
          <span className="text-xs">Đăng xuất</span>
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-300 p-6">
          <h1 className="text-xl font-semibold">Create your future</h1>

          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <span className="absolute left-8 text-gray-500 text-sm">
              Tìm kiếm
            </span>
            <input className="pl-24 pr-4 py-2 rounded-full bg-[#FBD8F8] shadow w-[360px]" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
            <span>Danh Thành</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-6 pb-6">
          {tabActive === "dashboard" && <DashBoard/>}
          {tabActive === "notification" && <NotificationTab />}
          {tabActive === "profile" && <ProfileTab />}
          {tabActive === "roadmap" && <RoadmapTab />}
        </div>

      </div>
    </div>
  );
}