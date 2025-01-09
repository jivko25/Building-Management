import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClientSchema } from "@/models/client/clientSchema";
import FormInput from "@/components/Forms/FormElements/FormInput";
import FormSelect from "@/components/Forms/FormElements/FormSelect";
import { Client } from "@/types/client-types/clientTypes";
import FormEmailList from "@/components/Forms/FormElements/FormEmailList";
import { useTranslation } from "react-i18next";
interface ClientFormProps {
  form: UseFormReturn<ClientSchema>;
  onSubmit: (data: Client) => void;
  defaultValues?: Client;
}

const ClientForm = ({ form, onSubmit, defaultValues }: ClientFormProps) => {
  const { t } = useTranslation();
  const statusOptions = [
    { label: t("Active"), value: "active" },
    { label: t("Inactive"), value: "inactive" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={form.control} name="client_company_name" label={t("Company Name")} placeholder={t("Enter company name")} />
        <FormInput control={form.control} name="client_name" label={t("Client Name")} placeholder={t("Enter client name")} />
        <FormInput control={form.control} name="client_company_address" label={t("Address")} placeholder={t("Enter company address")} />
        <FormInput control={form.control} name="client_company_iban" label={t("IBAN")} placeholder={t("Enter company IBAN")} />
        <FormInput control={form.control} name="client_company_vat_number" label={t("VAT Number")} placeholder={t("Enter company VAT number")} />
        <FormEmailList control={form.control} name="client_emails" label={t("Email Addresses")} placeholder={t("Add email address")} />
        <FormSelect control={form.control} name="status" label={t("Status")} options={statusOptions} />
        <Button type="submit" className="w-full">
          {defaultValues ? t("Update") : t("Create")} {t("Client")}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
