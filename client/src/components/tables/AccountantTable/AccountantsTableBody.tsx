//client\src\components\tables\AccountantTable\AccountantTableBody.tsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Calculator, CircleAlert } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import ArtisansLoader from "@/utils/SkeletonLoader/Artisans/ArtisansLoader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import { useTranslation } from "react-i18next";
import { Accountant } from "@/types/accountant-types/accountantTypes";
import AccountantCard from "./AccountantCard";
import AccountantsHeader from "./AccountantsHeader";
import CreateAccountant from "@/components/Forms/Accountants/AccountantFormCreate/CreateAccountant";
interface AccountantResponse {
  accountants: Accountant[];
  accountantsCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
const AccountantsTableBody = () => {
  const { t } = useTranslation();
  const { setSearchParams, itemsLimit, page } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: accountantsResponse,
    isPending,
    isError
  } = useGetPaginatedData<AccountantResponse>({
    URL: "/accountants",
    queryKey: ["accountants"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });

  console.log("👷 Accountants response:", accountantsResponse);
  const typedAccountantsResponse = accountantsResponse as AccountantResponse;
  if (isPending) {
    return <ArtisansLoader artisans={accountantsResponse} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search accountants...")} search={search} />
        <CreateAccountant />
      </div>
      <Table className="w-full min-w-full">
        <AccountantsHeader />
        <TableBody>
          <ConditionalRenderer
            data={typedAccountantsResponse?.accountants || []}
            renderData={data => <AccountantCard accountants={data as Accountant[]} />}
            noResults={{
              title: t("No accountants found"),
              description: t("It looks like you haven't added any accountants yet."),
              Icon: Calculator
            }}
            wrapper={content => (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-3xl">
                  {content}
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <Pagination page={page} setSearchParams={setSearchParams} totalPages={accountantsResponse?.totalPages} />
    </div>
  );
};

export default AccountantsTableBody;
