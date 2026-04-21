import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Bell, User, Map, LogOut, Search } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

// Dữ liệu từ Store thực tế
import { useTabStudentStore } from "@/stores/useTabStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { StudentService } from "@/services/StudentService";

import CourseDetail from "@/components/student/CourseDetail";
import StudyProgress from "@/components/student/StudyProgress";
import CourseSearch from "@/components/student/CourseSearch";
import SingleCourseDetail from "@/components/student/CourseDetailSingle";
import StudentProfile from "@/components/student/Profile"; 
import MarketplaceDashboard from "@/components/student/Home";
import { useStudentInfor } from "@/hooks/useAuth";
import CourseLearning from "@/components/student/CourseLearning";
import DashBoard from "@/components/student/DashBoard";

const NotificationTab = () => <div className="p-4">Trang Thông báo</div>;
const RoadmapTab = () => <div className="p-4">Trang Lộ trình</div>;

export default function HomePageStudent() {
  const { tabActive, setTabActive } = useTabStudentStore();
  const {data : student} = useStudentInfor()
  
  const signout = useAuthStore((state) => state.signout);
  const navigate = useNavigate();
  const { setCourseSearch, setMultipleCourseSearch } = useCourseStore();
  const [keyword, setKeyword] = useState("");

  const logout = async () => {
    try {
      await signout();
      setTabActive("dashboard");
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    try {
      const { courseSearchs, multipleCourseSearchs } = await StudentService.searchCourse(keyword);
      setCourseSearch(courseSearchs);
      setMultipleCourseSearch(multipleCourseSearchs);
      setTabActive("search");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#F8F2F9] to-[#CBABCF]">
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
        <div className="relative flex items-center">
          <button type="button" onClick={() => handleSearch()} className="flex justify-center items-center">
            <Search className="absolute left-3 text-gray-500" size={18} />
          </button>
          <input
            type="text"
            className="pl-8 py-2 rounded-full bg-[#FBD8F8] shadow w-[360px] text-left"
            placeholder="Tìm kiếm khóa học ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="cursor-pointer text-right"
            onClick={() => setTabActive("profile")} 
          >
            <p className="text-gray-800 text-sm font-semibold">
              {student?.name || "Đang tải..."}
            </p>
            <p className="text-xs text-gray-500">Học viên</p>
          </div>

          <div 
            className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer hover:scale-105 transition border-2 border-white"
            onClick={() => setTabActive("profile")}
          >
            <img 
              src={student?.avatarUrl || "https://via.placeholder.com/40"} 
              className="w-full h-full object-cover" 
              alt="avatar"
            />
          </div>
        </div>
      </div>
      {/* SIDEBAR CŨ GIỮ Y HỆT BAN ĐẦU */}
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
            onClick={() => setTabActive("profile")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "profile" && "text-[#851385]"
            )}
          >
            <User size={22} />
            <span className="text-xs">Hồ sơ</span>
          </div>

          <div
            onClick={() => setTabActive("roadmap")}
            className={cn(
              "flex flex-col items-center gap-1 cursor-pointer",
              tabActive === "roadmap" && "text-[#851385]"
            )}
          >
            <Map size={22} />
            <span className="text-xs">Lộ trình</span>
          </div>
        </div>
        <div
          className="mt-auto flex flex-col items-center gap-1 text-gray-700 hover:text-[#851385] cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut size={22} />
          <span className="text-xs">Đăng xuất</span>
        </div>
      </div>
      <div className="pt-[80px] pl-[90px]">
        <div className="p-6 overflow-y-auto min-h-[calc(100vh-80px)]">
          {tabActive === "dashboard" && <MarketplaceDashboard/>}
          {tabActive === "notification" && <NotificationTab />}
          {tabActive === "profile" && <StudentProfile />} 
          {tabActive === "roadmap" && <RoadmapTab />}
          {tabActive === "coursedetail" && <CourseDetail/>}
          {tabActive === "progress" && <StudyProgress/>}
          {tabActive === "search" && <CourseSearch/>}
          {tabActive === "coursedetail2" && <SingleCourseDetail/>}
          {tabActive == "courselearning" && <CourseLearning/>}
        </div>
      </div>
    </div>
  );
}