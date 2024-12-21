//client\src\guards\RouteGuard.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RouteGuard = () => {
  const { user } = useAuth();

  if (user && user?.role === "manager" || user?.role === "admin" || user?.role === "user") {
    return <Outlet />;
  }

  if (!user || user === null) {
    return <Navigate to="/login" replace={true} />;
  }
};

export default RouteGuard;
