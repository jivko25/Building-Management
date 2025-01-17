//client\src\models\company\companySchema.ts
import { Company } from "@/types/company-types/companyTypes";
import { z } from "zod";

export const phoneValidator = /^([0-9|\\+])[0-9\\s.\\/-]{6,20}$/;

export const companySchema = z.object({
  name: z.string().min(3, { message: "Company name must be at least 3 characters" }).max(50, { message: "Company name cannot exceed 50 characters." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }).max(50, { message: "Location cannot exceed 50 characters." }),
  registration_number: z.string().min(6, { message: "Registration number must be at least 6 characters." }).max(11, { message: "Registration number cannot exceed 11 characters." }),
  address: z.string().min(3, { message: "Address must be at least 3 characters" }).max(50, { message: "Address cannot exceed 50 characters." }),
  mol: z.string().min(3, { message: "MOL name must be at least 3 characters." }).max(55, { message: "MOL cannot exceed 55 characters." }),
  email: z.string().min(5, { message: "Email must be at least 5 characters." }).max(50, { message: "Email cannot exceed 50 characters." }).email("Please, enter a valid email."),
  phone: z.string().regex(phoneValidator, { message: "Invalid phone format" }),
  dds: z.enum(["yes", "no"], { message: "DDS is required." }),
  status: z.enum(["active", "inactive"], { message: "Please, select status." }),
  logo_url: z.any(),
  vat_number: z.string().min(3, { message: "VAT number must be at least 3 characters." }).max(50, { message: "VAT number cannot exceed 50 characters." }),
  iban: z.string().min(3, { message: "IBAN must be at least 3 characters." }).max(50, { message: "IBAN cannot exceed 50 characters." })
});

export const companyDefaults: Company = {
  name: "",
  registration_number: "",
  location: "",
  address: "",
  mol: "",
  phone: "",
  email: "",
  dds: "no",
  status: "active",
  logo_url: "",
  vat_number: "",
  iban: ""
};

export type CompanySchema = z.infer<typeof companySchema>;
