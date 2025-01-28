import { Activity } from "../activity-types/activityTypes";
import { Measure } from "../measure-types/measureTypes";

export type DefaultPricing = {
  id?: string;
  artisan_id: string | null;
  activity_id: string;
  measure_id: string;
  artisan_price?: number;
  manager_price: number;
  project_id: string;
  activity?: Activity;
  measure?: Measure;
};

export type DefaultPricingResponse = {
  success: boolean;
  status: string;
  message: string;
  data: DefaultPricing[];
};

export type EditDefaultValuesTableProps = {
  artisanId: string;
  defaultPricing: DefaultPricing;
  activity: string;
  measure: string;
  price?: number;
  managerPrice: number;
};

export type DefaultPricingDto = {
  id?: string;
  artisan_id: string;
  activity: Activity;
  measure: Measure;
  price: number;
  managerPrice: number;
};

export type DefaultPricingsActivityMeasureDto = {
  activity: Activity;
  measures: Measure[];
};

export interface PriceBodyTemplateProps {
  set: React.Dispatch<React.SetStateAction<number>>;
  price: number;
  setIsAdding?: (value: boolean) => void;
}
