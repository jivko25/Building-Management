import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import { Activity as ActivityIcon } from 'lucide-react';
import { useActivityFormHooks } from '@/hooks/forms/useActivityForm';
import { useCachedData } from '@/hooks/useQueryHook';
import { Activity } from '@/types/activity-types/activityTypes';
import { ActivitySchema } from '@/models/activity/activitySchema';
import useSearchParamsHook from '@/hooks/useSearchParamsHook';
import { findItemById } from '@/utils/helpers/findItemById';
import { PaginatedDataResponse } from '@/types/query-data-types/paginatedDataTypes';
import { Separator } from '@/components/ui/separator';

type EditActivityFormProps = {
    handleSubmit: (activityData: ActivitySchema) => void;
    activityId: string;
    isPending: boolean;
};

const EditActivityForm = ({
    activityId,
    handleSubmit,
    isPending,
}: EditActivityFormProps) => {
    const { itemsLimit, page, searchParam } = useSearchParamsHook();

    const activity = useCachedData<Activity>({
        queryKey: ['activities', page, itemsLimit, searchParam],
        selectFn: (data) =>
            findItemById<Activity>(
                data as PaginatedDataResponse<Activity>,
                activityId,
                (activity) => activity.id as string
            ),
    });

    const { useEditActivityForm } = useActivityFormHooks();

    const form = useEditActivityForm(activity as Partial<Activity>);

    return (
        <FormProvider {...form}>
            <form id='form-edit' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Activity name'
                        name='name'
                        className='pl-10'
                        Icon={ActivityIcon}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2'>
                    <StatusSelector
                        label='Status'
                        name='status'
                        placeholder='active'
                        defaultVal={activity && activity.status}
                    />
                </div>
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit changes'
                    formName='form-edit'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default EditActivityForm;
