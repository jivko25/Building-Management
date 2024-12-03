import { zodResolver } from '@hookform/resolvers/zod';
import {
    DefaultValues,
    FieldValues,
    useForm,
    UseFormProps,
} from 'react-hook-form';
import { ZodType } from 'zod';

export const useFormSchema = <T extends FieldValues>(
    schema: ZodType<T>,
    defaultValues: DefaultValues<T>,
    options: Omit<UseFormProps<T>, 'resolver' | 'defaultValues'> = {}
) => {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onChange',
        ...options,
    });

    return form;
};

export const useCreateFormHooks = <T extends FieldValues>(
    schema: ZodType<T>,
    defaultValues: DefaultValues<T>
) => {
    const useCreateForm = () => {
        return useFormSchema<T>(schema, defaultValues);
    };

    const useEditForm = (data: Partial<T>) => {
        return useFormSchema<T>(schema, {
            ...defaultValues,
            ...data,
        });
    };

    return {
        useCreateForm,
        useEditForm,
    };
};
