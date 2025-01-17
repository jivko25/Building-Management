import * as z from "zod";

export const createArtisanInvoiceSchema = z.object({
  company_id: z.number().min(1, "Company is required"),
  artisan_id: z.number().min(1, "Artisan is required"),
  due_date_weeks: z.number().min(0, "Due date weeks must be 0 or greater"),
  selected_work_items: z.array(z.number()).optional()
});

export type CreateArtisanInvoiceSchema = z.infer<typeof createArtisanInvoiceSchema>;
