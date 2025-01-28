//client\src\models\artisan\artisanSchema.ts
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { z } from "zod";
import { phoneValidator } from "../company/companySchema";
import i18next from "i18next";

const t = i18next.t;


export const artisanSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: t("Artisan name must be at least 3 characters.")
    })
    .max(50),
  note: z
    .string()
    .min(0)
    .max(100, {
      message: t("Note cannot exceed 100 characters.")
    })
    .optional(),
  number: z.string().regex(phoneValidator, { message: t("Invalid phone format") }),
  email: z
    .string()
    .min(5, {
      message: t("Email must be at least 5 characters long.")
    })
    .max(50, {
      message: t("Email cannot exceed 50 characters.")
    })
    .email(t("Please, enter a valid email.")),
  company: z.string().min(1, {
    message: t("Please select company")
  }),
  artisanName: z.string().min(1, {
    message: t("Please select user")
  }),
  status: z.enum(["active", "inactive"], {
    message: t("Please, select a status") 
  })
});

export const artisanDefaults: Artisan = {
  id: "",
  name: "",
  note: "",
  email: "",
  number: "",
  company: "",
  artisanName: "",
  status: "active"
};

export type ArtisanSchema = z.infer<typeof artisanSchema>;
