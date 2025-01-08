//client\src\components\Forms\Artisans\ArtisanFormCreate\CreateArtisan.tsx
import { artisanSchema, ArtisanSchema } from "@/models/artisan/artisanSchema";
import CreateArtisanForm from "./CreateArtisanForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const CreateArtisan = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new artisan",
    title: "New artisan",
    success: "Artisan created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new artisan"),
        title: await translate("New artisan"),
        success: await translate("Artisan created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ArtisanSchema>({
    URL: "/artisans/create",
    queryKey: ["artisans"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, artisanSchema);

  return <DialogModal Component={CreateArtisanForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateArtisan;
