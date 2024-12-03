import TableHeader, {
    HeaderItems,
} from '@/components/common/TableElements/TableHeader';

const headers: HeaderItems[] = [
    { key: 'name', label: 'Company name', width: 'w-[23rem]', align: 'left' },
    {
        key: 'number',
        label: 'Company number',
        width: 'w-[21.5rem]',
        align: 'center',
    },
    { key: 'mrp', label: 'MRP', width: 'w-[21rem]', align: 'center' },
    { key: 'options', label: 'Options', width: 'w-[12.5rem]', align: 'right' },
];

const CompaniesHeader = () => {
    return <TableHeader headers={headers} />;
};

export default CompaniesHeader;
