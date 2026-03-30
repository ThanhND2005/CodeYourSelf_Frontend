import React, { use } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { getRedirectPath } from "@/lib/navigation";

const SigninSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SigninFormValues = z.infer<typeof SigninSchema>;

export default function SigninPageTeacher({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(SigninSchema),
  });
  const {signinAdmin} = useAuthStore()
  const navigate = useNavigate()
  const onSubmit = async (data: SigninFormValues) => {
    const {username,password} = data
    try {
      await signinAdmin(username, password)
      const user = useAuthStore.getState().user 
      if(user)
      {
        const correctPath = getRedirectPath(user.role as string)
        navigate(correctPath)
      }
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-start justify-center pt-16",
        className
      )}
      style={{
        background: "linear-gradient(90deg,#F8F2F9,#CBABCF)",
      }}
      {...props}
    >
      {/* CONTENT */}
      <div className="flex flex-col items-center w-full max-w-[500px] px-4">

        {/* LOGO */}
        <img
          src="https://res.cloudinary.com/dlzg0btqt/image/upload/f_auto,q_auto/Blue_and_White_Coding_Minimalist_Business_Agency_Logo_1_jmjwft"
          alt="Logo"
          className="w-[80px] h-[80px] mb-6 rounded-xl shadow-md"
        />

        {/* TITLE */}
        <h1 className="text-[56px] md:text-[72px] font-semibold text-center mb-10 text-[#851385] leading-tight">
          Đăng nhập vào
          <br />
          Code YourSelf
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          {/* USERNAME */}
          <div className="flex flex-col gap-2">
            <Label className="text-base font-medium text-black">Tên đăng nhập</Label>
            <Input
              className="h-[56px] text-base rounded-xl bg-white shadow px-4"
              placeholder="Nhập email của bạn"
              {...register("username")}
            />
            <div className="h-[20px]">
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <Label className="text-base font-medium text-black">Mật khẩu</Label>
            <Input
              type="password"
              className="h-[56px] text-base rounded-xl bg-white shadow px-4"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
            <div className="h-[20px]">
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="h-[56px] text-base font-semibold rounded-2xl !bg-[#851385] text-white"
            disabled={isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>

        {/* REGISTER */}
        <p className="mt-6 text-sm text-center">
          Bạn chưa có tài khoản?{" "}
          <span className="text-[#851385] font-semibold cursor-pointer">
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}