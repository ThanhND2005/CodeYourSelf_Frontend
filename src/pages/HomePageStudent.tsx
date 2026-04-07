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
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const NotificationTab = () => <div>Trang Thông báo</div>;
const ProfileTab = () => <div>Trang Hồ sơ</div>;
const RoadmapTab = () => <div>Trang Lộ trình</div>;

export default function HomePageStudent() {
  const [tabActive, setTabActive] = useState("dashboard");

  const signout = useAuthStore((state) => state.signout);
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

  const fakeUser = {
    name: "Danh Thành",
    avatar: "https://via.placeholder.com/40",
    role: "Học viên",
  };

  const [openAvatar, setOpenAvatar] = useState(false);
  const [preview, setPreview] = useState(fakeUser.avatar);

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

        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-500" size={18} />
          <span className="absolute left-8 text-gray-500 text-sm">
            Tìm kiếm
          </span>
          <input className="pl-24 pr-4 py-2 rounded-full bg-[#FBD8F8] shadow w-[360px]" />
        </div>

        {/* ===== USER SECTION ===== */}
        <div className="flex items-center gap-3">

          {/* ===== DIALOG SỬA THÔNG TIN ===== */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer text-right">
                <p className="text-gray-800 text-sm font-semibold">
                  {fakeUser.name}
                </p>
                <p className="text-xs text-gray-500">{fakeUser.role}</p>
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-[500px] p-6">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold text-center text-[#851385]">
                  Cập nhật thông tin cá nhân
                </h2>

                <div className="space-y-1">
                  <Label className="text-[#851385]">Họ và tên</Label>
                  <Input defaultValue={fakeUser.name} className="rounded-xl" />
                </div>

                <div className="space-y-1">
                  <Label className="text-[#851385]">Ngày sinh</Label>
                  <Input type="date" className="rounded-xl" />
                </div>

                <div className="space-y-1">
                  <Label className="text-[#851385]">Giới tính</Label>
                  <RadioGroup defaultValue="Nam">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="Nam" />
                        <Label>Nam</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="Nữ" />
                        <Label>Nữ</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-[#851385]">Địa chỉ</Label>
                  <Input placeholder="Nhập địa chỉ..." className="rounded-xl" />
                </div>

                <Button
                  className="bg-[#851385] hover:bg-[#6a0f6a] text-white rounded-xl py-2"
                  onClick={() => alert("Chưa xử lý logic")}
                >
                  Cập nhật
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ===== DIALOG AVATAR ===== */}
          <Dialog open={openAvatar} onOpenChange={setOpenAvatar}>
            <DialogTrigger asChild>
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer hover:scale-105 transition">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-[400px] p-6">
              <div className="flex flex-col gap-5">
                <h2 className="text-xl text-[#851385] font-bold text-center">
                  Cập nhật avatar
                </h2>

                <img
                  src={preview}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />

                <Input
                  type="file"
                  className="rounded-xl"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <Button
                  className="bg-[#851385] hover:bg-[#6a0f6a] text-white rounded-xl py-2"
                  onClick={() => {
                    alert("Upload chưa xử lý");
                    setOpenAvatar(false);
                  }}
                >
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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

      {/* CONTENT */}
      <div className="pt-[80px] pl-[90px]">
        <div className="p-6 overflow-y-auto min-h-[calc(100vh-80px)]">
          {tabActive === "dashboard" && <DashBoard />}
          {tabActive === "notification" && <NotificationTab />}
          {tabActive === "profile" && <ProfileTab />}
          {tabActive === "roadmap" && <RoadmapTab />}
        </div>
      </div>
    </div>
  );
}