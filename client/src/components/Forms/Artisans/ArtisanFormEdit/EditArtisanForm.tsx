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
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type EditArtisanFormProps = {
  handleSubmit: (artisanData: ArtisanSchema) => void;
  artisanId: string;
  isPending: boolean;
};

const EditArtisanForm = ({ artisanId, handleSubmit, isPending }: EditArtisanFormProps) => {
  const { t } = useTranslation();
  const { data: artisan, isLoading } = useQuery({
    queryKey: ["artisan", artisanId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artisans/${artisanId}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch artisan");
      }
      return response.json();
    }
  });

  console.log("👷 Artisan data:", artisan);
  console.log("Loading state:", isLoading);

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

  useEffect(() => {
    if (artisan) {
      form.reset({
        name: artisan.name,
        note: artisan.note || "",
        number: artisan.number,
        email: artisan.email,
        status: artisan.status,
        company: artisan.company?.name,
        artisanName: artisan.user?.full_name
      });
    }
  }, [artisan, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Artisan name")} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={t("Artisan phone")} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={t("Artisan email")} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" defaultVal={artisan?.status} />
          <UsersSelector label={t("Select user")} name="artisanName" defaultVal={artisan?.user?.full_name} />
          <CompanySelector label={t("Select company")} name="company" defaultVal={artisan?.company?.name} />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={t("Artisan note")} placeholder={t("Artisan notes...")} type="text" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditArtisanForm;
