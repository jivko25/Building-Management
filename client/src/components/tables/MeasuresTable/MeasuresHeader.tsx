// src/components/tables/MeasuresTable/MeasuresHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";

const measuresHeaders: HeaderItems[] = [
  { key: "measure", label: "Measure", width: "w-20rem", align: "left" },
  { key: "options", label: "Options", width: "w-12.5rem", align: "right" }
];

const MeasuresHeader = () => {
  return <TableHeader headers={measuresHeaders} />;
};

export default MeasuresHeader;
