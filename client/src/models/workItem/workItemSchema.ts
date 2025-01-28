import { format } from "date-fns";
import { z } from "zod";

export const workItemSchema = z
  .object({
    artisan: z.string().optional(),
    default_pricing: z.string().optional(),
    quantity: z
      .number()
      .positive({
        message: "Quantity must be greater than 0."
      })
      .or(
        z
          .string()
          .min(1, { message: "Quantity is required." })
          .transform(val => parseFloat(val))
      ),
    hours: z
      .union([
        z.number().positive({ message: "Hours must be greater than 0." }),
        z
          .string()
          .trim()
          .refine(val => val === "" || !isNaN(parseFloat(val)), {
            message: "Hours must be a valid number or empty."
          })
          .transform(val => (val === "" ? undefined : parseFloat(val)))
      ])
      .optional(),
    start_date: z.coerce
      .date()
      .transform(date => format(date, "yyyy-MM-dd"))
      .optional(),
    end_date: z.coerce
      .date()
      .transform(date => format(date, "yyyy-MM-dd"))
      .optional(),
    note: z
      .string()
      .max(100, {
        message: "Note cannot exceed 100 characters."
      })
      .optional(),
    status: z.enum(["done", "in_progress"], {
      message: "Please select a status."
    }),
    project_id: z
      .string()
      .min(1, { message: "Error getting project id" })
      .or(z.number().positive({ message: "Project ID must be a positive number" }))
  })
  .refine(data => !data.end_date || !data.start_date || data.end_date >= data.start_date, {
    message: "End date cannot be earlier than start date.",
    path: ["end_date"]
  });

export const workItemDefaults = {
  artisan: "",
  default_pricing: "",
  quantity: "",
  hours: undefined,
  start_date: "",
  end_date: "",
  note: "",
  status: undefined,
  project_id: ""
};

export type WorkItemSchema = z.infer<typeof workItemSchema>;
