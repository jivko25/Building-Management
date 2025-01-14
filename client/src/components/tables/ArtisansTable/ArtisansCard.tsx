//client\src\components\tables\ArtisansTable\ArtisansCard.tsx
import EditArtisan from "@/components/Forms/Artisans/ArtisanFormEdit/EditArtisan";
import ArtisanAction from "@/components/Forms/Artisans/ArtisanTableAddDefaultVlues/ArtisanAction";
import ArtisanAllDefaultValues from "@/components/Forms/Artisans/ArtisanTableAddDefaultVlues/ArtisanAllDefaultValues";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Artisan } from "@/types/artisan-types/artisanTypes";

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
          <TableCell className="font-semibold">{artisan.name}</TableCell>
          <TableCell className="text-end w-[200px]">
            <ArtisanAllDefaultValues artisanId={artisan.id!} artisanName={artisan.name} />
            {defaultValuesGuard && <ArtisanAction artisanId={artisan.id!} />}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ArtisansCard;
