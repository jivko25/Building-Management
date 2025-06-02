//client\src\components\Forms\Companies\CompanyFormCreate\CreateCompanyForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useCompanyFormHooks } from "@/hooks/forms/useCompanyForm";
import { CompanySchema } from "@/models/company/companySchema";
import { ClipboardList, FileDigit, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateCompanyFormProps = {
  handleSubmit: (companyData: CompanySchema) => void;
  isPending: boolean;
};

const CreateCompanyForm = ({ handleSubmit, isPending }: CreateCompanyFormProps) => {
  const { t } = useTranslation();
  const { useCreateCompanyForm } = useCompanyFormHooks();

  const form = useCreateCompanyForm();

  const onSubmit = (data: CompanySchema) => {
    console.log("📝 Creating company with data:", {
      ...data,
      formState: form.formState,
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid
    });

    if (form.formState.errors) {
      console.log("❌ Form errors:", form.formState.errors);
    }

    console.log("🚀 Calling handleSubmit with data:", data);

    handleSubmit(data);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => console.log(`📊 Form field changed - Name: ${name}, Type: ${type}, Value:`, value));
    return () => subscription.unsubscribe();
  }, [form.watch]);

  console.log("🏢 Form values:", form.watch());
  console.log("🚦 Form state:", {
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting
  });

  return (
    <FormProvider {...form}>
      <form
        id="company-form"
        onSubmit={e => {
          console.log("🔄 Form submit event triggered");
          form.handleSubmit(onSubmit)(e);
        }}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company name")} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={t("Company location")} name="location" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={t("Company address")} name="address" className="pl-10" Icon={MapPin} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company MOL")} name="mol" className="pl-10" Icon={User} />
          <p className="text-red-500">{form.formState.errors?.mol?.message}</p>

          <FormFieldInput type="email" label={t("Company email")} name="email" className="pl-10" Icon={Mail} />
          <FormFieldInput type="text" label={t("Company IBAN")} name="iban" className="pl-10" Icon={FileDigit} />
          <p className="text-red-500">{form.formState.errors?.iban?.message}</p>
          <FormFieldInput type="text" label={t("Company VAT number")} name="vat_number" className="pl-10" Icon={FileDigit} />
          <p className="text-red-500">{form.formState.errors?.vat_number?.message}</p>
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company registration number")} name="registration_number" className="pl-10" Icon={FileDigit} />
          <p className="text-red-500">{form.formState.errors?.registration_number?.message}</p>
          <FormFieldInput type="text" label={t("Company phone")} name="phone" className="pl-10" Icon={Phone} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="company-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateCompanyForm;
