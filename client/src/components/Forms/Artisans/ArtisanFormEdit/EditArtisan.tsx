import { artisanSchema, ArtisanSchema } from '@/models/artisan/artisanSchema';
import useDialogState from '@/hooks/useDialogState';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import { useMutationHook } from '@/hooks/useMutationHook';
import DialogModal from '@/components/common/DialogElements/DialogModal';
import EditArtisanForm from './EditArtisanForm';

type ArtisanFormProps = {
    artisanId: string;
};

const EditArtisan = ({ artisanId }: ArtisanFormProps) => {
    const { isOpen, setIsOpen } = useDialogState();

    const { useEditEntity } = useMutationHook();

    const { mutate, isPending } = useEditEntity<ArtisanSchema>({
        URL: `/artisans/${artisanId}/edit`,
        queryKey: ['artisans'],
        successToast: 'Artisan updated successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, artisanSchema);

    return (
        <DialogModal
            Component={EditArtisanForm}
            props={{ artisanId, handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title='Edit artisan'
        />
    );
};

export default EditArtisan;
