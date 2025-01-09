//client\src\pages\UserProjectTaskPage.tsx
import UserProjectTaskTableBody from "@/components/tables/UserProjectTaskTable/UserProjectTaskTableBody";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const UserProjectTaskPage = () => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Project tasks"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Project tasks")
      });
    };
    loadTranslations();
  }, [translate]);

  console.log("📋 User project task page loaded with translations");

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
