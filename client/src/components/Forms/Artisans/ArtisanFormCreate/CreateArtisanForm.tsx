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
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type CreateArtisanFormProps = {
  handleSubmit: (artisanData: ArtisanSchema) => void;
  isPending: boolean;
};

const CreateArtisanForm = ({ handleSubmit, isPending }: CreateArtisanFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    artisanName: "Artisan name",
    artisanPhone: "Artisan phone",
    artisanEmail: "Artisan email",
    status: "Status",
    selectUser: "Select user",
    selectCompany: "Select company",
    artisanNote: "Artisan note",
    notesPlaceholder: "Artisan notes...",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        artisanName: await translate("Artisan name"),
        artisanPhone: await translate("Artisan phone"),
        artisanEmail: await translate("Artisan email"),
        status: await translate("Status"),
        selectUser: await translate("Select user"),
        selectCompany: await translate("Select company"),
        artisanNote: await translate("Artisan note"),
        notesPlaceholder: await translate("Artisan notes..."),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateArtisanForm } = useArtisanFormHooks();
  const form = useCreateArtisanForm();

  return (
    <FormProvider {...form}>
      <form id="artisan-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.artisanName} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={translations.artisanPhone} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={translations.artisanEmail} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={translations.status} name="status" placeholder="active" />
          <UsersSelector label={translations.selectUser} name="artisanName" />
          <CompanySelector label={translations.selectCompany} name="company" />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={translations.artisanNote} type="text" placeholder={translations.notesPlaceholder} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="artisan-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateArtisanForm;
