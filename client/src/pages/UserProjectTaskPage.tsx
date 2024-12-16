//client\src\pages\UserProjectTaskPage.tsx
import UserProjectTaskTableBody from "@/components/tables/UserProjectTaskTable/UserProjectTaskTableBody";
import Sidebar from "../components/Sidebar/Sidebar";

const UserProjectTaskPage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex flex-col w-full overflow-x-auto md:gap-8">
        <UserProjectTaskTableBody />
      </div>
    </div>
  );
};

export default UserProjectTaskPage;
