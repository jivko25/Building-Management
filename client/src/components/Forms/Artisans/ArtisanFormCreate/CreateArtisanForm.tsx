import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import CompanySelector from '@/components/common/FormElements/FormCompanySelector';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import UsersSelector from '@/components/common/FormElements/FormUserSelector';
import { Separator } from '@/components/ui/separator';
import { useArtisanFormHooks } from '@/hooks/forms/useArtisanForm';
import { ArtisanSchema } from '@/models/artisan/artisanSchema';
import { Mail, Phone, User } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

type CreateArtisanFormProps = {
    handleSubmit: (artisanData: ArtisanSchema) => void;
    isPending: boolean;
};

const CreateArtisanForm = ({
    handleSubmit,
    isPending,
}: CreateArtisanFormProps) => {
    const { useCreateArtisanForm } = useArtisanFormHooks();

    const form = useCreateArtisanForm();

    return (
        <FormProvider {...form}>
            <form id='artisan-form' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Artisan name'
                        name='name'
                        className='pl-10'
                        Icon={User}
                    />
                    <FormFieldInput
                        type='text'
                        label='Artisan phone'
                        name='number'
                        className='pl-10'
                        Icon={Phone}
                    />
                    <FormFieldInput
                        type='text'
                        label='Artisan email'
                        name='email'
                        className='pl-10'
                        Icon={Mail}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 content-around gap-2'>
                    <StatusSelector
                        label='Status'
                        name='status'
                        placeholder='active'
                    />
                    <UsersSelector label='Select user' name='artisanName' />
                    <CompanySelector label='Select company' name='company' />
                </div>
                <Separator className='mt-4 mb-2' />
                <FormTextareaInput
                    name='note'
                    label='Artisan note'
                    type='text'
                    placeholder='Artisan notes...'
                />
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='artisan-form'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default CreateArtisanForm;
