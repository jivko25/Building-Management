import { useEffect, useState } from "react";
import apiClient from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from 'primereact/api';
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Calendar } from "primereact/calendar";
import { Button } from "@/components/ui/button";
import { Nullable } from "primereact/ts-helpers";
import { useTranslation } from "react-i18next";

interface ManagerReport {
  activity: string;
  project_id: string;
  project_name: string;
  totalQuantity: number;
  totalManagerPrice: string;
  totalArtisanPrice: string;
  totalArtisanPricePaid: string;
  totalProfit: string;
  totalHours: number;
}

export default function ManagerReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ManagerReport[]>([]);
  const [filteredData, setFilteredData] = useState<ManagerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    activity: { value: null, matchMode: FilterMatchMode.EQUALS },
    project_name: { value: null, matchMode: FilterMatchMode.EQUALS }
  });
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);

  // Извличане на уникални стойности за филтрите
  const activities = [...new Set(reports.map(report => report.activity))];
  const projects = [...new Set(reports.map(report => report.project_name))];

  // Компоненти за филтриране
  const activityFilter = (
    <Dropdown
      value={filters.activity.value}
      options={activities}
      onChange={(e) => {
        setFilters({
          ...filters,
          activity: { value: e.value, matchMode: FilterMatchMode.EQUALS }
        });
      }}
      placeholder="Избери дейност"
      className="p-column-filter"
      showClear
    />
  );

  const projectFilter = (
    <Dropdown
      value={filters.project_name.value}
      options={projects}
      onChange={(e) => {
        setFilters({
          ...filters,
          project_name: { value: e.value, matchMode: FilterMatchMode.EQUALS }
        });
      }}
      placeholder="Избери проект"
      className="p-column-filter"
      showClear
    />
  );

  const calculateTotal = () => {
    return {
      quantity: filteredData.reduce((sum, item) => sum + item.totalQuantity + item.totalHours, 0),
      managerPrice: filteredData.reduce((sum, item) => sum + parseFloat(item.totalManagerPrice), 0),
      artisanPrice: filteredData.reduce((sum, item) => sum + parseFloat(item.totalArtisanPrice), 0),
      artisanPricePaid: filteredData.reduce((sum, item) => sum + parseFloat(item.totalArtisanPricePaid), 0),
      profit: filteredData.reduce((sum, item) => sum + parseFloat(item.totalProfit), 0)
    };
  };

  const onFilter = (event: any) => {
    setFilteredData(event || []); // Актуализиране на филтрираните данни
  };

  // Добавяме useEffect за първоначално зареждане
  useEffect(() => {
    fetchReportsWithDateRange();
  }, []); // Празен масив означава, че ще се изпълни само веднъж при монтиране

  const fetchReportsWithDateRange = async (startDate?: Date | null, endDate?: Date | null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const { data } = await apiClient.get<ManagerReport[]>("/managers/getReports", { params });
      setReports(data);
      setFilteredData(data);
    } catch (err) {
      setError("Грешка при зареждане на отчетите");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDateFilter = () => {
    if (dates && dates[0] && dates[1]) {
      fetchReportsWithDateRange(dates[0], dates[1]);
    }
  };

  const handleClearDateFilter = () => {
    setDates(null);
    fetchReportsWithDateRange();
  };

  const priceTemplate = (value: string) => `${value} €.`;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex md:gap-60 min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 py-6 px-4 md:px-8">
        <Card className="shadow-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-2xl font-bold">Мениджърски отчети</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Date Range Filter */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Избери период за филтриране
                  </label>
                  <div className="card">
                    <Calendar 
                      value={dates} 
                      onChange={(e) => setDates(e.value)} 
                      selectionMode="range" 
                      readOnlyInput 
                      hideOnRangeSelection 
                      placeholder="Избери период"
                      className="w-full shadow-sm"
                      panelClassName="bg-background border"
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={handleApplyDateFilter}
                    disabled={!dates || !dates[0] || !dates[1]}
                    className="flex-1 md:flex-none px-8"
                  >
                    Приложи филтър
                  </Button>
                  {dates && (dates[0] || dates[1]) && (
                    <Button
                      onClick={handleClearDateFilter}
                      variant="outline"
                      className="flex-1 md:flex-none"
                    >
                      Изчисти
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('Total quantity')}</p>
                <p className="text-2xl font-bold">{calculateTotal().quantity}</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">

                <p className="text-sm text-muted-foreground">{t('Total income')}</p>
                <p className="text-2xl font-bold">{calculateTotal().managerPrice.toFixed(2)} €.</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">

                <p className="text-sm text-muted-foreground">{t('Total unpaid to artisan')}</p>
                <p className="text-2xl font-bold">{calculateTotal().artisanPrice.toFixed(2)} €.</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">

                <p className="text-sm text-muted-foreground">{t('Total paid to artisan')}</p>
                <p className="text-2xl font-bold">{calculateTotal().artisanPricePaid.toFixed(2)} €.</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">

                <p className="text-sm text-muted-foreground">{t('Total profit')}</p>
                <p className="text-2xl font-bold">{calculateTotal().profit.toFixed(2)} €.</p>
              </div>
            </div>


            <DataTable 
              value={reports} 
              loading={loading} 
              showGridlines 
              stripedRows 
              tableStyle={{ minWidth: "50rem" }}
              filters={filters}
              filterDisplay="row"
              onValueChange={onFilter}
              paginator
              rows={10}
              totalRecords={reports.length}
              lazy={false}
              className="shadow-sm"
            >
              <Column 
                field="activity" 
                header={t('Activity')} 
                sortable 
                filter 
                filterElement={activityFilter}
                showFilterMenu={false}

              />
              <Column 
                field="project_name" 
                header={t('Project')} 
                sortable 
                filter
                filterElement={projectFilter}
                showFilterMenu={false}

              />
              <Column field="totalQuantity" header={t('Quantity')} sortable align="right" body={rowData => rowData.totalQuantity === 0 ? rowData.totalHours : (rowData.totalQuantity + rowData.totalHours).toFixed(2)}/>
              <Column field="totalManagerPrice" header={t('Income by activity')} body={rowData => priceTemplate(rowData.totalManagerPrice)} sortable align="right" />
              <Column field="totalArtisanPrice" header={t('Unpaid to artisan')} body={rowData => priceTemplate(rowData.totalArtisanPrice)} sortable align="right" />
              <Column field="totalArtisanPricePaid" header={t('Paid to artisan')} body={rowData => priceTemplate(rowData.totalArtisanPricePaid)} sortable align="right" />
              <Column field="totalProfit" header={t('Profit')} body={rowData => priceTemplate(rowData.totalProfit)} sortable align="right" />
            </DataTable>
          </CardContent>

        </Card>
      </div>
    </div>
  );
}
