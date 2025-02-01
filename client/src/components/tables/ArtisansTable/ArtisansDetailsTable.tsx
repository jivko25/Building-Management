import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Checkbox } from "primereact/checkbox"; // Импортиране на Checkbox
import apiClient from "@/api/axiosConfig";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  name: string;
  project_id: number;
  project: { id: number; name: string };
  activity: { id: number; name: string };
}

export interface WorkItem {
  id: number;
  name: string;
  total_artisan_price: string;
  total_manager_price: string;
  quantity: number;
  single_artisan_price: string;
  task: Task;
  created_at: Date;
  is_paid: boolean; // Добавяне на поле is_paid
}

const ArtisansDetailsTable: React.FC<{ data: WorkItem[]; artisanName: string }> = ({ data, artisanName }) => {
  const [filters, setFilters] = useState<any>(null);
  const [selectedPaidStatus, setSelectedPaidStatus] = useState<Record<number, boolean>>({});
  const [filteredData, setFilteredData] = useState<WorkItem[]>(data);
  const [selectAllPaid, setSelectAllPaid] = useState(false); // Управление на състоянието на хедър чекбокса

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    const initialStatus = data.reduce((acc, item) => {
      acc[item.id] = item.is_paid;
      return acc;
    }, {} as Record<number, boolean>);
    setSelectedPaidStatus(initialStatus);
  }, [data]);

  const initFilters = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const endOfDay = new Date(now);

    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    endOfDay.setHours(23, 59, 59, 999);

    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      "task.project.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      "task.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      created_at: {
        operator: FilterOperator.AND,
        constraints: [
          { value: startOfWeek, matchMode: FilterMatchMode.DATE_AFTER },
          { value: endOfDay, matchMode: FilterMatchMode.DATE_BEFORE }
        ]
      },
      is_paid: { value: null, matchMode: FilterMatchMode.EQUALS } // Филтър за is_paid
    });
  };

  const dateBodyTemplate = (rowData: WorkItem) => {
    const date = new Date(rowData.created_at);
    const dayOfWeek = new Intl.DateTimeFormat("bg-BG", { weekday: "short" }).format(date);
    const formattedDate = date.toLocaleDateString("en-US");

    const getWeekNumber = (date: Date) => {
      const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

      // Намираме деня от седмицата (понеделник = 1, неделя = 7)
      const day = targetDate.getUTCDay() || 7;

      // Преместваме датата назад, за да попаднем в правилната ISO седмица
      targetDate.setUTCDate(targetDate.getUTCDate() + 4 - day);

      // Намираме първия четвъртък на годината
      const yearStart = new Date(Date.UTC(targetDate.getUTCFullYear(), 0, 1));
      const yearStartDay = yearStart.getUTCDay() || 7;

      // Преместваме към първия понеделник на годината
      const firstMonday = new Date(yearStart);
      firstMonday.setUTCDate(yearStart.getUTCDate() + (1 - yearStartDay));

      // Изчисляваме разликата в дни и номера на седмицата
      const diff = (targetDate.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000);

      return Math.floor(diff) + 1;
    };

    const weekNumber = getWeekNumber(date);
    return `${dayOfWeek}, Week ${weekNumber}, ${formattedDate}`;
  };

  const dateFilterTemplate = (options: any) => {
    return <Calendar value={options.value} onChange={e => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
  };

  const calculateTotal = () => {
    return filteredData.reduce((sum, item) => sum + parseFloat(item.total_artisan_price || "0"), 0).toFixed(2);
  };

  const onFilter = (event: any) => {
    setFilteredData(event || []);
  };

  const updateIsPaidStatus = async (id: number, isPaid: boolean) => {
    try {
      const response = await apiClient.patch(
        `/work-items/${id}/is-paid`,
        { is_paid: isPaid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Замени с твоя начин за получаване на токена
          }
        }
      );

      console.log("Updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating is_paid status:", error);
    }
  };

  const isPaidTemplate = (rowData: WorkItem) => {
    const isChecked = selectedPaidStatus[rowData.id] ?? rowData.is_paid;

    const handleCheckboxChange = async (e: any) => {
      const newStatus = e.checked;

      setSelectedPaidStatus(prev => ({
        ...prev,
        [rowData.id]: e.checked
      }));

      await updateIsPaidStatus(rowData.id, newStatus);
    };

    return <Checkbox checked={isChecked} onChange={e => handleCheckboxChange(e)} />;
  };

  const handleSelectAllChange = async (e: any) => {
    const newStatus = e.checked;
    setSelectAllPaid(newStatus);

    // Обновяване на всички редове
    const updatedStatuses = data.reduce((acc, item) => {
      acc[item.id] = newStatus;
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedPaidStatus(updatedStatuses);

    // Актуализиране на състоянието в базата
    for (const item of data) {
      await updateIsPaidStatus(item.id, newStatus);
    }
  };

  const headerCheckbox = (
    <div className="flex flex-column gap-2 items-center">
      <p>Paid</p>
      <Checkbox checked={selectAllPaid} onChange={e => handleSelectAllChange(e)} />
    </div>
  );

  const isPaidFilterTemplate = (options: any) => {
    return (
      <div className="flex flex-column gap-2">
        <div>
          <Checkbox inputId="paid" checked={options.value === true} onChange={e => options.filterApplyCallback(e.checked ? true : null)} />
          <label htmlFor="paid" className="ml-2">
            Paid
          </label>
        </div>
        <div>
          <Checkbox inputId="unpaid" checked={options.value === false} onChange={e => options.filterApplyCallback(e.checked ? false : null)} />
          <label htmlFor="unpaid" className="ml-2">
            Unpaid
          </label>
        </div>
      </div>
    );
  };

  const projectLinkTemplate = (rowData: WorkItem) => {
    return (
      <Link to={`/projects/${rowData.task.project.id}/tasks`} className="text-blue-500 hover:underline">
        {rowData.task.project.name}
      </Link>
    );
  };

  const taskLinkTemplate = (rowData: WorkItem) => {
    return (
      <Link to={`/projects/${rowData.task.project.id}/tasks/${rowData.task.id}/work-items`} className="text-blue-500 hover:underline">
        {rowData.task.name}
      </Link>
    );
  };

  return (
    <div className="card">
      <h2 className="mb-3">{artisanName}</h2>
      <DataTable value={data} paginator rows={10} showGridlines filters={filters} onValueChange={onFilter} globalFilterFields={["name", "task.project.name", "created_at"]} emptyMessage="No work items found.">
        <Column field="created_at" header="Day" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} style={{ minWidth: "14rem" }} />
        <Column field="task.project.name" header="Project" body={projectLinkTemplate} filter filterPlaceholder="Search by project" style={{ minWidth: "14rem" }} />
        <Column field="task.name" header="Task" body={taskLinkTemplate} filter filterPlaceholder="Search by task" style={{ minWidth: "14rem" }} />
        <Column field="activity.name" header="Activity" style={{ minWidth: "14rem" }} />
        <Column field="quantity" header="Quantity" style={{ minWidth: "8rem" }} />
        <Column field="single_artisan_price" header="Price" style={{ minWidth: "8rem" }} />
        <Column field="total_artisan_price" header="Total" style={{ minWidth: "12rem", padding: "6px 0" }} footer={`Total: ${calculateTotal()}`} />
        <Column field="is_paid" header={headerCheckbox} body={isPaidTemplate} filter filterMatchMode="equals" filterElement={isPaidFilterTemplate} style={{ minWidth: "8rem" }} />
      </DataTable>
    </div>
  );
};

export default ArtisansDetailsTable;
