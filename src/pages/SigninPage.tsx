import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";


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

    // giả lập redirect
    navigate("/dashboard");
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-4",
        className
      )}
      style={{
        background: "linear-gradient(90deg,#F8F2F9,#CBABCF)",
        fontFamily: "Inter, sans-serif",
      }}
      {...props}
    >
      <div className="w-full max-w-[420px]">
        {/* Title */}
        <h1 className="text-[40px] font-bold text-center mb-10 text-[#851385]">
          Đăng nhập vào
          <br />
          Code YourSelf
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Username */}
          <div className="flex flex-col gap-2">
            <Label>Tên đăng nhập</Label>
            <Input
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
            <Label>Mật khẩu</Label>
            <Input
              type="password"
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
          <Button type="submit" disabled={isSubmitting}>
            Đăng nhập
          </Button>
        </form>

        {/* Register */}
        <p className="text-center text-sm mt-8">
          Bạn chưa có tài khoản?{" "}
          <span className="font-semibold text-[#851385] cursor-pointer">
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}