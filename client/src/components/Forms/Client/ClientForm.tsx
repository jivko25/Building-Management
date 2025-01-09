import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClientSchema } from "@/models/client/clientSchema";
import FormInput from "@/components/Forms/FormElements/FormInput";
import FormSelect from "@/components/Forms/FormElements/FormSelect";
import { Client } from "@/types/client-types/clientTypes";
import FormEmailList from "@/components/Forms/FormElements/FormEmailList";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ClientFormProps {
  form: UseFormReturn<ClientSchema>;
  onSubmit: (data: Client) => void;
  defaultValues?: Client;
}

const ClientForm = ({ form, onSubmit, defaultValues }: ClientFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    fields: {
      companyName: "Company Name",
      clientName: "Client Name",
      address: "Address",
      iban: "IBAN",
      vatNumber: "VAT Number",
      emails: "Email Addresses",
      status: "Status"
    },
    placeholders: {
      companyName: "Enter company name",
      clientName: "Enter client name",
      address: "Enter company address",
      iban: "Enter company IBAN",
      vatNumber: "Enter company VAT number",
      email: "Add email address"
    },
    status: {
      active: "Active",
      inactive: "Inactive"
    },
    buttons: {
      create: "Create Client",
      update: "Update Client"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        fields: {
          companyName: await translate("Company Name"),
          clientName: await translate("Client Name"),
          address: await translate("Address"),
          iban: await translate("IBAN"),
          vatNumber: await translate("VAT Number"),
          emails: await translate("Email Addresses"),
          status: await translate("Status")
        },
        placeholders: {
          companyName: await translate("Enter company name"),
          clientName: await translate("Enter client name"),
          address: await translate("Enter company address"),
          iban: await translate("Enter company IBAN"),
          vatNumber: await translate("Enter company VAT number"),
          email: await translate("Add email address")
        },
        status: {
          active: await translate("Active"),
          inactive: await translate("Inactive")
        },
        buttons: {
          create: await translate("Create Client"),
          update: await translate("Update Client")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  const statusOptions = [
    { label: translations.status.active, value: "active" },
    { label: translations.status.inactive, value: "inactive" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={form.control} name="client_company_name" label={translations.fields.companyName} placeholder={translations.placeholders.companyName} />
        <FormInput control={form.control} name="client_name" label={translations.fields.clientName} placeholder={translations.placeholders.clientName} />
        <FormInput control={form.control} name="client_company_address" label={translations.fields.address} placeholder={translations.placeholders.address} />
        <FormInput control={form.control} name="client_company_iban" label={translations.fields.iban} placeholder={translations.placeholders.iban} />
        <FormInput control={form.control} name="client_company_vat_number" label={translations.fields.vatNumber} placeholder={translations.placeholders.vatNumber} />
        <FormEmailList control={form.control} name="client_emails" label={translations.fields.emails} placeholder={translations.placeholders.email} />
        <FormSelect control={form.control} name="status" label={translations.fields.status} options={statusOptions} />
        <Button type="submit" className="w-full">
          {defaultValues ? translations.buttons.update : translations.buttons.create}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
