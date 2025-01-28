//client\src\models\project\projectSchema.ts
import { Project } from "@/types/project-types/projectTypes";
import { format } from "date-fns";
import { z } from "zod";

export const projectSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Project name must be at least 3 characters long."
      })
      .max(50, {
        message: "Project name cannot exceed 50 characters."
      }),
    company_name: z.string().min(1, {
      message: "Please select a company."
    }),
    address: z.string().min(5, {
      message: "Project address must be at least 5 characters."
    }),
    location: z.string().min(5, {
      message: "Project location must be at least 5 characters."
    }),
    email: z
      .string()
      .min(5, {
        message: "Email must be at least 5 characters long."
      })
      .max(50, {
        message: "Email cannot exceed 50 characters."
      })
      .email("Please, enter a valid email."),
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
    }),
    client_id: z.number({
      required_error: "Please select a client."
    })
  })
  .refine(data => data.end_date! >= data.start_date!, {
    message: "End date cannot be earlier than start date.",
    path: ["end_date"]
  });

export const projectDefaults: Project = {
  name: "",
  company_name: "",
  email: "",
  start_date: "",
  end_date: "",
  address: "",
  location: "",
  note: "",
  status: "active",
  client_id: 0
};

export type ProjectSchema = z.infer<typeof projectSchema>;
