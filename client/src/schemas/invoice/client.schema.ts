import * as z from "zod";

export const createClientInvoiceSchema = z.object({
  company_id: z.number().min(1, "Company is required"),
  client_company_id: z.number().min(1, "Client company is required"),
  due_date_weeks: z.number().min(0, "Due date weeks must be 0 or greater"),
  selected_projects: z.array(z.number()).optional(),
  selected_work_items: z.array(z.number()).optional()
});

export type CreateClientInvoiceSchema = z.infer<typeof createClientInvoiceSchema>;
