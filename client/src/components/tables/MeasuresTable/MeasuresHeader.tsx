// src/components/tables/MeasuresTable/MeasuresHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const MeasuresHeader = () => {
  const { translate } = useLanguage();
  const [headers, setHeaders] = useState<HeaderItems[]>([]);

  useEffect(() => {
    const translateHeaders = async () => {
      const translatedHeaders: HeaderItems[] = [
        { key: "measure", label: await translate("Measure"), width: "w-20rem", align: "left" },
        { key: "options", label: await translate("Options"), width: "w-12.5rem", align: "right" }
      ];
      setHeaders(translatedHeaders);
    };

    translateHeaders();
  }, [translate]);

  return <TableHeader headers={headers} />;
};

export default MeasuresHeader;
