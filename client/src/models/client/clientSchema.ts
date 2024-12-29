import { z } from "zod";
import { Client } from "@/types/client-types/clientTypes";

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
  })
});

export const clientDefaultValues: Client = {
  client_company_name: "",
  client_name: "",
  client_company_address: "",
  client_company_iban: "",
  client_emails: [],
  status: "active"
};

export type ClientSchema = z.infer<typeof clientSchema>;
