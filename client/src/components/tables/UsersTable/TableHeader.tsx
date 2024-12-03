import TableHeader, {
    HeaderItems,
} from '@/components/common/TableElements/TableHeader';

const userHeaders: HeaderItems[] = [
    { key: 'name', label: 'Name, Surname', width: 'w-20rem', align: 'left' },
    { key: 'user', label: 'User', width: 'w-20rem', align: 'center' },
    { key: 'options', label: 'Options', width: 'w-12.5rem', align: 'right' },
];

const UsersHeader = () => {
    return <TableHeader headers={userHeaders} />;
};

export default UsersHeader;
