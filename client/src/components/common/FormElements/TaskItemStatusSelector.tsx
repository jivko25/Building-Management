//client\src\components\common\FormElements\TaskItemStatusSelector.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { t } from "i18next";
const taskStatus = ["done", "in_progress"] as const;


const TaskItemStatusSelector = ({ label, name, defaultVal }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();
  const [selectedStatus, setSelectedStatus] = useState(defaultVal);

  useEffect(() => {
    if (defaultVal) {
      setSelectedStatus(defaultVal);
      setValue(name, defaultVal);
    }
  }, [defaultVal, name, setValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={value => {
            console.log("Selected status:", value);
            field.onChange(value);
            setValue(name, value);
          }} defaultValue={selectedStatus}>
            <FormControl>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={selectedStatus || t("Select status")}>
                  {selectedStatus}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>

              {taskStatus.map((status, index: number) => (
                <SelectItem key={index} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default TaskItemStatusSelector;
