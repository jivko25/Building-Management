import { FormProvider } from 'react-hook-form';
import FormFieldInput from '@/components/common/FormElements/FormFieldInput';
import DialogFooter from '@/components/common/DialogElements/DialogFooter';
import { Ruler } from 'lucide-react';
import { useMeasureFormHooks } from '@/hooks/forms/useMeasureForm';
import { MeasureSchema } from '@/models/measure/measureSchema';
import { useCachedData } from '@/hooks/useQueryHook';
import { Measure } from '@/types/measure-types/measureTypes';
import { findItemById } from '@/utils/helpers/findItemById';

type EditMeasureFormProps = {
    handleSubmit: (measureData: MeasureSchema) => void;
    measureId: string;
    isPending: boolean;
};

const EditMeasureForm = ({
    handleSubmit,
    isPending,
    measureId,
}: EditMeasureFormProps) => {
    const measure = useCachedData<Measure>({
        queryKey: ['measures'],
        selectFn: (data) =>
            findItemById<Measure>(
                data as Measure[],
                measureId,
                (measure) => measure.id as string
            ),
    });

    const { useEditMeasureForm } = useMeasureFormHooks();

    const form = useEditMeasureForm(measure as Partial<Measure>);

    return (
        <FormProvider {...form}>
            <form id='edit-measure' onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 gap-2 mb-2'>
                    <FormFieldInput
                        type='text'
                        label='Type of measure'
                        name='name'
                        className='pl-10'
                        Icon={Ruler}
                    />
                </div>
                <DialogFooter
                    disabled={!form.formState.isDirty || isPending}
                    isLoading={isPending}
                    label='Submit changes'
                    formName='edit-measure'
                    className='mt-6'
                />
            </form>
        </FormProvider>
    );
};

export default EditMeasureForm;
