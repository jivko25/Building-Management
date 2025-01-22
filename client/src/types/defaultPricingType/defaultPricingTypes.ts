export type DefaultPricing = {
  id?: string;
  artisan_id: string | null;
  activity_id: string;
  measure_id: string;
  artisan_price?: number;
  manager_price: number;
  project_id: string;
};
export type DefaultPricingResponse = {
  message: string;
  defaultPricing: DefaultPricing[];
};

export type EditDefaultValuesTableProps = {
  artisanId: string;
  defaultPricing: DefaultPricing;
  activity: string;
  measure: string;
  price?: number;
  managerPrice: number;
};

export interface PriceBodyTemplateProps {
  set: React.Dispatch<React.SetStateAction<number>>;
  price: number;
  setIsAdding?: (value: boolean) => void;
}
