//client\src\components\Forms\Companies\CompanyFormEdit\EditCompanyForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import VatSelector from "@/components/common/FormElements/FormVatSelector";
import { ClipboardList, FileDigit, Mail, MapPin, Phone, User } from "lucide-react";
import { CompanySchema } from "@/models/company/companySchema";
import { useCompanyFormHooks } from "@/hooks/forms/useCompanyForm";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Company } from "@/types/company-types/companyTypes";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
type EditCompanyFormProps = {
  handleSubmit: (companyData: CompanySchema) => void;
  company_id: string;
  isPending: boolean;
};

const EditCompanyForm = ({ company_id, handleSubmit, isPending }: EditCompanyFormProps) => {
  const { t } = useTranslation();
  const { data: company } = useFetchDataQuery<Company>({
    URL: `/companies/${company_id}`,
    queryKey: ["company", company_id],
    options: {
      staleTime: Infinity
    }
  });

  console.log("🏢 Fetched company data:", company);

  const { useEditCompanyForm } = useCompanyFormHooks();
  const form = useEditCompanyForm(company || {});

  const onSubmit = (data: CompanySchema) => {
    console.log("✏️ Editing company with data:", {
      id: company_id,
      ...data,
      formState: form.formState,
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid
    });
    handleSubmit(data);
  };

  console.log("🏢 Current form values:", form.watch());
  console.log("🚦 Form state:", {
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    dirtyFields: form.formState.dirtyFields
  });

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company name")} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={t("Company location")} name="location" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={t("Company address")} name="address" className="pl-10" Icon={MapPin} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company  MOL")} name="mol" className="pl-10" Icon={User} />
          <FormFieldInput type="email" label={t("Company email")} name="email" className="pl-10" Icon={Mail} />
          <FormFieldInput type="text" label={t("Company IBAN")} name="iban" className="pl-10" Icon={FileDigit} />
          <FormFieldInput type="text" label={t("Company VAT number")} name="vat_number" className="pl-10" Icon={FileDigit} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Company registration number")} name="registration_number" className="pl-10" Icon={FileDigit} />
          <FormFieldInput type="text" label={t("Company phone")} name="phone" className="pl-10" Icon={Phone} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} defaultVal={company?.status} />
          <VatSelector label={t("DDS")} name="dds" defaultVal={company?.dds} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditCompanyForm;
