import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import CompanySelector from '@/components/common/FormElements/FormCompanySelector';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import UsersSelector from '@/components/common/FormElements/FormUserSelector';
import { Mail, Phone, User } from 'lucide-react';
import { useArtisanFormHooks } from '@/hooks/forms/useArtisanForm';
import useSearchParamsHook from '@/hooks/useSearchParamsHook';
import { Artisan } from '@/types/artisan-types/artisanTypes';
import { useCachedData } from '@/hooks/useQueryHook';
import { findItemById } from '@/utils/helpers/findItemById';
import { ArtisanSchema } from '@/models/artisan/artisanSchema';
import { PaginatedDataResponse } from '@/types/query-data-types/paginatedDataTypes';
import { Separator } from '@/components/ui/separator';

type EditArtisanFormProps = {
    handleSubmit: (artisanData: ArtisanSchema) => void;
    artisanId: string;
    isPending: boolean;
};

const EditArtisanForm = ({
    artisanId,
    handleSubmit,
    isPending,
}: EditArtisanFormProps) => {
    const { itemsLimit, page, searchParam } = useSearchParamsHook();

    const artisan = useCachedData<Artisan>({
        queryKey: ['artisans', page, itemsLimit, searchParam],
        selectFn: (data) =>
            findItemById<Artisan>(
                data as PaginatedDataResponse<Artisan>,
                artisanId,
                (artisan) => artisan.id as string
            ),
    });
    const { useEditArtisanForm } = useArtisanFormHooks();

    const form = useEditArtisanForm(artisan as Partial<Artisan>);

    return (
        <FormProvider {...form}>
            <form id='form-edit' onSubmit={form.handleSubmit(handleSubmit)}>
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
                        defaultVal={artisan && artisan.status}
                    />
                    <UsersSelector
                        label='Select user'
                        name='artisanName'
                        defaultVal={artisan && artisan.artisanName}
                    />
                    <CompanySelector
                        label='Select company'
                        name='company'
                        defaultVal={artisan && artisan.company}
                    />
                </div>
                <Separator className='mt-4 mb-2' />
                <FormTextareaInput
                    name='note'
                    label='Artisan note'
                    placeholder='Artisan notes...'
                    type='text'
                />
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

export default EditArtisanForm;
