import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SigninSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SigninFormValues = z.infer<typeof SigninSchema>;

export default function SigninPageAdmin({
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

  const onSubmit = (data: SigninFormValues) => {
    console.log(data);
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
        <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-semibold text-center mb-10 text-[#851385] leading-tight">
          Đăng nhập quản trị
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          {/* USERNAME */}
          <div className="flex flex-col gap-2">
            <Label className="text-base font-medium text-black/70">
              Tên đăng nhập
            </Label>
            <Input
              className="h-[56px] text-base rounded-xl bg-white shadow px-4"
              placeholder="Nhập tài khoản admin"
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
            <Label className="text-base font-medium text-black/70">
              Mật khẩu
            </Label>
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
            className="h-[56px] text-base font-semibold rounded-2xl !bg-[#851385] text-white hover:opacity-90"
            disabled={isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>

      </div>
    </div>
  );
}