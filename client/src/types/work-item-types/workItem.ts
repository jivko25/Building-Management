export type WorkItem = {
    id?: string;
    task_id?: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    note?: string;
    finished_work?: string;
    status?: 'done' | 'in_progress';
    task_name?: string;
    task_status?: string;
    artisan_name?: string;
    price_per_measure?: string;
    total_price?: string;
    total_work_in_selected_measure?: string;
};

export interface PaginatedWorkItems {
    pages: WorkItem[][];
    pageParams: number[];
}
