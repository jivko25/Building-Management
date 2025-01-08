//client\src\components\tables\UsersTable\TableHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const UsersHeader = () => {
  const { translate } = useLanguage();
  const [headers, setHeaders] = useState<HeaderItems[]>([]);

  useEffect(() => {
    const translateHeaders = async () => {
      const translatedHeaders: HeaderItems[] = [
        { key: "name", label: await translate("Name, Surname"), width: "w-20rem", align: "left" },
        { key: "user", label: await translate("User"), width: "w-20rem", align: "center" },
        { key: "options", label: await translate("Options"), width: "w-12.5rem", align: "right" }
      ];
      setHeaders(translatedHeaders);
    };

    translateHeaders();
  }, [translate]);

  return <TableHeader headers={headers} />;
};

export default UsersHeader;
