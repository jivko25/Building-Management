//client\src\pages\ArtisansTablePage.tsx
import Sidebar from "../components/Sidebar/Sidebar";
import ManagerAllDefaultValuesTable from "@/components/Forms/Manager/ManagerTableAddDefaultVlues/ManagerAllDefaultValuesTable";

const ManagerDefaultPricesPage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex px-2 md:gap-8">
        <ManagerAllDefaultValuesTable />
      </div>
    </div>
  );
};

export default ManagerDefaultPricesPage;
