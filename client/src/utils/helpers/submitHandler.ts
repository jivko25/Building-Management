import { UseMutateFunction } from '@tanstack/react-query'
import { z } from 'zod'

export const useSubmitHandler = <T extends z.ZodType>(
    mutate: UseMutateFunction<any, Error, z.infer<T>, unknown>,
    schema: T,
) => {
    const handleSubmit = (data: z.infer<T>) => {
        try {
            const validateData: z.TypeOf<T> = schema.parse(data);
            mutate(validateData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return `Validation error: ${error.errors}`
            } else {
                return `Unexpected error: ${error}`
            }
        }
    }
    return handleSubmit;
}