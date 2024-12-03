import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import RoleSelector from '@/components/common/FormElements/FormRoleSelector';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import { Lock, User as UserIcon } from 'lucide-react';
import { useUserFormHooks } from '@/hooks/forms/useUserForm';
import { UserSchema } from '@/models/user/userSchema';
import { useCachedData } from '@/hooks/useQueryHook';
import { User } from '@/types/user-types/userTypes';
import { findItemById } from '@/utils/helpers/findItemById';
import { Separator } from '@/components/ui/separator';
import useSearchParamsHook from '@/hooks/useSearchParamsHook';
import { PaginatedDataResponse } from '@/types/query-data-types/paginatedDataTypes';

type EditUserFormProps = {
    handleSubmit: (userData: UserSchema) => void;
    userId: string;
    isPending: boolean;
};

const EditUserForm = ({
    handleSubmit,
    isPending,
    userId,
}: EditUserFormProps) => {
    const { itemsLimit, page, searchParam } = useSearchParamsHook();

    const user = useCachedData<User>({
        queryKey: ['users', page, itemsLimit, searchParam],
        selectFn: (data) =>
            findItemById<User>(
                data as PaginatedDataResponse<User>,
                userId,
                (measure) => measure.id as string
            ),
    });

    const { useEditUserForm } = useUserFormHooks();

    const form = useEditUserForm(user as Partial<User>);

    return (
        <FormProvider {...form}>
            <form id='form-edit' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Name, Surname'
                        name='name_and_family'
                        className='pl-10'
                        Icon={UserIcon}
                    />
                    <FormFieldInput
                        type='text'
                        label='Username'
                        name='username'
                        className='pl-10'
                        Icon={UserIcon}
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
                    <RoleSelector
                        label='Role'
                        name='role'
                        placeholder='Role'
                        defaultVal={user && user.role}
                    />
                    <StatusSelector
                        label='Status'
                        name='status'
                        defaultVal={user && user.status}
                    />
                </div>
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='form-edit'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default EditUserForm;
