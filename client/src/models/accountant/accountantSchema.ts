//client\src\models\accountant\accountantSchema.ts
import { Accountant } from "@/types/accountant-types/accountantTypes";
import { z } from "zod";
import { phoneValidator } from "../company/companySchema";

export const accountantSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "Artisan name must be at least 3 characters."
        })
        .max(50),
    note: z
        .string()
        .min(0)
        .max(100, {
            message: "Note cannot exceed 100 characters."
        })
        .optional(),
    number: z.string().regex(phoneValidator, { message: "Invalid phone format" }),
    email: z
        .string()
        .min(5, {
            message: "Email must be at least 5 characters long."
        })
        .max(50, {
            message: "Email cannot exceed 50 characters."
        })
        .email("Please, enter a valid email."),
    company: z.string().min(1, {
        message: "Please select company"
    }),
    accountantName: z.string().min(1, {
        message: "Please select user"
    }),
    status: z.enum(["active", "inactive"], {
        message: "Please, select a status"
    }),
    measure: z.string().min(1, {
        message: "Please select measure"
    }),
});

export const accountantDefaults: Accountant = {
    name: "",
    note: "",
    email: "",
    number: "",
    company: "",
    accountantName: "",
    status: "active",
    measure: "",
};

export type AccountantSchema = z.infer<typeof accountantSchema>;

