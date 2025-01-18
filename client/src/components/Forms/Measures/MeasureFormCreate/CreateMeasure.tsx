//client\src\components\Forms\Measures\MeasureFormCreate\CreateMeasure.tsx
import { measureSchema, MeasureSchema } from "@/models/measure/measureSchema";
import CreateMeasureForm from "./CreateMeasureForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";

const CreateMeasure = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<MeasureSchema>({
    URL: "/measures/create",
    queryKey: ["measures"],
    successToast: t("Measure created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, measureSchema);

  return <DialogModal Component={CreateMeasureForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={t("Add new measure")} title={t("New measure")} />;
};

export default CreateMeasure;
