//client\src\components\Forms\Accountant\AccountantFormEdit\EditAccountantForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import UsersSelector from "@/components/common/FormElements/FormUserSelector";
import { Mail, Phone, User } from "lucide-react";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { AccountantSchema } from "@/models/accountant/accountantSchema";
import { useAccountantFormHooks } from "@/hooks/forms/useAccountantForm";
import MeasureSelector from "@/components/common/FormElements/FormMeasureSelector";

type EditAccountantFormProps = {
  handleSubmit: (accountantData: AccountantSchema) => void;
  accountantId: string;
  isPending: boolean;
};

const EditAccountantForm = ({ accountantId, handleSubmit, isPending }: EditAccountantFormProps) => {
  const { t } = useTranslation();
  const { data: accountant } = useFetchDataQuery<{
    id: string;
    name: string;
    note: string;
    number: string;
    email: string;
    status: "active" | "inactive";
    company: { name: string };
    user: { full_name: string };
    measure: any;
  }>({
    URL: `/accountants/${accountantId}`,
    queryKey: ["accountant", accountantId],
    options: {
      staleTime: Infinity
    }
  });

  console.log("👷 Accountant data:", accountant);

  const { useEditAccountantForm } = useAccountantFormHooks();

  const form = useEditAccountantForm({
    name: accountant?.name || "",
    note: accountant?.note || "",
    number: accountant?.number || "",
    email: accountant?.email || "",
    status: accountant?.status || "active",
    company: accountant?.company?.name || "",
    accountantName: accountant?.user?.full_name || "",
    measure: accountant?.measure || ""
  });

  return (

    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div> aaaaaaaaaaaa {JSON.stringify(accountant)}</div>

        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Accountant name")} name="name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={t("Accountant phone")} name="number" className="pl-10" Icon={Phone} />
          <FormFieldInput type="text" label={t("Accountant email")} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" defaultVal={accountant?.status} />
          <UsersSelector label={t("Select user")} name="accountantName" defaultVal={accountant?.user?.full_name} />
          <CompanySelector label={t("Select company")} name="company" defaultVal={accountant?.company?.name} />
          <MeasureSelector label={t("Select measure")} name="measure" defaultVal={accountant?.measure?.name} />
        </div>
        <Separator className="mt-4 mb-2" />
        <FormTextareaInput name="note" label={t("Accountant note")} placeholder={t("Accountant notes...")} type="text" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditAccountantForm;
