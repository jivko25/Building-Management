import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const ClientsHeader = () => {
  const { t } = useTranslation();
  const clientHeaders: HeaderItems[] = [
    { key: "company", label: t("Company Name"), width: "w-20rem", align: "left" },
    { key: "name", label: t("Client Name"), width: "w-15rem", align: "left" },
    { key: "address", label: t("Address"), width: "w-20rem", align: "left" },
    { key: "iban", label: t("IBAN"), width: "w-15rem", align: "left" },
    { key: "language", label: t("Invoice Language"), width: "w-10rem", align: "left" },
    { key: "due_date", label: t("Due Date"), width: "w-10rem", align: "right" },
    { key: "status", label: t("Status"), width: "w-10rem", align: "center" },
    { key: "options", label: t("Options"), width: "w-12.5rem", align: "right" }
  ];

  return <TableHeader headers={clientHeaders} />;
};

export default ClientsHeader;
