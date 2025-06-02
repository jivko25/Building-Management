//client\src\models\company\companySchema.ts
import { Company } from "@/types/company-types/companyTypes";
import { z } from "zod";

export const phoneValidator = /^([0-9|\\+])[0-9\\s.\\/-]{6,20}$/;

export const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
export const vatRegex = /^[A-Z0-9]{7,15}$/; // букви и цифри, 7-15 символа
export const regNumRegex = /^[A-Z0-9]{6,11}$/; // букви и цифри, 6-11 символа


export const companySchema = z.object({
  name: z.string().min(3, { message: "Company name must be at least 3 characters" }).max(50, { message: "Company name cannot exceed 50 characters." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }).max(50, { message: "Location cannot exceed 50 characters." }),
  address: z.string().min(3, { message: "Address must be at least 3 characters" }).max(50, { message: "Address cannot exceed 50 characters." }),
  mol: z.string().min(3, { message: "MOL name must be at least 3 characters." }).max(55, { message: "MOL cannot exceed 55 characters." }),
  email: z.string().min(5, { message: "Email must be at least 5 characters." }).max(50, { message: "Email cannot exceed 50 characters." }).email("Please, enter a valid email."),
  phone: z.string().regex(phoneValidator, { message: "Invalid phone format" }),
  status: z.enum(["active", "inactive"], { message: "Please, select status." }),
  logo_url: z.any(),
  vat_number: z
    .string()
    .min(7, { message: "VAT number must be at least 7 characters." })
    .max(15, { message: "VAT number cannot exceed 15 characters." })
    .regex(vatRegex, { message: "VAT number must contain only letters and digits, no spaces or symbols." }),

  registration_number: z
    .string()
    .min(6, { message: "Registration number must be at least 6 characters." })
    .max(11, { message: "Registration number cannot exceed 11 characters." })
    .regex(regNumRegex, { message: "Registration number must contain only letters and digits, no spaces or symbols." }), 
    iban: z
      .string()
      .min(15, { message: "IBAN must be at least 15 characters." }) // минималната дължина варира, но най-често е 15
      .max(34, { message: "IBAN cannot exceed 34 characters." })
      .regex(ibanRegex, { message: "Invalid IBAN format." }),
});

export const companyDefaults: Company = {
  name: "",
  registration_number: "",
  location: "",
  address: "",
  mol: "",
  phone: "",
  email: "",
  status: "active",
  logo_url: "",
  vat_number: "",
  iban: ""
};

export type CompanySchema = z.infer<typeof companySchema>;
