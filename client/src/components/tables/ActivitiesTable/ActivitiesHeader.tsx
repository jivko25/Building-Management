//client\src\components\tables\ActivitiesTable\ActivitiesHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ActivitiesHeader = () => {
  const { translate } = useLanguage();
  const [headers, setHeaders] = useState<HeaderItems[]>([]);

  useEffect(() => {
    const translateHeaders = async () => {
      const translatedHeaders: HeaderItems[] = [
        { key: "activity", label: await translate("Activity"), width: "w-20rem", align: "left" },
        { key: "options", label: await translate("Options"), width: "w-12.5rem", align: "right" }
      ];
      setHeaders(translatedHeaders);
    };

    translateHeaders();
  }, [translate]);

  return <TableHeader headers={headers} />;
};

export default ActivitiesHeader;
