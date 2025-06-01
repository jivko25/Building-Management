import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useFetchDataQuery } from "@/hooks/useQueryHook";

const ArtisanSingleSelector = ({ label, name, placeholder }: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: artisansArray } = useFetchDataQuery<any>({
    URL: "/artisans",
    queryKey: ["artisans"],
    options: {
      staleTime: Infinity
    }
  });

  const artisans: Artisan[] = artisansArray?.artisans;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select
            onValueChange={value => field.onChange(value)} // Свързване на стойността с формата
            value={field.value || ""} // Осигуряване на текущата стойност
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Select artisan"} defaultValue={artisans?.find(artisan => artisan.id == field.value)?.name || placeholder}>
                  {artisans?.find(artisan => {
                    return artisan.id == field.value;
                  })?.name || placeholder}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {artisans &&
                  artisans
                    .filter(artisan => artisan.status === "active")
                    .map(artisan => (
                      <SelectItem key={artisan.id} value={artisan.id}>
                        {artisan.name}
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

export default ArtisanSingleSelector;
