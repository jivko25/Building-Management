import { measureSchema, MeasureSchema } from '@/models/measure/measureSchema';
import CreateMeasureForm from './CreateMeasureForm';
import useDialogState from '@/hooks/useDialogState';
import { useSubmitHandler } from '@/utils/helpers/submitHandler';
import { useMutationHook } from '@/hooks/useMutationHook';
import DialogModal from '@/components/common/DialogElements/DialogModal';

const CreateMeasure = () => {
    const { isOpen, setIsOpen } = useDialogState();

    const { useCreateNewEntity } = useMutationHook();

    const { mutate, isPending } = useCreateNewEntity<MeasureSchema>({
        URL: '/measures/create',
        queryKey: ['measures'],
        successToast: 'Measure created successfully!',
        setIsOpen,
    });

    const handleSubmit = useSubmitHandler(mutate, measureSchema);

    return (
        <DialogModal
            Component={CreateMeasureForm}
            props={{ handleSubmit, isPending }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            CreateButtonModal
            createButtonTitle='Add new measure'
            title='New measure'
        />
    );
};

export default CreateMeasure;
