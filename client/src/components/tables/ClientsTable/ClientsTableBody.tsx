import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CircleAlert, Users } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import useSearchHandler from "@/hooks/useSearchHandler";
import { useQuery } from "@tanstack/react-query";
import ClientsHeader from "./ClientsTableHeader";
import ClientsCard from "./ClientsCard";
import { Client } from "@/types/client-types/clientTypes";
import CreateClient from "@/components/Forms/Client/ClientFormCreate/CreateClient";
import ClientsLoader from "@/utils/SkeletonLoader/Clients/ClientsLoader";
import { getEntityData } from "@/api/apiCall";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ClientsTableBody = () => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    loading: "Loading...",
    error: {
      title: "Oops...",
      description: "Something went wrong"
    },
    search: {
      placeholder: "Search clients..."
    },
    noResults: {
      title: "No clients found",
      description: "It looks like you haven't added any clients yet."
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        loading: await translate("Loading..."),
        error: {
          title: await translate("Oops..."),
          description: await translate("Something went wrong")
        },
        search: {
          placeholder: await translate("Search clients...")
        },
        noResults: {
          title: await translate("No clients found"),
          description: await translate("It looks like you haven't added any clients yet.")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  const { itemsLimit, page, setSearchParams } = useSearchParamsHook();
  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({ setSearchParams });

  const {
    data: clientsResponse,
    isPending,
    isError
  } = useQuery({
    queryKey: ["clients", page, itemsLimit, debounceSearchTerm],
    queryFn: () => getEntityData<Client[]>(`/clients${debounceSearchTerm ? `?search=${debounceSearchTerm}` : ""}`)
  });

  console.log("👥 Clients response:", clientsResponse);

  const filteredClients = clientsResponse?.filter(client => !debounceSearchTerm || client.client_company_name.toLowerCase().includes(debounceSearchTerm.toLowerCase()) || client.client_name.toLowerCase().includes(debounceSearchTerm.toLowerCase()) || client.client_company_address.toLowerCase().includes(debounceSearchTerm.toLowerCase()) || client.client_company_iban.toLowerCase().includes(debounceSearchTerm.toLowerCase())) || [];

  const clients = filteredClients;
  const totalPages = Math.ceil(clients.length / itemsLimit);

  if (isPending) {
    return <ClientsLoader />;
  }

  if (isError) {
    return <ErrorMessage title={translations.error.title} Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 md:w-2/3 justify-between">
        <SearchBar handleSearch={handleSearch} placeholder={translations.search.placeholder} search={search} />
        <CreateClient />
      </div>
      <Table className="w-full min-w-full">
        <ClientsHeader />
        <TableBody>
          <ConditionalRenderer
            data={clients}
            renderData={data => <ClientsCard clients={data as Client[]} />}
            noResults={{
              title: translations.noResults.title,
              description: translations.noResults.description,
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
