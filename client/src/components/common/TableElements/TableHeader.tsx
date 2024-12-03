import {
    TableHead,
    TableHeader as Header,
    TableRow,
} from '@/components/ui/table';

export type HeaderItems = {
    key: string;
    label: string;
    width: string;
    align: 'left' | 'center' | 'right';
};

type TableHeaderProps = {
    headers: HeaderItems[];
};

const TableHeader = ({ headers }: TableHeaderProps) => {
    return (
        <Header>
            <TableRow>
                {headers.map((header) => (
                    <TableHead
                        key={header.key}
                        className={`${header.width} font-bold ${
                            header.align === 'center'
                                ? 'text-center'
                                : header.align === 'right'
                                ? 'text-end'
                                : ''
                        }`}
                    >
                        {header.label}
                    </TableHead>
                ))}
            </TableRow>
        </Header>
    );
};

export default TableHeader;
