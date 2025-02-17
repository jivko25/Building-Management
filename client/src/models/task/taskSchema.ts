//client\src\models\task\taskSchema.ts
import { z } from "zod";

export const baseTaskSchema = z.object({
  // Задължителни полета
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters long." })
    .max(50, { message: "Project name cannot exceed 50 characters." }),
  artisans: z
    .string()
    .array()
    .min(1, { message: "Please select at least one artisan." }),
  activity: z
    .string()
    .min(1, { message: "Please select activity." }),
  measure: z
    .string()
    .min(1, { message: "Please select measure." }),
  status: z.enum(["active", "inactive"], {
    message: "Please, select a status."
  }),
  
  // Незадължителни полета
  total_price: z.coerce.number().nullable().optional(),
  total_work_in_selected_measure: z.coerce.number().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  note: z.string().max(100).nullable().optional(),
});

export const taskSchema = baseTaskSchema.refine(
  data => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
  },
  {
    message: "End date cannot be earlier than start date.",
    path: ["end_date"]
  }
);

export const editTaskSchema = taskSchema;

export const taskDefaults = {
  name: "",
  total_price: null,
  total_work_in_selected_measure: null,
  artisans: [],
  activity: "",
  measure: "",
  start_date: null,
  end_date: null,
  note: "",
  status: "active" as const
};

export type TaskSchema = z.infer<typeof taskSchema>;
export type EditTaskSchema = z.infer<typeof editTaskSchema>;
