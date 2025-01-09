//client\src\components\tables\CompaniesTable\CompaniesHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const CompaniesHeader = () => {
  const { translate } = useLanguage();
  const [headers, setHeaders] = useState<HeaderItems[]>([]);

  useEffect(() => {
    const translateHeaders = async () => {
      const translatedHeaders: HeaderItems[] = [
        { key: "name", label: await translate("Company name"), width: "w-[23rem]", align: "left" },
        { key: "number", label: await translate("Company number"), width: "w-[21.5rem]", align: "center" },
        { key: "mrp", label: await translate("MRP"), width: "w-[21rem]", align: "center" },
        { key: "options", label: await translate("Options"), width: "w-[12.5rem]", align: "right" }
      ];
      setHeaders(translatedHeaders);
    };
    translateHeaders();
  }, [translate]);

  return <TableHeader headers={headers} />;
};

export default CompaniesHeader;
