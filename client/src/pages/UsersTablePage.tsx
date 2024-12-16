//client\src\pages\UsersTablePage.tsx
import UsersTableBody from "@/components/tables/UsersTable/UsersTableBody";
import Sidebar from "../components/Sidebar/Sidebar";

const UsersTablePage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex px-2 md:gap-8">
        <UsersTableBody />
      </div>
    </div>
  );
};

export default UsersTablePage;
