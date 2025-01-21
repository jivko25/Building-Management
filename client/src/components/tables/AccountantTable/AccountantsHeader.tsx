//client\src\components\tables\AccountantsTable\AccountantsHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const AccountantsHeader = () => {
  const { t } = useTranslation();

  const accountantHeaders: HeaderItems[] = [
    { key: "name", label: t("Name"), width: "w-20rem", align: "left" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={accountantHeaders} />;
};

export default AccountantsHeader;
