import React from "react";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignupPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-screen w-full flex items-center justify-center", className)}
      style={{
        background: "linear-gradient(90deg,#F8F2F9,#CBABCF)",
      }}
      {...props}
    >
      {/* CONTAINER */}
      <div className="w-full max-w-[1100px] flex items-center justify-between gap-10 px-6">

        {/* LEFT */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 gap-6">
          <img
            src="https://res.cloudinary.com/dlzg0btqt/image/upload/f_auto,q_auto/Blue_and_White_Coding_Minimalist_Business_Agency_Logo_1_jmjwft"
            className="w-[90px] h-[90px] rounded-xl shadow-md"
          />

          <h1 className="text-[110px] font-bold text-[#851385] leading-none">
            Đăng ký
          </h1>

          <p className="text-[32px] text-center leading-snug">
            Xin chào, cùng đăng ký <br />
            tài khoản mới !
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 max-w-[420px] bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-semibold text-[#851385] mb-4">
            Tạo tài khoản
          </h2>

          <form className="flex flex-col gap-4">

            {/* NAME */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Họ và tên</Label>
              <Input
                placeholder="Nhập họ và tên"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
              />
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Địa chỉ</Label>
              <Input
                placeholder="Nhập địa chỉ"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Ngày sinh</Label>
              <Input
                placeholder="YYYY-MM-DD"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
              />
            </div>

            {/* GENDER */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Giới tính</Label>

              <RadioGroup defaultValue="male" className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Nam</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Nữ</Label>
                </div>
              </RadioGroup>
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Tên đăng nhập</Label>
              <Input
                placeholder="Nhập username"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Mật khẩu</Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
              />
            </div>

            {/* ROLE */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Vai trò</Label>

              <RadioGroup defaultValue="student" className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Giáo viên</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Học viên</Label>
                </div>
              </RadioGroup>
            </div>

            {/* BUTTON */}
            <Button
              className="h-[46px] mt-2 rounded-xl !bg-[#851385] text-white hover:opacity-90"
            >
              Đăng ký
            </Button>

            {/* LOGIN */}
            <p className="text-sm text-center mt-2">
              Bạn đã có tài khoản?{" "}
              <span className="text-[#851385] font-semibold cursor-pointer">
                Đăng nhập
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}