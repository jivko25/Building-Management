import { UserSchema } from '@/models/user/userSchema';
import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import RoleSelector from '@/components/common/FormElements/FormRoleSelector';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import { Lock, User } from 'lucide-react';
import { useUserFormHooks } from '@/hooks/forms/useUserForm';
import { Separator } from '@/components/ui/separator';

type CreateUserFormProps = {
    handleSubmit: (userData: UserSchema) => void;
    isPending: boolean;
};

const CreateUserForm = ({ handleSubmit, isPending }: CreateUserFormProps) => {
    const { useCreateUserForm } = useUserFormHooks();
    const form = useCreateUserForm();

    return (
        <FormProvider {...form}>
            <form id='user-form' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Name, Surname'
                        name='name_and_family'
                        className='pl-10'
                        Icon={User}
                    />
                    <FormFieldInput
                        type='text'
                        label='Username'
                        name='username'
                        className='pl-10'
                        Icon={User}
                    />
                    <FormFieldInput
                        type='password'
                        label='Password'
                        name='password'
                        className='pl-10'
                        Icon={Lock}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2'>
                    <RoleSelector label='Role' name='role' placeholder='user' />
                    <StatusSelector
                        label='Status'
                        name='status'
                        placeholder='active'
                    />
                </div>
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='user-form'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default CreateUserForm;
