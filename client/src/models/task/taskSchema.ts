//client\src\models\task\taskSchema.ts
import { format } from "date-fns";
import { z } from "zod";

export const taskSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Project name must be at least 3 characters long."
      })
      .max(50, {
        message: "Project name cannot exceed 50 characters."
      }),
    price_per_measure: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    total_price: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    total_work_in_selected_measure: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    artisans: z
      .string()
      .array()
      .optional(),
    activity: z
      .string()
      .min(1, {
        message: "Please select activity."
      })
      .optional(),
    measure: z
      .string()
      .min(1, {
        message: "Please select measure."
      })
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
      .min(0)
      .max(100, {
        message: "Note cannot exceed 100 characters."
      })
      .optional(),
    status: z.enum(["active", "inactive"], {
      message: "Please, select a status."
    })
  })
  .refine(data => data.end_date! >= data.start_date!, {
    message: "End date cannot be earlier than start date.",
    path: ["end_date"]
  });

export const editTaskSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Project name must be at least 3 characters long."
      })
      .max(50, {
        message: "Project name cannot exceed 50 characters."
      }),
    price_per_measure: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    total_price: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    total_work_in_selected_measure: z.coerce.number().gte(1, {
      message: "Please enter a valid price."
    }),
    artisans: z.string().array().optional(),
    activity: z
      .string()

      .optional(),
    measure: z.string().optional(),
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
      .min(0)
      .max(100, {
        message: "Note cannot exceed 100 characters."
      })
      .optional(),
    status: z.enum(["active", "inactive"], {
      message: "Please, select a status."
    })
  })
  .refine(data => data.end_date! >= data.start_date!, {
    message: "End date cannot be earlier than start date.",
    path: ["end_date"]
  });

export const taskDefaults = {
  name: "",
  price_per_measure: 0,
  total_price: 0,
  total_work_in_selected_measure: 0,
  artisans: [],
  activity: "",
  measure: "",
  start_date: "",
  end_date: "",
  note: "",
  status: undefined
};

export type TaskSchema = z.infer<typeof taskSchema>;
export type EditTaskSchema = z.infer<typeof editTaskSchema>;
