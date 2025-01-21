//client\src\components\Forms\Accountants\AccountantFormCreate\CreateArtisanForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import MeasureSelector from "@/components/common/FormElements/FormMeasureSelector";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import UsersSelector from "@/components/common/FormElements/FormUserSelector";
import { Separator } from "@/components/ui/separator";
import { useAccountantFormHooks } from "@/hooks/forms/useAccountantForm";
import { AccountantSchema } from "@/models/accountant/accountantSchema";
import { Mail, Phone, User } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateAccountantFormProps = {
  handleSubmit: (accountantData: AccountantSchema) => void;
  isPending: boolean;
};

const CreateAccountantForm = ({ handleSubmit, isPending }: CreateAccountantFormProps) => {
  const { t } = useTranslation();
  const { useCreateAccountantForm } = useAccountantFormHooks();
  const form = useCreateAccountantForm();

  return (
    <FormProvider {...form}>
      <form id="accountant-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Accountant name")} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={t("Accountant phone")} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={t("Accountant email")} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} />
          <UsersSelector label={t("Select user")} name="accountantName" />
          <CompanySelector label={t("Select company")} name="company" />
          <MeasureSelector label={t("Select measure")} name="measure" />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={t("Accountant note")} type="text" placeholder={t("Accountant notes...")} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="accountant-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateAccountantForm;
