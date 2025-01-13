//client\src\components\tables\ArtisansTable\ArtisansHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const ArtisansHeader = () => {
  const { t } = useTranslation();

  const artisanHeaders: HeaderItems[] = [
    { key: "name", label: t("Name"), width: "w-20rem", align: "left" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={artisanHeaders} />;
};

export default ArtisansHeader;
