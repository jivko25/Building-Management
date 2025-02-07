import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, getDay } from "date-fns";
import apiClient from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type Activity = {
  activity: string;
  totalQuantity: number;
  totalHours: number;
  price: number;
  total: number;
  artisans: string[];
  tasks: string[];
};

type DailyActivity = {
  date: string;
  activities: Activity[];
  totalPrice: number;
};

type WeeklyReport = {
  weekNumber: number;
  dailyActivities: DailyActivity[];
  totalPrice: number;
};

// Добавяме нов тип за обобщените данни
type ActivitySummary = {
  activity: string;
  totalQuantity: number;
  totalHours: number;
  totalPrice: number;
  isHourly: boolean;
};

const getDayName = (date: Date) => {
  const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[getDay(date)];
};

export const WeeklyReportTable = ({ projectId }: { projectId: string }) => {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [projectSummary, setProjectSummary] = useState<ActivitySummary[]>([]);
  const [currentWeek, setCurrentWeek] = useState(() => getCurrentWeekNumber());
  const [isLoading, setIsLoading] = useState(false);

  // Функция за получаване на текущата седмица
  function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  }

  // Добавяме нов useEffect за зареждане на общото обобщение
  useEffect(() => {
    const fetchProjectSummary = async () => {
      try {
        const response = await apiClient.get(`/${projectId}/summary`);
        setProjectSummary(response.data);
      } catch (error) {
        console.error("Error fetching project summary:", error);
      }
    };

    if (projectId) {
      fetchProjectSummary();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/${projectId}/reports/weekly?weekNumber=${currentWeek}`
        );
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchReport();
    }
  }, [projectId, currentWeek]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => Math.min(52, prev + 1));
  };

  // Функция за изчисляване на обобщените данни
  const getActivitySummary = (): ActivitySummary[] => {
    if (!report?.dailyActivities) return [];

    const summary = report.dailyActivities.reduce((acc, day) => {
      day.activities.forEach(activity => {
        if (!acc[activity.activity]) {
          acc[activity.activity] = {
            activity: activity.activity,
            totalQuantity: 0,
            totalHours: 0,
            totalPrice: 0,
            isHourly: activity.activity === "Hour"
          };
        }
        
        acc[activity.activity].totalQuantity += activity.totalQuantity;
        acc[activity.activity].totalHours += activity.totalHours;
        acc[activity.activity].totalPrice += activity.total;
      });
      return acc;
    }, {} as Record<string, ActivitySummary & { isHourly: boolean; totalHours: number }>);

    return Object.values(summary);
  };

  // Добавяме помощна функция за проверка дали е часово активити

  const dateBodyTemplate = (rowData: Activity & { date: string }) => {
    return (
      <span>
        {getDayName(new Date(rowData.date))} {format(new Date(rowData.date), "dd/MM/yyyy")}
      </span>
    );
  };

  const priceBodyTemplate = (rowData: Activity) => {
    return `$${rowData.price?.toFixed(2)}`;
  };

  const totalBodyTemplate = (rowData: Activity) => {
    return `$${rowData.total?.toFixed(2)}`;
  };


  const listBodyTemplate = (list: string[]) => {
    return list.join(", ");
  };

  // Преобразуваме данните в плосък масив за таблицата
  const flattenedData = report?.dailyActivities.flatMap(day => 
    day.activities.map(activity => ({
      ...activity,
      date: day.date
    }))
  ) || [];

  if (!report) return <div>Loading...</div>;

  return (
    <Card className="mx-2">
      <CardHeader className="space-y-6 px-4">
        {/* Project Summary */}
        <div>
          <CardTitle className="mb-4">Project Summary</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {projectSummary.map(summary => (
              <div 
                key={summary.activity}
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <h3 className="font-medium text-sm sm:text-base">{summary.activity}</h3>
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs sm:text-sm">
                    {summary.isHourly ? 'Total Hours: ' : 'Total Quantity: '}
                    <span className="font-medium">
                      {summary.isHourly ? summary.totalHours : summary.totalQuantity}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm">
                    Total Price: <span className="font-medium">€{summary.totalPrice?.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Report Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <CardTitle>Weekly Report - Week {currentWeek}</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviousWeek}
                disabled={currentWeek <= 1 || isLoading}
                className="text-xs sm:text-sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextWeek}
                disabled={currentWeek >= 52 || isLoading}
                className="text-xs sm:text-sm"
              >
                Next
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {getActivitySummary().map(summary => (
              <div 
                key={summary.activity}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <h3 className="font-medium text-sm sm:text-base">{summary.activity}</h3>
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs sm:text-sm">
                    {summary.isHourly ? 'Total Hours: ' : 'Total Quantity: '}
                    <span className="font-medium">
                      {summary.isHourly ? summary.totalHours : summary.totalQuantity}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm">
                    Total Price: <span className="font-medium">€{summary?.totalPrice?.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        {isLoading ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : (
          <DataTable 
            value={flattenedData}
            showGridlines 
            stripedRows
            tableStyle={{ width: '100%' }}
            footer={`Total Price: $${(report?.totalPrice || 0)?.toFixed(2)}`}
            className="text-xs sm:text-sm"
            scrollable
            scrollHeight="500px"
          >
            <Column 
              field="date" 
              header="Day" 
              body={dateBodyTemplate}
              sortable
            />
            <Column 
              field="activity" 
              header="Activity" 
              sortable
            />
            <Column 
              field="artisans" 
              header="Artisans" 
              body={(rowData) => listBodyTemplate(rowData.artisans)}
            />
            <Column 
              field="tasks" 
              header="Tasks"
              body={(rowData) => listBodyTemplate(rowData.tasks)}
            />
            <Column 
              field="totalQuantity" 
              header="Total Quantity" 
              sortable
              align="right"
            />
            <Column 
              field="totalHours" 
              header="Hours" 
              sortable
              align="right"
            />
            <Column 
              field="price" 
              header="Price" 
              body={priceBodyTemplate}
              sortable
              align="right"
            />
            <Column 
              field="total" 
              header="Total" 
              body={totalBodyTemplate}
              sortable
              align="right"
            />
          </DataTable>
        )}
      </CardContent>
    </Card>
  );
}; 