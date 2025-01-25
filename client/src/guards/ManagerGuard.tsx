//client\src\guards\ManagerGuard.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner/LoadingSpinner";

const ManagerGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying access, please wait..." />;
  }

  if (user && (user.role === "manager" || user.role === "admin" )) {
    return <Outlet />;
  } else if (user && user.role !== "manager") {
    return <Navigate to="/login" replace={true} />;
  }

  if (!user || user === null) {
    return <Navigate to="/login" replace={true} />;
  }

  return null;
};

export default ManagerGuard;
