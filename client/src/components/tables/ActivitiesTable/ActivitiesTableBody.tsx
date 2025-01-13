//client\src\components\tables\ActivitiesTable\ActivitiesTableBody.tsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ActivitiesLoader from "@/utils/SkeletonLoader/Activities/ActivitiesLoader";
import { CircleAlert, Activity as ActivityIcon } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import { Activity } from "@/types/activity-types/activityTypes";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import CreateActivity from "@/components/Forms/Activities/ActivityFormCreate/CreateActivity";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import ActivitiesHeader from "./ActivitiesHeader";
import ActivitiesCard from "./ActivitiesCard";
import { useTranslation } from "react-i18next";

const ActivitiesTableBody = () => {
  const { t } = useTranslation();
  const { itemsLimit, page, setSearchParams } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: activities,
    isPending,
    isError
  } = useGetPaginatedData<Activity>({
    URL: "/activities",
    queryKey: ["activities"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });

  const totalPages: number | undefined = activities?.totalPages;

  if (isPending) {
    return <ActivitiesLoader activity={activities} />;
  }

  if (isError) {
    return <ErrorMessage title={t("Oops...")} Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search activities...")} search={search} />
        <CreateActivity />
      </div>
      <Table className="w-full min-w-full">
        <ActivitiesHeader />
        <TableBody>
          <ConditionalRenderer
            data={activities.data}
            renderData={activities => <ActivitiesCard activities={activities as Activity[]} />}
            noResults={{
              title: t("No activities found"),
              description: t("It looks like you haven't added any activities yet."),
              Icon: ActivityIcon
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
      <Pagination setSearchParams={setSearchParams} page={page} totalPages={totalPages} />
    </div>
  );
};

export default ActivitiesTableBody;
