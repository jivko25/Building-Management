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

type EditCompanyFormProps = {
  handleSubmit: (companyData: CompanySchema) => void;
  companyId: string;
  isPending: boolean;
};

const EditCompanyForm = ({ companyId, handleSubmit, isPending }: EditCompanyFormProps) => {
  const { data: company } = useFetchDataQuery<Company>({
    URL: `/companies/${companyId}`,
    queryKey: ["company", companyId],
    options: {
      staleTime: Infinity
    }
  });

  console.log("🏢 Company data:", company);

  const { useEditCompanyForm } = useCompanyFormHooks();
  const form = useEditCompanyForm(company || {});

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label="Company name" name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label="Company address" name="address" className="pl-10" Icon={MapPin} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label="Company MOL" name="mol" className="pl-10" Icon={User} />
          <FormFieldInput type="email" label="Company email" name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormFieldInput type="text" label="Company number" name="number" className="pl-10" Icon={FileDigit} />
          <FormFieldInput type="text" label="Company phone" name="phone" className="pl-10" Icon={Phone} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label="Status" name="status" placeholder="active" defaultVal={company?.status} />
          <VatSelector label="DDS" name="dds" defaultVal={company?.dds} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label="Submit" formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditCompanyForm;
