import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CircleAlert, ContactRound } from 'lucide-react';
import ErrorMessage from '@/components/common/FormMessages/ErrorMessage';
import Pagination from '@/components/common/Pagination/Pagination';
import { Artisan } from '@/types/artisan-types/artisanTypes';
import ArtisansLoader from '@/utils/SkeletonLoader/Artisans/ArtisansLoader';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import CreateArtisan from '@/components/Forms/Artisans/ArtisanFormCreate/CreateArtisan';
import ConditionalRenderer from '@/components/common/ConditionalRenderer/ConditionalRenderer';
import useSearchParamsHook from '@/hooks/useSearchParamsHook';
import useSearchHandler from '@/hooks/useSearchHandler';
import { useGetPaginatedData } from '@/hooks/useQueryHook';
import ArtisansCard from './ArtisansCard';
import ArtisansHeader from './ArtisansHeader';

const ArtisansTableBody = () => {
    const { setSearchParams, itemsLimit, page } = useSearchParamsHook();

    const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
        setSearchParams,
    });

    const {
        data: artisans,
        isPending,
        isError,
    } = useGetPaginatedData<Artisan>({
        URL: '/artisans',
        queryKey: ['artisans'],
        limit: itemsLimit,
        page,
        search: debounceSearchTerm,
    });

    const totalPages: number | undefined = artisans?.totalPages;

    if (isPending) {
        return <ArtisansLoader artisans={artisans} />;
    }

    if (isError) {
        return <ErrorMessage title='Oops...' Icon={CircleAlert} />;
    }

    return (
        <div className='flex flex-col flex-1 py-8 items-center md:px-0'>
            <div className='flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between'>
                <SearchBar
                    handleSearch={handleSearch}
                    placeholder='Search artisans...'
                    search={search}
                />
                <CreateArtisan />
            </div>
            <Table className='w-full min-w-full'>
                <ArtisansHeader />
                <TableBody>
                    <ConditionalRenderer
                        data={artisans.data}
                        renderData={(artisans) => (
                            <ArtisansCard artisans={artisans as Artisan[]} />
                        )}
                        noResults={{
                            title: 'No artisans found',
                            description:
                                "It looks like you haven't added any artisans yet.",
                            Icon: ContactRound,
                        }}
                        wrapper={(content) => (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className='text-center text-3xl'
                                >
                                    {content}
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
            <Pagination
                page={page}
                setSearchParams={setSearchParams}
                totalPages={totalPages}
            />
        </div>
    );
};

export default ArtisansTableBody;
