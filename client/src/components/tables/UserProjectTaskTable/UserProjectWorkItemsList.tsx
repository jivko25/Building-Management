import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { WorkItem } from "@/types/work-item-types/workItem";
import UserWorkItemEdit from "@/components/Forms/UserWorkItem/UserWorkItemFormEdit/UserWorkItemEdit";
import { Button } from "primereact/button";
// import { confirmDialog } from "primereact/confirmdialog"; // Диалог за потвърждение

interface UserProjectWorkItemsTableProps {
  workItemsData: WorkItem[];
  // onDelete: (id: number) => void; // Функция за изтриване
}

const UserProjectWorkItemsTable: React.FC<UserProjectWorkItemsTableProps> = ({
  workItemsData,
  // onDelete,
}) => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    if (workItemsData) {
      setWorkItems(workItemsData);
    }
  }, [workItemsData]);

  // Функция за рендиране на цветен лейбъл за статус
  const statusBodyTemplate = (data: WorkItem) => {
    const status = data.status;
    const labelClass =
      status === "done"
        ? "bg-green-500 text-white px-2 py-1 rounded-full text-xs"
        : "bg-orange-500 text-white px-2 py-1 rounded-full text-xs";

    return <span className={labelClass}>{status === "done" ? "Done" : "InProgress"}</span>;
  };

  // Потвърждение за изтриване
  // const confirmDelete = (id: number) => {
  //   confirmDialog({
  //     message: "Are you sure you want to delete this work item?",
  //     header: "Confirm Deletion",
  //     icon: "pi pi-exclamation-triangle",
  //     // accept: () => onDelete(id),
  //   });
  // };

  // Рендериране на бутоните за действие
  const actionsBodyTemplate = (data: WorkItem) => {
    return (
      <div className="flex gap-2">
        <UserWorkItemEdit workItemId={data.id} />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-rounded user-project-trash-icon"
          // onClick={() => confirmDelete(data.id)}
        />
      </div>
    );
  };

  return (
    <div className="card w-full">
      <DataTable value={workItems} paginator rows={10} tableStyle={{ minWidth: "50rem" }}>
        <Column field="activity.name" header="Activity" sortable style={{ width: "20%" }}></Column>
        <Column
          field="artisan.name"
          header="Artisan"
          body={(data) => (data.artisan?.name ? data.artisan.name : "N/A")}
          sortable
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="quantity"
          header="Quantity"
          body={(data) => (data.quantity ? data.quantity : "N/A")}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="hours"
          header="Hours"
          body={(data) => (data.hours ? data.hours : "N/A")}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="start_date"
          header="Start Date"
          body={(data) => (data.start_date ? new Date(data.start_date).toLocaleDateString() : "N/A")}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="end_date"
          header="End Date"
          body={(data) => (data.end_date ? new Date(data.end_date).toLocaleDateString() : "N/A")}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          style={{ width: "10%" }}
        ></Column>
        <Column
          header="Actions"
          body={actionsBodyTemplate}
          style={{ width: "15%" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default UserProjectWorkItemsTable;
