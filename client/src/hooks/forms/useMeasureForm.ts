import {
    measureDefaults,
    measureSchema,
    MeasureSchema,
} from '@/models/measure/measureSchema';
import { useDynamicForm } from './dynamicForm/useDynamicForm';

export const useMeasureFormHooks = () => {
    const { useCreateForm, useEditForm } = useDynamicForm<MeasureSchema>(
        measureSchema,
        measureDefaults
    );

    return {
        useCreateMeasureForm: useCreateForm,
        useEditMeasureForm: useEditForm,
    };
};
