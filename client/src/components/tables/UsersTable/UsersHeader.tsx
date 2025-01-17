//client\src\components\tables\UsersTable\UsersHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const UsersHeader = () => {
  const { t } = useTranslation();

  const userHeaders: HeaderItems[] = [
    { key: "name", label: t("Name, Surname"), width: "w-20rem", align: "left" },
    { key: "user", label: t("User"), width: "w-20rem", align: "center" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={userHeaders} />;
};

export default UsersHeader;
