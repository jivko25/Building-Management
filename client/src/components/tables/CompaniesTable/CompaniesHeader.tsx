//client\src\components\tables\CompaniesTable\CompaniesHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const CompaniesHeader = () => {
  const { t } = useTranslation();

  const headers: HeaderItems[] = [
    { key: "name", label: t("Company name"), width: "w-[23rem]", align: "left" },
    { key: "number", label: t("Company number"), width: "w-[21.5rem]", align: "center" },
    { key: "mrp", label: t("MRP"), width: "w-[21rem]", align: "center" },
    { key: "logo", label: t("Logo"), width: "w-[21rem]", align: "center" },
    { key: "options", label: t("Options"), width: "w-[12.5rem]", align: "right" }
  ];

  return <TableHeader headers={headers} />;
};

export default CompaniesHeader;
