import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { useEffect } from "react";

const ArtisanSelector = ({ label, name, placeholder, defaultVal }: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: artisansArray, refetch } = useFetchDataQuery<any>({
    URL: "/artisans",
    queryKey: ["artisans"],
    options: {
      staleTime: Infinity
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const artisans: Artisan[] = artisansArray?.artisans;


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select multiSelect value={field.value || []} onValueChange={selectedValues => field.onChange(selectedValues)} defaultValue={defaultVal}>
            <FormControl>
              <SelectTrigger multiSelect selectedValues={field.value || []} placeholder={placeholder || "Select artisans"} />
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {artisans &&
                  artisans
                    .filter(artisan => artisan.status === "active")
                    .map(artisan => (
                      <SelectItem key={artisan.id} value={artisan.name}>
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

export default ArtisanSelector;
