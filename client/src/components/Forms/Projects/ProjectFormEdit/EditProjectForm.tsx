import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import CompanySelector from '@/components/common/FormElements/FormCompanySelector';
import FormDatePicker from '@/components/common/FormElements/FormDatePicker';
import { ClipboardList, Mail, MapPin } from 'lucide-react';
import { useProjectFormHook } from '@/hooks/forms/useProjectForm';
import { Project } from '@/types/project-types/projectTypes';
import { ProjectSchema } from '@/models/project/projectSchema';
import { useCachedData } from '@/hooks/useQueryHook';
import { findItemById } from '@/utils/helpers/findItemById';
import { PaginatedDataResponse } from '@/types/query-data-types/paginatedDataTypes';
import { Separator } from '@/components/ui/separator';

type EditProjectFormProps = {
    handleSubmit: (projectData: ProjectSchema) => void;
    isPending: boolean;
    projectId: string;
};

const EditProjectForm = ({
    handleSubmit,
    isPending,
    projectId,
}: EditProjectFormProps) => {
    const project = useCachedData<Project>({
        queryKey: ['projects'],
        selectFn: (data) =>
            findItemById<Project>(
                data as PaginatedDataResponse<Project>,
                projectId,
                (project) => project.id as string
            ),
    });

    const { useEditProjectForm } = useProjectFormHook();

    const form = useEditProjectForm(project as Partial<Project>);

    return (
        <FormProvider {...form}>
            <form id='edit-project' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Project name'
                        name='name'
                        className='pl-10'
                        Icon={ClipboardList}
                    />
                    <FormFieldInput
                        type='text'
                        label='Project address'
                        name='address'
                        className='pl-10'
                        Icon={MapPin}
                    />
                    <FormFieldInput
                        type='email'
                        label='Project email'
                        name='email'
                        className='pl-10'
                        Icon={Mail}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4'>
                    <StatusSelector
                        label='Status'
                        name='status'
                        defaultVal={project && project.status}
                    />
                    <CompanySelector
                        label='Select company'
                        name='company_name'
                        defaultVal={project && project.company_name}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5'>
                    <FormDatePicker
                        name='start_date'
                        label='Select new start date'
                        selected={new Date(`${project && project.start_date}`)
                            .toLocaleDateString()
                            .slice(0, 10)}
                    />
                    <FormDatePicker
                        name='end_date'
                        label='Select new end date'
                        selected={new Date(`${project && project.end_date}`)
                            .toLocaleDateString()
                            .slice(0, 10)}
                    />
                </div>
                <Separator className='my-2' />
                <FormTextareaInput
                    placeholder='Project notes...'
                    className='resize-none'
                    name='note'
                    type='text'
                    label='Project note'
                />
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Save changes'
                    formName='edit-project'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default EditProjectForm;
