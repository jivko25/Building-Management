//client\src\components\tables\CompaniesTable\CompaniesTableBody.tsx
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import CompaniesLoader from "@/utils/SkeletonLoader/Companies/CompaniesLoader";
import { Building2, CircleAlert } from "lucide-react";
import { Company } from "@/types/company-types/companyTypes";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import CreateCompany from "@/components/Forms/Companies/CompanyFormCreate/CreateCompany";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import CompaniesHeader from "./CompaniesHeader";
import CompaniesCard from "./CompaniesCard";
import { useTranslation } from "react-i18next";

interface CompanyResponse {
  companies: Company[];
  companiesCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
const CompaniesTableBody = () => {
  const { t } = useTranslation();
  const { setSearchParams, itemsLimit, page } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: companiesResponse,
    isPending,
    isError
  } = useGetPaginatedData<CompanyResponse>({
    URL: "/companies",
    queryKey: ["companies"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });
  const typedCompaniesResponse = companiesResponse as CompanyResponse;
  console.log("🏢 Companies response:", companiesResponse);

  if (isPending) {
    return <CompaniesLoader companies={typedCompaniesResponse?.companies} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0 width-limiter">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search companies...")} search={search} />
        <CreateCompany />
      </div>
      <Table className="w-full min-w-full">
        <CompaniesHeader />
        <TableBody>
          <ConditionalRenderer
            data={typedCompaniesResponse.companies || []}
            renderData={data => <CompaniesCard companies={data as Company[]} />}
            noResults={{
              title: t("No companies found"),
              description: t("It looks like you haven't added any companies yet."),
              Icon: Building2
            }}
            wrapper={content => (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-3xl">
                  {content}
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <Pagination page={page} setSearchParams={setSearchParams} totalPages={companiesResponse?.totalPages} />
    </div>
  );
};

export default CompaniesTableBody;
