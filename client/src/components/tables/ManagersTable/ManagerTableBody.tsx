import React, { useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { User } from "@/types/user-types/userTypes";
import { CircleAlert, User as UserIcon } from "lucide-react";
import ActivitiesLoader from "@/utils/SkeletonLoader/Activities/ActivitiesLoader";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import apiClient from "@/api/axiosConfig";

const ManagersTableBody = () => {
  const { itemsLimit, page } = useSearchParamsHook();
  const [readonlyValue, setReadonlyValue] = useState<any>(null);

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

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" className="search-input" />
        </IconField>
      </div>
    );
  };

  const changePermissionsToReadOnly = (manager: User) => {
    apiClient.patch(`/users/managers/update-readonly/${manager && manager?.id}`)
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
    return (
      <Dropdown
        value={readonlyValue || options.value}
        options={[
          { label: "On", value: true },
          { label: "Off", value: false }
        ]}
        onChange={e => options.filterApplyCallback(e.value)}
        placeholder="Select readonly"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  if (isPending) {
    return <ActivitiesLoader activity={managers} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  const header = renderHeader();

  return (
    <div className="mx-auto mt-2">
      <DataTable value={managers?.data} paginator rows={itemsLimit} totalRecords={managers?.totalCount} dataKey="id" filters={filters} globalFilterFields={["full_name", "email", "role", "status"]} header={header} filterDisplay="row" loading={isPending} emptyMessage="No managers found.">
        <Column field="full_name" header="Full Name" filter sortable filterPlaceholder="Search by name" style={{ minWidth: "12rem" }} />
        <Column field="email" header="Email" filter sortable filterPlaceholder="Search by email" style={{ minWidth: "12rem" }} />
        <Column field="role" header="Role" filter sortable filterPlaceholder="Search by role" style={{ minWidth: "12rem" }} />
        <Column field="readonly" header="Readonly" body={readonlyBodyTemplate} filter sortable filterElement={statusFilterTemplate} style={{ minWidth: "12rem" }} />
      </DataTable>
    </div>
  );
};

export default ManagersTableBody;