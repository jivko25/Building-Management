import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { User } from "@/types/user-types/userTypes";
import { CircleAlert } from "lucide-react";
import ActivitiesLoader from "@/utils/SkeletonLoader/Activities/ActivitiesLoader";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import apiClient from "@/api/axiosConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import ManagersHeader from "./ManagerHeader";

const ManagersTableBody = () => {
  const { itemsLimit, page } = useSearchParamsHook();
  const [readonlyValue, setReadonlyValue] = useState<any>(null);
  const { translate } = useLanguage();

  const {
    data: managers,
    isPending,
    isError
  } = useGetPaginatedData<User>({
    URL: "/users/managers",
    queryKey: ["managers"],
    limit: itemsLimit,
    page
  });

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    full_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    readonly: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [translations, setTranslations] = useState({
    fullName: "Full Name",
    email: "Email",
    role: "Role",
    readonly: "Readonly",
    noManagers: "No managers found.",
    searchByName: "Search by name",
    searchByEmail: "Search by email",
    searchByRole: "Search by role",
    managers: "Managers",
    keywordSearch: "Keyword Search"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const [fullName, email, role, readonly, noManagers, searchByName, searchByEmail, searchByRole, managers, keywordSearch] = await Promise.all([translate("Full Name"), translate("Email"), translate("Role"), translate("Readonly"), translate("No managers found."), translate("Search by name"), translate("Search by email"), translate("Search by role"), translate("Managers"), translate("Keyword Search")]);

      setTranslations({
        fullName,
        email,
        role,
        readonly,
        noManagers,
        searchByName,
        searchByEmail,
        searchByRole,
        managers,
        keywordSearch
      });
    };

    loadTranslations();
  }, [translate]);

  useEffect(() => {
    const translateComponents = async () => {
      setGlobalFilterValue("");
      const translatedPlaceholder = await translate("Keyword Search");
      const searchInput = document.querySelector(".search-input") as HTMLInputElement;
      if (searchInput) {
        searchInput.placeholder = translatedPlaceholder;
      }
    };

    translateComponents();
  }, [translate]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    (_filters["global"] as DataTableFilterMetaData).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{translations.managers}</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations.keywordSearch} className="p-inputtext-sm" />
        </span>
      </div>
    );
  };

  const changePermissionsToReadOnly = (manager: User) => {
    apiClient
      .patch(`/users/managers/update-readonly/${manager && manager?.id}`)
      .then(response => {
        console.log("Permissions updated:", response.data);
      })
      .catch(error => {
        console.error("Error updating permissions:", error);
      });
  };

  const readonlyBodyTemplate = (rowData: User) => {
    const options = [
      { label: "On", value: true },
      { label: "Off", value: false }
    ];

    return (
      <Dropdown
        value={rowData.readonly}
        options={options}
        onChange={e => {
          rowData.readonly = e.value;
          setReadonlyValue(e.value);
          changePermissionsToReadOnly(rowData);
        }}
        placeholder="Select a status"
      />
    );
  };
  const statusFilterTemplate = (options: any) => {
    const [translatedOptions, setTranslatedOptions] = useState([
      { label: "On", value: true },
      { label: "Off", value: false }
    ]);
    const [placeholderText, setPlaceholderText] = useState("Select readonly");

    useEffect(() => {
      const translateFilter = async () => {
        setTranslatedOptions([
          { label: await translate("On"), value: true },
          { label: "Off", value: false }
        ]);
        setPlaceholderText(await translate("Select readonly"));
      };
      translateFilter();
    }, [translate]);

    return <Dropdown value={readonlyValue || options.value} options={translatedOptions} onChange={e => options.filterApplyCallback(e.value)} placeholder={placeholderText} className="p-column-filter" showClear style={{ minWidth: "12rem" }} />;
  };

  if (isPending) {
    return <ActivitiesLoader activity={managers} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="mx-auto mt-2">
      <DataTable value={managers?.data} paginator rows={itemsLimit} totalRecords={managers?.totalCount} dataKey="id" filters={filters} globalFilterFields={["full_name", "email", "role", "status"]} header={renderHeader()} filterDisplay="row" loading={isPending} emptyMessage={translations.noManagers}>
        <Column field="full_name" header={translations.fullName} filter sortable filterPlaceholder={translations.searchByName} style={{ minWidth: "12rem" }} />
        <Column field="email" header={translations.email} filter sortable filterPlaceholder={translations.searchByEmail} style={{ minWidth: "12rem" }} />
        <Column field="role" header={translations.role} filter sortable filterPlaceholder={translations.searchByRole} style={{ minWidth: "12rem" }} />
        <Column field="readonly" header={translations.readonly} body={readonlyBodyTemplate} filter sortable filterElement={statusFilterTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
    </div>
  );
};

export default ManagersTableBody;
