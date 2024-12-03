import { editTaskSchema, TaskSchema } from '@/models/task/taskSchema';
import { useMutationHook } from '@/hooks/useMutationHook';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import EditTaskForm from './EditTaskForm';
import useDialogState from '@/hooks/useDialogState';
import DialogModal from '@/components/common/DialogElements/DialogModal';

type EditTaskFormProps = {
    id: string;
    taskId: string;
};

const EditTask = ({ id, taskId }: EditTaskFormProps) => {
    const { isOpen, setIsOpen } = useDialogState();

    const { useEditEntity } = useMutationHook();

    const { mutate, isPending } = useEditEntity<TaskSchema>({
        URL: `/projects/${id}/tasks/${taskId}/edit`,
        queryKey: ['projects', id, 'tasks'],
        successToast: 'Task updated successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, editTaskSchema);

    return (
        <DialogModal
            Component={EditTaskForm}
            props={{ handleSubmit, isPending, id, taskId }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title='Edit task'
        />
    );
};

export default EditTask;
