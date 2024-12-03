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
import { Activity } from '@/types/activity-types/activityTypes';
import { TableFormSelectType } from '@/types/table-types/tableTypes';
import { useFormContext } from 'react-hook-form';
import { PaginatedData } from '../Pagination/Pagination';
import { useFetchDataQuery } from '@/hooks/useQueryHook';

const ActivitySelector = ({
    label,
    name,
    placeholder,
    defaultVal,
}: TableFormSelectType) => {
    const { control } = useFormContext();

    const { data: activities } = useFetchDataQuery<PaginatedData<Activity>>({
        URL: '/activities',
        queryKey: ['activities'],
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
                            {activities &&
                                activities.data.map((activity) => (
                                    <SelectItem
                                        key={activity.id}
                                        value={activity.name}
                                    >
                                        {activity.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
};

export default ActivitySelector;
