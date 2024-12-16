//client\src\models\measure\measureSchema.ts
import { Measure } from "@/types/measure-types/measureTypes";
import { z } from "zod";

export const measureSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Measure must be at least 1 characters."
    })
    .max(50, {
      message: "Measure cannot exceed 50 characters."
    })
});

export const measureDefaults: Measure = {
  name: ""
};

export type MeasureSchema = z.infer<typeof measureSchema>;
