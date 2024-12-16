//client\src\pages\ActivitiesTablePage.tsx
import ActivitiesTableBody from "@/components/tables/ActivitiesTable/ActivitiesTableBody";
import Sidebar from "../components/Sidebar/Sidebar";

const ActivitiesTablePage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex px-2 md:gap-8">
        <ActivitiesTableBody />
      </div>
    </div>
  );
};

export default ActivitiesTablePage;
