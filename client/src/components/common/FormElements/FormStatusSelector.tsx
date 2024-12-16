//client\src\components\common\FormElements\FormStatusSelector.tsx
import { userStatus } from "@/models/user/userSchema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";

const StatusSelector = ({ label, name, placeholder, defaultVal }: TableFormSelectType) => {
  const { control } = useFormContext();

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
