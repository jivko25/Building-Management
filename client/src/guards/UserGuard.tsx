//client\src\guards\UserGuard.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner/LoadingSpinner";

const UserGuard = () => {
  const { user, loading } = useAuth();
  console.log("UserGuard checking authentication:", { user, loading });

  if (loading) {
    return <LoadingSpinner message="Verifying access, please wait..." />;
  }

  if (user) {
    console.log("User is authenticated, allowing access");
    return <Outlet />;
  }

  console.log("User is not authenticated, redirecting to login");
  return <Navigate to="/login" replace={true} />;
};

export default UserGuard;
