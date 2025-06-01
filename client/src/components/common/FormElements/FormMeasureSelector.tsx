//client\src\components\common\FormElements\FormMeasureSelector.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Measure } from "@/types/measure-types/measureTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { PaginatedData } from "../Pagination/Pagination";
import { t } from "i18next";

const MeasureSelector = ({ label, name, defaultVal }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();
  const [selectedMeasure, setSelectedMeasure] = useState(defaultVal);
  
  const { data: measures } = useFetchDataQuery<PaginatedData<Measure>>({
    URL: "/measures",
    queryKey: ["measures"],
    options: {
      staleTime: Infinity
    }
  });

  useEffect(() => {
    if (defaultVal) {
      setValue(name, defaultVal);
      setSelectedMeasure(defaultVal);
    }
  }, [defaultVal, name, setValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={(value: any) => {
            field.onChange(value)
            setSelectedMeasure(value)
            }} defaultValue={selectedMeasure}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={selectedMeasure || t("Select measure")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {measures?.data.map(measure => (
                <SelectItem key={measure.id} value={measure.name}>
                  {measure.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default MeasureSelector;
