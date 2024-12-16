//client\src\components\Forms\Measures\MeasureFormEdit\EditMeasure.tsx
import { measureSchema, MeasureSchema } from "@/models/measure/measureSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditMeasureForm from "./EditMeasureForm";

type MeasureFormProps = {
  measureId: string;
};

const EditMeasure = ({ measureId }: MeasureFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<MeasureSchema>({
    URL: `/measures/${measureId}/edit`,
    queryKey: ["measures"],
    successToast: "Measure updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, measureSchema);

  return <DialogModal Component={EditMeasureForm} props={{ handleSubmit, isPending, measureId }} isOpen={isOpen} setIsOpen={setIsOpen} title="Edit measure" />;
};

export default EditMeasure;
