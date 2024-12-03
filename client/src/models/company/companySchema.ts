import { Company } from '@/types/company-types/companyTypes';
import { z } from 'zod';

export const phoneValidator = /^([0-9|\\+])[0-9\\s.\\/-]{6,20}$/;

export const companySchema = z.object({
    name: z.string()
        .min(3, { message: 'Company name must be at least 3 characters' })
        .max(50, { message: 'Company name cannot exceed 50 characters.' }),
    number: z.string()
        .min(6, { message: 'Number must be at least 6 characters.' })
        .max(11, { message: 'Number cannot exceed 11 characters.' }),
    address: z.string()
        .min(3, { message: 'Address must be at least 3 characters' })
        .max(50, { message: 'Address cannot exceed 50 characters.' }),
    mol: z.string()
        .min(3, { message: 'MOL name must be at least 3 characters.' })
        .max(55, { message: 'MOL cannot exceed 55 characters.' }),
    email: z.string()
        .min(5, { message: 'Email must be at least 5 characters.' })
        .max(50, { message: 'Email cannot exceed 50 characters.' })
        .email('Please, enter a valid email.'),
    phone: z.string()
        .regex(phoneValidator, { message: 'Invalid phone format' }),
    dds: z.enum(['yes', 'no'], { message: 'DDS is required.', }),
    status: z.enum(['active', 'inactive'], { message: 'Please, select status.' }),
});

export const companyDefaults: Company = {
    name: '',
    number: '',
    address: '',
    mol: '',
    phone: '',
    email: '',
    dds: 'no',
    status: 'active',
}

export type CompanySchema = z.infer<typeof companySchema>;