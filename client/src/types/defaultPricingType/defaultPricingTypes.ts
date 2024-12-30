export type DefaultPricing = {
  activity_id: string;
  measure_id: string;
  price: number;
};
export type DefaultPricingResponse = {
  message: string;
  defaultPricing: DefaultPricing[];
};
