import { z } from "zod";
import { Client } from "@/types/client-types/clientTypes";
import { useTranslation } from "react-i18next";

export const clientSchema = z.object({
  client_company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters"
  }),
  client_name: z.string().min(2, {
    message: "Client name must be at least 2 characters"
  }),
  client_company_address: z.string().min(5, {
    message: "Address must be at least 5 characters"
  }),
  client_company_iban: z.string().min(5, {
    message: "IBAN must be at least 5 characters"
  }),
  client_emails: z.array(
    z.string().email({
      message: "Invalid email format"
    })
  ),
  status: z.enum(["active", "inactive"], {
    message: "Please select status"
  }),
  client_company_vat_number: z.string().min(5, {
    message: "VAT number must be at least 5 characters"
  }),
  invoice_language_id: z.union([z.number(), z.string().transform(val => Number(val))], {
    required_error: "Please select a language"
  })
});

export const clientDefaultValues: Client = {
  client_company_name: "",
  client_name: "",
  client_company_address: "",
  client_company_iban: "",
  client_emails: [],
  status: "active",
  client_company_vat_number: "",
  invoice_language_id: 1
};

export type ClientSchema = z.infer<typeof clientSchema>;
