//client\src\components\tables\ArtisansTable\ArtisansHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";

const artisanHeaders: HeaderItems[] = [
  { key: "name", label: "Name", width: "w-20rem", align: "left" },
  { key: "options", label: "Options", width: "w-12.5rem", align: "right" }
];

const ArtisansHeader = () => {
  return <TableHeader headers={artisanHeaders} />;
};

export default ArtisansHeader;
