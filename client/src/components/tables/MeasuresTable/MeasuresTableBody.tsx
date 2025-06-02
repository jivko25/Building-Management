import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CircleAlert, Ruler } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import CreateMeasure from "@/components/Forms/Measures/MeasureFormCreate/CreateMeasure";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import MeasuresHeader from "./MeasuresHeader";
import MeasuresCard from "./MeasuresCard";
import { useTranslation } from "react-i18next";
import { Measure } from "@/types/measure-types/measureTypes";

const MeasuresTableBody = () => {
  const { t } = useTranslation();
  const { itemsLimit, page, setSearchParams } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: measuresResponse,
    isError
  } = useGetPaginatedData<Measure>({
    URL: "/measures",
    queryKey: ["measures"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });

  const totalPages: number | undefined = measuresResponse?.totalPages;

  if (isError) {
    return <ErrorMessage title={t("Oops...")} Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar
          handleSearch={handleSearch}
          placeholder={t("Search measures...")}
          search={search}
        />
        <CreateMeasure />
      </div>
      <Table className="w-full min-w-full">
        <MeasuresHeader />
        <TableBody>
          <ConditionalRenderer
            data={measuresResponse?.data || []}
            renderData={(data) => <MeasuresCard measures={data as Measure[]} />}
            noResults={{
              title: t("No measures found"),
              description: t("It looks like you haven't added any measures yet."),
              Icon: Ruler
            }}
            wrapper={(content) => (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-3xl">
                  {content}
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <Pagination
        setSearchParams={setSearchParams}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
};

export default MeasuresTableBody;
