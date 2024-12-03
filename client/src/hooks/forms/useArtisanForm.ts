import {
    artisanDefaults,
    artisanSchema,
    ArtisanSchema,
} from '@/models/artisan/artisanSchema';
import { useDynamicForm } from './dynamicForm/useDynamicForm';

export const useArtisanFormHooks = () => {
    const { useCreateForm, useEditForm } = useDynamicForm<ArtisanSchema>(
        artisanSchema,
        artisanDefaults
    );

    return {
        useCreateArtisanForm: useCreateForm,
        useEditArtisanForm: useEditForm,
    };
};
