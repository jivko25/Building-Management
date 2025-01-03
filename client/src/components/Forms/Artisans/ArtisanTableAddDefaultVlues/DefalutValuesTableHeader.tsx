import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";

const defaultValuesHeaders: HeaderItems[] = [
  { key: "name", label: "Name", width: "w-20rem", align: "left" },
  { key: "value", label: "Value", width: "w-20rem", align: "left" },
  { key: "action", label: "Action", width: "w-10rem", align: "right" }
];
export default function DefaultValuesTableHeader() {
  return <TableHeader headers={defaultValuesHeaders} />;
}
