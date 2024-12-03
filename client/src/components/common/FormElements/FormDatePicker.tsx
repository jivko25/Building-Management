import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

type FormDateType = {
    label: string;
    name: string;
    description?: string;
    selected?: string;
    className?: string;
};

const FormDatePicker = ({
    label,
    name,
    description,
    selected,
    className,
}: FormDateType) => {
    const { control } = useFormContext();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const dateToday = new Date().toLocaleDateString();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('flex flex-col', className)}>
                    <FormLabel className='font-semibold pb-1'>
                        {label}
                    </FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {field.value ? (
                                    format(field.value, 'PPP')
                                ) : (
                                    <span>
                                        {selected || `E.g. ${dateToday}`}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                            <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={(date) => {
                                    if (date) {
                                        field.onChange(date);
                                        setCalendarOpen(false);
                                    }
                                }}
                                defaultMonth={
                                    field.value ? field.value : undefined
                                }
                                fromDate={new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormDatePicker;
