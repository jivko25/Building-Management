//client\src\components\tables\UsersTable\UsersTableBody.tsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import UsersLoader from "@/utils/SkeletonLoader/Users/UsersLoader";
import { CircleAlert, Users } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import { User } from "@/types/user-types/userTypes";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import CreateUser from "@/components/Forms/User/UserFormCreate/CreateUser";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import UsersHeader from "./UsersHeader";
import UsersCard from "@/components/tables/UsersTable/UsersCard";
import { useTranslation } from "react-i18next";

const UsersTableBody = () => {
  const { t } = useTranslation();
  const { itemsLimit, page, setSearchParams } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: usersResponse,
    isPending,
    isError
  } = useGetPaginatedData<User>({
    URL: "/users",
    queryKey: ["users"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });

  console.log("👥 Users response:", usersResponse);

  const users = usersResponse?.users || []; // Променено от data на users
  const totalPages = usersResponse?.totalPages;

  if (isPending) {
    return <UsersLoader users={users} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search users...")} search={search} />
        <CreateUser />
      </div>
      <Table className="w-full min-w-full">
        <UsersHeader />
        <TableBody>
          <ConditionalRenderer
            data={users}
            renderData={data => <UsersCard users={data as User[]} />}
            noResults={{
              title: t("No users found"),
              description: t("It looks like you haven't added any users yet."),
              Icon: Users
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

export default UsersTableBody;
