//client\src\components\Forms\Artisans\ArtisanFormCreate\CreateArtisan.tsx
import { artisanSchema, ArtisanSchema } from "@/models/artisan/artisanSchema";
import CreateArtisanForm from "./CreateArtisanForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";

const CreateArtisan = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ArtisanSchema>({
    URL: "/artisans/create",
    queryKey: ["artisans"],
    successToast: t("Artisan created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, artisanSchema);

  return <DialogModal Component={CreateArtisanForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={t("Add new artisan")} title={t("New artisan")} />;
};

export default CreateArtisan;
