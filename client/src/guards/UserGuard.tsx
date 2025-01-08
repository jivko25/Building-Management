//client\src\guards\UserGuard.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const UserGuard = () => {
  const { translate } = useLanguage();
  const [loadingMessage, setLoadingMessage] = useState("Verifying access, please wait...");

  useEffect(() => {
    const loadTranslations = async () => {
      setLoadingMessage(await translate("Verifying access, please wait..."));
    };
    loadTranslations();
  }, [translate]);

  const { user, loading } = useAuth();
  console.log("UserGuard checking authentication:", { user, loading });

  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (user) {
    console.log("User is authenticated, allowing access");
    return <Outlet />;
  }

  console.log("User is not authenticated, redirecting to login");
  return <Navigate to="/login" replace={true} />;
};

export default UserGuard;
