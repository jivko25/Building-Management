import useDialogState from '@/hooks/useDialogState';
import { useMutationHook } from '@/hooks/useMutationHook';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import EditWorkItemForm from './EditWorkItemForm';
import {
    workItemSchema,
    WorkItemSchema,
} from '@/models/workItem/workItemSchema';
import DialogModal from '@/components/common/DialogElements/DialogModal';
import { useParams } from 'react-router-dom';

type EditWorkItemProps = {
    workItemId: string;
};

const EditWorkItem = ({ workItemId }: EditWorkItemProps) => {
    const { id, taskId } = useParams();

    const { isOpen, setIsOpen } = useDialogState();

    const { useEditEntity } = useMutationHook();

    const { mutate, isPending } = useEditEntity<WorkItemSchema>({
        URL: `/projects/${id}/tasks/${taskId}/work-items/${workItemId}/edit`,
        queryKey: ['projects', id, 'tasks', taskId, 'work-items'],
        successToast: 'Work item updated successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, workItemSchema);

    return (
        <DialogModal
            Component={EditWorkItemForm}
            props={{ handleSubmit, isPending, id, taskId, workItemId }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title='Edit work item'
        />
    );
};

export default EditWorkItem;
