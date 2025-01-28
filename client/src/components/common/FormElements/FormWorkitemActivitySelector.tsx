//client\src\components\common\FormElements\FormActivitySelector.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import { useUserWorkitem } from "@/context/UserWorkitemContext";

const WorkItemActiviySelector = ({ label, name, placeholder, defaultVal }: TableFormSelectType) => {
  const { control } = useFormContext();
  const { activities, dispatch } = useUserWorkitem();

  const handleValueChange = (value: string | string[], field: ControllerRenderProps<FieldValues, string>) => {
    field.onChange(value);
    const activity = activities?.find(activity => activity.name === value);
    dispatch({ type: "SET_ACTIVITY_MEASURE_ID", payload: activity?.id });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={value => handleValueChange(value, field)} defaultValue={defaultVal}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {activities &&
                activities?.map(activity => (
                  <SelectItem key={activity.id} value={activity.name}>
                    {activity.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default WorkItemActiviySelector;
