//client\src\components\common\FormElements\FormMeasureSelector.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Measure } from "@/types/measure-types/measureTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";

const MeasureSelector = ({ label, name, placeholder, defaultVal }: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: measures } = useFetchDataQuery<Measure[]>({
    URL: "/measures",
    queryKey: ["measures"],
    options: {
      staleTime: Infinity
    }
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={defaultVal}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {measures &&
                  measures.map(measure => (
                    <SelectItem key={measure.id} value={measure.name}>
                      {measure.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default MeasureSelector;
