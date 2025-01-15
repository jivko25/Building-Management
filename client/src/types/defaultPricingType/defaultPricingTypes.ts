export type DefaultPricing = {
  activity_id: string;
  measure_id: string;
  price: number;
  manager_price: number;
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
  price: number;
  managerPrice: number;
};
