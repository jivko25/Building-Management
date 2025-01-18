import { PriceBodyTemplateProps } from "@/types/defaultPricingType/defaultPricingTypes";
import { InputNumber } from "primereact/inputnumber";

export const priceBodyTemplate = ({ set, price, setIsAdding }: PriceBodyTemplateProps) => {
  return (
    <InputNumber
      className=" "
      value={price}
      inputId="currency-germany"
      currency="EUR"
      onChange={e => {
        set(e.value ?? 0);
        if (setIsAdding) setIsAdding(true);
      }}
      size={3}
      style={{ height: "36px" }}
    />
  );
};
