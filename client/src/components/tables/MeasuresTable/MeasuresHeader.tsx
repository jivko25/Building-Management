// src/components/tables/MeasuresTable/MeasuresHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const MeasuresHeader = () => {
  const { t } = useTranslation();

  const measuresHeaders: HeaderItems[] = [
    { key: "measure", label: t("Measure"), width: "w-20rem", align: "left" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={measuresHeaders} />;
};

export default MeasuresHeader;
