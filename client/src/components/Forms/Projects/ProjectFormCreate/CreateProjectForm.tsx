import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import CompanySelector from '@/components/common/FormElements/FormCompanySelector';
import FormDatePicker from '@/components/common/FormElements/FormDatePicker';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import { Separator } from '@/components/ui/separator';
import { useProjectFormHook } from '@/hooks/forms/useProjectForm';
import { ProjectSchema } from '@/models/project/projectSchema';
import { ClipboardList, Mail, MapPin } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

type CreateProjectFormProps = {
    handleSubmit: (projectData: ProjectSchema) => void;
    isPending: boolean;
};

const CreateProjectForm = ({
    handleSubmit,
    isPending,
}: CreateProjectFormProps) => {
    const { useCreateProjectForm } = useProjectFormHook();
    const form = useCreateProjectForm();

    return (
        <FormProvider {...form}>
            <form id='project-form' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Project name'
                        name='name'
                        className='pl-10'
                        Icon={ClipboardList}
                    />
                    <FormFieldInput
                        type='email'
                        label='Project email'
                        name='email'
                        className='pl-10'
                        Icon={Mail}
                    />
                    <FormFieldInput
                        type='text'
                        label='Project address'
                        name='address'
                        className='pl-10'
                        Icon={MapPin}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 gap-2 '>
                    <StatusSelector
                        label='Status'
                        name='status'
                        defaultVal='active'
                    />
                    <CompanySelector
                        label='Select company'
                        name='company_name'
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 content-around gap-2'>
                    <FormDatePicker
                        name='start_date'
                        label='Select a start date'
                    />
                    <FormDatePicker
                        name='end_date'
                        label='Select an end date'
                    />
                </div>
                <Separator className='mt-2 mb-2' />
                <FormTextareaInput
                    name='note'
                    label='Project note'
                    placeholder='Project notes...'
                    type='text'
                />
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='project-form'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default CreateProjectForm;
