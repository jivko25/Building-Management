//client\src\components\common\FormElements\FormFieldInput.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormInputType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const FormFieldInput = ({ label, name, type, className, Icon, text, disabled }: FormInputType) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && <Icon size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />}
              <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
              <Input {...field} type={type} className={cn("", className)} disabled={disabled} />
              <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
              {text && <s className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{text}</s>}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormFieldInput;
