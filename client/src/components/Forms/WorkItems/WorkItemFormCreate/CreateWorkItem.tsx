import { useParams } from 'react-router-dom';
import CreateWorkItemForm from './CreateWorkItemForm';
import useDialogState from '@/hooks/useDialogState';
import { useMutationHook } from '@/hooks/useMutationHook';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import {
    workItemSchema,
    WorkItemSchema,
} from '@/models/workItem/workItemSchema';
import DialogModal from '@/components/common/DialogElements/DialogModal';

const CreateWorkItem = () => {
    const { id, taskId } = useParams();
    const { isOpen, setIsOpen } = useDialogState();

    const { useCreateNewEntity } = useMutationHook();

    const { mutate, isPending } = useCreateNewEntity<WorkItemSchema>({
        URL: `/projects/${id}/tasks/${taskId}/workItems/create`,
        queryKey: ['projects', id, 'tasks', taskId, 'work-items'],
        successToast: 'Work item created successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, workItemSchema);

    return (
        <DialogModal
            Component={CreateWorkItemForm}
            CreateButtonModal
            props={{ handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            createButtonTitle='Add new work item'
            title='New work item'
        />
    );
};

export default CreateWorkItem;
