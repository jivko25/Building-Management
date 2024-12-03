import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import FormDatePicker from '@/components/common/FormElements/FormDatePicker';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import TaskItemStatusSelector from '@/components/common/FormElements/TaskItemStatusSelector';
import { Separator } from '@/components/ui/separator';
import { useWorkItemFormHooks } from '@/hooks/forms/useWorkItemForm';
import { useCachedData } from '@/hooks/useQueryHook';
import { WorkItemSchema } from '@/models/workItem/workItemSchema';
import { WorkItem } from '@/types/work-item-types/workItem';
import { findItemById } from '@/utils/helpers/findItemById';
import { ClipboardList, Hammer } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

type EditWorkItemFormProps = {
    handleSubmit: (data: WorkItemSchema) => void;
    isPending: boolean;
    id?: string;
    taskId?: string;
    workItemId: string;
};

const EditWorkItemForm = ({
    handleSubmit,
    isPending,
    id,
    taskId,
    workItemId,
}: EditWorkItemFormProps) => {
    const workItem = useCachedData<WorkItem>({
        queryKey: ['projects', id, 'tasks', taskId, 'work-items'],
        selectFn: (data) => {
            if ('pages' in data) {
                for (const page of data.pages) {
                    const item = findItemById<WorkItem>(
                        page,
                        workItemId,
                        (item) => item.id as string
                    );
                    if (item) {
                        return item;
                    }
                }
            }
            return undefined;
        },
    });

    const { useEditWorkItemForm } = useWorkItemFormHooks();

    const form = useEditWorkItemForm(workItem as Partial<WorkItem>);

    return (
        <FormProvider {...form}>
            <form
                id='work-item-edit'
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        name='name'
                        label='Work item name'
                        type='text'
                        className='pl-10'
                        Icon={ClipboardList}
                    />
                    <FormFieldInput
                        name='finished_work'
                        label='Finished work'
                        type='text'
                        className='pl-10'
                        Icon={Hammer}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1'>
                    <FormDatePicker
                        name='start_date'
                        label='Select a start date'
                        selected={new Date(`${workItem && workItem.start_date}`)
                            .toLocaleDateString()
                            .slice(0, 10)}
                    />
                    <FormDatePicker
                        name='end_date'
                        label='Select an end date'
                        selected={new Date(`${workItem && workItem.end_date}`)
                            .toLocaleDateString()
                            .slice(0, 10)}
                    />
                </div>
                <Separator className='mt-2 ' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1'>
                    <TaskItemStatusSelector
                        name='status'
                        label='Select status'
                        defaultVal={workItem?.status}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <FormTextareaInput
                    name='note'
                    label='Work item note'
                    type='text'
                    placeholder='Work item notes...'
                />
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit changes'
                    formName='work-item-edit'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default EditWorkItemForm;
