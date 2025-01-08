import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ManagersHeader = () => {
  const { translate } = useLanguage();
  const [headers, setHeaders] = useState<HeaderItems[]>([]);

  useEffect(() => {
    const translateHeaders = async () => {
      const translatedHeaders: HeaderItems[] = [
        { key: "name", label: await translate("Name"), width: "w-20rem", align: "left" },
        { key: "email", label: await translate("Email"), width: "w-20rem", align: "left" },
        { key: "role", label: await translate("Role"), width: "w-10rem", align: "left" },
        { key: "options", label: await translate("Options"), width: "w-12.5rem", align: "right" }
      ];
      setHeaders(translatedHeaders);
    };

    translateHeaders();
  }, [translate]);

  return <TableHeader headers={headers} />;
};

export default ManagersHeader;
