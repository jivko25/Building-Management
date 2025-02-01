//client\src\components\Forms\Measures\MeasureFormEdit\EditMeasure.tsx
import { measureSchema, MeasureSchema } from "@/models/measure/measureSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditMeasureForm from "./EditMeasureForm";
import { useTranslation } from "react-i18next";
import { useCachedData } from "@/hooks/useQueryHook";
import { findItemById } from "@/utils/helpers/findItemById";
import { Measure } from "@/types/measure-types/measureTypes";
import apiClient from "@/api/axiosConfig";
import { useQuery } from "@tanstack/react-query";

type MeasureFormProps = {
  measureId: string;
};

const EditMeasure = ({ measureId }: MeasureFormProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();
  const { useEditEntity } = useMutationHook();

  // const measure = useCachedData<Measure>({
  //   queryKey: ["measures"],
  //   selectFn: data => findItemById<Measure>(data as Measure[], measureId, measure => measure.id?.toString() || "")
  // });

  const measure = useQuery<Measure>({
    queryKey: ["measures", measureId],
    queryFn: () => apiClient.get(`/measures/${measureId}`)
  });

  console.log(measure?.data?.data?.data, 'measure');
  



  const { mutate, isPending } = useEditEntity<MeasureSchema>({
    URL: `/measures/${measureId}/edit`,
    queryKey: ["measures"],
    successToast: t("Measure updated successfully!"),
    setIsOpen

  });

  const handleSubmit = useSubmitHandler(mutate, measureSchema);

  return <DialogModal Component={EditMeasureForm} props={{ handleSubmit, isPending, measureId, initialData: measure?.data?.data?.data }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit measure")} />;
};

export default EditMeasure;
