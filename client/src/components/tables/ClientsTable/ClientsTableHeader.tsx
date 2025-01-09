import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ClientsHeader = () => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    headers: {
      company: "Company Name",
      name: "Client Name",
      address: "Address",
      iban: "IBAN",
      status: "Status",
      options: "Options"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        headers: {
          company: await translate("Company Name"),
          name: await translate("Client Name"),
          address: await translate("Address"),
          iban: await translate("IBAN"),
          status: await translate("Status"),
          options: await translate("Options")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  const clientHeaders: HeaderItems[] = [
    {
      key: "company",
      label: translations.headers.company,
      width: "w-20rem",
      align: "left"
    },
    {
      key: "name",
      label: translations.headers.name,
      width: "w-15rem",
      align: "left"
    },
    {
      key: "address",
      label: translations.headers.address,
      width: "w-20rem",
      align: "left"
    },
    {
      key: "iban",
      label: translations.headers.iban,
      width: "w-15rem",
      align: "left"
    },
    {
      key: "status",
      label: translations.headers.status,
      width: "w-10rem",
      align: "center"
    },
    {
      key: "options",
      label: translations.headers.options,
      width: "w-12.5rem",
      align: "right"
    }
  ];

  console.log("📋 Client headers loaded with translations");

  return <TableHeader headers={clientHeaders} />;
};

export default ClientsHeader;
