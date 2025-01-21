//client\src\pages\AccountantsTablePage.tsx
import Sidebar from "../components/Sidebar/Sidebar";
import AccountantsTableBody from "@/components/tables/AccountantTable/AccountantsTableBody";

const AccountantsTablePage = () => {
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex px-2 md:gap-8">
        <AccountantsTableBody />
      </div>
    </div>
  );
};

export default AccountantsTablePage;
