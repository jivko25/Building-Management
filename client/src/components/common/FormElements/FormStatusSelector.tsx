import { userStatus } from "@/models/user/userSchema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { t } from "i18next";

const StatusSelector = ({ label, name, defaultVal = "active" }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (defaultVal) {
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
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("Select status")}/>
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
