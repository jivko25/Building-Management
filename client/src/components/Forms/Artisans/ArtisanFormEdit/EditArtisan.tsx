//client\src\components\Forms\Artisans\ArtisanFormEdit\EditArtisan.tsx
import { artisanSchema, ArtisanSchema } from "@/models/artisan/artisanSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditArtisanForm from "./EditArtisanForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

type ArtisanFormProps = {
  artisanId: string;
};

const EditArtisan = ({ artisanId }: ArtisanFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Edit artisan",
    success: "Artisan updated successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Edit artisan"),
        success: await translate("Artisan updated successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ArtisanSchema>({
    URL: `/artisans/${artisanId}/edit`,
    queryKey: ["artisans"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, artisanSchema);

  return <DialogModal Component={EditArtisanForm} props={{ artisanId, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title={translations.title} />;
};

export default EditArtisan;
