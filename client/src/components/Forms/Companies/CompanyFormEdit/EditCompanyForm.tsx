//client\src\components\Forms\Companies\CompanyFormEdit\EditCompanyForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import VatSelector from "@/components/common/FormElements/FormVatSelector";
import { ClipboardList, FileDigit, Mail, MapPin, Phone, User } from "lucide-react";
import { CompanySchema } from "@/models/company/companySchema";
import { useCompanyFormHooks } from "@/hooks/forms/useCompanyForm";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type EditCompanyFormProps = {
  handleSubmit: (companyData: CompanySchema) => void;
  company_id: string;
  isPending: boolean;
};

const EditCompanyForm = ({ company_id, handleSubmit, isPending }: EditCompanyFormProps) => {
  const { t } = useTranslation();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", company_id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${company_id}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }
      return response.json();
    }
  });

  console.log("🏢 Company data:", company);
  console.log("Loading state:", isLoading);

  const { useEditCompanyForm } = useCompanyFormHooks();

  const form = useEditCompanyForm({
    name: company?.name || "",
    location: company?.location || "",
    address: company?.address || "",
    mol: company?.mol || "",
    email: company?.email || "",
    iban: company?.iban || "",
    vat_number: company?.vat_number || "",
    registration_number: company?.registration_number || "",
    phone: company?.phone || "",
    status: company?.status || "active",
    logo_url: company?.logo_url || ""
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        location: company.location,
        address: company.address,
        mol: company.mol,
        email: company.email,
        iban: company.iban,
        vat_number: company.vat_number,
        registration_number: company.registration_number,
        phone: company.phone,
        status: company.status,
        logo_url: company.logo_url
      });
    }
  }, [company, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
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
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditCompanyForm;
