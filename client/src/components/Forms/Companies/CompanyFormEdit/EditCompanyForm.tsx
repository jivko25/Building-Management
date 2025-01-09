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
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type EditCompanyFormProps = {
  handleSubmit: (companyData: CompanySchema) => void;
  company_id: string;
  isPending: boolean;
};

const EditCompanyForm = ({ company_id, handleSubmit, isPending }: EditCompanyFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    companyName: "Company name",
    companyLocation: "Company location",
    companyAddress: "Company address",
    companyMol: "Company MOL",
    companyEmail: "Company email",
    companyIban: "Company IBAN",
    companyVat: "Company VAT number",
    companyRegNumber: "Company registration number",
    companyPhone: "Company phone",
    status: "Status",
    dds: "DDS",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        companyName: await translate("Company name"),
        companyLocation: await translate("Company location"),
        companyAddress: await translate("Company address"),
        companyMol: await translate("Company MOL"),
        companyEmail: await translate("Company email"),
        companyIban: await translate("Company IBAN"),
        companyVat: await translate("Company VAT number"),
        companyRegNumber: await translate("Company registration number"),
        companyPhone: await translate("Company phone"),
        status: await translate("Status"),
        dds: await translate("DDS"),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

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
          <FormFieldInput type="text" label={translations.companyName} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={translations.companyLocation} name="location" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={translations.companyAddress} name="address" className="pl-10" Icon={MapPin} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.companyMol} name="mol" className="pl-10" Icon={User} />
          <FormFieldInput type="email" label={translations.companyEmail} name="email" className="pl-10" Icon={Mail} />
          <FormFieldInput type="text" label={translations.companyIban} name="iban" className="pl-10" Icon={FileDigit} />
          <FormFieldInput type="text" label={translations.companyVat} name="vat_number" className="pl-10" Icon={FileDigit} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.companyRegNumber} name="registration_number" className="pl-10" Icon={FileDigit} />
          <FormFieldInput type="text" label={translations.companyPhone} name="phone" className="pl-10" Icon={Phone} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={translations.status} name="status" placeholder="active" defaultVal={company?.status} />
          <VatSelector label={translations.dds} name="dds" defaultVal={company?.dds} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditCompanyForm;
