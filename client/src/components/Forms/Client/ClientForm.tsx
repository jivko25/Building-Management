import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClientSchema } from "@/models/client/clientSchema";
import FormInput from "@/components/Forms/FormElements/FormInput";
import FormSelect from "@/components/Forms/FormElements/FormSelect";
import { Client, Language } from "@/types/client-types/clientTypes";
import FormEmailList from "@/components/Forms/FormElements/FormEmailList";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getEntityData } from "@/api/apiCall";

interface ClientFormProps {
  form: UseFormReturn<ClientSchema>;
  onSubmit: (data: Client) => void;
  defaultValues?: Client;
}

const ClientForm = ({ form, onSubmit, defaultValues }: ClientFormProps) => {
  const { t } = useTranslation();

  const { data: languages } = useQuery<Language[]>({
    queryKey: ["languages"],
    queryFn: () => getEntityData("/languages")
  });

  console.log("Languages loaded:", languages);

  const statusOptions = [
    { label: t("Active"), value: "active" },
    { label: t("Inactive"), value: "inactive" }
  ];

  const languageOptions =
    languages?.map(lang => ({
      label: lang.name,
      value: lang.id.toString()
    })) || [];

  const handleSubmit = (data: ClientSchema) => {
    const formattedData = {
      ...data,
      invoice_language_id: Number(data.invoice_language_id),
      due_date: Number(data.due_date)
    };
    console.log("Submitting form with data:", formattedData);
    onSubmit(formattedData as Client);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput control={form.control} name="client_company_name" label={t("Company Name")} placeholder={t("Enter company name")} />
        <FormInput control={form.control} name="client_name" label={t("Client Name")} placeholder={t("Enter client name")} />
        <FormInput control={form.control} name="client_company_address" label={t("Address")} placeholder={t("Enter company address")} />
        <FormInput control={form.control} name="client_company_iban" label={t("IBAN")} placeholder={t("Enter company IBAN")} />
        <FormInput control={form.control} name="client_company_vat_number" label={t("VAT Number")} placeholder={t("Enter company VAT number")} />
        <FormEmailList control={form.control} name="client_emails" label={t("Email Addresses")} placeholder={t("Add email address")} />
        <FormSelect control={form.control} name="status" label={t("Status")} options={statusOptions} />
        <FormSelect control={form.control} name="invoice_language_id" label={t("Invoice Language")} options={languageOptions} />
        <FormInput control={form.control} name="due_date" label={t("Due Date (weeks)")} placeholder={t("Enter due date in weeks")} type="number" />
        <Button type="submit" className="w-full">
          {defaultValues ? t("Update Client") : t("Create Client")}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
