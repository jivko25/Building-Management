import { artisanSchema, ArtisanSchema } from '@/models/artisan/artisanSchema';
import CreateArtisanForm from './CreateArtisanForm';
import useDialogState from '@/hooks/useDialogState';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import { useMutationHook } from '@/hooks/useMutationHook';
import DialogModal from '@/components/common/DialogElements/DialogModal';

const CreateArtisan = () => {
    const { isOpen, setIsOpen } = useDialogState();

    const { useCreateNewEntity } = useMutationHook();

    const { mutate, isPending } = useCreateNewEntity<ArtisanSchema>({
        URL: '/artisans/create',
        queryKey: ['artisans'],
        successToast: 'Artisan created successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, artisanSchema);

    return (
        <DialogModal
            Component={CreateArtisanForm}
            CreateButtonModal
            props={{ handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            createButtonTitle='Add new artisan'
            title='New artisan'
        />
    );
};

export default CreateArtisan;
