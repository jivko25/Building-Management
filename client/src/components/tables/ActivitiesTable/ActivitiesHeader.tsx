import TableHeader, {
    HeaderItems,
} from '@/components/common/TableElements/TableHeader';

const activityHeaders: HeaderItems[] = [
    { key: 'activity', label: 'Activity', width: 'w-20rem', align: 'left' },
    { key: 'options', label: 'Options', width: 'w-12.5rem', align: 'right' },
];

const ActivitiesHeader = () => {
    return <TableHeader headers={activityHeaders} />;
};

export default ActivitiesHeader;
