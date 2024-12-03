import { userSchema, UserSchema } from '@/models/user/userSchema';
import CreateUserForm from './CreateUserForm';
import useDialogState from '@/hooks/useDialogState';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import { useMutationHook } from '@/hooks/useMutationHook';
import DialogModal from '@/components/common/DialogElements/DialogModal';

const CreateUser = () => {
    const { isOpen, setIsOpen } = useDialogState();

    const { useCreateNewEntity } = useMutationHook();

    const { mutate, isPending } = useCreateNewEntity<UserSchema>({
        URL: '/users/create',
        queryKey: ['users'],
        successToast: 'User created successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, userSchema);

    return (
        <DialogModal
            Component={CreateUserForm}
            props={{ handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            CreateButtonModal
            createButtonTitle='Add new user'
            title='New user'
        />
    );
};

export default CreateUser;
