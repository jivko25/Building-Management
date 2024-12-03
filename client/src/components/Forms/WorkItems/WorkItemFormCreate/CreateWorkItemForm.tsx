import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import FormDatePicker from '@/components/common/FormElements/FormDatePicker';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import TaskItemStatusSelector from '@/components/common/FormElements/TaskItemStatusSelector';
import { Separator } from '@/components/ui/separator';
import { useWorkItemFormHooks } from '@/hooks/forms/useWorkItemForm';
import { WorkItemSchema } from '@/models/workItem/workItemSchema';
import { ClipboardList, Hammer } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

type CreateWorkItemFormProps = {
    handleSubmit: (workItemData: WorkItemSchema) => void;
    isPending: boolean;
};

const CreateWorkItemForm = ({
    handleSubmit,
    isPending,
}: CreateWorkItemFormProps) => {
    const { useCreateWorkItemForm } = useWorkItemFormHooks();

    const form = useCreateWorkItemForm();

    return (
        <FormProvider {...form}>
            <form id='task-item' onSubmit={form.handleSubmit(handleSubmit)}>
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
                    />
                    <FormDatePicker
                        name='end_date'
                        label='Select an end date'
                    />
                </div>
                <Separator className='mt-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1'>
                    <TaskItemStatusSelector
                        name='status'
                        label='Select status'
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
                    className='mt-6'
                    formName='task-item'
                    label='Submit'
                />
            </form>
        </FormProvider>
    );
};

export default CreateWorkItemForm;
