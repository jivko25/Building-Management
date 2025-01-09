import ClientsTableBody from "@/components/tables/ClientsTable/ClientsTableBody";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ClientsTablePage = () => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Clients"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Clients")
      });
    };
    loadTranslations();
  }, [translate]);

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
