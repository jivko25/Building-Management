import { useParams } from 'react-router-dom';
import UserWorkItemCreateForm from './UserWorkItemCreateForm';
import useDialogState from '@/hooks/useDialogState';
import { useMutationHook } from '@/hooks/useMutationHook';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import {
    workItemSchema,
    WorkItemSchema,
} from '@/models/workItem/workItemSchema';
import DialogModal from '@/components/common/DialogElements/DialogModal';

const UserWorkItemCreate = () => {
    const { taskId } = useParams();

    const { isOpen, setIsOpen } = useDialogState();

    const { useCreateNewEntity } = useMutationHook();

    const { mutate, isPending } = useCreateNewEntity<WorkItemSchema>({
        URL: `/my-projects/${taskId}/task/create`,
        queryKey: ['artisanTasks', taskId],
        successToast: 'Work item created successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, workItemSchema);

    return (
        <DialogModal
            Component={UserWorkItemCreateForm}
            CreateButtonModal
            createButtonTitle='Add work item'
            props={{ handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title='New work item'
        />
    );
};

export default UserWorkItemCreate;
