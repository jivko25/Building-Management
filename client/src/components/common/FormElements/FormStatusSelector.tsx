//client\src\components\common\FormElements\FormStatusSelector.tsx
import { userStatus } from "@/models/user/userSchema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const StatusSelector = ({ label, name, defaultVal }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, defaultVal);
  }, [defaultVal]);


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
                <SelectValue placeholder={"Select status"} defaultValue={defaultVal} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {userStatus.map((role, index: number) => (
                <SelectItem key={index} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default StatusSelector;
