//client\src\components\tables\ArtisansTable\ArtisansCard.tsx
import EditArtisan from "@/components/Forms/Artisans/ArtisanFormEdit/EditArtisan";
import ArtisanAction from "@/components/Forms/Artisans/ArtisanTableAddDefaultVlues/ArtisanAction";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { Link } from "react-router-dom";

type ArtisansCardProps = {
  artisans: Artisan[];
};

const ArtisansCard = ({ artisans }: ArtisansCardProps) => {
  const { role } = useAuth();
  const defaultValuesGuard = role === "manager" || role === "admin";
  return (
    <>
      {artisans.map(artisan => (
        <TableRow key={artisan.id}>
          <TableCell className="font-semibold">
            <Link to={`/artisans/${artisan.id}`}>{artisan.name}</Link>
          </TableCell>
          <TableCell className="text-end w-[200px]">
            {defaultValuesGuard && <ArtisanAction key={artisan.id} artisanId={artisan.id!} artisanName={artisan.name} type="all" />}
            <EditArtisan artisanId={artisan.id!} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ArtisansCard;
