//client\src\models\activity\activitySchema.ts
import { Activity } from "@/types/activity-types/activityTypes";
import { z } from "zod";

export const activitySchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Activity name must be at least 3 characters."
    })
    .max(50),
  status: z.enum(["active", "inactive"], {
    message: "Please select status."
  })
});

export const activityDefaults: Activity = {
  name: "",
  status: "active"
};

export type ActivitySchema = z.infer<typeof activitySchema>;
