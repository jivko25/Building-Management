import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import StatusSelector from '@/components/common/FormElements/FormStatusSelector';
import CompanySelector from '@/components/common/FormElements/FormCompanySelector';
import FormTextareaInput from '@/components/common/FormElements/FormTextareaInput';
import UsersSelector from '@/components/common/FormElements/FormUserSelector';
import { Mail, Phone, User } from 'lucide-react';
import { useArtisanFormHooks } from '@/hooks/forms/useArtisanForm';
import { ArtisanSchema } from '@/models/artisan/artisanSchema';
import { useFetchDataQuery } from '@/hooks/useQueryHook';
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
    const { data: artisan } = useFetchDataQuery<{
        id: string;
        name: string;
        note: string;
        number: string;
        email: string;
        status: "active" | "inactive";
        company: { name: string };
        user: { full_name: string };
    }>({
        URL: `/artisans/${artisanId}`,
        queryKey: ["artisan", artisanId],
        options: {
            staleTime: Infinity,
        },
    });

    console.log("👷 Artisan data:", artisan);

    const { useEditArtisanForm } = useArtisanFormHooks();

    const form = useEditArtisanForm({
        name: artisan?.name || "",
        note: artisan?.note || "",
        number: artisan?.number || "",
        email: artisan?.email || "",
        status: artisan?.status || "active",
        company: artisan?.company?.name || "",
        artisanName: artisan?.user?.full_name || "",
    });

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
                        defaultVal={artisan?.status}
                    />
                    <UsersSelector
                        label='Select user'
                        name='artisanName'
                        defaultVal={artisan?.user?.full_name}
                    />
                    <CompanySelector
                        label='Select company'
                        name='company'
                        defaultVal={artisan?.company?.name}
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
