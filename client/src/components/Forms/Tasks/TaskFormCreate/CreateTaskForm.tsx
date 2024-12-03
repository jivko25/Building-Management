import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import FormDatePicker from '@/components/common/FormElements/FormDatePicker';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import { TaskSchema } from '@/models/task/taskSchema';
import ArtisanSelector from '@/components/common/FormElements/FormArtisanSelector';
import ActivitySelector from '@/components/common/FormElements/FormActivitySelector';
import MeasureSelector from '@/components/common/FormElements/FormMeasureSelector';
import { ClipboardList, DollarSign, Hammer } from 'lucide-react';
import { useTaskFormHooks } from '@/hooks/forms/useTaskForm';
import { Separator } from '@/components/ui/separator';

type CreateTaskFormProps = {
    handleSubmit: (taskData: TaskSchema) => void;
    isPending: boolean;
};

const CreateTaskForm = ({ handleSubmit, isPending }: CreateTaskFormProps) => {
    const { useCreateTaskForm } = useTaskFormHooks();
    const form = useCreateTaskForm();

    return (
        <FormProvider {...form}>
            <form id='task-form' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-2 md:grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Task name'
                        name='name'
                        className='pl-10'
                        Icon={ClipboardList}
                    />
                    <FormFieldInput
                        type='text'
                        label='Price per measure'
                        name='price_per_measure'
                        className='pl-10'
                        Icon={DollarSign}
                    />
                    <FormFieldInput
                        type='text'
                        label='Total work in measure'
                        name='total_work_in_selected_measure'
                        className='pl-10'
                        Icon={Hammer}
                    />
                    <FormFieldInput
                        type='text'
                        label='Total price'
                        name='total_price'
                        className='pl-10'
                        Icon={DollarSign}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4'>
                    <ArtisanSelector name='artisan' label='Select artisan' />
                    <ActivitySelector name='activity' label='Select activity' />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4'>
                    <StatusSelector label='Status' name='status' />
                    <MeasureSelector name='measure' label='Select measure' />
                </div>
                <Separator className='mt-4 mb-2' />

                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1.5'>
                    <FormDatePicker
                        name='start_date'
                        label='Select new start date'
                    />
                    <FormDatePicker
                        name='end_date'
                        label='Select new end date'
                    />
                </div>
                <Separator className='mt-2 mb-2' />
                <FormTextareaInput
                    name='note'
                    label='Task note'
                    placeholder='Task notes...'
                    type='text'
                />
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='task-form'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default CreateTaskForm;
