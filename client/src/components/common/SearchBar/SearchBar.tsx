import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SearchBarProps = {
    search: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const SearchBar = ({ search, placeholder, handleSearch }: SearchBarProps) => {
    return (
        <div className='relative'>
            <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
                type='text'
                placeholder={placeholder}
                value={search}
                onChange={handleSearch}
                className='pr-10 pl-3 focus-visible:ring-blue-700 transition focus:ease-in-out duration-300 w-full md:w-full'
            />
        </div>
    )
};

export default SearchBar;