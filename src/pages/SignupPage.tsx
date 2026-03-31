import React from "react";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
const SignUpFormSchema = z.object({
  name: z.string().min(1, "Không để trống thông tin"),
  address: z.string().min(1, "Không để trống thông tin"),
  dob: z.string().date("Cần nhập đúng định dạng"),
  gender: z.string().min(1, "Không để trống thông tin"),
  username: z.string().min(6, "Tên đăng nhập cần nhiều hơn 6 kí tự"),
  password: z.string().min(6, "Mật khẩu cần nhiều hơn 6 kí tự"),
  role: z.string(),
});
type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
export default function SignupPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
  });
  const {signup} = useAuthStore()
  const navigate = useNavigate()
  const onSubmit = async (data: SignUpFormValues) => {
    const {name, address,dob,gender,username,password, role} = data
    try {
      await signup(name, address, new Date(dob),gender,username,password,role)
      navigate('/signin')
    } catch (error) {
      console.error(error)
    }
  };
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center",
        className,
      )}
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
            tài khoản mới nhé !
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 max-w-[420px] bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-[#851385] mb-4">
            Tạo tài khoản
          </h2>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* NAME */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Họ và tên</Label>
              <Input
                placeholder="Nhập họ và tên"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
                {...register("name")}
              />
              
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Địa chỉ</Label>
              <Input
                placeholder="Nhập địa chỉ"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
                {...register("address")}
              />{errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Ngày sinh</Label>
              <Input
                type="date"
                placeholder="YYYY-MM-DD"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
                {...register("dob")}
              />
              {errors.dob && (
                <p className="text-sm text-destructive">
                  {errors.dob.message}
                </p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <Label htmlFor="gender" className="text-sm block">
                Giới tính
              </Label>
              <Controller name="gender" control={control} defaultValue="Nam" 
                render={({field}) => (

              <RadioGroup onValueChange={field.onChange} value={field.value}  className="w-full" name="gender" >
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Nam" id="nam" />
                    <Label htmlFor="nam">Nam</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Nữ" id="nu" />
                    <Label htmlFor="nu">Nữ</Label>
                  </div>
                </div>
              </RadioGroup>
                )}
              />
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Tên đăng nhập</Label>
              <Input
                placeholder="Nhập username"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Mật khẩu</Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                className="h-[44px] px-3 rounded-xl bg-white border border-gray-200"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <Label htmlFor="role" className="text-sm block">
                Vai trò
              </Label>
              <Controller control={control} defaultValue="student" name="role" 
                render={({field}) =>(

              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="w-full" name="role">
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 ">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Giáo viên</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Học sinh</Label>
                  </div>
                </div>
              </RadioGroup>
                )}
              />
            </div>

            {/* BUTTON */}
            <Button
              className="h-[46px] mt-2 rounded-xl bg-[#851385] text-white hover:opacity-90"
              type="submit"
              disabled={isSubmitting}
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
