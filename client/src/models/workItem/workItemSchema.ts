//client\src\models\workItem\workItemSchema.ts
import { format } from "date-fns";
import { z } from "zod";

export const workItemSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Work item name must be at least 3 characters long.",
      })
      .max(50, {
        message: "Work item name cannot exceed 50 characters.",
      }),
    finished_work: z
      .string()
      .min(1, {
        message: "Please enter finished work.",
      }),
    artisan: z.string().optional(),
    default_pricing: z
      .string()
      .optional(),
    quantity: z
      .number()
      .positive({
        message: "Quantity must be greater than 0.",
      })
      .or(z.string().min(1, { message: "Quantity is required." }).transform((val) => parseFloat(val))),
    start_date: z.coerce
      .date()
      .transform((date) => format(date, "yyyy-MM-dd"))
      .optional(),
    end_date: z.coerce
      .date()
      .transform((date) => format(date, "yyyy-MM-dd"))
      .optional(),
    note: z
      .string()
      .max(100, {
        message: "Note cannot exceed 100 characters.",
      })
      .optional(),
    status: z.enum(["done", "in_progress"], {
      message: "Please select a status.",
    }),
  })
  .refine(
    (data) => !data.end_date || !data.start_date || data.end_date >= data.start_date,
    {
      message: "End date cannot be earlier than start date.",
      path: ["end_date"],
    }
  );

export const workItemDefaults = {
  name: "",
  finished_work: "",
  artisan: "",
  default_pricing: "",
  quantity: "",
  start_date: "",
  end_date: "",
  note: "",
  status: undefined,
};

export type WorkItemSchema = z.infer<typeof workItemSchema>;
