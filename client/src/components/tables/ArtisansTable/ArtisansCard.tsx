//client\src\components\tables\ArtisansTable\ArtisansCard.tsx
import EditArtisan from "@/components/Forms/Artisans/ArtisanFormEdit/EditArtisan";
import { TableCell, TableRow } from "@/components/ui/table";
import { Artisan } from "@/types/artisan-types/artisanTypes";

type ArtisansCardProps = {
  artisans: Artisan[];
};

const ArtisansCard = ({ artisans }: ArtisansCardProps) => {
  return (
    <>
      {artisans.map(artisan => (
        <TableRow key={artisan.id}>
          <TableCell className="font-semibold">{artisan.name}</TableCell>
          <TableCell className="text-end w-[200px]">
            <EditArtisan artisanId={artisan.id!} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ArtisansCard;
