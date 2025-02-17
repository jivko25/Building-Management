import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { InputNumber } from "primereact/inputnumber";

const ManagersTableBody = () => {
  const { t } = useTranslation();
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

    (_filters["global"] as DataTableFilterMetaData).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("Keyword Search")} className="search-input" />
        </IconField>
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
      { label: t("On"), value: true },
      { label: t("Off"), value: false }
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
          { label: t("On"), value: true },
          { label: t("Off"), value: false }
        ]}
        onChange={e => options.filterApplyCallback(e.value)}
        placeholder={t("Select readonly")}
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const updateUserLimit = (manager: User, newLimit: number) => {
    apiClient
      .patch(`/users/managers/update-limit/${manager.id}`, { user_limit: newLimit })
      .then(response => {
        console.log("User limit updated:", response.data);
      })
      .catch(error => {
        console.error("Error updating user limit:", error);
      });
  };

  const userLimitBodyTemplate = (rowData: User) => {
    return (
      <InputNumber 
        value={rowData.user_limit} 
        onValueChange={(e: any) => {
          if (e.value !== null) {
            rowData.user_limit = e.value;
            updateUserLimit(rowData, e.value);
          }
        }}
        min={0}
        showButtons
        buttonLayout="horizontal"
        style={{ width: '150px' }}
        decrementButtonClassName="p-button-secondary" 
        incrementButtonClassName="p-button-secondary"
        incrementButtonIcon="pi pi-plus" 
        decrementButtonIcon="pi pi-minus" 
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
      <DataTable value={managers?.data} paginator rows={itemsLimit} totalRecords={managers?.totalCount} dataKey="id" filters={filters} globalFilterFields={["full_name", "email", "role", "status"]} header={header} filterDisplay="row" loading={isPending} emptyMessage={t("No managers found")}>
        <Column field="full_name" header={t("Full Name")} filter sortable filterPlaceholder={t("Search by name")} style={{ minWidth: "12rem" }} />
        <Column field="email" header={t("Email")} filter sortable filterPlaceholder={t("Search by email")} style={{ minWidth: "12rem" }} />
        <Column field="role" header={t("Role")} filter sortable filterPlaceholder={t("Search by role")} style={{ minWidth: "12rem" }} />
        <Column field="readonly" header={t("Readonly")} body={readonlyBodyTemplate} filter sortable filterElement={statusFilterTemplate} style={{ minWidth: "12rem" }} />
        <Column 
          field="user_limit" 
          header={t("User Limit")} 
          body={userLimitBodyTemplate} 
          sortable 
          style={{ minWidth: "12rem" }} 
        />
      </DataTable>
    </div>
  );
};

export default ManagersTableBody;
