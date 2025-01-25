//client\src\guards\AccountantGuard.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner/LoadingSpinner";

const AccountantGuard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Verifying access, please wait..." />;
    }

    if (user && (user.role === "accountant" || user.role === "admin" || user.role === "manager")) {
        return <Outlet />;
    } else if (user && user.role !== "accountant") {
        return <Navigate to="/login" replace={true} />;
    }

    if (!user || user === null) {
        return <Navigate to="/login" replace={true} />;
    }

    return null;
};

export default AccountantGuard;
