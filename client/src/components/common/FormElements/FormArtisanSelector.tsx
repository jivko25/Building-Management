import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Artisan } from '@/types/artisan-types/artisanTypes';
import { TableFormSelectType } from '@/types/table-types/tableTypes';
import { useFormContext } from 'react-hook-form';
import { PaginatedData } from '../Pagination/Pagination';
import { useFetchDataQuery } from '@/hooks/useQueryHook';

const ArtisanSelector = ({
    label,
    name,
    placeholder,
    defaultVal,
}: TableFormSelectType) => {
    const { control } = useFormContext();

    const { data: artisans } = useFetchDataQuery<PaginatedData<Artisan>>({
        URL: '/artisans',
        queryKey: ['artisans'],
        options: {
            staleTime: Infinity,
        },
    });

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='font-semibold'>{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={defaultVal}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                {artisans &&
                                    artisans.data
                                        .filter(
                                            (artisan) =>
                                                artisan.status === 'active'
                                        )
                                        .map((artisan) => (
                                            <SelectItem
                                                key={artisan.id}
                                                value={artisan.name}
                                            >
                                                {artisan.name}
                                            </SelectItem>
                                        ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
};

export default ArtisanSelector;
