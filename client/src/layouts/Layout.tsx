import { Outlet } from "react-router-dom";

export const Layout = () => {
  console.log("Rendering Layout component");
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};
