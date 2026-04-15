import { getRedirectPath } from "@/lib/navigation";
import { TeacherService } from "@/services/TeacherService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTeacherStore } from "@/stores/useTeacherStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRole: string;
}

const ProtectedRoute = ({ allowedRole }: Props) => {
  // Chỉ lấy những state cần thiết cho việc render UI ở đây
  const { accessToken, user, loading } = useAuthStore();
  const { setTeacher } = useTeacherStore();

  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // LUÔN lấy state mới nhất trực tiếp từ store để tránh bẫy closure
        let currentToken = useAuthStore.getState().accessToken;
        let currentUser = useAuthStore.getState().user;

        // 1. Nếu không có token (khi vừa reload), thử gọi refresh token
        if (!currentToken) {
          await useAuthStore.getState().refresh();
          currentToken = useAuthStore.getState().accessToken; // Cập nhật lại biến cục bộ
        }

        // 2. Nếu đã có token nhưng chưa có dữ liệu user, gọi API lấy thông tin user
        if (currentToken && !currentUser) {
          await useAuthStore.getState().getMe();
          currentUser = useAuthStore.getState().user; // Cập nhật lại biến cục bộ
        }

        // 3. Nếu là teacher, tiến hành gọi API lấy thông tin teacher
        if (currentUser?.role === "teacher" && currentUser?.userId) {
          const response = await TeacherService.getInformation(currentUser.userId as string);
          
          // Đảm bảo response trả về đúng cấu trúc trước khi set
          if (response?.teacher) {
            setTeacher(response.teacher);
          }
        }
      } catch (error) {
        console.error("Khởi tạo session thất bại:", error);
        // Có thể dispatch action logout ở đây nếu refresh token thực sự hết hạn
      } finally {
        // Luôn tắt trạng thái starting dù API thành công hay thất bại
        setStarting(false);
      }
    };

    init();
  }, [setTeacher]); // Chỉ chạy 1 lần khi component mount

  if (loading || starting) {
    return <h1>Loading...</h1>;
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (accessToken && allowedRole !== user?.role) {
    const correctPath = getRedirectPath(user?.role as string);
    return <Navigate to={correctPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;