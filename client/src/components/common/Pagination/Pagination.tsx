//client\src\components\common\Pagination\Pagination.tsx
import { Pagination as Paginate, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type PaginationProps = {
  totalPages: number | undefined;
  page: number;
  setSearchParams: (params: URLSearchParams) => void;
};

export type PaginatedData<T> = {
  data: T[];
  limit?: number;
  total?: number;
  totalPages?: number;
};

const Pagination = ({ totalPages, page, setSearchParams }: PaginationProps) => {
  const handlePreviousPage = (): void => {
    setSearchParams(new URLSearchParams({ page: (page - 1).toString() }));
  };

  const handleNextPage = (): void => {
    setSearchParams(new URLSearchParams({ page: (page + 1).toString() }));
  };

  const calculatedTotalPages = Math.max(totalPages || 0, 1);

  return (
    <div className="mt-4">
      <Paginate>
        <PaginationContent className="justify-center w-full">
          <PaginationItem>
            <PaginationPrevious aria-disabled={page <= 1} className={page <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} onClick={handlePreviousPage} />
          </PaginationItem>

          {new Array(calculatedTotalPages).fill("_").map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink className="cursor-pointer" isActive={index + 1 === page} onClick={() => setSearchParams(new URLSearchParams({ page: (index + 1).toString() }))}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext className={page >= calculatedTotalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Paginate>
    </div>
  );
};

export default Pagination;
