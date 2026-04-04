import { getRedirectPath } from "@/lib/navigation";

import { useAuthStore } from "@/stores/useAuthStore";

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
interface Props {
  allowedRole: string;
}
const ProtectedRoute = ({ allowedRole }: Props) => {
  const { accessToken, user, loading, refresh, getMe } = useAuthStore();


  const [starting, setStarting] = useState(true);
  const init = async () => {
    if (!accessToken) {
      await refresh();
      await getMe();
    }
    if (accessToken && !user) {
      await getMe();
    }
    
    setStarting(false);
  };
  useEffect(() => {
    init();
  }, []);
  if (loading || starting) {
    return (
        <>
            <h1>Loading...</h1>
        </>
    );
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