//client\src\pages\ActivitiesTablePage.tsx
import ManagersTableBody from "@/components/tables/ManagersTable/ManagerTableBody";
import Sidebar from "../components/Sidebar/Sidebar";

const ManagerTablePage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex px-2 md:gap-8">
        <ManagersTableBody />
      </div>
    </div>
  );
};

export default ManagerTablePage;
