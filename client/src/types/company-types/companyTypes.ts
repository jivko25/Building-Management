export type Company = {
    id?: string;
    name: string;
    number: string;
    address: string;
    mol: string;
    email: string;
    phone: string;
    dds: 'yes' | 'no';
    status: 'active' | 'inactive';
}