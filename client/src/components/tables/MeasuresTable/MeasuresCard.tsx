// src/components/tables/MeasuresTable/MeasuresCard.tsx
import EditMeasure from "@/components/Forms/Measures/MeasureFormEdit/EditMeasure";
import { TableCell, TableRow } from "@/components/ui/table";
import { Measure } from "@/types/measure-types/measureTypes";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import apiClient from "@/api/axiosConfig";

type MeasuresCardProps = {
  measures: Measure[];
};

const MeasuresCard = ({ measures }: MeasuresCardProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/measures/${id}`);
      // След успешно изтриване – принудително презареждаме query-а "measures"
      queryClient.invalidateQueries({ queryKey: ["measures"] });
    } catch (error: any) {
      alert(error.response.data.message);
      console.error("Error deleting measure:", error);
      // Можете да покажете тук съобщение за грешка
    }
  };

  return (
    <>
      {Array.isArray(measures) &&
        measures.map((measure) => (
          <TableRow key={measure.id} className="w-full">
            <TableCell className="font-semibold">{measure.name}</TableCell>
            <TableCell className="text-end flex justify-end gap-2 w-full">
              <EditMeasure measureId={measure.id!} />
              <button
                onClick={() => handleDelete(measure.id! as any)}
                className="text-red-500 hover:text-red-700"
                title={t("Delete measure")}
              >
                <Trash2 size={18} />
              </button>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default MeasuresCard;
