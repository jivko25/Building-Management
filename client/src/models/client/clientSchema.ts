import { z } from "zod";
import { Client } from "@/types/client-types/clientTypes";
import { ibanRegex, vatRegex } from "../company/companySchema";

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
  postal_code: z.string().min(4, {
    message: "Postal code must be at least 4 characters"
  }).max(10, {
    message: "Postal code cannot exceed 10 characters"
  }),
  client_company_iban: z
    .string()
    .min(15, { message: "IBAN must be at least 15 characters." }) // минималната дължина варира, но най-често е 15
    .max(34, { message: "IBAN cannot exceed 34 characters." })
    .regex(ibanRegex, { message: "Invalid IBAN format." }),
  client_emails: z.array(
    z.string().email({
      message: "Invalid email format"
    })
  ),
  status: z.enum(["active", "inactive"], {
    message: "Please select status"
  }),
  client_company_vat_number: z
  .string()
  .min(7, { message: "VAT number must be at least 7 characters." })
  .max(15, { message: "VAT number cannot exceed 15 characters." })
  .regex(vatRegex, { message: "VAT number must contain only letters and digits, no spaces or symbols." }),
  invoice_language_id: z.number({
    required_error: "Please select a language",
  }),
  due_date: z.number({
    required_error: "Please enter due date"
  }).min(1, {
    message: "Due date must be at least 1 week"
  }).max(52, {
    message: "Due date cannot exceed 52 weeks"
  }),
});

export const clientDefaultValues: Client = {
  client_company_name: "",
  client_name: "",
  client_company_address: "",
  postal_code: "",
  client_company_iban: "",
  client_emails: [],
  status: "active",
  client_company_vat_number: "",
  invoice_language_id: 1,
  due_date: 1
};

export type ClientSchema = z.infer<typeof clientSchema>;
