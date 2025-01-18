//client\src\models\activity\activitySchema.ts
import { Activity } from "@/types/activity-types/activityTypes";
import { z } from "zod";
import i18next from "i18next";

const t = i18next.t;

export const activitySchema = z.object({
  name: z
    .string()
    .min(3, {
      message: t("Activity name must be at least 3 characters.")
    })
    .max(50, {
      message: t("Activity name cannot exceed 50 characters.")
    }),
  status: z.enum(["active", "inactive"], {
    message: t("Please select status.")
  })
});

export const activityDefaults: Activity = {
  name: "",
  status: "active" as const
};

export type ActivitySchema = z.infer<typeof activitySchema>;
