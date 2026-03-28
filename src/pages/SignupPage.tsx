import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const SignupSchema = z.object({
  fullname: z.string().min(1, "Không được để trống"),
  address: z.string().min(1, "Không được để trống"),
  dob: z.string().min(1, "Không được để trống"),
  username: z.string().min(1, "Không được để trống"),
  password: z.string().min(1, "Không được để trống"),
});

type SignupFormValues = z.infer<typeof SignupSchema>;


export default function SignupPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center",
        className
      )}
      style={{
        background: "linear-gradient(90deg,#F8F2F9,#CBABCF)",
      }}
      {...props}
    >
      {/* CONTAINER */}
      <div className="w-full max-w-[1100px] flex items-start justify-between px-6">

        {/* left */}
        <div className="flex flex-col items-center justify-start w-1/2 pt-12 pr-10 h-full">

          <img
            src="https://res.cloudinary.com/dlzg0btqt/image/upload/f_auto,q_auto/Blue_and_White_Coding_Minimalist_Business_Agency_Logo_1_jmjwft"
            alt="logo"
            className="w-[85px] h-[85px] mb-8 rounded-xl shadow-md"
          />

          <h1 className="text-[160px] font-bold text-[#851385] leading-none mb-8">
            Đăng ký
          </h1>

          <p className="text-[38px] text-center max-w-[300px] leading-relaxed">
            Xin chào, cùng đăng ký tài khoản mới !
          </p>
        </div>

        {/* right */}
        <div className="w-1/2 max-w-[400px]">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >

            {/* Họ tên */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Họ và tên</Label>
              <Input
                className="h-[46px] px-3 rounded-xl bg-white shadow"
                placeholder="Nhập họ và tên"
                {...register("fullname")}
              />
              <div className="h-[14px]">
                {errors.fullname && (
                  <p className="text-red-500 text-xs">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Địa chỉ</Label>
              <Input
                className="h-[46px] px-3 rounded-xl bg-white shadow"
                placeholder="Nhập vào địa chỉ"
                {...register("address")}
              />
              <div className="h-[14px]">
                {errors.address && (
                  <p className="text-red-500 text-xs">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Ngày sinh</Label>
              <Input
                className="h-[46px] px-3 rounded-xl bg-white shadow"
                placeholder="Nhập vào ngày sinh"
                {...register("dob")}
              />
              <div className="h-[14px]">
                {errors.dob && (
                  <p className="text-red-500 text-xs">
                    {errors.dob.message}
                  </p>
                )}
              </div>
            </div>

            {/* Giới tính */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Giới tính</Label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Nam
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Nữ
                </label>
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Tên đăng nhập</Label>
              <Input
                className="h-[46px] px-3 rounded-xl bg-white shadow"
                placeholder="Nhập email của bạn"
                {...register("username")}
              />
              <div className="h-[14px]">
                {errors.username && (
                  <p className="text-red-500 text-xs">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Mật khẩu</Label>
              <Input
                type="password"
                className="h-[46px] px-3 rounded-xl bg-white shadow"
                placeholder="Nhập mật khẩu của bạn"
                {...register("password")}
              />
              <div className="h-[14px]">
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Vai trò</Label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Giáo viên
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Học viên
                </label>
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="h-[48px] mt-2 rounded-xl !bg-[#851385] text-white"
              disabled={isSubmitting}
            >
              Đăng ký
            </Button>

            {/* Login */}
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