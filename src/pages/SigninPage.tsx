import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

// validate
const SigninSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SigninFormValues = z.infer<typeof SigninSchema>;

export default function SigninPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const signin = useAuthStore((state) => state.signin);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = async (data: SigninFormValues) => {
    const { username, password } = data;
    await signin(username, password);
    navigate("/dashboard");
  };

  return (
    <div
      className={cn(
        "w-[1440px] h-[1024px] mx-auto flex items-center justify-center",
        className
      )}
      style={{
        background: "linear-gradient(90deg,#F8F2F9,#CBABCF)",
        fontFamily: "Inter, sans-serif",
      }}
      {...props}
    >
      {/* Container */}
      <div className="flex flex-col items-center w-full max-w-[520px]">

        {/* LOGO */}
        <img
          src="https://res.cloudinary.com/dlzg0btqt/image/upload/f_auto,q_auto/Blue_and_White_Coding_Minimalist_Business_Agency_Logo_1_jmjwft"
          alt="Logo"
          className="w-[80px] h-[80px] object-contain mb-6 shadow-lg rounded-xl"
        />

        {/* TITLE */}
        <h1 className="text-[95px] font-semibold leading-[100px] text-center mb-12 text-[#851385]">
          Đăng nhập vào
          <br />
          Code YourSelf
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          {/* Username */}
          <div className="flex flex-col gap-2">
            <Label className="text-base">Tên đăng nhập</Label>
            <Input
              className="h-[60px] text-lg rounded-2xl bg-white shadow-md px-5"
              placeholder="Nhập email của bạn"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-base">Mật khẩu</Label>
            <Input
              type="password"
              className="h-[60px] text-lg rounded-2xl bg-white shadow-md px-5"
              placeholder="Nhập mật khẩu của bạn"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="h-[60px] text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 shadow-lg"
            disabled={isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>

        {/* REGISTER */}
        <p className="text-center text-base mt-6">
          Bạn chưa có tài khoản?{" "}
          <span className="font-semibold text-[#851385] cursor-pointer">
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}