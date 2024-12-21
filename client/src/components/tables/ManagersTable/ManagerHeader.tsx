import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";

const managerHeaders: HeaderItems[] = [
  { key: "name", label: "Name", width: "w-20rem", align: "left" },
  { key: "email", label: "Email", width: "w-20rem", align: "left" },
  { key: "role", label: "Role", width: "w-10rem", align: "left" },
  { key: "options", label: "Options", width: "w-12.5rem", align: "right" }
];

const ManagersHeader = () => {
  return <TableHeader headers={managerHeaders} />;
};

export default ManagersHeader;