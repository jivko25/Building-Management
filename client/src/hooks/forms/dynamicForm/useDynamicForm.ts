//client\src\hooks\forms\dynamicForm\useDynamicForm.ts
import { ZodType } from "zod";
import { useCreateFormHooks } from "../useForm";
import { DefaultValues, FieldValues } from "react-hook-form";

export const useDynamicForm = <T extends FieldValues>(schema: ZodType<T>, defaultValues: DefaultValues<T>) => {
  return useCreateFormHooks<T>(schema, defaultValues);
};
