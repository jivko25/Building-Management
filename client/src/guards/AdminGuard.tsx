import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminGuard = () => {
  const { user } = useAuth();
  console.log("AdminGuard checking user role:", user?.role);

  if (!user || user.role !== "admin") {
    console.log("Access denied: User is not admin");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminGuard;
