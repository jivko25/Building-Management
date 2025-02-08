//client\src\components\common\FormElements\FormStatusSelector.tsx
import { userStatus } from "@/models/user/userSchema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { t } from "i18next";
const StatusSelector = ({ label, name, defaultVal = "active" }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();
  const [selectedStatus, setSelectedStatus] = useState(defaultVal);

  useEffect(() => {
    if (defaultVal) {
      setSelectedStatus(defaultVal);
      setValue(name, defaultVal);
    }
  }, [defaultVal]);



  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={selectedStatus}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={selectedStatus || t("Select status")} >
                  {selectedStatus}
                </SelectValue>
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
