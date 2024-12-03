import {
    workItemDefaults,
    workItemSchema,
    WorkItemSchema,
} from '@/models/workItem/workItemSchema';
import { useDynamicForm } from './dynamicForm/useDynamicForm';

export const useWorkItemFormHooks = () => {
    const { useCreateForm, useEditForm } = useDynamicForm<WorkItemSchema>(
        workItemSchema as any,
        workItemDefaults
    );

    return {
        useCreateWorkItemForm: useCreateForm,
        useEditWorkItemForm: useEditForm,
    };
};
