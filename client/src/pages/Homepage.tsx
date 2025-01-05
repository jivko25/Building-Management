//client\src\pages\Homepage.tsx
import Sidebar from "../components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Homepage = () => {
  const { user } = useAuth();
  console.log("Homepage user status:", user);

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="flex gap-2 pr-2 md:gap-8">
      <Sidebar />
    </div>
  );
};

export default Homepage;
