import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClientSchema } from "@/models/client/clientSchema";
import FormInput from "@/components/Forms/FormElements/FormInput";
import FormSelect from "@/components/Forms/FormElements/FormSelect";
import { Client } from "@/types/client-types/clientTypes";
import FormEmailList from "@/components/Forms/FormElements/FormEmailList";

interface ClientFormProps {
  form: UseFormReturn<ClientSchema>;
  onSubmit: (data: Client) => void;
  defaultValues?: Client;
}

const ClientForm = ({ form, onSubmit, defaultValues }: ClientFormProps) => {
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={form.control} name="client_company_name" label="Company Name" placeholder="Enter company name" />
        <FormInput control={form.control} name="client_name" label="Client Name" placeholder="Enter client name" />
        <FormInput control={form.control} name="client_company_address" label="Address" placeholder="Enter company address" />
        <FormInput control={form.control} name="client_company_iban" label="IBAN" placeholder="Enter company IBAN" />
        <FormEmailList control={form.control} name="client_emails" label="Email Addresses" placeholder="Add email address" />
        <FormSelect control={form.control} name="status" label="Status" options={statusOptions} />
        <Button type="submit" className="w-full">
          {defaultValues ? "Update" : "Create"} Client
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
