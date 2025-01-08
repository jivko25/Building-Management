//client\src\components\Forms\Measures\MeasureFormCreate\CreateMeasure.tsx
import { measureSchema, MeasureSchema } from "@/models/measure/measureSchema";
import CreateMeasureForm from "./CreateMeasureForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const CreateMeasure = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new measure",
    title: "New measure",
    success: "Measure created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new measure"),
        title: await translate("New measure"),
        success: await translate("Measure created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<MeasureSchema>({
    URL: "/measures/create",
    queryKey: ["measures"],
    successToast: "Measure created successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, measureSchema);

  return <DialogModal Component={CreateMeasureForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateMeasure;
