//client\src\types\task-types\workItemType.ts
import { format } from 'date-fns';
import { z } from 'zod';

export type WorkItem = {
    id?: string;
    task_id?: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    note?: string;
    finished_work?: string;
    status?: 'done' | 'in_progress';
}

export const workItemSchema = z.object({
    name: z.string().min(3, {
        message: 'Task name must be at least 3 characters long.'
    }).max(50, {
        message: 'Task name cannot exceed 50 characters.'
    }),
    start_date: z.coerce.date().transform((date) => format(date, 'yyyy-MM-dd')).optional(),
    end_date: z.coerce.date().transform((date) => format(date, 'yyyy-MM-dd')).optional(),
    note: z.string().min(0).max(100, {
        message: 'Note cannot exceed 100 characters.'
    }).optional(),
    finished_work: z.string().min(1, {
        message: 'Please enter finished work'
    }),
    status: z.enum(['done', 'in_progress'], {
        message: 'Please, select a status.'
    }),
}).refine((data) => data.end_date! >= data.start_date!, {
    message: 'End date cannot be earlier than start date.',
    path: ['end_date']
});

export const workItemDefaults = {
    name: '',
    start_date: '',
    end_date: '',
    note: '',
    finished_work: '',
    status: undefined,
}

export type WorkItemSchema = z.infer<typeof workItemSchema>;