import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Company } from '@/types/company-types/companyTypes';
import { TableFormSelectType } from '@/types/table-types/tableTypes';
import { useFormContext } from 'react-hook-form';
import { PaginatedData } from '../Pagination/Pagination';
import { useFetchDataQuery } from '@/hooks/useQueryHook';

const CompanySelector = ({
    label,
    name,
    placeholder,
    defaultVal,
}: TableFormSelectType) => {
    const { control } = useFormContext();

    const { data: companies } = useFetchDataQuery<PaginatedData<Company>>({
        URL: '/companies',
        queryKey: ['companies'],
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
                            {companies &&
                                companies.data
                                    .filter(
                                        (company) => company.status === 'active'
                                    )
                                    .map((company) => (
                                        <SelectItem
                                            key={company.id}
                                            value={company.name}
                                        >
                                            {company.name}
                                        </SelectItem>
                                    ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
};

export default CompanySelector;
