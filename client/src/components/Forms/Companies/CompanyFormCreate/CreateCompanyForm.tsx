import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import VatSelector from '@/components/common/FormElements/FormVatSelector';
import { Separator } from '@/components/ui/separator';
import { useCompanyFormHooks } from '@/hooks/forms/useCompanyForm';
import { CompanySchema } from '@/models/company/companySchema';
import {
    ClipboardList,
    FileDigit,
    Mail,
    MapPin,
    Phone,
    User,
} from 'lucide-react';
import { FormProvider } from 'react-hook-form';

type CreateCompanyFormProps = {
    handleSubmit: (companyData: CompanySchema) => void;
    isPending: boolean;
};

const CreateCompanyForm = ({
    handleSubmit,
    isPending,
}: CreateCompanyFormProps) => {
    const { useCreateCompanyForm } = useCompanyFormHooks();

    const form = useCreateCompanyForm();

    return (
        <FormProvider {...form}>
            <form id='company-form' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Company name'
                        name='name'
                        className='pl-10'
                        Icon={ClipboardList}
                    />
                    <FormFieldInput
                        type='text'
                        label='Company address'
                        name='address'
                        className='pl-10'
                        Icon={MapPin}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Company MOL'
                        name='mol'
                        className='pl-10'
                        Icon={User}
                    />
                    <FormFieldInput
                        type='email'
                        label='Company email'
                        name='email'
                        className='pl-10'
                        Icon={Mail}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Company number'
                        name='number'
                        className='pl-10'
                        Icon={FileDigit}
                    />
                    <FormFieldInput
                        type='text'
                        label='Company phone'
                        name='phone'
                        className='pl-10'
                        Icon={Phone}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <div className='grid grid-cols-2 sm:grid-cols-2 content-around gap-2'>
                    <StatusSelector
                        label='Status'
                        name='status'
                        placeholder='active'
                    />
                    <VatSelector label='DDS' name='dds' placeholder='no' />
                </div>
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    label='Submit'
                    formName='company-form'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default CreateCompanyForm;
