import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";

const clientHeaders: HeaderItems[] = [
  { key: "company", label: "Company Name", width: "w-20rem", align: "left" },
  { key: "name", label: "Client Name", width: "w-15rem", align: "left" },
  { key: "address", label: "Address", width: "w-20rem", align: "left" },
  { key: "iban", label: "IBAN", width: "w-15rem", align: "left" },
  { key: "status", label: "Status", width: "w-10rem", align: "center" },
  { key: "options", label: "Options", width: "w-12.5rem", align: "right" }
];

const ClientsHeader = () => {
  return <TableHeader headers={clientHeaders} />;
};

export default ClientsHeader;
