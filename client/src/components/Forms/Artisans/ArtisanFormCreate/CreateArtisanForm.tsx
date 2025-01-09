//client\src\components\Forms\Artisans\ArtisanFormCreate\CreateArtisanForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import UsersSelector from "@/components/common/FormElements/FormUserSelector";
import { Separator } from "@/components/ui/separator";
import { useArtisanFormHooks } from "@/hooks/forms/useArtisanForm";
import { ArtisanSchema } from "@/models/artisan/artisanSchema";
import { Mail, Phone, User } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateArtisanFormProps = {
  handleSubmit: (artisanData: ArtisanSchema) => void;
  isPending: boolean;
};

const CreateArtisanForm = ({ handleSubmit, isPending }: CreateArtisanFormProps) => {
  const { t } = useTranslation();
  const { useCreateArtisanForm } = useArtisanFormHooks();
  const form = useCreateArtisanForm();

  return (
    <FormProvider {...form}>
      <form id="artisan-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Artisan name")} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={t("Artisan phone")} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={t("Artisan email")} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} />
          <UsersSelector label={t("Select user")} name="artisanName" />
          <CompanySelector label={t("Select company")} name="company" />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={t("Artisan note")} type="text" placeholder={t("Artisan notes...")} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="artisan-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateArtisanForm;
