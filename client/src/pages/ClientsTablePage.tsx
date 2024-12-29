import ClientsTableBody from "@/components/tables/ClientsTable/ClientsTableBody";
import Sidebar from "@/components/Sidebar/Sidebar";

const ClientsTablePage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex px-2 md:gap-8">
        <ClientsTableBody />
      </div>
    </div>
  );
};

export default ClientsTablePage;
