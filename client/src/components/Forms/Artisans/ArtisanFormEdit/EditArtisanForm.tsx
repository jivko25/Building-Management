//client\src\components\Forms\Artisans\ArtisanFormEdit\EditArtisanForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import UsersSelector from "@/components/common/FormElements/FormUserSelector";
import { Mail, Phone, User } from "lucide-react";
import { useArtisanFormHooks } from "@/hooks/forms/useArtisanForm";
import { ArtisanSchema } from "@/models/artisan/artisanSchema";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type EditArtisanFormProps = {
  handleSubmit: (artisanData: ArtisanSchema) => void;
  artisanId: string;
  isPending: boolean;
};

const EditArtisanForm = ({ artisanId, handleSubmit, isPending }: EditArtisanFormProps) => {
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

  const { data: artisan } = useFetchDataQuery<{
    id: string;
    name: string;
    note: string;
    number: string;
    email: string;
    status: "active" | "inactive";
    company: { name: string };
    user: { full_name: string };
  }>({
    URL: `/artisans/${artisanId}`,
    queryKey: ["artisan", artisanId],
    options: {
      staleTime: Infinity
    }
  });

  console.log("👷 Artisan data:", artisan);

  const { useEditArtisanForm } = useArtisanFormHooks();

  const form = useEditArtisanForm({
    name: artisan?.name || "",
    note: artisan?.note || "",
    number: artisan?.number || "",
    email: artisan?.email || "",
    status: artisan?.status || "active",
    company: artisan?.company?.name || "",
    artisanName: artisan?.user?.full_name || ""
  });

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.artisanName} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={translations.artisanPhone} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={translations.artisanEmail} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={translations.status} name="status" defaultVal={artisan?.status} />
          <UsersSelector label={translations.selectUser} name="artisanName" defaultVal={artisan?.user?.full_name} />
          <CompanySelector label={translations.selectCompany} name="company" defaultVal={artisan?.company?.name} />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={translations.artisanNote} placeholder={translations.notesPlaceholder} type="text" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditArtisanForm;
