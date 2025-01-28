//client\src\components\Forms\Artisans\ArtisanFormEdit\EditArtisan.tsx
import { artisanSchema, ArtisanSchema } from "@/models/artisan/artisanSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditArtisanForm from "./EditArtisanForm";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

type ArtisanFormProps = {
  artisanId: string;
};

const EditArtisan = ({ artisanId }: ArtisanFormProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();
  const queryClient = useQueryClient();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ArtisanSchema>({
    URL: `/artisans/${artisanId}/edit`,
    queryKey: ["artisans"],
    successToast: t("Artisan updated successfully!"),
    setIsOpen,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["artisan", artisanId] });
      queryClient.invalidateQueries({ queryKey: ["artisans"] });
    }
  });

  const handleSubmit = useSubmitHandler(mutate, artisanSchema);

  return <DialogModal Component={EditArtisanForm} props={{ artisanId, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit artisan")} />;
};

export default EditArtisan;
