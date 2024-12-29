import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CircleAlert, Users } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import ClientsHeader from "./TableHeader";
import ClientsCard from "./ClientsCard";
import { Client } from "@/types/client-types/clientTypes";
import CreateClient from "@/components/Forms/Client/ClientFormCreate/CreateClient";
import ClientsLoader from "@/utils/SkeletonLoader/Clients/ClientsLoader";

const ClientsTableBody = () => {
  const { itemsLimit, page, setSearchParams } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: clientsResponse,
    isPending,
    isError
  } = useGetPaginatedData<Client>({
    URL: "/clients",
    queryKey: ["clients"],
    limit: itemsLimit,
    page,
    search: debounceSearchTerm
  });

  console.log("👥 Clients response:", clientsResponse);

  const clients = clientsResponse?.data || [];
  const totalPages = clientsResponse?.totalPages || 1;

  if (isPending) {
    return <ClientsLoader clients={clients} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder="Search clients..." search={search} />
        <CreateClient />
      </div>
      <Table className="w-full min-w-full">
        <ClientsHeader />
        <TableBody>
          <ConditionalRenderer
            data={clients}
            renderData={data => <ClientsCard clients={data as Client[]} />}
            noResults={{
              title: "No clients found",
              description: "It looks like you haven't added any clients yet.",
              Icon: Users
            }}
            wrapper={content => (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-3xl">
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

export default ClientsTableBody;
