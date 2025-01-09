import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const ManagersHeader = () => {
  const { t } = useTranslation();

  const managerHeaders: HeaderItems[] = [
    { key: "name", label: t("Name"), width: "w-20rem", align: "left" },
    { key: "email", label: t("Email"), width: "w-20rem", align: "left" },
    { key: "role", label: t("Role"), width: "w-10rem", align: "left" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={managerHeaders} />;
};

export default ManagersHeader;
