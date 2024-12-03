import { taskDefaults, taskSchema, TaskSchema } from '@/models/task/taskSchema';
import { useDynamicForm } from './dynamicForm/useDynamicForm';

export const useTaskFormHooks = () => {
    const { useCreateForm, useEditForm } = useDynamicForm<TaskSchema>(
        taskSchema as any,
        taskDefaults
    );

    return {
        useCreateTaskForm: useCreateForm,
        useEditTaskForm: useEditForm,
    };
};
